class Intro {
  static STEP_DATA = [
    { version: '0.0.1', stepsFunc: get0dot0dot1 },
    { version: '0.9.4', stepsFunc: get0dot9dot4 },
    { version: '0.9.10', stepsFunc: get0dot9dot10 },
    { version: '1.1.1', stepsFunc: get1dot1dot1 }
  ]
}

function parseVersion (versionString) {
  const parsedVersion = versionString
    ? versionString.split('.').map(Number)
    : []

  parsedVersion[0] ||= 0
  parsedVersion[1] ||= 0
  parsedVersion[2] ||= 0
  return parsedVersion
}

function compareVersions (v1, v2) {
  if (v1[0] > v2[0]) return 1
  if (v1[0] < v2[0]) return -1
  if (v1[1] > v2[1]) return 1
  if (v1[1] < v2[1]) return -1
  if (v1[2] > v2[2]) return 1
  if (v1[2] < v2[2]) return -1

  return 0
}

function get0dot0dot1 () {
  return [
    {
      title: 'Yay ! 💃',
      intro: `Bienvenue sur ${Global.ADP_APP_NAME} !`,
      priority: 0
    },
    {
      element: document.querySelector('#beginning-extra-time'),
      title: 'Heures supplémentaires',
      intro: `Vos heures supplémentaires (qui sont directement données par ADP) sont visibles ici.`,
      position: 'top',
      priority: 1
    },
    {
      element: document.querySelector('#monday-details'),
      title: 'Pointage & événements',
      intro: `Le détail de la journée est divisé entre vos heures pointées et les événements (jours fériés, etc.). Survolez le point d'interrogation à droite d'une paire horaire pour connaître sa nature.`,
      position: 'top',
      priority: 1
    },
    {
      title: "En cas d'erreur...",
      element: document.querySelector('#adp-enhanced-toggle-button'),
      intro: `Un problème avec ${Global.ADP_APP_NAME} ? Pas de panique ! Le script en est encore au stade expérimental... En cas de pépin, désactivez simplement ${Global.ADP_APP_NAME} en un clic !`,
      position: 'top',
      priority: 999
    }
  ]
}

function get0dot9dot4 () {
  const getValidPredictionEl = () => {
    const els = document.querySelectorAll('.day-predictions')
    let selectedEl = null

    for (const el of els) {
      // Some prediction elements might be hidden, so we take the first one that is visible.
      if (window.getComputedStyle(el).display !== 'none') {
        selectedEl = el
        break
      }
    }

    if (selectedEl === null) {
      // Fallback. Who installs ADP Enhanced during the weekend?
      selectedEl = document.querySelector('#monday-time')
    }

    return selectedEl
  }

  return [
    {
      element: getValidPredictionEl(),
      title: 'Horaires de départ conseillés',
      intro: `Ici sont affichés les horaires conseillés pour finir votre journée. Survolez le point d'interrogation pour avoir plus de détails.`,
      position: 'top',
      priority: 2
    }
  ]
}

function get0dot9dot10 () {
  const getValidPredictionEl = () => {
    const els = document.querySelectorAll('.cumulated-daily-delta')
    let selectedEl = els.length > 0 ? els[0] : null

    if (selectedEl === null) {
      // Fallback. Who installs ADP Enhanced during the weekend?
      selectedEl = document.querySelector('#monday-time')
    }

    return selectedEl
  }

  return [
    {
      element: getValidPredictionEl(),
      title: 'Delta cumulé sur la semaine',
      intro: `Utile pour savoir si vous gagnez ou perdez du temps sur vos 35 heures !`,
      position: 'top',
      priority: 1
    }
  ]
}

function get1dot1dot1 () {
  return [
    {
      element: document.querySelector('#adp-settings-icon'),
      title: 'Paramètres',
      intro: `Vous ne souhaitez prendre qu'une heure de pause le midi ? Ou encore arriver plus tard le matin ? C'est ici que vous personnalisez votre expérience ${Global.ADP_APP_NAME}!`,
      position: 'top',
      priority: 998
    }
  ]
}

function getSteps () {
  const version = parseVersion(
    Settings.get(SettingsKeys.GLOBAL_LAST_ADP_VERSION)
  )

  let steps = []

  Intro.STEP_DATA.forEach((stepData, index) => {
    if (compareVersions(version, parseVersion(stepData.version)) >= 0) {
      return
    }

    for (const newStep of stepData.stepsFunc()) {
      newStep.version = stepData.version
      steps.push(newStep)
    }
  })

  return sortArrayOfObjects(steps, ['priority', 'version'])
}

function loadIntro () {
  const steps = getSteps()

  if (steps.length === 0) {
    return
  }

  const css = document.createElement('link')

  css.href = 'https://unpkg.com/intro.js/introjs.css'
  css.type = 'text/css'
  css.rel = 'stylesheet'
  document.head.appendChild(css)

  const script = document.createElement('script')
  script.src = 'https://unpkg.com/intro.js/intro.js'
  script.onload = async () => {
    introJs()
      .setOptions({
        steps: steps,
        showProgress: true,
        nextLabel: 'Suivant',
        prevLabel: 'Précédent'
      })
      .start()
  }

  document.head.appendChild(script)

  Settings.set(
    SettingsKeys.GLOBAL_LAST_ADP_VERSION,
    Global.ADP_ENHANCED_VERSION
  )
}
