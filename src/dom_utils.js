class DomUtils {
  static SHAKE_PACE_IN_MS = 20
  static SHAKE_DURATION_IN_MS = 400
  static SHAKE_INTENSITY_IN_PIXELS = 10

  static getShakePaceForCss () {
    const paceStr = (DomUtils.SHAKE_PACE_IN_MS / 1000).toFixed(1)
    return `${paceStr}s`
  }
}

function waitForElement (querySelector, timeout) {
  return new Promise((resolve, reject) => {
    let timeoutId = -1

    if (document.querySelectorAll(querySelector).length > 0) {
      return resolve()
    }

    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(querySelector).length > 0) {
        observer.disconnect()

        if (timeoutId > 0) {
          clearTimeout(timeout)
        }

        return resolve()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    if (timeout) {
      timeoutId = setTimeout(() => {
        observer.disconnect()
        reject()
      }, timeout)
    }
  })
}

function getLoadingText () {
  return '<span class="time-loading-animation">...</span>'
}

function getNoTimePairEl () {
  return '<div class="time-pair-no-entries">-</div>'
}

function handleModal (buttonEl, modalEl, closingCallback = null) {
  modalEl.classList.add('enhanced-modal')

  buttonEl.addEventListener('click', event => {
    event.preventDefault()
    event.stopPropagation()

    const isVisible = modalEl.classList.toggle('show')
    const hideModalFunc = event => {
      event.preventDefault()
      event.stopPropagation()
      modalEl.classList.remove('show')
      document.querySelector(`#${modalEl.id}-overlay`).remove()
      document.body.style.overflow = 'initial'

      if (closingCallback === null) {
        return
      }

      closingCallback()
    }

    if (isVisible) {
      const overlay = document.createElement('div')
      overlay.id = `${modalEl.id}-overlay`
      overlay.classList.add('enhanced-modal-overlay')
      overlay.classList.add('show')
      document.body.appendChild(overlay)
      document.body.style.overflow = 'hidden'
      overlay.addEventListener('click', hideModalFunc)

      let closeButtonEl = modalEl.querySelector('.close-button')

      if (closeButtonEl === null) {
        closeButtonEl = document.createElement('div')
        closeButtonEl.innerHTML =
          '<i class="far fa-times-circle close-button" aria-hidden="true"></i>'
        closeButtonEl.addEventListener('click', hideModalFunc)
        modalEl.appendChild(closeButtonEl)
      }
    } else {
      document.querySelector(`#${modalEl.id}-overlay`).remove()
      document.body.style.overflow = 'initial'
    }
  })
}

function getHoursMinutesInput (
  id = null,
  value = null,
  label = null,
  onKeyUpCallback = null,
  onFocusOutCallback = null
) {
  if (id !== null) {
    if (onKeyUpCallback !== null) {
      setHoursMinutesInputKeyUpCallback(id, onKeyUpCallback)
    }

    if (onFocusOutCallback !== null) {
      setHoursMinutesInputFocusOutCallback(id, onFocusOutCallback)
    }
  }

  value = value !== null ? `value="${value}"` : ''
  const idAttr = id === null ? '' : `id="${id}"`
  const labelEl =
    id !== null && label !== null
      ? `<label class="hours-minutes-input-label"  for="${id}">${label}</label>`
      : ''
  return `${labelEl}<input ${idAttr} class="hours-minutes-input vdl-textbox ng-touched ng-dirty ng-valid" type="text" placeholder="hh:mm" inputmode="text" ${value}>`
}

function shakeElement (element) {
  element.classList.add('shake')
  const oldPosition = element.style.position
  const oldLeft = element.style.left
  const oldTop = element.style.top

  const elComputedStyle = getComputedStyle(element)
  const leftOrigin = parseFloat(elComputedStyle.left) || 0
  const topOrigin = parseFloat(elComputedStyle.top) || 0
  element.style.position = 'fixed'

  const bluringElement = document.createElement('div')
  bluringElement.classList.add('shake-blur')
  document.body.appendChild(bluringElement)

  const updateShake = () => {
    const toMoveFromLeft = getRandomNumber(
      -DomUtils.SHAKE_INTENSITY_IN_PIXELS,
      DomUtils.SHAKE_INTENSITY_IN_PIXELS
    )

    const toMoveFromTop = getRandomNumber(
      -DomUtils.SHAKE_INTENSITY_IN_PIXELS,
      DomUtils.SHAKE_INTENSITY_IN_PIXELS
    )

    element.style.left = `${leftOrigin + toMoveFromLeft}px`
    element.style.top = `${topOrigin + toMoveFromTop}px`
  }

  let interval = setInterval(updateShake, DomUtils.SHAKE_PACE_IN_MS)

  setTimeout(() => {
    clearInterval(interval)
    interval = 0
    document.body.removeChild(bluringElement)
    element.style.position = oldPosition
    element.style.left = oldLeft
    element.style.top = oldTop
    element.classList.remove('shake')
  }, DomUtils.SHAKE_DURATION_IN_MS)
}
