class DateUtils {
  static WEEKDAY_COUNT = 7
  static WORKDAY_COUNT = 5
  static MONDAY_LABEL = 'monday'
  static TUESDAY_LABEL = 'tuesday'
  static WEDNESDAY_LABEL = 'wednesday'
  static THURSDAY_LABEL = 'thursday'
  static FRIDAY_LABEL = 'friday'
  static SATURDAY_LABEL = 'saturday'
  static SUNDAY_LABEL = 'sunday'
  static UNKNOWN_LABEL = '???'
}

class TimePair {
  static ID_COUNTER = -1
  static pairs_ = {}
  static normalizedPairs_ = {}

  static get (id) {
    if (!TimePair.pairs_.hasOwnProperty(id)) {
      return null
    }

    return TimePair.pairs_[id]
  }

  static getNormalized (id) {
    if (!TimePair.normalizedPairs_.hasOwnProperty(id)) {
      log(
        `Non-existing normalized pair! Non-normalized ID is: ${id}.`,
        Log.Error
      )

      return null
    }

    return TimePair.normalizedPairs_[id]
  }

  static setup () {
    TimePair.ID_COUNTER = -1
    TimePair.pairs_ = {}
    TimePair.normalizedPairs_ = {}
  }

  id = null
  dayIndex = -1
  from = null
  to = null
  description = null
  previousPair = null

  constructor (dayIndex, previousPair, fromPair = null) {
    this.id = `${this.constructor.name}_${++TimePair.ID_COUNTER}`
    this.fromPair = fromPair
    this.dayIndex = dayIndex
    TimePair.pairs_[this.id] = this
    this.previousPair = previousPair
  }

  isEmpty () {
    return this.from === null && this.to === null
  }

  isFilled () {
    return this.from !== null && this.to !== null
  }

  isActive () {
    return (
      this.from !== null &&
      ((this.fromPair !== null && this.fromPair.to === null) ||
        this.to === null)
    )
  }

  push (time) {
    assert(!this.isFilled(), `${this.constructor.name} is already filled!`)

    if (this.from === null) {
      this.from = time
    } else {
      this.to = time
    }
  }

  getLabel (isHtml) {
    if (this.from === null) {
      return '???'
    }

    const arrow = isHtml ? ' <span class="time-arrow">→</span> ' : ' → '
    let label = `${getHoursMinutesLabel(this.from)} ${arrow} `

    if (this.to === null) {
      label += isHtml ? `${getLoadingText()}` : '...'
    } else {
      label += getHoursMinutesLabel(this.to)
    }

    if (isHtml) {
      label = `<div class="time-pair-element"><span class="time-bullet">·</span> ${label}</div>`
    }

    const deltaInSeconds = TimePair.getNormalized(this.id).getDeltaInSeconds()
    const timeDeltaLabel = getTimeDeltaLabel(deltaInSeconds)

    let dataTooltip = !this.description
      ? 'Paire non reconnue'
      : this.description
    dataTooltip = `data-tooltip="${dataTooltip}"`

    if (isHtml) {
      const additionalClasses = this.isActive() ? 'working-time-delta' : ''

      const additionalIconClasses =
        this.dayIndex == DateUtils.WORKDAY_COUNT - 1
          ? 'time-pair-entry-help-left'
          : ''

      label += `<div class="time-delta"><span id="${this.id}" class="${additionalClasses}">[${timeDeltaLabel}]</span><span class="time-pair-entry-help ${additionalIconClasses}" ${dataTooltip}><i class="time-pair-entry-help-icon fa fa-question-circle"></i></span></div>`
    } else {
      label += ` ${timeDeltaLabel}`
    }

    if (isHtml) {
      label = `<div class="time-pair-entry">${label}</div>`
    }

    return label
  }

  getDeltaInSeconds () {
    if (this.from === null) {
      assert(this.to === null, `${this.constructor.name} is malformed!`)
      return 0
    }

    const to = this.to === null ? getNow() : this.to
    return getTimeDeltaInSeconds(this.from, to)
  }

  normalize () {
    TimePair.normalizedPairs_[this.id] = this

    if (this.isEmpty()) {
      return
    }

    let hours = Settings.get(SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_HOURS)
    let minutes = Settings.get(
      SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_MINUTES
    )

    if (this.from.getHours() <= hours && this.from.getMinutes() < minutes) {
      this.from.setHours(hours)
      this.from.setMinutes(minutes)
    }

    hours = Settings.get(SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_HOURS)
    minutes = Settings.get(SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_MINUTES)

    if (this.to === null) {
      this.to = getNow()
    }

    if (this.to.getHours() >= hours && this.to.getMinutes() > minutes) {
      this.to.setHours(hours, minutes)
    }

    if (
      this.isMorning() &&
      convertDateToSeconds(stripYearMonthAndDay(this.to)) >
        DateConsts.getMaximumBeginningLunchTime()
    ) {
      this.to = stripHoursMinutesSecondsAndMilliseconds(this.to)
      shiftDateWithSeconds(this.to, DateConsts.getMaximumBeginningLunchTime())
    }

    if (this.previousPair !== null) {
      if (this.previousPair.isMorning() && this.isAfternoon()) {
        AdpData.days[this.dayIndex].afternoonBeginningPair = this

        const normalizedPreviousTo = convertDateToSeconds(
          stripYearMonthAndDay(TimePair.getNormalized(this.previousPair.id).to)
        )

        const delta =
          convertDateToSeconds(stripYearMonthAndDay(this.from)) -
          normalizedPreviousTo -
          DateConsts.getMinimumLunchBreakTime()

        if (delta < 0) {
          this.from = stripHoursMinutesSecondsAndMilliseconds(this.from)
          shiftDateWithSeconds(
            this.from,
            normalizedPreviousTo + DateConsts.getMinimumLunchBreakTime()
          )
        }
      }
    }

    if (this.from > this.to) {
      this.to = copyOrGenerateDate(this.from)
    }

    if (this.from <= getNow()) {
      if (this.isMorning()) {
        AdpData.days[this.dayIndex].morningEndPair = this
        const dayData = AdpData.days[this.dayIndex]

        if (dayData.remainingMorningBreakTime > 0) {
          const delta = this.getDeltaInSeconds()
          const toShift = Math.min(delta, dayData.remainingMorningBreakTime)
          dayData.remainingMorningBreakTime -= toShift
          shiftDateWithSeconds(this.from, toShift)
        }
      } else if (this.isAfternoon()) {
        const dayData = AdpData.days[this.dayIndex]

        if (dayData.remainingAfternoonBreakTime > 0) {
          const delta = this.getDeltaInSeconds()
          const toShift = Math.min(delta, dayData.remainingAfternoonBreakTime)
          dayData.remainingAfternoonBreakTime -= toShift
          shiftDateWithSeconds(this.from, toShift)
        }
      }
    }
  }

  isMorning () {
    return !this.isAfternoon()
  }

  isAfternoon () {
    return (
      convertDateToSeconds(stripYearMonthAndDay(this.from)) >
      DateConsts.getBeginningLunchBreakTime()
    )
  }

  getFromTimeInSeconds () {
    const timeObj = {
      hours: this.from.getHours(),
      minutes: this.from.getMinutes()
    }

    return convertDateObjToSeconds(timeObj)
  }

  getToTimeInSeconds () {
    const timeObj = {
      hours: this.to.getHours(),
      minutes: this.to.getMinutes()
    }

    return convertDateObjToSeconds(timeObj)
  }

  getNormalizedCopy () {
    const newPair = new TimePair(this.dayIndex, this.previousPair, this)
    // Make deep copies.
    newPair.from = this.from === null ? null : copyOrGenerateDate(this.from)
    newPair.to = this.to === null ? null : copyOrGenerateDate(this.to)
    newPair.description = this.description
    newPair.normalize()
    TimePair.normalizedPairs_[this.id] = newPair
    return newPair
  }

  toString () {
    return `${this.constructor.name}: [${this.getLabel()}]`
  }
}

function getNow (isYearMonthAndDayStrip = false, isRealNowForced = false) {
  let realNow = stripMilliseconds(new Date())
  let now = null

  if (!isRealNowForced) {
    if (realNow <= AdpData.startDate) {
      // Case: future.
      now = copyOrGenerateDate(AdpData.startDate)
    } else if (realNow >= AdpData.endDate) {
      // Case: past.
      now = copyOrGenerateDate(AdpData.endDate)
    }
  }

  if (now === null) {
    // Case: present.
    now = realNow
  }

  if (Global.isNowOverride()) {
    now = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Global.FORCED_HOURS,
      Global.FORCED_MINUTES,
      0,
      0
    )
  }

  return isYearMonthAndDayStrip ? stripYearMonthAndDay(now) : now
}

function shiftDateWithSeconds (date, seconds) {
  date.setSeconds(date.getSeconds() + seconds)
}

function isGainingTimeDuringLunchBreak (dayIndex) {
  const strippedNow = convertDateToSeconds(getNow(true))

  return (
    strippedNow > DateConsts.getRecommendedBeginningLunchTime() &&
    strippedNow < DateConsts.getMaximumBeginningLunchTime() &&
    (dayIndex === AdpData.dayIndex ||
      AdpData.days[dayIndex].predictedCumulatedWeeklyDelta !== 0)
  )
}

function isWithinTimeBoundaries (strippedTime) {
  return (
    (strippedTime >= DateConsts.getMinimumBeginningWorkingTime() &&
      strippedTime <= DateConsts.getRecommendedBeginningLunchTime()) ||
    (strippedTime >= DateConsts.getRecommendedBeginningLunchTime() &&
      strippedTime < DateConsts.getMaximumBeginningLunchTime()) ||
    (strippedTime >= DateConsts.getMaximumBeginningLunchTime() &&
      strippedTime <= DateConsts.getMaximumLeavingWorkingTime())
  )
}

function stripMilliseconds (date) {
  date = copyOrGenerateDate(date)

  date = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    0
  )

  return date
}

function copyOrGenerateDate (date) {
  const newDate = new Date(date)
  newDate.setMilliseconds(0)
  return newDate
}

function stripHoursMinutesSecondsAndMilliseconds (date) {
  date = new copyOrGenerateDate(date)

  date = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  )

  return date
}

function stripYearMonthAndDay (date) {
  date = new copyOrGenerateDate(date)

  date = new Date(
    1970,
    0,
    1,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    0
  )
  return date
}

function convertDateToSeconds (date, isUtc = true) {
  date = new copyOrGenerateDate(date)

  const milliseconds = isUtc
    ? Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        0
      )
    : date.getTime()

  return Math.ceil(milliseconds / 1000)
}

function getDateHoursMinutesFromSeconds (date, seconds) {
  date = new copyOrGenerateDate(date)

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    seconds,
    0
  )
}

function formatDateToYYYYMMDD (date) {
  date = new copyOrGenerateDate(date)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getMonthFromShortLabel (shortMonthLabel) {
  const months = [
    'janv.',
    'févr.',
    'mars',
    'avr.',
    'mai',
    'juin',
    'juil.',
    'août',
    'sept.',
    'oct.',
    'nov.',
    'déc.'
  ]

  return months.indexOf(shortMonthLabel.toLowerCase())
}

function getTimeDeltaInSeconds (from, to) {
  const timeSpan = (to - from) / 1000
  return timeSpan
}

function getDayLabelFromDayIndex (index) {
  index %= DateUtils.WEEKDAY_COUNT

  switch (index) {
    case 0:
      return DateUtils.MONDAY_LABEL
    case 1:
      return DateUtils.TUESDAY_LABEL
    case 2:
      return DateUtils.WEDNESDAY_LABEL
    case 3:
      return DateUtils.THURSDAY_LABEL
    case 4:
      return DateUtils.FRIDAY_LABEL
    case 5:
      return DateUtils.SATURDAY_LABEL
    case 6:
      return DateUtils.SUNDAY_LABEL
  }

  return DateUtils.UNKNOWN_LABEL
}

function getDayIndexFromDayLabel (day) {
  switch (day) {
    case DateUtils.MONDAY_LABEL:
      return 0
    case DateUtils.TUESDAY_LABEL:
      return 1
    case DateUtils.WEDNESDAY_LABEL:
      return 2
    case DateUtils.THURSDAY_LABEL:
      return 3
    case DateUtils.FRIDAY_LABEL:
      return 4
    case DateUtils.SATURDAY_LABEL:
      return 5
    case DateUtils.SUNDAY_LABEL:
      return 6
  }

  return -1
}

function getMondayOfCurrentWeek () {
  const today = getNow(false, true)
  const dayOfWeek = today.getDay()
  const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = stripHoursMinutesSecondsAndMilliseconds(
    today.setDate(today.getDate() + difference)
  )
  return monday
}

function isValidDayIndex (dayIndex) {
  return dayIndex >= 0 && dayIndex < DateUtils.WEEKDAY_COUNT
}

function getDayIndexFromDate (date) {
  const day = date.getDay()

  if (day == 0) {
    return 6
  }

  return day - 1
}

function getRecommendedMorningTimePair (anchorDate, description = null) {
  const beginningDate = copyOrGenerateDate(anchorDate)
  shiftDateWithSeconds(
    beginningDate,
    DateConsts.getRecommendedBeginningWorkingTime()
  )

  const endDate = copyOrGenerateDate(anchorDate)
  shiftDateWithSeconds(endDate, DateConsts.getRecommendedBeginningLunchTime())

  const pair = new TimePair(getDayIndexFromDate(anchorDate), null)
  pair.push(beginningDate)
  pair.push(endDate)
  pair.description = description
  return pair
}

function getRecommendedAfternoonTimePair (
  anchorDate,
  previousPair,
  description = null
) {
  const beginningDate = copyOrGenerateDate(anchorDate)
  shiftDateWithSeconds(
    beginningDate,
    DateConsts.getRecommendedEndingLunchTime()
  )

  const endDate = copyOrGenerateDate(anchorDate)
  shiftDateWithSeconds(endDate, DateConsts.getRecommendedEndingWorkingTime())

  const pair = new TimePair(getDayIndexFromDate(anchorDate), previousPair)
  pair.push(beginningDate)
  pair.push(endDate)
  pair.description = description
  return pair
}

function getDayLabelFromDate (date) {
  return getDayLabelFromDayIndex(getDayIndexFromDate(date))
}

function parseAdpTime (adpTime) {
  const [hours, minutes] = adpTime.split(':').map(Number)
  const date = getNow()
  date.setHours(hours, minutes, 0, 0)
  return date
}

function getHoursMinutesLabel (date) {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function getTimeSimpleDeltaLabel (
  seconds,
  hoursSeparator = ':',
  minutesSeparator = ''
) {
  const sign = seconds < 0 ? '-' : '+'
  const absSeconds = Math.abs(seconds)
  const hours = Math.floor(absSeconds / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((absSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0')

  return `${sign}${hours}${hoursSeparator}${minutes}${minutesSeparator}`
}

function getTimeDeltaLabel (
  seconds,
  hoursSeparator = 'h',
  minutesSeparator = 'm',
  isPlusSign = true
) {
  const sign = seconds < 0 ? '-' : isPlusSign ? '+' : ''
  const absSeconds = Math.abs(seconds)
  const hours = Math.floor(absSeconds / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((absSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0')

  if (hours <= 0) {
    return `${sign}${minutes}${minutesSeparator}`
  }

  return `${sign}${hours}${hoursSeparator}${minutes}${minutesSeparator}`
}

function getLongTimeDeltaLabel (seconds) {
  const sign = seconds < 0 ? '-' : ''
  const absSeconds = Math.abs(seconds)
  const hours = Math.floor(absSeconds / 3600).toString()
  const minutes = Math.floor((absSeconds % 3600) / 60).toString()

  const minutesLabel = minutes > 1 ? 'minutes' : 'minute'

  if (hours <= 0) {
    return `${sign}${minutes} ${minutesLabel}`
  }

  const hoursLabel = hours > 1 ? 'heures' : 'heure'

  if (minutes > 0) {
    return `${sign}${hours} ${hoursLabel} et ${minutes} ${minutesLabel}`
  } else {
    return `${sign}${hours} ${hoursLabel}`
  }
}

function convertDateObjToSeconds (timeObj) {
  let seconds = 0

  if (timeObj.days) {
    seconds += Math.abs(timeObj.days) * 86400
  }

  if (timeObj.hours) {
    seconds += Math.abs(timeObj.hours) * 3600
  }

  if (timeObj.minutes) {
    seconds += Math.abs(timeObj.minutes) * 60
  }

  if (timeObj.seconds) {
    seconds += Math.abs(timeObj.seconds)
  }

  if (timeObj.isNegative && seconds > 0) {
    seconds *= -1
  }

  return seconds
}

class DateConsts {
  static getMorningTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_MORNING_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_MORNING_MINUTES)
    })
  }

  static getAfternoonTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_AFTERNOON_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_AFTERNOON_MINUTES)
    })
  }

  static getMinimumBeginningWorkingTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_MINUTES)
    })
  }

  static getMinimumLeavingWorkingTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_MINUTES)
    })
  }

  static getMaximumLeavingWorkingTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_MINUTES)
    })
  }

  static getMinimumLunchBreakTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_MINIMUM_LUNCH_BREAK_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_MINIMUM_LUNCH_BREAK_MINUTES)
    })
  }

  static getBeginningLunchBreakTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_MINUTES)
    })
  }

  static getEndingLunchBreakTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_ENDING_LUNCH_BREAK_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_ENDING_LUNCH_BREAK_MINUTES)
    })
  }

  static getMorningBreakTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_MORNING_BREAK_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_MORNING_BREAK_MINUTES)
    })
  }

  static getAfternoonBreakTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_AFTERNOON_BREAK_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_AFTERNOON_BREAK_MINUTES)
    })
  }

  static getDailyRequiredHours () {
    return (
      Settings.get(SettingsKeys.TIME_MORNING_HOURS) +
      Settings.get(SettingsKeys.TIME_AFTERNOON_HOURS)
    )
  }

  static getDailyRequiredMinutes () {
    return (
      Settings.get(SettingsKeys.TIME_MORNING_MINUTES) +
      Settings.get(SettingsKeys.TIME_AFTERNOON_MINUTES)
    )
  }

  static getDailyRequiredTime () {
    return convertDateObjToSeconds({
      hours: DateConsts.getDailyRequiredHours(),
      minutes: DateConsts.getDailyRequiredMinutes()
    })
  }

  static getWeeklyRequiredHours () {
    return DateConsts.getDailyRequiredHours() * DateUtils.WORKDAY_COUNT
  }

  static getWeeklyRequiredMinutes () {
    return DateConsts.getDailyRequiredMinutes() * DateUtils.WORKDAY_COUNT
  }

  static getWeeklyRequiredTime () {
    return convertDateObjToSeconds({
      hours: DateConsts.getWeeklyRequiredHours(),
      minutes: DateConsts.getWeeklyRequiredMinutes()
    })
  }

  static getRecommendedBeginningWorkingTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(
        SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_HOURS
      ),
      minutes: Settings.get(
        SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_MINUTES
      )
    })
  }

  static getRecommendedBeginningLunchTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_HOURS),
      minutes: Settings.get(
        SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_MINUTES
      )
    })
  }

  static getRecommendedEndingLunchTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_MINUTES)
    })
  }

  static getMaximumBeginningLunchTime () {
    return (
      DateConsts.getEndingLunchBreakTime() -
      DateConsts.getMinimumLunchBreakTime()
    )
  }

  static getRecommendedEndingWorkingTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_HOURS),
      minutes: Settings.get(
        SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_MINUTES
      )
    })
  }

  static getRecommendedLunchBreakTime () {
    return (
      DateConsts.getRecommendedEndingLunchTime() -
      DateConsts.getRecommendedBeginningLunchTime()
    )
  }

  static getWeekHours () {
    return DateUtils.WORKDAY_COUNT * DateConsts.getDailyRequiredHours()
  }

  static getWeekMinutes () {
    return DateUtils.WORKDAY_COUNT * DateConsts.getDailyRequiredMinutes()
  }

  static getWeekTime () {
    return convertDateObjToSeconds({
      hours: DateConsts.getWeekHours(),
      minutes: DateConsts.getWeekMinutes()
    })
  }

  static getLowestExtraTotalTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_LOWEST_TOTAL_EXTRA_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_LOWEST_TOTAL_EXTRA_MINUTES)
    })
  }

  static getHighestWeeklyExtraTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_HIGHEST_WEEKLY_EXTRA_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_HIGHEST_WEEKLY_EXTRA_MINUTES)
    })
  }

  static getHighestMonthlyExtraTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_HIGHEST_TOTAL_EXTRA_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_HIGHEST_TOTAL_EXTRA_MINUTES)
    })
  }
}
