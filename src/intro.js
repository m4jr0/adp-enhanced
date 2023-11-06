class Intro {
  static STEP_DATA = [{ version: '0.0.1', stepsFunc: get0dot0dot1 }]
}

function parseVersion (versionString) {
  const parsedVersion = versionString.split('.').map(Number)
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
      intro: `Bienvenue sur ${Global.ADP_APP_NAME} !`
    },
    {
      element: document.querySelector('#beginning-extra-time'),
      title: 'Heures supplémentaires',
      intro: `Vos heures supplémentaires (qui sont directement données par ADP) sont visibles ici.`,
      position: 'top'
    },
    {
      element: document.querySelector('#monday-details'),
      title: 'Pointage & événements',
      intro: `Le détail de la journée est divisé entre vos heures pointées et les événements (jours fériés, etc.). Survolez le point d'interrogation à droite d'une paire horaire pour connaître sa nature.`,
      position: 'top'
    },
    {
      title: "En cas d'erreur...",
      element: document.querySelector('#adp-enhanced-toggle-button'),
      intro: `Un problème avec ${Global.ADP_APP_NAME} ? Pas de panique ! Le script en est encore au stade expérimental... En cas de pépin, désactivez simplement ${Global.ADP_APP_NAME} en un clic !`,
      position: 'top'
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

    steps = [...steps, ...stepData.stepsFunc()]
  })

  return steps
}

function loadIntro () {
  var steps = getSteps()

  if (steps.length === 0) {
    return
  }

  var css = document.createElement('link')

  css.href = 'https://unpkg.com/intro.js/introjs.css'
  css.type = 'text/css'
  css.rel = 'stylesheet'
  document.head.appendChild(css)

  var script = document.createElement('script')
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
