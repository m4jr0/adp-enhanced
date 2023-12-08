class Loader {
  static SCRIPT_TIMEOUT_IN_MILLISECONDS = 20000
  static SCRIPT_LOAD_SLEEP_IN_MILLISECONDS = 250

  static MATCH_URL =
    GM_info.script.matches.length > 0 ? GM_info.script.matches[0] : ''

  static MATCH_PATTERN = new RegExp(
    `^${Loader.MATCH_URL.replace('*', '[\\d.]+')}#/time/timecard`
  )

  static isAdpEnhancedEnabled = Settings.get(
    SettingsKeys.GLOBAL_IS_ADP_ENHANCED_ENABLED
  )

  static isPreloaded = false
  static isLoaded = false
}

function isUrlOkay () {
  return Loader.MATCH_PATTERN.test(window.location.href)
}

function addAdpEnhancedToggleButton () {
  const actionLabel = Loader.isAdpEnhancedEnabled ? 'Désactiver' : 'Activer'
  const footerAnchor = document.querySelector('.vdl-footer > ul > li')

  const adpToggleButton = document.createElement('li')
  adpToggleButton.id = 'adp-enhanced-toggle-button'
  adpToggleButton.innerHTML = `<a target="_blank" href="">
    <svg width="2em" height="2em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" id="adp-enhanced-toggle-button-logo">
      <g transform="translate(1.000000, 7.000000)" fill-rule="nonzero">
        <path d="M22,3.93 C22,4.47 21.896,4.979 21.688,5.455 C21.4940887,5.92524279 21.2085443,6.35219962 20.848,6.711 C20.4892958,7.06666705 20.0656226,7.35013431 19.6,7.546 C19.1201739,7.75573542 18.6016513,7.86236985 18.078,7.859 L18.078,10 L14.683,10 L14.683,8.328 C14.455,8.589 14.201,8.821 13.922,9.022 C13.6485995,9.23085322 13.3523688,9.40798779 13.039,9.55 C12.3841972,9.84529776 11.6743075,9.99865846 10.956,10 L7.736,10 L7.736,7.86 L5.21,7.86 L3.96,10 L0,10 L5.824,0 L10.956,0 C11.326,0 11.688,0.04 12.039,0.117 C12.39,0.196 12.723,0.307 13.039,0.45 C13.354,0.593 13.649,0.77 13.922,0.978 C14.202,1.186 14.455,1.418 14.682,1.672 L14.682,0 L18.078,0 C18.618,0 19.125,0.101 19.6,0.303 C20.075,0.512 20.491,0.793 20.849,1.149 C21.206,1.504 21.486,1.923 21.688,2.405 C21.896,2.88 22,3.389 22,3.93 Z M10.956,8.759 C11.333,8.759 11.691,8.706 12.029,8.602 C12.374,8.492 12.693,8.342 12.985,8.152 C13.2772006,7.96355328 13.5428886,7.73687769 13.775,7.478 C14.003,7.218 14.192,6.928 14.341,6.608 L15.931,6.608 L15.931,8.758 L16.829,8.758 L16.829,6.608 L18.079,6.608 C18.449,6.608 18.793,6.536 19.112,6.393 C19.7527941,6.12369737 20.2635429,5.61545926 20.536,4.976 C20.68,4.65 20.751,4.301 20.751,3.93 C20.751,3.558 20.68,3.21 20.537,2.884 C20.4050833,2.56551551 20.2109626,2.27654421 19.966,2.034 C19.7192069,1.79056901 19.4297181,1.5946387 19.112,1.456 C18.7850051,1.31759024 18.4330673,1.24781533 18.078,1.251 L15.932,1.251 L15.932,4.467 L14.663,4.467 C14.6011687,4.02170097 14.4588522,3.59136298 14.243,3.197 C14.0276905,2.81274627 13.749504,2.46729472 13.42,2.175 C13.0902901,1.88425802 12.7118067,1.6540534 12.302,1.495 C11.8722983,1.33107413 11.4159001,1.24833924 10.956,1.251 L6.566,1.251 L2.205,8.76 L3.249,8.76 L4.488,6.609 L8.985,6.609 L8.985,8.759 L10.956,8.759 Z M7.736,2.14 L7.736,4.466 L5.746,4.466 L5.015,5.717 L8.985,5.717 L8.985,2.141 L7.737,2.141 L7.736,2.14 Z M13.59,6.108 C13.44,6.46 13.237,6.765 12.98,7.022 C12.7183537,7.28270443 12.4086376,7.49020065 12.068,7.633 C11.723,7.783 11.356,7.858 10.966,7.858 L9.873,7.858 L9.873,6.608 L10.966,6.608 C11.408,6.608 11.786,6.452 12.098,6.138 C12.41,5.826 12.566,5.445 12.566,4.995 C12.566,4.552 12.41,4.174 12.098,3.861 C11.8017806,3.55482064 11.3919614,3.3850281 10.966,3.392 L9.873,3.392 L9.873,2.141 L10.966,2.141 C11.356,2.141 11.723,2.216 12.068,2.366 C12.42,2.516 12.723,2.719 12.98,2.976 C13.237,3.234 13.44,3.539 13.59,3.891 C13.74,4.236 13.815,4.604 13.815,4.995 C13.815,5.393 13.74,5.765 13.59,6.109 L13.59,6.108 Z M16.83,2.14 L16.83,3.391 L18.078,3.391 C18.2195258,3.39151457 18.3549439,3.44871754 18.4539795,3.54982029 C18.5530151,3.65092303 18.6074088,3.78749378 18.605,3.929 C18.607411,4.07041389 18.5529864,4.20688318 18.4539214,4.3078279 C18.3548565,4.40877263 18.2194342,4.46575268 18.078,4.466 L16.83,4.466 L16.83,5.717 L18.08,5.717 C18.567,5.717 18.985,5.543 19.333,5.194 C19.681,4.846 19.855,4.424 19.855,3.929 C19.855,3.433 19.681,3.011 19.333,2.663 C19.0052395,2.32285834 18.5513151,2.13354218 18.079,2.14 L16.83,2.14 L16.83,2.14 Z M19.384,10 C19.514,10 19.627,9.954 19.721,9.863 C19.8141011,9.77396782 19.8653024,9.64977745 19.862,9.521 C19.8638434,9.3954166 19.8126503,9.27487674 19.721,9.189 C19.6317379,9.09975635 19.5102119,9.05035258 19.384,9.052 C19.258112,9.05050926 19.1369547,9.0999097 19.048,9.189 C18.9558761,9.27462686 18.904289,9.39523893 18.906,9.521 C18.906,9.658 18.953,9.771 19.048,9.863 C19.1369547,9.9520903 19.258112,10.0014907 19.384,10 L19.384,10 Z M19.384,9.922 C19.2792368,9.92068228 19.1792889,9.87779719 19.1061479,9.8027808 C19.0330069,9.7277644 18.9926655,9.62676298 18.994,9.522 C18.994,9.417 19.031,9.326 19.106,9.247 C19.1777688,9.17017903 19.2788975,9.12761768 19.384,9.13 C19.494,9.13 19.588,9.17 19.662,9.247 C19.737,9.325 19.775,9.417 19.775,9.521 C19.775,9.631 19.737,9.726 19.662,9.804 C19.5903345,9.88108325 19.489232,9.92399723 19.384,9.922 L19.384,9.922 Z M19.404,9.56 C19.417,9.56 19.43,9.566 19.443,9.58 C19.449,9.593 19.454,9.609 19.458,9.629 C19.461,9.649 19.466,9.671 19.472,9.697 C19.472,9.717 19.474,9.734 19.477,9.751 C19.48,9.767 19.485,9.781 19.492,9.795 L19.599,9.795 L19.579,9.717 C19.5723904,9.69118574 19.5690311,9.66464698 19.569,9.638 C19.565007,9.61252729 19.5569014,9.58787267 19.545,9.565 C19.535,9.549 19.511,9.537 19.472,9.531 L19.472,9.521 C19.5056906,9.51746303 19.5369561,9.5018303 19.56,9.477 C19.58,9.454 19.59,9.427 19.59,9.394 C19.59,9.329 19.566,9.286 19.521,9.267 C19.477869,9.24772558 19.431239,9.23751463 19.384,9.237 L19.2,9.237 L19.2,9.795 L19.288,9.795 L19.288,9.56 L19.405,9.56 L19.404,9.56 Z M19.287,9.326 L19.384,9.326 C19.424,9.326 19.449,9.33 19.462,9.34 C19.475,9.35 19.482,9.368 19.482,9.394 C19.482,9.414 19.475,9.432 19.462,9.448 C19.449,9.464 19.42,9.472 19.375,9.472 L19.287,9.472 L19.287,9.326 L19.287,9.326 Z" id="Shape">
        </path>
      </g>
    </svg>
    ${actionLabel} ${Global.ADP_APP_NAME}</a>`

  footerAnchor.insertAdjacentElement('afterend', adpToggleButton)

  adpToggleButton.addEventListener('click', event => {
    event.preventDefault()

    Settings.set(
      SettingsKeys.GLOBAL_IS_ADP_ENHANCED_ENABLED,
      !Loader.isAdpEnhancedEnabled
    )

    location.reload()
  })
}

async function preLoad () {
  if (Loader.isPreloaded) {
    return
  }

  Loader.isPreloaded = true
  loadCss()

  try {
    await waitForElement(
      '.vdl-footer > ul > li',
      Loader.SCRIPT_TIMEOUT_IN_MILLISECONDS
    )
  } catch (error) {
    console.error(
      `Could not load ${Global.ADP_APP_NAME} v${Global.ADP_ENHANCED_VERSION}! Error: ${error}`
    )

    Loader.isPreloaded = false
    return
  }

  addAdpEnhancedToggleButton()
}

async function checkIfLoadIsNeeded () {
  if (!isUrlOkay()) {
    Loader.isLoaded = false
    return
  }

  if (Loader.isLoaded) {
    return
  }

  await load()
}

async function load () {
  await preLoad()

  if (!Loader.isAdpEnhancedEnabled || Loader.isLoaded) {
    return
  }

  Loader.isLoaded = true

  try {
    await waitForElement(
      '.time-show-schedule-switch',
      Loader.SCRIPT_TIMEOUT_IN_MILLISECONDS
    )
  } catch (error) {
    console.error(
      `Could not load ${Global.ADP_APP_NAME} v${Global.ADP_ENHANCED_VERSION}! Error: ${error}`
    )

    return
  }

  const displayExpectedHoursCheckboxContainer = document.getElementsByClassName(
    'time-show-schedule-switch'
  )[0]

  const displayExpectedHoursCheckbox =
    displayExpectedHoursCheckboxContainer.children[0].children[0]

  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  })

  displayExpectedHoursCheckbox.dispatchEvent(event)
  await sleep(Loader.SCRIPT_LOAD_SLEEP_IN_MILLISECONDS)
  displayExpectedHoursCheckbox.parentElement.innerHTML = `<a id="adp-settings-btn" href="#">
  <i id="adp-settings-icon" class="fa fa-cog"></i></a> <span id="adp-title">${Global.ADP_APP_NAME}</span> <span id="adp-version">v${Global.ADP_ENHANCED_VERSION}</span>`

  try {
    await waitForElement(
      '.time-calendar',
      Loader.SCRIPT_TIMEOUT_IN_MILLISECONDS
    )
  } catch (error) {
    console.error(
      `Could not load ${Global.ADP_APP_NAME} v${Global.ADP_ENHANCED_VERSION}! Error: ${error}`
    )

    return
  }

  try {
    await setup()
    setupSettings()
    loadIntro()
  } catch (error) {
    if (Global.IS_DEBUG) {
      throw error
    }

    console.error(
      `Could not load ${Global.ADP_APP_NAME} v${Global.ADP_ENHANCED_VERSION}! Error: ${error}`
    )
  }
}
