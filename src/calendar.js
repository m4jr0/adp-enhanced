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
            <div class="time-calendar-table-cell ng-scope">
              <div class="cell-day-header ng-binding">Lun</div>
            </div>
            <div class="time-calendar-table-cell ng-scope">
              <div class="cell-day-header ng-binding">Mar</div>
            </div>
            <div class="time-calendar-table-cell ng-scope">
              <div class="cell-day-header ng-binding">Mer</div>
            </div>
            <div class="time-calendar-table-cell ng-scope">
              <div class="cell-day-header ng-binding">Jeu</div>
            </div>
            <div class="time-calendar-table-cell ng-scope">
              <div class="cell-day-header ng-binding">Ven</div>
            </div>
            <div class="time-calendar-table-cell ng-scope">
              <div class="cell-day-header ng-binding">Sam</div>
            </div>
            <div class="time-calendar-table-cell ng-scope">
              <div class="cell-day-header ng-binding">Dim</div>
            </div>
          </div>
        </div>
        <div class="time-calendar-week ng-scope selected-week last-week">
          <div class="time-calendar-table">
            <div class="time-calendar-table-row">
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="monday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope">
                            <div id="monday-time">-</div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="monday-details">
                      </div>
                  </div>

                  </timecard-calendar-view-see-details>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="tuesday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope">
                            <div id="tuesday-time">-</div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="tuesday-details">
                      </div>
                  </div>

                  </timecard-calendar-view-see-details>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="wednesday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope">
                            <div id="wednesday-time">-</div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="wednesday-details">
                      </div>
                  </div>

                  </timecard-calendar-view-see-details>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="thursday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope">
                            <div id="thursday-time">-</div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="thursday-details">
                      </div>
                  </div>

                  </timecard-calendar-view-see-details>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="friday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope">
                            <div id="friday-time">-</div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="friday-details">
                      </div>
                  </div>

                  </timecard-calendar-view-see-details>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="saturday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope">
                            <div id="saturday-time">-</div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="saturday-details">
                      </div>
                  </div>

                  </timecard-calendar-view-see-details>
                  <timecard-day-schedule class="ng-scope ng-isolate-scope">
                    <div>
                    </div>
                  </timecard-day-schedule>
                </div>
              </div>
              <div class="time-calendar-table-cell timecard-day cell-content-details-expanded">
                <div class="cell-content timecard-day-content view-only cell-content-expanded">
                  <div>
                    <div ng-switch-when="content" class="ng-scope">
                      <day-summary-content>
                        <div class="timecard-day-summary">
                          <div class="cell-date ng-binding" id="sunday-month-day">-</div>
                          <div class="timecard-calendar hours-summary day-time ng-binding ng-scope">
                            <div id="sunday-time">-</div>
                          </div>
                        </div>
                      </day-summary-content>
                    </div>
                  </div>
                  <div class="row cell-content-details ng-scope">
                    <timecard-calendar-view-see-details class="ng-scope ng-isolate-scope">
                      <div class="ng-isolate-scope day-details" id="sunday-details">
                      </div>
                  </div>

                  </timecard-calendar-view-see-details>
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
  getStartAndEndDates()
  await getVersionData()
  await getAssociateOid()
  await getExtraHours()

  await getCalendarTimes().then(calendarEntries => {
    setCalendarTimes(calendarEntries)
  })

  await getCalendarEvents().then(calendarEvents => {
    setCalendarEvents(calendarEvents)
  })

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

  for (let i = 0; i < DateUtils.WEEKDAY_COUNT; ++i) {
    const dayLabel = getDayFromIndex(i)
    const monthDayEl = document.querySelector(`#${dayLabel}-month-day`)
    monthDayEl.innerHTML = AdpData.getDayDate(dayLabel).getDate()
    const timePairsEl = document.querySelector(`#${dayLabel}-details`)
    const dayData = AdpData.days[dayLabel]

    timePairsEl.innerHTML = '<p class="day-details-title">Pointage</p>'

    if (dayData.timePairs.length > 0) {
      dayData.timePairs.forEach((timePair, index) => {
        timePairsEl.innerHTML += timePair.getLabel(true)
      })
    } else {
      timePairsEl.innerHTML += getNoTimePairEl()
    }

    timePairsEl.innerHTML += '<hr class="time-separator">'
    timePairsEl.innerHTML += '<p class="day-details-title">Événements</p>'

    if (dayData.specialTimePairs.length > 0) {
      dayData.specialTimePairs.forEach((timePair, index) => {
        timePairsEl.innerHTML += timePair.getLabel(true)
      })
    } else {
      timePairsEl.innerHTML += getNoTimePairEl()
    }

    let beginningExtraTimesEl = document.querySelector('#beginning-extra-time')
    beginningExtraTimesEl.innerHTML = getTimeDeltaString(
      AdpData.beginningExtraTime
    )

    let endingExtraTimesEl = document.querySelector('#ending-extra-time')
    endingExtraTimesEl.parentElement.style.display = 'none'
  }

  startRefresh()
}

function setCalendarTimes (calendarEntries) {
  for (const entry of calendarEntries) {
    const date = new Date(entry.entryDate)
    const dayData = (AdpData.days[getDayLabelFromDate(date)] = new AdpDayData())
    dayData.date = new Date(date)
    dayData.date.setHours(0, 0, 0, 0)

    if (entry.entryDetail === undefined) {
      continue
    }

    const rawTimePairs = entry.entryDetail[0].timePairSummary

    if (rawTimePairs) {
      let pair = new TimePair()
      pair.description = 'Pointage'

      for (const rawTimePair of rawTimePairs) {
        const pairDate = new Date(rawTimePair.timePeriod.startDateTime)

        if (pair.isFilled()) {
          dayData.timePairs.push(pair)
          pair = new TimePair()
          pair.description = 'Pointage'
        }

        pair.push(pairDate)
      }

      if (!pair.isEmpty()) {
        dayData.timePairs.push(pair)
      }
    }

    const dayPeriodSummaries = entry.entryDetail[0].dayPeriodSummary

    if (dayPeriodSummaries === undefined) {
      continue
    }

    for (const dayPeriodSummary of dayPeriodSummaries) {
      try {
        const codeName = dayPeriodSummary.codeName

        if (!isSpecificTimePair(codeName)) {
          continue
        }

        const dayPeriodValue = dayPeriodSummary.dayPeriodValue
        const isMorning = dayPeriodValue === 'M' || dayPeriodValue === 'J'
        const isAfternoon = dayPeriodValue === 'A' || dayPeriodValue === 'J'

        if (isMorning) {
          dayData.specialTimePairs.push(
            getRecommendedMorningTimePair(
              dayData.date,
              getTimePairDescriptionFromAdp(codeName, dayPeriodValue)
            )
          )
        }

        if (isAfternoon) {
          dayData.specialTimePairs.push(
            getRecommendedAfternoonTimePair(
              dayData.date,
              getTimePairDescriptionFromAdp(codeName, dayPeriodValue)
            )
          )
        }
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
    const date = new Date(startTime)
    const dayLabel = getDayLabelFromDate(date)
    const dayData = AdpData.days[dayLabel]

    dayData.specialTimePairs.push(
      getRecommendedMorningTimePair(dayData.date, 'Jour férié (matin)')
    )

    dayData.specialTimePairs.push(
      getRecommendedAfternoonTimePair(dayData.date, 'Jour férié (après-midi)')
    )
  }
}

function display () {
  AdpData.refresh()
  const isWorking = AdpData.isWorking()

  const progressionEl = document.querySelector('#total-time')
  progressionEl.innerHTML = getTimeDeltaString(AdpData.totalTime)

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

  if (!AdpData.isFutureWeek()) {
    const currentDayIndex = getDayIndexFromDate(getNow())

    for (let dayIndex = 0; dayIndex < DateUtils.WORKDAY_COUNT; ++dayIndex) {
      if (dayIndex > currentDayIndex) {
        break
      }

      const dayLabel = getDayFromIndex(dayIndex)
      const dayTimeEl = document.querySelector(`#${dayLabel}-time`)
      const dayTime = AdpData.getDayTime(dayLabel)
      const timeDeltaString = getTimeDeltaString(dayTime)
      dayTimeEl.innerHTML = timeDeltaString

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
        timePair.getDeltaInSeconds()
      )}]`
    }
  }
}

function startRefresh () {
  const delay = (30 - getNow().getSeconds()) * 1000
  display()

  setTimeout(() => {
    setInterval(display, 1000 * 30)
  }, delay)
}
