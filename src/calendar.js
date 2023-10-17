async function setup () {
  getStartAndEndDates()
  await getVersionData()
  await getAssociateOid()
  await getExtraHours()

  const calendar = document.querySelector(
    '.time-calendar > :nth-child(2) > :first-child > :first-child'
  )

  for (let i = 0; i < calendar.children.length; ++i) {
    const dayElement = calendar.children[i]
    const dayLabel = getDayFromIndex(i)
    dayElement[dayLabel] = dayElement
    const clockedValueEls = dayElement.querySelectorAll(
      '[ng-switch-when="clockEntry"] > :nth-child(1)'
    )

    const dayData = (AdpData.days[dayLabel] = new DayData())
    let pair = new TimePair()

    Array.from(clockedValueEls).forEach((clockedValueEl, index) => {
      if (pair.isFilled()) {
        dayData.timePairs.push(pair)
        pair = new TimePair()
      }

      pair.push(parseAdpTime(clockedValueEl.innerHTML))
    })

    if (!pair.isEmpty()) {
      dayData.timePairs.push(pair)
    }

    const timePairsEl = dayElement.querySelector(
      'timecard-calendar-view-see-details'
    )

    if (timePairsEl !== null) {
      timePairsEl.innerHTML = ''

      dayData.timePairs.forEach((timePair, index) => {
        timePairsEl.innerHTML += `<div class="time-pair-entry"><span class="time-bullet">·</span> ${timePair.getLabel(
          true
        )}</div>`
      })

      timePairsEl.innerHTML += '<hr class="time-separator">'
    }

    let extraTimesEl = document.querySelector('#beginning-extra-time')

    if (extraTimesEl === null) {
      const summaryContainerEl = document.querySelector('.timecard-week-totals')
        .parentElement.parentElement.parentElement
      const extraTimeContainerEl = document.createElement('weekly-view')
      extraTimeContainerEl.className = 'ng-isolate-scope'

      const extraTimeColumnEl = document.createElement('div')
      extraTimeColumnEl.className = 'col-sm-5 hidden-xs'

      const extraTimeOtherContainerEl = document.createElement('div')
      extraTimeOtherContainerEl.className = 'timecard-week-totals'

      summaryContainerEl.appendChild(extraTimeOtherContainerEl)
      extraTimeOtherContainerEl.appendChild(extraTimeColumnEl)
      extraTimeColumnEl.appendChild(extraTimeContainerEl)

      const extraTimeTitleEl = document.createElement('div')
      extraTimeTitleEl.className = 'timecard-totals-label ng-binding'
      extraTimeTitleEl.innerHTML = 'Résumé de la semaine'

      extraTimeContainerEl.appendChild(extraTimeTitleEl)

      extraTimesEl = document.createElement('div')
      extraTimesEl.className = 'row timecard-week-totals ng-scope'
      extraTimesEl.id = 'beginning-extra-time'

      extraTimeContainerEl.appendChild(extraTimesEl)
    }

    extraTimesEl.innerHTML = `
      <div class="timecard-week-total-header ng-binding">
        Heures supplémentaires
      </div>
      <span class="week-date-range ng-binding">Début de semaine</span>
      <span class="pull-right text-right week-total ng-binding">${getTimeDeltaString(
        AdpData.beginningExtraTime
      )}</span>
      <br>
      <span class="week-date-range ng-binding">Fin de semaine (estimation)</span>
      <span class="pull-right text-right week-total ng-binding">${'WIP'}</span>
    `
  }

  startRefresh()
}

function display () {
  AdpData.refresh()
  const isWorking = AdpData.isWorking()

  const progressionEl = document.querySelector('adp-pokerchip-progression')
  progressionEl.id = 'adp-pokerchip-progression'
  progressionEl.innerHTML = getTimeDeltaString(AdpData.totalTime)

  const progressionSubTextEl = document.querySelector('adp-pokerchip-subtext')
  const progressionMaskEl = document.querySelector('adp-pokerchip-mask')
  const progressionRingEls = document.querySelectorAll('adp-pokerchip-fill')

  let progressionMaskContainerEl = document.querySelector(
    '#adp-pokerchip-mask-container'
  )

  if (progressionMaskContainerEl === null) {
    progressionMaskContainerEl = document.createElement('div')
    progressionMaskContainerEl.id = 'adp-pokerchip-mask-container'
    progressionMaskEl.parentElement.appendChild(progressionMaskContainerEl)

    const progressionMaskEls = document.querySelectorAll('adp-pokerchip-mask')

    for (const el of progressionMaskEls) {
      progressionMaskContainerEl.appendChild(el)
    }
  }

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

  const currentDayIndex = getDayIndexFromDate(getNow())

  for (let dayIndex = 1; dayIndex <= DateUtils.WORKDAY_COUNT; ++dayIndex) {
    if (dayIndex - 1 > currentDayIndex) {
      break
    }

    const dayKey = getDayFromIndex(dayIndex - 1)

    if (!AdpData.isDay(dayKey)) {
      continue
    }

    const hoursEl = document.querySelector(
      `.time-calendar > :nth-child(2) > :first-child > :first-child > :nth-child(${dayIndex}) > :first-child > :first-child > :first-child > :first-child > :first-child > :nth-child(2)`
    )

    if (hoursEl === null || !hoursEl.hasChildNodes()) {
      continue
    }

    const dayTime = AdpData.getDayTime(getDayFromIndex(dayIndex - 1))
    const node = hoursEl.childNodes[0]
    const timeDeltaString = getTimeDeltaString(dayTime)

    if (!isWorking || dayIndex - 1 !== currentDayIndex) {
      node.textContent = timeDeltaString
      continue
    }

    node.textContent = ''
    const dayEl = document.createElement('span')
    dayEl.textContent = timeDeltaString
    dayEl.className = 'working-day-time'
    hoursEl.insertBefore(dayEl, hoursEl.firstChild)
  }
}

function startRefresh () {
  const delay = (30 - getNow().getSeconds()) * 1000
  display()

  setTimeout(() => {
    setInterval(display, 1000 * 30)
  }, delay)
}
