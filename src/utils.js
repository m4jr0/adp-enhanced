async function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class Log {
  static Info = 0
  static Error = 1
  static Warning = 2
}

function log (message, type = null) {
  if (type === null) {
    type = Log.Info
  }

  let logFunc
  let logLabel

  switch (type) {
    default:
    case Log.Info:
      logFunc = console.log
      logLabel = 'INFO'
      break
    case Log.Warning:
      logFunc = console.warn
      logLabel = 'WARNING'
      break
    case Log.Error:
      logFunc = console.error
      logLabel = 'ERROR'
      break
  }

  logFunc(`[${Global.ADP_APP_NAME}] [${logLabel}] ${message}`)
}

function sortArrayOfObjects (array, keys) {
  return array.sort((a, b) => {
    for (const key of keys) {
      const aValue = a[key]
      const bValue = b[key]
      let result = 0

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        result = aValue - bValue
      } else if (aValue instanceof Date && bValue instanceof Date) {
        result = aValue - bValue
      } else {
        result = String(aValue).localeCompare(String(bValue), undefined, {
          sensitivity: 'base'
        })
      }

      if (result !== 0) {
        return result
      }
    }

    return 0
  })
}
