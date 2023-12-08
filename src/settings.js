function getSettingsHtml () {
  return `
    <div id="adp-settings-modal">
      <h1>Paramètres</h1>
      <div id="adp-settings-modal-container">
        <div id="adp-settings-modal-left" class="adp-settings-subcontainer">
          ${getTitle("Heures d'arrivée", 'fa fa-arrow-circle-right', true)}
          <div class="inputs-group">
            ${handleTimeInput(
              'minimum-beginning-working-time-input',
              SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_HOURS,
              SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_MINUTES,
              'Min',
              'Heure minimale à partir de laquelle travailler compte',
              null,
              onMinimumBeginningWorkingTimeFocusOutCallback
            )}
            ${handleTimeInput(
              'prediction-beginning-working-time-input',
              SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_HOURS,
              SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_MINUTES,
              'Voulue',
              "Heure d'arrivée utilisée pour le calcul des prédictions",
              null,
              onPredictionBeginningWorkingTimeFocusOutCallback
            )}
          </div>

          ${getTitle('Heures de la pause midi', 'fas fa-hamburger')}
          <div class="inputs-group">
            ${handleTimeInput(
              'beginning-lunch-break-time-input',
              SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_HOURS,
              SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_MINUTES,
              'Min',
              'Heure minimale pour débuter sa pause midi',
              null,
              onBeginningLunchBreakTimeFocusOutCallback
            )}
            ${handleTimeInput(
              'ending-lunch-break-time-input',
              SettingsKeys.TIME_ENDING_LUNCH_BREAK_HOURS,
              SettingsKeys.TIME_ENDING_LUNCH_BREAK_MINUTES,
              'Max',
              'Heure maximale pour terminer sa pause midi',
              null,
              onEndingLunchBreakTimeFocusOutCallback
            )}
            ${handleTimeInput(
              'minimum-lunch-break-time-input',
              SettingsKeys.TIME_MINIMUM_LUNCH_BREAK_HOURS,
              SettingsKeys.TIME_MINIMUM_LUNCH_BREAK_MINUTES,
              'Temps min',
              'Temps minimal pour effectuer sa pause midi',
              null,
              onMinimmumLunchBreakTimeFocusOutCallback
            )}
          </div>
          <div class="inputs-group">
            ${handleTimeInput(
              'prediction-beginning-lunch-break-time-input',
              SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_HOURS,
              SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_MINUTES,
              'Début voulu',
              'Heure de début de la pause midi utilisée pour le calcul des prédictions',
              null,
              onPredictionBeginningLunchBreakTimeFocusOutCallback,
              true
            )}
            ${handleTimeInput(
              'prediction-ending-lunch-break-time-input',
              SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_HOURS,
              SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_MINUTES,
              'Fin voulue',
              'Heure de fin de la pause midi utilisée pour le calcul des prédictions',
              null,
              onPredictionEndingLunchBreakTimeFocusOutCallback,
              true
            )}
          </div>

          ${getTitle('Heures de départ', 'fa fa-arrow-circle-left')}
          <div class="inputs-group">
            ${handleTimeInput(
              'minimum-leaving-working-time-input',
              SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_HOURS,
              SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_MINUTES,
              'Min',
              "Heure minimale pour quitter l'entreprise",
              null,
              onMinimumLeavingWorkingTimeFocusOutCallback
            )}
            ${handleTimeInput(
              'maximum-leaving-working-time-input',
              SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_HOURS,
              SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_MINUTES,
              'Max',
              'Heure maximale à partir de laquelle travailler ne compte plus',
              null,
              onMaximumLeavingWorkingTimeFocusOutCallback
            )}
            ${handleTimeInput(
              'prediction-leaving-working-time-input',
              SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_HOURS,
              SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_MINUTES,
              'Voulue',
              'Heure de départ utilisée pour le calcul des prédictions',
              null,
              onPredictionLeavingWorkingTimeFocusOutCallback
            )}
          </div>
        </div>
        <div class="adp-settings-separator"></div>
        <div id="adp-settings-modal-right" class="adp-settings-subcontainer">
          ${getTitle('Heures de travail requises', 'fas fa-briefcase', true)}
          <div class="inputs-group">
            ${handleTimeInput(
              'time-morning-input',
              SettingsKeys.TIME_MORNING_HOURS,
              SettingsKeys.TIME_MORNING_MINUTES,
              'Matin',
              "Nombre d'heures requises au matin",
              null,
              onTimeMorningFocusOutCallback
            )}
            ${handleTimeInput(
              'time-afternoon-input',
              SettingsKeys.TIME_AFTERNOON_HOURS,
              SettingsKeys.TIME_AFTERNOON_MINUTES,
              'Après-midi',
              "Nombre d'heures requises durant l'après-midi",
              null,
              onTimeAfternoonFocusOutCallback
            )}
          </div>

          ${getTitle('Tout réinitialiser', 'fas fa-bomb')}
          <div class="inputs-group">
            ${handleButtonInput(
              'reset-all-settings-input',
              'Boum !',
              "Cliquez ici pour restorer l'ensemble des paramètres de ADP Enhanced",
              onResetEverythingCallback
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  `
}

function getTitle (title, iconClasses = null, isFirst = false) {
  const additionalTitleClasses = isFirst ? '' : 'below'

  const icon =
    iconClasses === null
      ? ''
      : `<i class="${iconClasses} adp-settings-help-icon"></i> `
  return `<h2 class="adp-settings-title ${additionalTitleClasses}">${icon}${title}</h2>`
}

function handleTimeInput (
  id,
  hoursKey,
  minutesKey,
  label,
  description,
  onKeyUpCallback = null,
  onFocusOutCallback = null,
  isBelowAnotherOne = false
) {
  const value = getNormalizedDaytimeString(
    Settings.get(hoursKey),
    Settings.get(minutesKey)
  )

  SettingsInternal.boundTimeInputs[id] = {
    hours: hoursKey,
    minutes: minutesKey
  }

  let descriptionEl = ''

  if (description !== null) {
    descriptionEl = `<span class="adp-settings-time-input-help-icon" data-tooltip="${description}"><i class="fa fa-question-circle"></i></span>`
  }

  const additionalClasses = isBelowAnotherOne ? 'below' : ''

  return `<div class="settings-time-input ${additionalClasses}">
  ${descriptionEl}
  ${getHoursMinutesInput(
    id,
    value,
    label,
    onKeyUpCallback,
    onFocusOutCallback
  )}</div>`
}

function handleButtonInput (id, label, description, callback) {
  SettingsInternal.boundButtons[id] = callback

  let descriptionEl = ''

  if (description !== null) {
    descriptionEl = `<span class="adp-settings-button-input-help-icon" data-tooltip="${description}"><i class="fa fa-question-circle"></i></span>`
  }

  return `<div>${descriptionEl}<button id="${id}" class="adp-settings-button-input" >${label}</button></div>`
}

function bindButtonCallbacks () {
  for (const buttonId in SettingsInternal.boundButtons) {
    if (SettingsInternal.boundButtons.hasOwnProperty(buttonId)) {
      document
        .querySelector(`#${buttonId}`)
        .addEventListener('click', SettingsInternal.boundButtons[buttonId])
    }
  }
}

function onMinimumBeginningWorkingTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  if (timeInSeconds > DateConsts.getRecommendedBeginningWorkingTime()) {
    timeInSeconds = DateConsts.getRecommendedBeginningWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds > DateConsts.getBeginningLunchBreakTime()) {
    timeInSeconds = DateConsts.getBeginningLunchBreakTime()
    dateObj.hours = Settings.get(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_HOURS)

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_HOURS, dateObj.hours)

  Settings.set(
    SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_MINUTES,
    dateObj.minutes
  )
}

function onPredictionBeginningWorkingTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  if (timeInSeconds < DateConsts.getMinimumBeginningWorkingTime()) {
    timeInSeconds = DateConsts.getMinimumBeginningWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds > DateConsts.getBeginningLunchBreakTime()) {
    timeInSeconds = DateConsts.getBeginningLunchBreakTime()
    dateObj.hours = Settings.get(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_HOURS)

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(
    SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_HOURS,
    dateObj.hours
  )

  Settings.set(
    SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_MINUTES,
    dateObj.minutes
  )
}

function onBeginningLunchBreakTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  if (timeInSeconds < DateConsts.getMinimumBeginningWorkingTime()) {
    timeInSeconds = DateConsts.getMinimumBeginningWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds < DateConsts.getRecommendedBeginningWorkingTime()) {
    timeInSeconds = DateConsts.getRecommendedBeginningWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds > DateConsts.getRecommendedBeginningLunchTime()) {
    timeInSeconds = DateConsts.getRecommendedBeginningLunchTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_HOURS, dateObj.hours)
  Settings.set(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_MINUTES, dateObj.minutes)
}

function onEndingLunchBreakTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  if (timeInSeconds < DateConsts.getBeginningLunchBreakTime()) {
    timeInSeconds = DateConsts.getBeginningLunchBreakTime()
    dateObj.hours = Settings.get(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_HOURS)

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds < DateConsts.getRecommendedBeginningLunchTime()) {
    timeInSeconds = DateConsts.getRecommendedBeginningLunchTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds > DateConsts.getMinimumLeavingWorkingTime()) {
    timeInSeconds = DateConsts.getMinimumLeavingWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(SettingsKeys.TIME_ENDING_LUNCH_BREAK_HOURS, dateObj.hours)
  Settings.set(SettingsKeys.TIME_ENDING_LUNCH_BREAK_MINUTES, dateObj.minutes)
}

function onMinimmumLunchBreakTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  const maxBreakTime =
    DateConsts.getEndingLunchBreakTime() -
    DateConsts.getBeginningLunchBreakTime()

  if (timeInSeconds > maxBreakTime) {
    const maxBreakObj = getNormalizedDaytimeObj(0, maxBreakTime / 60)
    dateObj.hours = maxBreakObj.hours
    dateObj.minutes = maxBreakObj.minutes
    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(SettingsKeys.TIME_MINIMUM_LUNCH_BREAK_HOURS, dateObj.hours)
  Settings.set(SettingsKeys.TIME_MINIMUM_LUNCH_BREAK_MINUTES, dateObj.minutes)
}

function onPredictionBeginningLunchBreakTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  if (timeInSeconds < DateConsts.getBeginningLunchBreakTime()) {
    timeInSeconds = DateConsts.getBeginningLunchBreakTime()
    dateObj.hours = Settings.get(SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_HOURS)

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds > DateConsts.getRecommendedEndingLunchTime()) {
    timeInSeconds = DateConsts.getRecommendedEndingLunchTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_HOURS
    )
    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_MINUTES
    )
    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(
    SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_HOURS,
    dateObj.hours
  )

  Settings.set(
    SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_MINUTES,
    dateObj.minutes
  )
}

function onPredictionEndingLunchBreakTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  if (timeInSeconds < DateConsts.getRecommendedBeginningLunchTime()) {
    timeInSeconds = DateConsts.getRecommendedBeginningLunchTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds > DateConsts.getEndingLunchBreakTime()) {
    timeInSeconds = DateConsts.getEndingLunchBreakTime()
    dateObj.hours = Settings.get(SettingsKeys.TIME_ENDING_LUNCH_BREAK_HOURS)
    dateObj.minutes = Settings.get(SettingsKeys.TIME_ENDING_LUNCH_BREAK_MINUTES)
    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_HOURS, dateObj.hours)

  Settings.set(
    SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_MINUTES,
    dateObj.minutes
  )
}

function onMinimumLeavingWorkingTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  if (timeInSeconds > DateConsts.getRecommendedEndingWorkingTime()) {
    timeInSeconds = DateConsts.getRecommendedEndingWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds < DateConsts.getEndingLunchBreakTime()) {
    timeInSeconds = DateConsts.getEndingLunchBreakTime()
    dateObj.hours = Settings.get(SettingsKeys.TIME_ENDING_LUNCH_BREAK_HOURS)

    dateObj.minutes = Settings.get(SettingsKeys.TIME_ENDING_LUNCH_BREAK_MINUTES)

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_HOURS, dateObj.hours)

  Settings.set(
    SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_MINUTES,
    dateObj.minutes
  )
}

function onMaximumLeavingWorkingTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  if (timeInSeconds < DateConsts.getRecommendedEndingWorkingTime()) {
    timeInSeconds = DateConsts.getRecommendedEndingWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds < DateConsts.getMinimumLeavingWorkingTime()) {
    timeInSeconds = DateConsts.getMinimumLeavingWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_HOURS, dateObj.hours)

  Settings.set(
    SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_MINUTES,
    dateObj.minutes
  )
}

function onPredictionLeavingWorkingTimeFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  let timeInSeconds = convertDateObjToSeconds(dateObj)

  if (timeInSeconds > DateConsts.getMaximumLeavingWorkingTime()) {
    timeInSeconds = DateConsts.getMaximumLeavingWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  if (timeInSeconds < DateConsts.getMinimumLeavingWorkingTime()) {
    timeInSeconds = DateConsts.getMinimumLeavingWorkingTime()
    dateObj.hours = Settings.get(
      SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_HOURS
    )

    dateObj.minutes = Settings.get(
      SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_MINUTES
    )

    element.value = getNormalizedDaytimeString(dateObj.hours, dateObj.minutes)
  }

  Settings.set(
    SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_HOURS,
    dateObj.hours
  )

  Settings.set(
    SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_MINUTES,
    dateObj.minutes
  )
}

function onTimeMorningFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  Settings.set(SettingsKeys.TIME_MORNING_HOURS, dateObj.hours)

  Settings.set(SettingsKeys.TIME_MORNING_MINUTES, dateObj.minutes)
}

function onTimeAfternoonFocusOutCallback (element) {
  const hoursMinutes = element.value.split(':')

  let dateObj = {
    hours: parseIntOrGetDefault(hoursMinutes[0]),
    minutes: parseIntOrGetDefault(hoursMinutes[1])
  }

  Settings.set(SettingsKeys.TIME_AFTERNOON_HOURS, dateObj.hours)
  Settings.set(SettingsKeys.TIME_AFTERNOON_MINUTES, dateObj.minutes)
}

function onResetEverythingCallback () {
  shakeElement(document.querySelector('#adp-settings-modal'))
  Settings.resetEverything()

  for (const timeInputId in SettingsInternal.boundTimeInputs) {
    if (SettingsInternal.boundTimeInputs.hasOwnProperty(timeInputId)) {
      const keyPair = SettingsInternal.boundTimeInputs[timeInputId]

      document.querySelector(`#${timeInputId}`).value =
        getNormalizedDaytimeString(
          Settings.get(keyPair.hours),
          Settings.get(keyPair.minutes)
        )
    }
  }
}

function getSettingsEntryHtml (name, html) {
  return `<li>${name} : ${html}</li>`
}

class Settings {
  static get (key, defaultValue = null) {
    if (Settings.has(key)) {
      return JSON.parse(localStorage.getItem(key))
    } else if (defaultValue !== null) {
      return defaultValue
    }

    return Settings.getDefault(key)
  }

  static set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static has (key) {
    return localStorage.getItem(key) !== null
  }

  static reset (key) {
    localStorage.removeItem(key)
  }

  static getDefault (key) {
    if (key in SettingsInternal.DEFAULT_VALUES) {
      return SettingsInternal.DEFAULT_VALUES[key]
    }

    return null
  }

  static resetEverything () {
    for (const keyName in SettingsKeys) {
      if (!SettingsKeys.hasOwnProperty(keyName)) {
        continue
      }

      const key = SettingsKeys[keyName]

      if (
        typeof key === 'function' ||
        key === SettingsKeys.GLOBAL_IS_ADP_ENHANCED_ENABLED ||
        key === SettingsKeys.GLOBAL_LAST_ADP_VERSION
      ) {
        continue
      }

      Settings.reset(key)
    }
  }
}

class SettingsKeys {
  static GLOBAL_IS_ADP_ENHANCED_ENABLED =
    'ADP_ENHANCED_GLOBAL_IS_ADP_ENHANCED_ENABLED'
  static GLOBAL_LAST_ADP_VERSION = 'ADP_ENHANCED_GLOBAL_LAST_ADP_VERSION'
  static TIME_MORNING_HOURS = 'ADP_ENHANCED_TIME_MORNING_HOURS'
  static TIME_MORNING_MINUTES = 'ADP_ENHANCED_TIME_MORNING_MINUTES'
  static TIME_MORNING_HOURS = 'ADP_ENHANCED_TIME_MORNING_HOURS'
  static TIME_MORNING_MINUTES = 'ADP_ENHANCED_TIME_MORNING_MINUTES'
  static TIME_AFTERNOON_HOURS = 'ADP_ENHANCED_TIME_AFTERNOON_HOURS'
  static TIME_AFTERNOON_MINUTES = 'ADP_ENHANCED_TIME_AFTERNOON_MINUTES'
  static TIME_BEGINNING_LUNCH_BREAK_HOURS =
    'ADP_ENHANCED_TIME_BEGINNING_LUNCH_BREAK_HOURS'
  static TIME_BEGINNING_LUNCH_BREAK_MINUTES =
    'ADP_ENHANCED_TIME_BEGINNING_LUNCH_BREAK_MINUTES'
  static TIME_ENDING_LUNCH_BREAK_HOURS =
    'ADP_ENHANCED_TIME_ENDING_LUNCH_BREAK_HOURS'
  static TIME_ENDING_LUNCH_BREAK_MINUTES =
    'ADP_ENHANCED_TIME_ENDING_LUNCH_BREAK_MINUTES'
  static TIME_MINIMUM_BEGINNING_WORKING_HOURS =
    'ADP_ENHANCED_TIME_MINIMUM_BEGINNING_WORKING_HOURS'
  static TIME_MINIMUM_BEGINNING_WORKING_MINUTES =
    'ADP_ENHANCED_TIME_MINIMUM_BEGINNING_WORKING_MINUTES'
  static TIME_MINIMUM_LEAVING_WORKING_HOURS =
    'ADP_ENHANCED_TIME_MINIMUM_LEAVING_WORKING_HOURS'
  static TIME_MINIMUM_LEAVING_WORKING_MINUTES =
    'ADP_ENHANCED_TIME_MINIMUM_LEAVING_WORKING_MINUTES'
  static TIME_MAXIMUM_LEAVING_WORKING_HOURS =
    'ADP_ENHANCED_TIME_MAXIMUM_LEAVING_WORKING_HOURS'
  static TIME_MAXIMUM_LEAVING_WORKING_MINUTES =
    'ADP_ENHANCED_TIME_MAXIMUM_LEAVING_WORKING_MINUTES'
  static TIME_MINIMUM_LUNCH_BREAK_HOURS =
    'ADP_ENHANCED_TIME_MINIMUM_LUNCH_BREAK_HOURS'
  static TIME_MINIMUM_LUNCH_BREAK_MINUTES =
    'ADP_ENHANCED_TIME_MINIMUM_LUNCH_BREAK_MINUTES'
  static TIME_MORNING_BREAK_HOURS = 'ADP_ENHANCED_TIME_MORNING_BREAK_HOURS'
  static TIME_MORNING_BREAK_MINUTES = 'ADP_ENHANCED_TIME_MORNING_BREAK_MINUTES'
  static TIME_AFTERNOON_BREAK_HOURS = 'ADP_ENHANCED_TIME_AFTERNOON_BREAK_HOURS'
  static TIME_AFTERNOON_BREAK_MINUTES =
    'ADP_ENHANCED_TIME_AFTERNOON_BREAK_MINUTES'
  static TIME_MORNING_HOURS = 'ADP_ENHANCED_TIME_MORNING_HOURS'
  static TIME_AFTERNOON_HOURS = 'ADP_ENHANCED_TIME_AFTERNOON_HOURS'
  static TIME_MORNING_MINUTES = 'ADP_ENHANCED_TIME_MORNING_MINUTES'
  static TIME_AFTERNOON_MINUTES = 'ADP_ENHANCED_TIME_AFTERNOON_MINUTES'
  static TIME_RECOMMENDED_BEGINNING_WORKING_HOURS =
    'ADP_ENHANCED_TIME_RECOMMENDED_BEGINNING_WORKING_HOURS'
  static TIME_RECOMMENDED_BEGINNING_WORKING_MINUTES =
    'ADP_ENHANCED_TIME_RECOMMENDED_BEGINNING_WORKING_MINUTES'
  static TIME_RECOMMENDED_BEGINNING_LUNCH_HOURS =
    'ADP_ENHANCED_TIME_RECOMMENDED_BEGINNING_LUNCH_HOURS'
  static TIME_RECOMMENDED_BEGINNING_LUNCH_MINUTES =
    'ADP_ENHANCED_TIME_RECOMMENDED_BEGINNING_LUNCH_MINUTES'
  static TIME_RECOMMENDED_ENDING_LUNCH_HOURS =
    'ADP_ENHANCED_TIME_RECOMMENDED_ENDING_LUNCH_HOURS'
  static TIME_RECOMMENDED_ENDING_LUNCH_MINUTES =
    'ADP_ENHANCED_TIME_RECOMMENDED_ENDING_LUNCH_MINUTES'
  static TIME_RECOMMENDED_ENDING_WORKING_HOURS =
    'ADP_ENHANCED_TIME_RECOMMENDED_ENDING_WORKING_HOURS'
  static TIME_RECOMMENDED_ENDING_WORKING_MINUTES =
    'ADP_ENHANCED_TIME_RECOMMENDED_ENDING_WORKING_MINUTES'
  static TIME_LOWEST_TOTAL_EXTRA_HOURS =
    'ADP_ENHANCED_TIME_LOWEST_TOTAL_EXTRA_HOURS'
  static TIME_LOWEST_TOTAL_EXTRA_MINUTES =
    'ADP_ENHANCED_TIME_LOWEST_TOTAL_EXTRA_MINUTES'
  static TIME_HIGHEST_WEEKLY_EXTRA_HOURS =
    'ADP_ENHANCED_TIME_HIGHEST_WEEKLY_EXTRA_HOURS'
  static TIME_HIGHEST_WEEKLY_EXTRA_MINUTES =
    'ADP_ENHANCED_TIME_HIGHEST_WEEKLY_EXTRA_MINUTES'
  static TIME_HIGHEST_TOTAL_EXTRA_HOURS =
    'ADP_ENHANCED_TIME_HIGHEST_TOTAL_EXTRA_HOURS'
  static TIME_HIGHEST_TOTAL_EXTRA_MINUTES =
    'ADP_ENHANCED_TIME_HIGHEST_TOTAL_EXTRA_MINUTES'
}

class SettingsInternal {
  static DEFAULT_VALUES = {
    [SettingsKeys.GLOBAL_IS_ADP_ENHANCED_ENABLED]: true,
    [SettingsKeys.GLOBAL_LAST_ADP_VERSION]: '0.0.0',
    [SettingsKeys.TIME_MORNING_HOURS]: 3,
    [SettingsKeys.TIME_MORNING_MINUTES]: 30,
    [SettingsKeys.TIME_AFTERNOON_HOURS]: 3,
    [SettingsKeys.TIME_AFTERNOON_MINUTES]: 30,
    [SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_HOURS]: 12,
    [SettingsKeys.TIME_BEGINNING_LUNCH_BREAK_MINUTES]: 0,
    [SettingsKeys.TIME_ENDING_LUNCH_BREAK_HOURS]: 14,
    [SettingsKeys.TIME_ENDING_LUNCH_BREAK_MINUTES]: 0,
    [SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_HOURS]: 8,
    [SettingsKeys.TIME_MINIMUM_BEGINNING_WORKING_MINUTES]: 0,
    [SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_HOURS]: 17,
    [SettingsKeys.TIME_MINIMUM_LEAVING_WORKING_MINUTES]: 0,
    [SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_HOURS]: 19,
    [SettingsKeys.TIME_MAXIMUM_LEAVING_WORKING_MINUTES]: 0,
    [SettingsKeys.TIME_MINIMUM_LUNCH_BREAK_HOURS]: 1,
    [SettingsKeys.TIME_MINIMUM_LUNCH_BREAK_MINUTES]: 0,
    [SettingsKeys.TIME_MORNING_BREAK_HOURS]: 0,
    [SettingsKeys.TIME_MORNING_BREAK_MINUTES]: 15,
    [SettingsKeys.TIME_AFTERNOON_BREAK_HOURS]: 0,
    [SettingsKeys.TIME_AFTERNOON_BREAK_MINUTES]: 15,
    [SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_HOURS]: 9,
    [SettingsKeys.TIME_RECOMMENDED_BEGINNING_WORKING_MINUTES]: 0,
    [SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_HOURS]: 12,
    [SettingsKeys.TIME_RECOMMENDED_BEGINNING_LUNCH_MINUTES]: 30,
    [SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_HOURS]: 14,
    [SettingsKeys.TIME_RECOMMENDED_ENDING_LUNCH_MINUTES]: 0,
    [SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_HOURS]: 18,
    [SettingsKeys.TIME_RECOMMENDED_ENDING_WORKING_MINUTES]: 0,
    [SettingsKeys.TIME_LOWEST_TOTAL_EXTRA_HOURS]: -3,
    [SettingsKeys.TIME_LOWEST_TOTAL_EXTRA_MINUTES]: 0,
    [SettingsKeys.TIME_HIGHEST_WEEKLY_EXTRA_HOURS]: 3,
    [SettingsKeys.TIME_HIGHEST_WEEKLY_EXTRA_MINUTES]: 0,
    [SettingsKeys.TIME_HIGHEST_TOTAL_EXTRA_HOURS]: 10,
    [SettingsKeys.TIME_HIGHEST_TOTAL_EXTRA_MINUTES]: 0
  }

  static boundTimeInputs = {}
  static boundButtons = {}
}

function setupSettings () {
  const settingsContainer = document.createElement('div')
  settingsContainer.innerHTML = getSettingsHtml()
  document.body.appendChild(settingsContainer)
  setUpHoursMinutesInputs()
  bindButtonCallbacks()

  handleModal(
    document.querySelector('#adp-settings-btn'),
    document.querySelector('#adp-settings-modal'),
    refresh
  )
}
