class Global {
  static ADP_APP_NAME = GM_info.script.name
  static ADP_ENHANCED_VERSION = GM_info.script.version
  static IS_DEBUG = true
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

    let isMorningBreak = false
    let isAfternoonBreak = false
    let morningEndTime = null
    let morningEndThreshold = null
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

      if (!isMorningBreak) {
        delta -= DateConsts.getMorningBreakTime()
        isMorningBreak = true
      } else if (!isAfternoonBreak && isAfternoonThreshold) {
        delta -= DateConsts.getAfternoonBreakTime()
        isAfternoonBreak = true
      }

      dayData.totalTime += Math.max(delta, 0)
    })
  }

  static isDay (key) {
    return this.days.hasOwnProperty(key)
  }

  static isWorkingDay (key) {
    return this.isDay(key) && this.days[key].timePairs.length > 0
  }

  static refresh () {
    AdpData.totalTime = 0

    for (const key in this.days) {
      if (!this.isDay(key)) {
        continue
      }

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
