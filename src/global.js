class Global {
  static ADP_APP_NAME = GM_info.script.name
  static ADP_ENHANCED_VERSION = GM_info.script.version
  static IS_DEBUG = true
}

class AdpDayData {
  date = null
  totalTime = 0
  timePairs = []
  specialTimePairs = []
}

class AdpData {
  static startDate = null
  static endDate = null
  static associateOid = null
  static appVersion = null
  static appOid = null
  static dayElements = {}
  static days = {}
  static totalTime = 0
  static beginningExtraTime = 0

  static getDayDate (key) {
    const dayIndex = getIndexFromDay(key)

    assert(
      isValidDayIndex(dayIndex),
      `Invalid day index ${dayIndex} from key ${key}!`
    )

    const date = new Date(AdpData.startDate)
    date.setDate(date.getDate() + dayIndex)
    return date
  }

  static isWorking () {
    const now = getNow()
    const dayIndex = getDayIndexFromDate(now)

    if (dayIndex < 0 || dayIndex >= DateUtils.WORKDAY_COUNT) {
      return false
    }

    const key = getDayFromIndex(dayIndex)

    if (!this.isWorkingDay(key)) {
      return false
    }

    const dayData = this.days[key]
    return dayData.timePairs[dayData.timePairs.length - 1].isActive()
  }

  static refreshDayData (key) {
    const dayData = this.days[key]
    let morningEndTime = null
    let morningEndThreshold = null

    var date = new Date(dayData.date)

    date.setSeconds(
      date.getSeconds() + DateConsts.getRecommendedBeginningLunchTime()
    )

    const now = getNow()
    const dayBeginningDate = new Date(now)
    dayBeginningDate.setHours(0)
    dayBeginningDate.setMinutes(0)
    dayBeginningDate.setSeconds(0)
    dayBeginningDate.setMilliseconds(0)

    const isAfternoon =
      dayData.date < dayBeginningDate ||
      (dayData.date.getTime() === dayBeginningDate.getTime() && now > date)

    dayData.totalTime = 0

    dayData.timePairs.forEach((timePair, index) => {
      const normalizedPair = timePair.getNormalizedCopy()
      const isAfternoonThreshold =
        normalizedPair.getFromTimeInSeconds() >
        DateConsts.getRecommendedBeginningLunchTime()

      if (!isAfternoonThreshold) {
        morningEndTime = normalizedPair.to
      } else {
        if (morningEndThreshold === null) {
          const morningEndThresholdDate = new Date(morningEndTime)

          morningEndThresholdDate.setHours(
            Settings.get(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_HOURS)
          )

          morningEndThresholdDate.setMinutes(
            Settings.get(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_MINUTES)
          )

          morningEndThreshold =
            morningEndTime !== null
              ? new Date(Math.max(morningEndThresholdDate, morningEndTime))
              : morningEndThresholdDate
        }

        const minimumLunchBreakTime = DateConsts.getMinimumLunchBreakTime()

        if (
          (normalizedPair.from - morningEndThreshold) / 1000 <
          minimumLunchBreakTime
        ) {
          normalizedPair.from = new Date(morningEndThreshold)

          normalizedPair.to.setTime(
            normalizedPair.to.getTime() - minimumLunchBreakTime * 1000
          )

          if (normalizedPair.from > normalizedPair.to) {
            normalizedPair.to = new Date(normalizedPair.from)
          }
        }
      }

      let delta = normalizedPair.getDeltaInSeconds()
      dayData.totalTime += Math.max(delta, 0)
    })

    dayData.totalTime -= DateConsts.getMorningBreakTime()

    if (isAfternoon) {
      dayData.totalTime -= DateConsts.getAfternoonBreakTime()
    }

    dayData.specialTimePairs.forEach((timePair, index) => {
      dayData.totalTime += timePair.getDeltaInSeconds()
    })

    dayData.totalTime = Math.max(0, dayData.totalTime)
  }

  static isWorkingDay (key) {
    return this.days[key].timePairs.length > 0
  }

  static refresh () {
    AdpData.totalTime = 0

    for (const key in this.days) {
      this.refreshDayData(key)
      const dayData = this.days[key]
      AdpData.totalTime += dayData.totalTime
    }
  }

  static getDayTime (key) {
    if (!AdpData.days.hasOwnProperty(key)) {
      return 0
    }

    let dayTime = AdpData.days[key].totalTime

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
