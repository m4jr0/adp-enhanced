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

  static get (id) {
    if (!TimePair.pairs_.hasOwnProperty(id)) {
      return null
    }

    return TimePair.pairs_[id]
  }

  id = null
  from = null
  to = null
  description = null

  constructor () {
    this.id = `${this.constructor.name}_${++TimePair.ID_COUNTER}`
    TimePair.pairs_[this.id] = this
  }

  isEmpty () {
    return this.from === null && this.to === null
  }

  isFilled () {
    return this.from !== null && this.to !== null
  }

  isActive () {
    return this.from !== null && this.to === null
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
    const isWorking = this.to === null

    if (isWorking) {
      label += isHtml ? `${getLoadingText()}` : '...'
    } else {
      label += getHoursMinutesLabel(this.to)
    }

    if (isHtml) {
      label = `<div class="time-pair-element"><span class="time-bullet">·</span> ${label}</div>`
    }

    const timeDeltaLable = getTimeDeltaLabel(this.getDeltaInSeconds())

    let dataTooltip = !this.description
      ? 'Paire non reconnue'
      : this.description
    dataTooltip = `data-tooltip="${dataTooltip}"`

    if (isHtml) {
      const additionalClasses = isWorking ? 'working-time-delta' : ''
      label += `<div class="time-delta"><span id="${this.id}" class="${additionalClasses}">[${timeDeltaLable}]</span><span class="time-pair-entry-help" ${dataTooltip}><i class="time-pair-entry-help-icon fa fa-question-circle"></i></span></div>`
    } else {
      label += ` ${timeDeltaLable}`
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

    const to = this.to === null ? new Date() : this.to
    return getTimeDeltaInSeconds(this.from, to)
  }

  normalize () {
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
  }

  getFromTimeInSeconds () {
    var timeObj = {
      hours: this.from.getHours(),
      minutes: this.from.getMinutes()
    }

    return convertDateObjToSeconds(timeObj)
  }

  getToTimeInSeconds () {
    var timeObj = {
      hours: this.to.getHours(),
      minutes: this.to.getMinutes()
    }

    return convertDateObjToSeconds(timeObj)
  }

  getNormalizedCopy () {
    const newPair = new TimePair()
    // Make deep copies.
    newPair.from = this.from === null ? null : new Date(this.from)
    newPair.to = this.to === null ? null : new Date(this.to)
    newPair.normalize()
    return newPair
  }

  toString () {
    return `${this.constructor.name}: [${this.getLabel()}]`
  }
}

class DayData {
  timePairs = []
}

function getStartAndEndDates () {
  const dateEl = document.getElementsByClassName(
    'periods-nav-item displayed-period text-center pointer'
  )[0]

  const regex =
    /(\d{1,2})\s*([a-z]{3,4}\.?)\s*-\s*(\d{1,2})\s*([a-z]{3,4}\.)\s*(\d{4})/i
  const match = dateEl.innerText.match(regex)

  if (match === null) {
    return new Date()
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
}

function getNow () {
  let realNow = new Date()
  let now = null

  if (realNow <= AdpData.startDate) {
    // Case: future.
    now = new Date(AdpData.startDate)
  } else if (realNow >= AdpData.endDate) {
    // Case: past.
    now = new Date(AdpData.endDate)
  } else {
    // Case: present.
    now = realNow
  }

  return now
}

function formatDateToYYYYMMDD (date) {
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

function getTimeDeltaString (
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

function getDayFromIndex (index) {
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

function getIndexFromDay (day) {
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
  const today = new Date()
  const dayOfWeek = today.getDay()
  const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today.setDate(today.getDate() + difference))
  monday.setHours(0, 0, 0, 0)
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
  const beginningDate = new Date(
    anchorDate.getTime() +
      DateConsts.getRecommendedBeginningWorkingTime() * 1000
  )
  const endDate = new Date(
    anchorDate.getTime() + DateConsts.getRecommendedBeginningLunchTime() * 1000
  )

  const pair = new TimePair()
  pair.push(beginningDate)
  pair.push(endDate)
  pair.description = description
  return pair
}

function getRecommendedAfternoonTimePair (anchorDate, description = null) {
  const beginningDate = new Date(
    anchorDate.getTime() + DateConsts.getRecommendedEndingLunchTime() * 1000
  )
  const endDate = new Date(
    anchorDate.getTime() + DateConsts.getRecommendedEndingWorkingTime() * 1000
  )

  const pair = new TimePair()
  pair.push(beginningDate)
  pair.push(endDate)
  pair.description = description
  return pair
}

function getDayLabelFromDate (date) {
  return getDayFromIndex(getDayIndexFromDate(date))
}

function parseAdpTime (adpTime) {
  const [hours, minutes] = adpTime.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

function getHoursMinutesLabel (date) {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function getTimeDeltaLabel (
  seconds,
  hoursSeparator = 'h',
  minutesSeparator = 'm'
) {
  const sign = seconds < 0 ? '-' : '+'
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
      hours: getDailyRequiredHours(),
      minutes: getDailyRequiredMinutes()
    })
  }

  static getWeeklyRequiredHours () {
    return getDailyRequiredHours() * DateUtils.WORKDAY_COUNT
  }

  static getWeeklyRequiredMinutes () {
    return getDailyRequiredMinutes() * DateUtils.WORKDAY_COUNT
  }

  static getWeeklyRequiredTime () {
    return convertDateObjToSeconds({
      hours: getWeeklyRequiredHours(),
      minutes: getWeeklyRequiredMinutes()
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

  static getRecommendedEndingWorkingTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_HOURS),
      minutes: Settings.get(
        SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_MINUTES
      )
    })
  }

  static getRecommendedLunchBreakTime () {
    return convertDateObjToSeconds({
      hours: Settings.get(SettingsKeys.TIME_RECOMMENDED_LUNCH_BREAK_HOURS),
      minutes: Settings.get(SettingsKeys.TIME_RECOMMENDED_LUNCH_BREAK_MINUTES)
    })
  }

  static getWeekHours () {
    return DateUtils.WORKDAY_COUNT * getDailyRequiredHours()
  }

  static getWeekMinutes () {
    return DateUtils.WORKDAY_COUNT * getDailyRequiredMinutes()
  }

  static getWeekTime () {
    return convertDateObjToSeconds({
      hours: getWeekHours(),
      minutes: getWeekMinutes()
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
