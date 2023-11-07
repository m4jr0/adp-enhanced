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

function getCalendarEvents () {
  return new Promise((resolve, reject) => {
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

  return false
}

function getTimePairDescriptionFromAdp (codeName, dayPeriodValue) {
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
