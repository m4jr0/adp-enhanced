function setXhrHttpRequestData (data) {
  let requestData = ''

  for (const [key, value] of Object.entries(data)) {
    requestData += `${key}=${encodeURI(value)}&`
  }

  if (requestData) {
    requestData = requestData.substring(0, requestData.length - 1)
  }

  return requestData
}

function getVersionData () {
  return new Promise((resolve, reject) => {
    const ajaxUrl = `${window.location.origin}/redboxapi/core/v1/version`
    const xhrHttpRequest = new XMLHttpRequest()

    xhrHttpRequest.onload = () => {
      if (xhrHttpRequest.status >= 200 && xhrHttpRequest.status < 300) {
        try {
          AdpData.appVersion = JSON.parse(xhrHttpRequest.response).ui.version
          AdpData.appOid = AdpData.appVersion.match(/(\d+\.\d+)\..+$/)[1]
        } catch (error) {
          reject()
        }

        resolve()
      }
    }

    xhrHttpRequest.onerror = () => {
      reject()
    }

    xhrHttpRequest.open('GET', ajaxUrl, true)

    xhrHttpRequest.setRequestHeader(
      'Accept',
      'application/json, text/plain, */*'
    )

    xhrHttpRequest.send()
  })
}

function getExtraHours () {
  return new Promise((resolve, reject) => {
    if (Global.isDebugMode() && ADebug.isBeginningExtraTimeOverride()) {
      AdpData.beginningExtraTime = ADebug.FORCED_BEGINNING_EXTRA_TIME
      resolve()
      return
    }

    const ajaxUrl = `${window.location.origin}/time/v3/workers/${
      AdpData.associateOid
    }/time-off-balances?$filter=balanceAsOfDate%20eq%20%27${formatDateToYYYYMMDD(
      AdpData.startDate
    )}%27`

    const xhrHttpRequest = new XMLHttpRequest()

    xhrHttpRequest.onload = () => {
      if (xhrHttpRequest.status >= 200 && xhrHttpRequest.status < 300) {
        try {
          const timeOffPolicyBalances = JSON.parse(xhrHttpRequest.response)
            .timeOffBalances[0].timeOffPolicyBalances

          for (const timeOffPolicyBalance of timeOffPolicyBalances) {
            if (timeOffPolicyBalance.timeOffPolicyCode.codeValue !== 'MOB090') {
              continue
            }

            const rawTime =
              timeOffPolicyBalance.policyBalances[0].totalTime.timeValue.split(
                ':'
              )

            const isNegative = rawTime[0][0] === '-'
            const hours = parseInt(rawTime[0])
            const minutes = parseInt(rawTime[1])

            AdpData.beginningExtraTime = convertDateObjToSeconds({
              hours: Math.abs(hours),
              minutes: Math.abs(minutes),
              isNegative: isNegative
            })

            break
          }
        } catch (error) {
          reject()
        }

        resolve()
      }
    }

    xhrHttpRequest.onerror = () => {
      reject()
    }

    xhrHttpRequest.open('GET', ajaxUrl, true)

    xhrHttpRequest.setRequestHeader(
      'Accept',
      'application/json, text/plain, */*'
    )

    xhrHttpRequest.setRequestHeader('Accept-Language', 'fr-FR')
    xhrHttpRequest.setRequestHeader('Consumerappoid', `RDBX:${AdpData.appOid}`)
    xhrHttpRequest.send()
  })
}

function getAssociateOid () {
  return new Promise((resolve, reject) => {
    const ajaxUrl = `${window.location.origin}/redboxapi/identity/v1/self?isFuse=true`
    const xhrHttpRequest = new XMLHttpRequest()

    xhrHttpRequest.onload = () => {
      if (xhrHttpRequest.status >= 200 && xhrHttpRequest.status < 300) {
        try {
          AdpData.associateOid = JSON.parse(
            xhrHttpRequest.response
          ).associateoid
        } catch (error) {
          reject()
        }

        resolve()
      }
    }

    xhrHttpRequest.onerror = () => {
      reject()
    }

    xhrHttpRequest.open('GET', ajaxUrl, true)

    xhrHttpRequest.setRequestHeader(
      'Accept',
      'application/json, text/plain, */*'
    )

    xhrHttpRequest.send()
  })
}

function getCalendarTimes () {
  return new Promise((resolve, reject) => {
    if (Global.isDebugMode() && ADebug.isCalendarTimesOverride()) {
      resolve(ADebug.FORCED_CALENDAR_TIMES)
      return
    }

    const ajaxUrl = `${
      window.location.origin
    }/v1_0/O/A/timeEntryDetails?dateRange=${formatDateToYYYYMMDD(
      AdpData.startDate
    )},${formatDateToYYYYMMDD(AdpData.endDate)}&entryNotes=yes`
    const xhrHttpRequest = new XMLHttpRequest()

    xhrHttpRequest.onload = () => {
      if (xhrHttpRequest.status >= 200 && xhrHttpRequest.status < 300) {
        try {
          const data = JSON.parse(xhrHttpRequest.response).timeEntryDetails
            .entrySummary[0].entries
          resolve(data)
        } catch (error) {
          reject()
        }
      }
    }

    xhrHttpRequest.onerror = () => {
      reject()
    }

    xhrHttpRequest.open('GET', ajaxUrl, true)

    xhrHttpRequest.setRequestHeader(
      'Accept',
      'application/json, text/plain, */*'
    )

    xhrHttpRequest.setRequestHeader('Accept-Language', 'fr-FR')
    xhrHttpRequest.setRequestHeader('Consumerappoid', `RDBX:${AdpData.appOid}`)
    xhrHttpRequest.send()
  })
}

function getCalendarEvents () {
  return new Promise((resolve, reject) => {
    if (Global.isDebugMode() && ADebug.isCalendarEventsOverride()) {
      resolve(ADebug.FORCED_CALENDAR_EVENTS)
      return
    }

    const ajaxUrl = `${
      window.location.origin
    }/v1_0/O/A/calendarDetail/myCalendar?startdate=${formatDateToYYYYMMDD(
      AdpData.startDate
    )}&enddate=${formatDateToYYYYMMDD(AdpData.endDate)}`
    const xhrHttpRequest = new XMLHttpRequest()

    xhrHttpRequest.onload = () => {
      if (xhrHttpRequest.status >= 200 && xhrHttpRequest.status < 300) {
        try {
          const data = JSON.parse(xhrHttpRequest.response).calendarDetail
            .calendar.calendarEvents
          resolve(data)
        } catch (error) {
          reject()
        }

        resolve()
      }
    }

    xhrHttpRequest.onerror = () => {
      reject()
    }

    xhrHttpRequest.open('GET', ajaxUrl, true)

    xhrHttpRequest.setRequestHeader(
      'Accept',
      'application/json, text/plain, */*'
    )

    xhrHttpRequest.setRequestHeader('Accept-Language', 'fr-FR')
    xhrHttpRequest.setRequestHeader('Consumerappoid', `RDBX:${AdpData.appOid}`)
    xhrHttpRequest.send()
  })
}

function isSpecificTimePair (codeName) {
  if (codeName === 'RV') {
    return true
  }

  if (codeName === 'CP') {
    return true
  }

  if (codeName === 'CS') {
    return true
  }

  if (codeName === 'MA') {
    return true
  }

  if (codeName === 'EF') {
    return true
  }

  if (codeName === 'NM') {
    return true
  }

  if (codeName === 'ZVI') {
    return true
  }

  return false
}

function getMorningTimeFromCodeName (codeName) {
  if (codeName === 'RV') {
    return (
      DateConsts.getDefaultRecommendedBeginningLunchTime() -
      DateConsts.getDefaultRecommendedBeginningWorkingTime() -
      DateConsts.getDefaultMorningBreakTime()
    )
  }

  if (
    codeName === 'CP' ||
    codeName === 'CS' ||
    codeName === 'MA' ||
    codeName === 'EF' ||
    codeName === 'NM'
  ) {
    return DateConsts.getDefaultMorningTime()
  }

  return 0
}

function getAfternoonTimeFromCodeName (codeName) {
  if (codeName === 'RV') {
    return (
      DateConsts.getDefaultRecommendedEndingWorkingTime() -
      DateConsts.getDefaultRecommendedEndingLunchTime() -
      DateConsts.getDefaultAfternoonBreakTime()
    )
  }

  if (
    codeName === 'CP' ||
    codeName === 'CS' ||
    codeName === 'MA' ||
    codeName === 'EF' ||
    codeName === 'NM'
  ) {
    return DateConsts.getDefaultAfternoonTime()
  }

  return 0
}

function getDayTimeFromCodeName (codeName) {
  return (
    getMorningTimeFromCodeName(codeName) +
    getAfternoonTimeFromCodeName(codeName)
  )
}

function getTimePairDescriptionFromAdp (codeName, dayPeriodValue = null) {
  let description = ''

  if (codeName === 'RV') {
    description = 'Récupération variable'
  } else if (codeName === 'CP') {
    description = 'Congé payé'
  } else if (codeName === 'CS') {
    description = 'Congé sans solde'
  } else if (codeName === 'MA') {
    description = 'Arrêt maladie'
  } else if (codeName === 'EF') {
    description = 'Télétravail'
  } else if (codeName === 'NM') {
    description = 'Mise à pied'
  } else if (codeName === 'ZVI') {
    description = 'Temps de travail pour le CSE'
  } else {
    description = 'Inconnu'
  }

  if (dayPeriodValue == 'M') {
    description += ' (matin)'
  } else if (dayPeriodValue == 'A') {
    description += ' (après-midi)'
  } else if (dayPeriodValue == 'J') {
    description += ' (journée)'
  }

  return description
}

function getNationalHolidayPair (dayData) {
  const pair = new LeaveTimePair(dayData.index)
  pair.push(convertSecondsToDate(DateConsts.getDefaultDayTime()))
  pair.description = 'Jour férié'
  pair.isExtraTimeConsumed = false
  return pair
}

function getResolvedTimePair (dayData, codeName, dayPeriodValue) {
  if (!isSpecificTimePair(codeName)) {
    return null
  }

  switch (dayPeriodValue) {
    case 'M':
      return getLeaveMorningTimePair(
        codeName,
        dayData.index,
        getTimePairDescriptionFromAdp(codeName, dayPeriodValue)
      )

    case 'A':
      return getLeaveAfternoonTimePair(
        codeName,
        dayData.index,
        getTimePairDescriptionFromAdp(codeName, dayPeriodValue)
      )

    case 'J':
      return getLeaveDayTimePair(
        codeName,
        dayData.index,
        getTimePairDescriptionFromAdp(codeName, dayPeriodValue)
      )
  }

  const duration = convertDateToSeconds(parseAdpTime2(dayPeriodValue))

  return getCustomLeaveTimePair(
    codeName,
    dayData.index,
    duration,
    getTimePairDescriptionFromAdp(codeName, dayPeriodValue)
  )
}

function isExtraTimeConsumed (codeName) {
  if (codeName === 'RV') {
    return true
  }

  return false
}
