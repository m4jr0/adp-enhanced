class HoursMinutesInput {
  static hoursMinutesInputKeyUpCallbacks_ = {}
  static hoursMinutesInputFocusOutCallbacks_ = {}
}

function processHoursMinutesInputValue (rawValue, keyCode = -1) {
  rawValue = cleanNonDigits(rawValue)

  if (rawValue.length > 4) {
    rawValue = rawValue.slice(0, 4)
  }

  let hours
  let minutes

  if (rawValue.length === 3) {
    if (rawValue[0] === '1' || rawValue[0] === '2') {
      hours = parseIntOrGetDefault(`${rawValue[0]}${rawValue[1]}`)
      minutes = parseIntOrGetDefault(rawValue[2])
    } else {
      hours = parseIntOrGetDefault(rawValue[0])
      minutes = parseIntOrGetDefault(`${rawValue[1]}${rawValue[2]}`)
    }
  } else if (rawValue.length === 2) {
    if (rawValue[0] === '1' || rawValue[0] === '2') {
      hours = parseIntOrGetDefault(`${rawValue[0]}${rawValue[1]}`)
      minutes = parseIntOrGetDefault(`${rawValue[2]}${rawValue[3]}`)
    } else {
      hours = parseIntOrGetDefault(rawValue[0])
      minutes = parseIntOrGetDefault(`${rawValue[1]}${rawValue[2]}`)
    }
  } else {
    hours = parseIntOrGetDefault(`${rawValue[0]}${rawValue[1]}`)
    minutes = parseIntOrGetDefault(`${rawValue[2]}${rawValue[3]}`)
  }

  if (keyCode === 38 || keyCode === 40) {
    if (keyCode === 38) {
      // Up key.
      minutes++
    } else if (keyCode === 40) {
      // Down key.
      minutes--
    }

    return getNormalizedDaytimeString(hours, minutes)
  }

  if (rawValue.length === 2) {
    if (hours <= 9) {
      rawValue = insertTextToString(rawValue, ':', 1)
    }
  } else if (rawValue.length === 3) {
    if (hours <= 9) {
      rawValue = insertTextToString(rawValue, ':', 1)
    } else {
      rawValue = insertTextToString(rawValue, ':', 2)
    }
  } else if (rawValue.length === 4) {
    rawValue = insertTextToString(rawValue, ':', 2)
  }

  return rawValue
}

function hoursMinutesInputKeyUp (event) {
  event.stopPropagation()
  const keyCode = event
    ? event.which
      ? event.which
      : event.keyCode
    : event.keyCode

  let rawValue = cleanNonDigits(event.currentTarget.value)
  event.currentTarget.value = processHoursMinutesInputValue(rawValue, keyCode)
  const id = event.currentTarget.id;

  if (HoursMinutesInput.hoursMinutesInputKeyUpCallbacks_.hasOwnProperty(id)) {
    HoursMinutesInput.hoursMinutesInputKeyUpCallbacks_[id](event.currentTarget)
  }
}

function hoursMinutesInputFocusOut (event) {
  const rawValue = processHoursMinutesInputValue(
    cleanNonDigits(event.currentTarget.value)
  )

  hoursMinutes = rawValue.split(':')

  event.currentTarget.value = getNormalizedDaytimeString(
    parseIntOrGetDefault(hoursMinutes[0]),
    parseIntOrGetDefault(hoursMinutes[1])
  )
  
  const id = event.currentTarget.id;

  if (HoursMinutesInput.hoursMinutesInputFocusOutCallbacks_.hasOwnProperty(id)) {
    HoursMinutesInput.hoursMinutesInputFocusOutCallbacks_[id](event.currentTarget)
  }
}

function setUpHoursMinutesInputs (query = '.hours-minutes-input') {
  for (const hoursMinutesInputEl of document.querySelectorAll(query)) {
    setUpHoursMinutesInput(hoursMinutesInputEl)
  }
}

function setUpHoursMinutesInput (inputEl) {
  // Prevent memory leaks.
  inputEl.removeEventListener('keyup', hoursMinutesInputKeyUp)
  inputEl.removeEventListener('blur', hoursMinutesInputFocusOut)

  inputEl.addEventListener('keyup', hoursMinutesInputKeyUp)
  inputEl.addEventListener('blur', hoursMinutesInputFocusOut)
}

function setHoursMinutesInputKeyUpCallback (id, callback) {
  HoursMinutesInput.hoursMinutesInputKeyUpCallbacks_[id] = callback
}

function setHoursMinutesInputFocusOutCallback (id, callback) {
  HoursMinutesInput.hoursMinutesInputFocusOutCallbacks_[id] = callback
}

// >:3 ???
function handleShortcutsOnHoursInput (event) {
  event.stopPropagation()
  const keyCode = event
    ? event.which
      ? event.which
      : event.keyCode
    : event.keyCode

  if (keyCode === 13) {
    // Enter key.
    resetHoursInput(event.currentTarget)
  } else if (keyCode === 9) {
    // Tab key.
    event.preventDefault()

    if (event.shiftKey) {
      goToPreviousHoursInput(event.currentTarget)
    } else {
      goToNextHoursInput(event.currentTarget)
    }
  }
}
