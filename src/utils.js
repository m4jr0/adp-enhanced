async function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class Log {
  static Info = 0
  static Error = 1
}

function log (message, type = null) {
  if (type === null) {
    type = Log.Info
  }

  message = `[${Global.ADP_APP_NAME}] ${message}`

  switch (type) {
    default:
    case Log.Info:
      console.log(message)
      break
    case Log.Error:
      console.log(message)
      break
  }
}
