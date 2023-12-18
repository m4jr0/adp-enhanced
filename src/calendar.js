function getHeaderHtml () {
  return `<div class="row timesheet-totals">
  <div class="col-sm-3 col-xs-12 text-center">
    <div>
      <div ng-switch-when="not-approved" class="ng-scope">
        <timecard-total-view class="row ng-isolate-scope" type="totalhours" color="neutral-dark" size="xl"
          current="timecardCalendarCtrl.currentTimesheet"
          use-fractional-format="timecardCalendarCtrl.useFractionFormat">
          <div class="timesheet-total">
            <div class="timecard-totals-label ng-binding">Temps total</div>
            <adp-poker-chip id="timecard-total" class="ng-isolate-scope"><adp-pokerchip-container
                class="xl neutral-dark-bg render-chip" data-chip-progress="100">
                <adp-pokerchip-inset class="white-bg"><adp-pokerchip-percentage
                    class="neutral-dark description"><adp-pokerchip-data-container>
                      <adp-pokerchip-progression class="ng-binding ng-scope"
                        id="total-time">-</adp-pokerchip-progression><adp-pokerchip-subtext class="ng-binding"
                        style="font-size: 14px">h
                        min</adp-pokerchip-subtext></adp-pokerchip-data-container></adp-pokerchip-percentage></adp-pokerchip-inset>
                <div id="adp-pokerchip-mask-container">
                  <adp-pokerchip-mask class="full ng-scope"><adp-pokerchip-fill
                      class="neutral-dark-bg"></adp-pokerchip-fill></adp-pokerchip-mask>
                  <adp-pokerchip-mask class="half"><adp-pokerchip-fill
                      class="neutral-dark-bg"></adp-pokerchip-fill><adp-pokerchip-fill
                      class="fix"></adp-pokerchip-fill></adp-pokerchip-mask>
                </div>
              </adp-pokerchip-container>
            </adp-poker-chip>
          </div>
        </timecard-total-view>
      </div>
    </div>
  </div>

  <div class="col-sm-9 col-xs-12 no-padding">
    <div class="col-sm-5 hidden-xs">
      <weekly-view weeks="timecardCalendarCtrl.calendarView.model.weeks" class="ng-isolate-scope">
        <div class="timecard-week-totals">
          <div class="timecard-totals-label ng-binding">
            Résumé de la semaine
          </div>
          <div class="row timecard-week-total ng-scope">
            <div class="timecard-week-total-header ng-binding">
              Quota d'heures variables
            </div>
            <div>
              <span class="week-date-range ng-binding">Début</span>
              <span class="pull-right text-right week-total ng-binding" id="beginning-extra-time">-</span>
            </div>
            <div>
              <span class="week-date-range ng-binding">Fin (estimation)</span>
              <span class="pull-right text-right week-total ng-binding" id="ending-extra-time">-</span>
            </div>
          </div>
        </div>
      </weekly-view>
    </div>
  </div>
</div>
  `
}

function getViewHtml () {
  return `<div class="timecard-calendar-view ng-pristine ng-valid" id="timecard-calendar">
  <div>
    <div class="ng-scope">
      <div class="row time-calendar timecard-calendar monospace-numbers">
        <div class="time-calendar-table time-calendar-week ng-scope">
          <div class="time-calendar-table-row ng-scope">
            <div class="time-calendar-table-cell ng-scope monday-day">
              <div class="cell-day-header ng-binding">Lun</div>
            </div>
            <div class="time-calendar-table-cell ng-scope tuesday-day">
              <div class="cell-day-header ng-binding">Mar</div>
            </div>
            <div class="time-calendar-table-cell ng-scope wednesday-day">
              <div class="cell-day-header ng-binding">Mer</div>
            </div>
            <div class="time-calendar-table-cell ng-scope thursday-day">
              <div class="cell-day-header ng-binding">Jeu</div>
            </div>
            <div class="time-calendar-table-cell ng-scope friday-day">
              <div class="cell-day-header ng-binding">Ven</div>
            </div>
            <div class="time-calendar-table-cell ng-scope saturday-day">
              <div class="cell-day-header ng-binding">Sam</div>
            </div>
            <div class="time-calendar-table-cell ng-scope sunday-day">
              <div class="cell-day-header ng-binding">Dim</div>
            </div>
          </div>
        </div>
        <div class="time-calendar-week ng-scope selected-week last-week">
          <div class="time-calendar-table">
            <div class="time-calendar-table-row">
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded monday-day">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="monday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope day-times monday-times">
                            <div id="monday-time">-</div>
                            <div id="monday-predictions" class="day-predictions">
                              <p id="monday-daily-prediction" class="day-prediction">-</p>
                              <p class="day-predictions-separator"><span id="monday-predictions-help-icon" class="day-predictions-help-icon"><i class="fa fa-question-circle"></i></span></p>
                              <p id="monday-weekly-prediction" class="day-prediction">-</p>
                            </div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="monday-details">
                      </div>
                    </timecard-calendar-view-see-details>
                  </div>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded tuesday-day">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="tuesday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope day-times tuesday-times">
                            <div id="tuesday-time">-</div>
                            <div id="tuesday-predictions" class="day-predictions">
                              <p id="tuesday-daily-prediction" class="day-prediction">-</p>
                              <p class="day-predictions-separator"><span id="tuesday-predictions-help-icon" class="day-predictions-help-icon"><i class="fa fa-question-circle"></i></span></p>
                              <p id="tuesday-weekly-prediction" class="day-prediction">-</p>
                            </div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="tuesday-details">
                      </div>
                    </timecard-calendar-view-see-details>
                  </div>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded wednesday-day">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="wednesday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope day-times wednesday-times">
                            <div id="wednesday-time">-</div>
                            <div id="wednesday-predictions" class="day-predictions">
                              <p id="wednesday-daily-prediction" class="day-prediction">-</p>
                              <p class="day-predictions-separator"><span id="wednesday-predictions-help-icon" class="day-predictions-help-icon"><i class="fa fa-question-circle"></i></span></p>
                              <p id="wednesday-weekly-prediction" class="day-prediction">-</p>
                            </div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="wednesday-details">
                      </div>
                    </timecard-calendar-view-see-details>
                  </div>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded thursday-day">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="thursday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope day-times thursday-times">
                            <div id="thursday-time">-</div>
                            <div id="thursday-predictions" class="day-predictions">
                              <p id="thursday-daily-prediction" class="day-prediction">-</p>
                              <p class="day-predictions-separator"><span id="thursday-predictions-help-icon" class="day-predictions-help-icon"><i class="fa fa-question-circle"></i></span></p>
                              <p id="thursday-weekly-prediction" class="day-prediction">-</p>
                            </div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="thursday-details">
                      </div>
                    </timecard-calendar-view-see-details>
                  </div>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded friday-day">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="friday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope day-times friday-times">
                            <div id="friday-time">-</div>
                            <div id="friday-predictions" class="day-predictions">
                              <p id="friday-daily-prediction" class="day-prediction">-</p>
                              <p class="day-predictions-separator"><span id="friday-predictions-help-icon" class="day-predictions-help-icon"><i class="fa fa-question-circle"></i></span></p>
                              <p id="friday-weekly-prediction" class="day-prediction">-</p>
                            </div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="friday-details">
                      </div>
                    </timecard-calendar-view-see-details>
                  </div>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded saturday-day">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="saturday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope day-times saturday-times">
                            <div id="saturday-time">-</div>
                            <div id="saturday-predictions" class="day-predictions">
                              <p id="saturday-daily-prediction" class="day-prediction">-</p>
                              <p class="day-predictions-separator"><span id="saturday-predictions-help-icon" class="day-predictions-help-icon"><i class="fa fa-question-circle"></i></span></p>
                              <p id="saturday-weekly-prediction" class="day-prediction">-</p>
                            </div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="saturday-details">
                      </div>
                    </timecard-calendar-view-see-details>
                  </div>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded sunday-day">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="sunday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope day-times sunday-times">
                            <div id="sunday-time">-</div>
                            <div id="sunday-predictions" class="day-predictions">
                              <p id="sunday-daily-prediction" class="day-prediction">-</p>
                              <p class="day-predictions-separator"><span id="sunday-predictions-help-icon" class="day-predictions-help-icon"><i class="fa fa-question-circle"></i></span></p>
                              <p id="sunday-weekly-prediction" class="day-prediction">-</p>
                            </div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="sunday-details">
                      </div>
                    </timecard-calendar-view-see-details>
                  </div>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `
}

function listenForPeriodPicker () {
  let previousValue = document.querySelector('.periods-navigator').innerHTML

  function checkForChanges () {
    const periodNavigator = document.querySelector('.periods-navigator')
    const currentValue = periodNavigator.innerHTML

    if (previousValue !== currentValue) {
      previousValue = currentValue
      setup()
    }
  }

  setInterval(checkForChanges, Loader.SCRIPT_LOAD_SLEEP_IN_MILLISECONDS)
}

function listenForRefreshButton () {
  const element = document.querySelector(
    '[ng-click="timecardCalendarCtrl.reload()"]'
  )

  element.addEventListener('click', event => {
    setup()
  })
}

const listenForRefreshed = (function () {
  let isLoaded = false

  return function () {
    if (isLoaded) {
      return
    }

    listenForPeriodPicker()
    listenForRefreshButton()
    isLoaded = true
  }
})()

async function setup () {
  listenForRefreshed()
  AdpData.setup()
  await getVersionData()
  await getAssociateOid()
  await getExtraHours()

  await getCalendarTimes().then(calendarEntries => {
    setCalendarTimes(calendarEntries)
  })

  await getCalendarEvents().then(calendarEvents => {
    setCalendarEvents(calendarEvents)
  })

  AdpData.refresh()

  const headerEl = document.querySelector('.row .timesheet-totals')

  if (headerEl === null) {
    return
  }

  const viewEl = document.querySelector('esi-timecard-calendar-view')

  if (viewEl === null) {
    return
  }

  headerEl.innerHTML = getHeaderHtml()
  viewEl.innerHTML = getViewHtml()

  for (let dayIndex = 0; dayIndex < DateUtils.WORKDAY_COUNT; ++dayIndex) {
    const dayLabel = getDayLabelFromDayIndex(dayIndex)
    const monthDayEl = document.querySelector(`#${dayLabel}-month-day`)
    monthDayEl.innerHTML = AdpData.getDayDate(dayIndex).getDate()
    const timePairsEl = document.querySelector(`#${dayLabel}-details`)
    const dayData = AdpData.days[dayIndex]
    let timePairsElHtml =
      '<div class="time-logging"><p class="day-details-title day-details-title-first">Pointage</p>'

    if (dayData.timePairs.length > 0) {
      dayData.timePairs.forEach((timePair, index) => {
        timePairsElHtml += timePair.getLabel(true)
      })
    } else {
      timePairsElHtml += getNoTimePairEl()
    }

    timePairsElHtml += '</div><hr class="time-separator">'
    timePairsElHtml += '<p class="day-details-title">Événements</p>'

    if (dayData.specialTimePairs.length > 0) {
      dayData.specialTimePairs.forEach((timePair, index) => {
        timePairsElHtml += timePair.getLabel(true)
      })
    } else {
      timePairsElHtml += getNoTimePairEl()
    }

    timePairsEl.innerHTML = timePairsElHtml

    let beginningExtraTimesEl = document.querySelector('#beginning-extra-time')
    beginningExtraTimesEl.innerHTML = getTimeSimpleDeltaLabel(
      AdpData.beginningExtraTime
    )

    let endingExtraTimesEl = document.querySelector('#ending-extra-time')
    endingExtraTimesEl.parentElement.style.display = 'none'
  }

  startRefresh()
}

function setCalendarTimes (calendarEntries) {
  for (const entry of calendarEntries) {
    const date = stripHoursMinutesSecondsAndMilliseconds(entry.entryDate)
    const dayIndex = getDayIndexFromDate(date)
    const dayData = (AdpData.days[dayIndex] = new DayData(dayIndex))
    dayData.date = date

    if (entry.entryDetail === undefined) {
      continue
    }

    const rawTimePairs = entry.entryDetail[0].timePairSummary

    if (rawTimePairs) {
      let pair = new TimePair(dayIndex, null)
      pair.description = 'Pointage'

      for (const rawTimePair of rawTimePairs) {
        const pairDate = stripMilliseconds(rawTimePair.timePeriod.startDateTime)
        const codeName = rawTimePair.codeName

        if (isSpecificTimePair(codeName)) {
          const specificPair = new TimePair(dayIndex, null)

          const pairEndDate = stripMilliseconds(
            rawTimePair.timePeriod.endDateTime
          )

          specificPair.push(pairDate)
          specificPair.push(pairEndDate)
          specificPair.description = getTimePairDescriptionFromAdp(codeName)
          dayData.specialTimePairs.push(specificPair)
          continue
        }

        if (codeName !== 'punch') {
          log(`Unknown or unsupported code name: ${codeName}.`, Log.Warning)
          continue
        }

        if (pair.isFilled()) {
          dayData.timePairs.push(pair)
          pair = new TimePair(dayIndex, pair)
          pair.description = 'Pointage'
        }

        pair.push(pairDate)
      }

      if (!pair.isEmpty()) {
        dayData.timePairs.push(pair)
      }
    }

    const hoursSummaries = entry.entryDetail[0].hoursSummary

    if (hoursSummaries !== undefined) {
      for (const hoursSummary of hoursSummaries) {
        try {
          const specialPair = getResolvedTimePair(
            dayData,
            hoursSummary.codeName,
            hoursSummary.hoursValue
          )

          if (specialPair === null) {
            continue
          }

          dayData.specialTimePairs.push(specialPair)
        } catch (error) {
          // Ignore error for this specific case (we are not sure if all cases are handled correctly).
          log(
            `Error while trying to parse specific time pair: ${error}`,
            Log.Error
          )
        }
      }
    }

    const dayPeriodSummaries = entry.entryDetail[0].dayPeriodSummary

    if (dayPeriodSummaries === undefined) {
      continue
    }

    for (const dayPeriodSummary of dayPeriodSummaries) {
      try {
        const specialPair = getResolvedTimePair(
          dayData,
          dayPeriodSummary.codeName,
          dayPeriodSummary.dayPeriodValue
        )

        if (specialPair === null) {
          continue
        }

        dayData.specialTimePairs.push(specialPair)
      } catch (error) {
        // Ignore error for this specific case (we are not sure if all cases are handled correctly).
        log(
          `Error while trying to parse specific time pair: ${error}`,
          Log.Error
        )
      }
    }
  }
}

function setCalendarEvents (calendarEvents) {
  for (const calendarEvent of calendarEvents) {
    const subject = calendarEvent.subject

    if (subject !== 'Férié') {
      continue
    }

    const startTime = calendarEvent.timePeriod.startDateTime
    const date = copyOrGenerateDate(startTime)
    const dayIndex = getDayIndexFromDate(date)
    const dayData = AdpData.days[dayIndex]
    const morningPair = getLeaveMorningTimePair(
      dayData.date,
      'Jour férié (matin)'
    )

    dayData.specialTimePairs.push(morningPair)

    dayData.specialTimePairs.push(
      getLeaveAfternoonTimePair(
        dayData.date,
        morningPair,
        'Jour férié (après-midi)'
      )
    )
  }
}

function generateLeavingTime (leavingTime, timeLeft, isTimeActive, isDelta) {
  const additionalClasses = isTimeActive ? 'working-time-delta' : ''
  let toReturn = `<span class="day-leaving-time-and-delta ${additionalClasses}">${getTimeDeltaLabel(
    leavingTime,
    'h',
    '',
    false
  )}</span>`

  if (isDelta) {
    toReturn += ` <span class="day-leaving-time-delta ${additionalClasses}">[${getTimeDeltaLabel(
      -timeLeft
    )}]</span>`
  }

  return toReturn
}

function display () {
  const isWorking = AdpData.isWorking()
  const progressionEl = document.querySelector('#total-time')
  progressionEl.innerHTML = getTimeSimpleDeltaLabel(AdpData.totalTime)

  const progressionSubTextEl = document.querySelector('adp-pokerchip-subtext')
  const progressionMaskEl = document.querySelector('adp-pokerchip-mask')
  const progressionRingEls = document.querySelectorAll('adp-pokerchip-fill')

  let progressionMaskContainerEl = document.querySelector(
    '#adp-pokerchip-mask-container'
  )

  if (isWorking) {
    progressionEl.classList.add('working-global-time')
    progressionSubTextEl.classList.add('working-global-time')
    progressionMaskEl.classList.add('working-global-time-mask')
    progressionMaskContainerEl.classList.add('working-global-time-container')

    for (const progressionRingEl of progressionRingEls) {
      progressionRingEl.classList.add('working-global-time-ring')
    }
  } else {
    progressionEl.classList.remove('working-global-time')
    progressionSubTextEl.classList.remove('working-global-time')
    progressionMaskEl.classList.remove('working-global-time-mask')
    progressionMaskContainerEl.classList.remove('working-global-time-container')

    for (const progressionRingEl of progressionRingEls) {
      progressionRingEl.classList.remove('working-global-time-ring')
    }
  }

  if (AdpData.isFutureWeek()) {
    const dayTimeEls = document.querySelectorAll('.day-times')

    dayTimeEls.forEach(dayTimeEl => {
      dayTimeEl.style.display = 'none'
    })

    const timeLoggingEls = document.querySelectorAll('.time-logging')

    timeLoggingEls.forEach(dayTimeEl => {
      dayTimeEl.style.display = 'none'
    })
  } else {
    const currentDayIndex = getDayIndexFromDate(getNow())

    for (let dayIndex = 0; dayIndex < DateUtils.WORKDAY_COUNT; ++dayIndex) {
      const dayData = AdpData.days[dayIndex]
      const dayLabel = getDayLabelFromDayIndex(dayIndex)

      if (dayIndex < currentDayIndex) {
        document.querySelector(`#${dayLabel}-predictions`).style.display =
          'none'
      } else {
        const dailyRequiredTime = DateConsts.getDailyRequiredTime()

        document
          .querySelector(`#${dayLabel}-predictions-help-icon`)
          .setAttribute(
            'data-tooltip',
            `À gauche : temps de départ conseillé pour effectuer une journée de ${getLongTimeDeltaLabel(
              dailyRequiredTime
            )}.\n\nÀ droite : temps de départ conseillé pour effectuer une semaine de ${getLongTimeDeltaLabel(
              dailyRequiredTime * DateUtils.WORKDAY_COUNT
            )} (et donc, pour être à ${getLongTimeDeltaLabel(
              dailyRequiredTime * (dayIndex + 1)
            )} à la fin de cette journée).`
          )

        document.querySelector(`#${dayLabel}-daily-prediction`).innerHTML =
          generateLeavingTime(
            dayData.dailyLeavingTime,
            dayData.dailyTimeLeft,
            isWorking && dayIndex === currentDayIndex,
            dayIndex === currentDayIndex
          )

        document.querySelector(`#${dayLabel}-weekly-prediction`).innerHTML =
          generateLeavingTime(
            dayData.weeklyLeavingTime,
            dayData.weeklyTimeLeft,
            isWorking,
            dayIndex === currentDayIndex
          )
      }

      if (dayIndex > currentDayIndex) {
        continue
      }

      const dayTimeEl = document.querySelector(`#${dayLabel}-time`)
      const dayTime = AdpData.getDayTime(dayIndex)
      dayTimeEl.innerHTML = `${getTimeSimpleDeltaLabel(
        dayTime
      )} <span class="cumulated-daily-delta">${getTimeSimpleDeltaLabel(
        dayData.cumulatedDailyDelta
      )}</span>`

      if (!isWorking || dayIndex !== currentDayIndex) {
        dayTimeEl.classList.remove('working-day-time')
      } else {
        dayTimeEl.classList.add('working-day-time')
      }
    }

    const activeTimePairEls = document.querySelectorAll('.working-time-delta')

    for (const activeTimePairEl of activeTimePairEls) {
      const timePair = TimePair.get(activeTimePairEl.id)

      if (timePair === null) {
        continue
      }

      activeTimePairEl.innerHTML = `[${getTimeDeltaLabel(
        TimePair.getNormalized(timePair.id).getDeltaInSeconds()
      )}]`
    }
  }

  for (
    let dayIndex = DateUtils.WORKDAY_COUNT;
    dayIndex < DateUtils.WEEKDAY_COUNT;
    ++dayIndex
  ) {
    const dayLabel = getDayLabelFromDayIndex(dayIndex)
    const dayTimeEls = document.querySelectorAll(`.${dayLabel}-day`)

    dayTimeEls.forEach(dayTimeEl => {
      dayTimeEl.style.display = 'none'
    })
  }
}

function startRefresh () {
  const delay = (30 - getNow().getSeconds()) * 1000
  display()

  setTimeout(() => {
    setInterval(refresh, 1000 * 30)
  }, delay)
}

function refresh () {
  AdpData.refresh()
  display()
}
