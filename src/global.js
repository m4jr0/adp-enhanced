class Global {
  static ADP_APP_NAME = GM_info.script.name
  static ADP_ENHANCED_VERSION = GM_info.script.version
  static IS_DEBUG = false
  static FORCED_HOURS = -1
  static FORCED_MINUTES = -1

  static isNowOverride () {
    return (
      Global.IS_DEBUG &&
      Global.FORCED_HOURS !== -1 &&
      Global.FORCED_MINUTES !== -1
    )
  }
}

class LeavingTimeData {
  leavingTime = 0
  timeLeft = 0

  constructor (leavingTime, timeLeft) {
    this.leavingTime = leavingTime
    this.timeLeft = timeLeft
  }
}

class DayData {
  label = null
  index = -1
  date = null
  morningTime = 0
  afternoonTime = 0
  totalTime = 0
  timePairs = []
  normalizedPairs = []
  specialTimePairs = []
  morningEndPair = null
  afternoonBeginningPair = null
  cumulatedWeeklyDelta = 0
  predictedCumulatedWeeklyDelta = 0
  dailyLeavingTime = 0
  dailyTimeLeft = 0
  remainingMorningBreakTime = 0
  remainingAfternoonBreakTime = 0

  constructor (index) {
    this.index = index
    this.label = getDayLabelFromDayIndex(this.index)
    this.remainingMorningBreakTime = DateConsts.getMorningBreakTime()
    this.remainingAfternoonBreakTime = DateConsts.getAfternoonBreakTime()
  }

  isAfternoon () {
    return this.afternoonBeginningPair !== null
  }

  refresh () {
    this.normalizedPairs = []
    this.morningEndPair = null
    this.afternoonBeginningPair = null
    this.cumulatedWeeklyDelta = 0
    this.predictedCumulatedWeeklyDelta = 0
    this.dailyLeavingTime = 0
    this.dailyTimeLeft = 0
    this.remainingMorningBreakTime = DateConsts.getMorningBreakTime()
    this.remainingAfternoonBreakTime = DateConsts.getAfternoonBreakTime()

    this.refreshTotalTime()

    if (this.date.getDate() === 1) {
      AdpData.beginningExtraTime = Math.min(
        AdpData.beginningExtraTime,
        DateConsts.getHighestMonthlyExtraTime()
      )
    }

    if (this.index > DateUtils.WORKDAY_COUNT - 1) {
      return
    }

    this.refreshLeavingTimes()

    if (this.index === DateUtils.WORKDAY_COUNT - 1) {
      const delta = Math.min(
        this.predictedCumulatedWeeklyDelta - AdpData.beginningExtraTime,
        DateConsts.getHighestWeeklyExtraTime()
      )

      AdpData.predictedEndingExtraTimeOffset +=
        AdpData.beginningExtraTime + delta - this.predictedCumulatedWeeklyDelta

      this.predictedCumulatedWeeklyDelta = Math.min(
        this.predictedCumulatedWeeklyDelta,
        DateConsts.getHighestMonthlyExtraTime()
      )
    }
  }

  refreshTotalTime () {
    this.totalTime = 0

    if (this.index > DateUtils.WORKDAY_COUNT - 1) {
      return
    }

    const date = copyOrGenerateDate(this.date)
    shiftDateWithSeconds(date, DateConsts.getRecommendedBeginningLunchTime())

    const now = getNow()
    const dayBeginningDate = copyOrGenerateDate(now)
    dayBeginningDate.setHours(0, 0, 0, 0)

    this.timePairs.forEach((timePair, index) => {
      const normalizedPair = timePair.getNormalizedCopy()
      this.normalizedPairs.push(normalizedPair)
      let delta = normalizedPair.getDeltaInSeconds()
      delta = Math.max(delta, 0)

      if (!this.isAfternoon()) {
        this.morningTime += delta
      } else {
        this.afternoonTime += delta
      }

      this.totalTime += delta
    })

    this.specialTimePairs.forEach((timePair, index) => {
      const normalizedPair = timePair.getNormalizedCopy()
      this.normalizedPairs.push(normalizedPair)
      this.totalTime += normalizedPair.getDeltaInSeconds()

      if (normalizedPair.isExtraTimeConsumed) {
        AdpData.predictedEndingExtraTimeOffset -=
          normalizedPair.getDeltaInSeconds()
      }
    })

    this.totalTime = Math.max(0, this.totalTime)

    if (this.index !== DateUtils.MONDAY_INDEX) {
      this.cumulatedWeeklyDelta =
        AdpData.days[this.index - 1].cumulatedWeeklyDelta
      this.predictedCumulatedWeeklyDelta =
        AdpData.days[this.index - 1].predictedCumulatedWeeklyDelta
    } else if (Settings.get(SettingsKeys.ARE_EXTRA_HOURS_ZEROED_OUT)) {
      this.predictedCumulatedWeeklyDelta = this.cumulatedWeeklyDelta =
        AdpData.beginningExtraTime
    } else {
      this.predictedCumulatedWeeklyDelta = this.cumulatedWeeklyDelta = 0
    }

    this.cumulatedWeeklyDelta += this.totalTime
    this.predictedCumulatedWeeklyDelta += this.totalTime

    if (this.index <= AdpData.dayIndex) {
      this.cumulatedWeeklyDelta -= DateConsts.getDailyRequiredTime()
      this.predictedCumulatedWeeklyDelta -= DateConsts.getDailyRequiredTime()
    }
  }

  refreshLeavingTimes () {
    if (
      this.index < AdpData.dayIndex ||
      this.index > DateUtils.WORKDAY_COUNT - 1
    ) {
      return
    }

    const dailyRequiredTime = DateConsts.getDailyRequiredTime()
    this.dailyTimeLeft = dailyRequiredTime - this.totalTime

    const fromStrippedTime =
      this.index > AdpData.dayIndex
        ? DateConsts.getRecommendedBeginningWorkingTime()
        : convertDateToSeconds(getNow(true))

    const dailyLeavingTimeData = this.generateLeavingTime(
      this.dailyTimeLeft,
      fromStrippedTime
    )

    this.dailyLeavingTime = dailyLeavingTimeData.leavingTime

    let timeLeft = -this.predictedCumulatedWeeklyDelta

    if (this.index > AdpData.dayIndex) {
      timeLeft += DateConsts.getDailyRequiredTime()
    }

    const weeklyLeavingTimeData = this.generateLeavingTime(
      timeLeft,
      fromStrippedTime
    )

    this.weeklyLeavingTime = weeklyLeavingTimeData.leavingTime
    this.predictedCumulatedWeeklyDelta = -weeklyLeavingTimeData.timeLeft
  }

  generateLeavingTime (timeLeft, fromStrippedTime) {
    let lastTimePair =
      this.normalizedPairs.length !== 0
        ? this.normalizedPairs[this.normalizedPairs.length - 1]
        : null

    if (lastTimePair !== null && lastTimePair.isActive()) {
      const fromTime = convertDateToSeconds(
        stripYearMonthAndDay(lastTimePair.from)
      )

      if (fromStrippedTime < fromTime) {
        fromStrippedTime = fromTime
      }
    }

    if (timeLeft <= 0) {
      const leavingTime = Math.max(
        fromStrippedTime,
        DateConsts.getMinimumLeavingWorkingTime()
      )

      const timeWorked =
        DateConsts.getMinimumLeavingWorkingTime() -
        fromStrippedTime -
        (DateConsts.getMorningBreakTime() +
          DateConsts.getAfternoonBreakTime() +
          DateConsts.getRecommendedLunchBreakTime())

      return new LeavingTimeData(leavingTime, timeLeft - timeWorked)
    }

    let leavingTime =
      fromStrippedTime +
      timeLeft +
      this.remainingMorningBreakTime +
      this.remainingAfternoonBreakTime

    // Case: user hasn't starting working in the afternoon yet.
    if (!this.isAfternoon()) {
      if (fromStrippedTime <= DateConsts.getRecommendedBeginningLunchTime()) {
        leavingTime += DateConsts.getRecommendedLunchBreakTime()
      } else if (
        fromStrippedTime <= DateConsts.getRecommendedEndingLunchTime()
      ) {
        leavingTime += Math.max(
          0,
          DateConsts.getRecommendedEndingLunchTime() - fromStrippedTime
        )
      }
    }

    const effectiveLeavingTime = Math.min(
      Math.max(leavingTime, DateConsts.getMinimumLeavingWorkingTime()),
      DateConsts.getMaximumLeavingWorkingTime()
    )

    return new LeavingTimeData(
      effectiveLeavingTime,
      leavingTime - effectiveLeavingTime
    )
  }
}

class AdpData {
  static date = null
  static dayIndex = -1
  static startDate = null
  static endDate = null
  static associateOid = null
  static appVersion = null
  static appOid = null
  static days = {}
  static totalTime = 0
  static beginningExtraTime = 0
  static predictedEndingExtraTime = 0
  static predictedEndingExtraTimeOffset = 0

  static reset () {
    AdpData.totalTime = 0
    AdpData.predictedEndingExtraTime = 0
    AdpData.predictedEndingExtraTimeOffset = 0
  }

  static setup () {
    TimePair.setup()
    this.getStartAndEndDates()
    AdpData.date = getNow()
    AdpData.dayIndex = getDayIndexFromDate(AdpData.date)
  }

  static getStartAndEndDates () {
    const dateEl = document.getElementsByClassName(
      'periods-nav-item displayed-period text-center pointer'
    )[0]

    const regex =
      /(\d{1,2})\s*([A-Za-zÀ-ÖØ-öø-ÿ]{3,4}\.?)\s*-\s*(\d{1,2})\s*([A-Za-zÀ-ÖØ-öø-ÿ]{3,4}\.)\s*(\d{4})/i
    const match = dateEl.innerText.match(regex)

    if (match === null) {
      return getNow()
    }

    const startDay = parseInt(match[1], 10)
    const startMonth = getMonthFromShortLabel(match[2])
    const endDay = parseInt(match[3], 10)
    const endMonth = getMonthFromShortLabel(match[4])
    const year = parseInt(match[5], 10)

    AdpData.startDate = new Date(
      endMonth >= startMonth ? year : year - 1,
      startMonth,
      startDay,
      0,
      0,
      0
    )

    AdpData.endDate = new Date(year, endMonth, endDay, 23, 59, 59)

    AdpData.startDate = stripMilliseconds(AdpData.startDate)
    AdpData.endDate = stripMilliseconds(AdpData.endDate)
  }

  static isFutureWeek () {
    if (!this.startDate) {
      return false
    }

    return getMondayOfCurrentWeek() < this.startDate
  }

  static getDayDate (dayIndex) {
    assert(
      isValidDayIndex(dayIndex),
      `Invalid day index ${dayIndex} from day ${getDayLabelFromDayIndex(
        dayIndex
      )}!`
    )

    const date = copyOrGenerateDate(AdpData.startDate)
    date.setDate(date.getDate() + dayIndex)
    return date
  }

  static isWorking () {
    if (!isWithinTimeBoundaries(convertDateToSeconds(getNow(true)))) {
      return false
    }

    const now = getNow()
    const dayIndex = getDayIndexFromDate(now)

    if (dayIndex < 0 || dayIndex >= DateUtils.WORKDAY_COUNT) {
      return false
    }

    if (!this.isWorkingDay(dayIndex)) {
      return false
    }

    const dayData = this.days[dayIndex]

    return TimePair.getNormalized(
      dayData.timePairs[dayData.timePairs.length - 1].id
    ).isActive()
  }

  static isWorkingDay (dayIndex) {
    return this.days[dayIndex].timePairs.length > 0
  }

  static refresh () {
    AdpData.reset()

    for (let dayIndex = 0; dayIndex < DateUtils.WEEKDAY_COUNT; ++dayIndex) {
      const dayData = this.days[dayIndex]
      dayData.refresh()
      AdpData.totalTime += dayData.totalTime
    }

    AdpData.totalTime = Math.max(0, AdpData.totalTime)

    AdpData.predictedEndingExtraTime =
      AdpData.days[DateUtils.WORKDAY_COUNT - 1].predictedCumulatedWeeklyDelta +
      AdpData.predictedEndingExtraTimeOffset

    if (!Settings.get(SettingsKeys.ARE_EXTRA_HOURS_ZEROED_OUT)) {
      AdpData.predictedEndingExtraTime +=
        AdpData.beginningExtraTime +
        AdpData.days[AdpData.dayIndex].predictedCumulatedWeeklyDelta
    }
  }

  static getDayTime (dayIndex) {
    let dayTime = AdpData.days[dayIndex].totalTime

    if (dayTime === null || dayTime === undefined) {
      dayTime = 0
    }

    return dayTime
  }
}

class AssertError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
  }
}

function assert (assertion, message = null) {
  if (assertion) {
    return
  }

  if (message === null) {
    message = 'Something wrong happened!'
  }

  throw new AssertError(message)
}
