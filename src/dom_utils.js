function waitForElement (querySelector, timeout) {
  return new Promise((resolve, reject) => {
    var timeoutId = -1

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
  return '<div class="time-loading-animation">...</div>'
}
