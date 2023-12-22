class ADebug {
  static IS_DEBUG = true
  static FORCED_HOURS = -1
  static FORCED_MINUTES = -1
  static FORCED_DAY = DateUtils.UNKNOWN_LABEL
  static FORCED_BEGINNING_EXTRA_TIME = -1
  static FORCED_CALENDAR_TIMES = null
  static FORCED_CALENDAR_EVENTS = null

  static isNowOverride () {
    return (
      ADebug.IS_DEBUG &&
      ADebug.FORCED_HOURS !== -1 &&
      ADebug.FORCED_MINUTES !== -1
    )
  }

  static isDayOverride () {
    return ADebug.IS_DEBUG && ADebug.FORCED_DAY !== DateUtils.UNKNOWN_LABEL
  }

  static isBeginningExtraTimeOverride () {
    return ADebug.IS_DEBUG && ADebug.FORCED_BEGINNING_EXTRA_TIME >= 0
  }

  static isCalendarTimesOverride () {
    return ADebug.IS_DEBUG && ADebug.FORCED_CALENDAR_TIMES !== null
  }

  static isCalendarEventsOverride () {
    return ADebug.IS_DEBUG && ADebug.FORCED_CALENDAR_EVENTS !== null
  }
}

function initDebugMode () {
  // setupDebugProperties()
}

function setupDebugProperties () {
  ADebug.IS_DEBUG = true

  ADebug.FORCED_HOURS = 17
  ADebug.FORCED_MINUTES = 52

  ADebug.FORCED_DAY = DateUtils.THURSDAY_LABEL

  ADebug.FORCED_BEGINNING_EXTRA_TIME = 7 * 3600 + 38 * 60

  const forcedNowHtml = `<span id="adp-enhanced-debug-data">Heure de debug : ${getTimeDeltaLabel(
    getNowInSeconds(true)
  )}</span>`

  document
    .querySelector('#adp-version')
    .insertAdjacentHTML('afterend', forcedNowHtml)

  setupForcedTimes()
}

function setupForcedTimes () {
  ADebug.FORCED_CALENDAR_TIMES = []
  ADebug.FORCED_CALENDAR_EVENTS = []

  const mondayDate = getMondayOfCurrentWeek()

  const dates = {
    monday: [],
    tuesday: ['08:56', '12:30'],
    wednesday: ['09:06', '12:40', '14:02', '19:07'],
    thursday: ['09:29', '12:13', '14:04'],
    friday: []
  }

  const daysOff = {
    monday: [],
    tuesday: [
      {
        codeName: 'CP',
        hoursValue: 'A'
      }
    ],
    wednesday: [],
    thursday: [],
    friday: [
      {
        codeName: 'RV',
        hoursValue: 'J'
      }
    ]
  }

  const nationalHolidays = [
    { monday: true },
    { tuesday: false },
    { wednesday: false },
    { thursday: false },
    { friday: false }
  ]

  for (let i = 0; i < DateUtils.WEEKDAY_COUNT; ++i) {
    const dayLabel = getDayLabelFromDayIndex(i)

    const currentDate = copyOrGenerateDate(mondayDate)
    currentDate.setDate(currentDate.getDate() + i)
    const dateStr = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`

    const dayData = {
      entryDate: dateStr
    }

    if (dates.hasOwnProperty(dayLabel)) {
      const times = dates[dayLabel]

      if (times) {
        const processedTimes = []

        for (const time of times) {
          processedTimes.push({
            codeName: 'punch',
            timePeriod: {
              startDateTime: `${dateStr}T${time}:00+01:00`
            }
          })
        }

        dayData.entryDetail = [
          {
            timePairSummary: processedTimes
          }
        ]
      }
    }

    if (daysOff.hasOwnProperty(dayLabel)) {
      const dayOffData = daysOff[dayLabel]

      if (dayOffData) {
        for (const dayOff of dayOffData) {
          if (!dayData.entryDetail) {
            dayData.entryDetail = [{}]
          }

          if (!dayData.entryDetail[0].hoursSummary) {
            dayData.entryDetail[0].hoursSummary = []
          }

          dayData.entryDetail[0].hoursSummary.push(dayOff)
        }
      }
    }

    ADebug.FORCED_CALENDAR_TIMES.push(dayData)

    if (i < nationalHolidays.length) {
      const nationalHolidayData = nationalHolidays[i]

      if (nationalHolidayData.hasOwnProperty(dayLabel)) {
        const isNationalHoliday = nationalHolidayData[dayLabel]

        if (isNationalHoliday) {
          ADebug.FORCED_CALENDAR_EVENTS.push({
            subject: 'Férié',
            timePeriod: {
              endDateTime: '2023-12-25T00:00:00+01:00',
              startDateTime: '2023-12-25T00:00:00+01:00',
              duration: 'PT0H'
            }
          })
        }
      }
    }
  }
}
