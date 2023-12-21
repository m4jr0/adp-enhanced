// ==UserScript==
// @name         ADP Enhanced
// @namespace    https://github.com/m4jr0/adp-enhanced
// @downloadURL  https://raw.githubusercontent.com/m4jr0/adp-enhanced/release/src/adp_enhanced.user.js
// @updateURL    https://raw.githubusercontent.com/m4jr0/adp-enhanced/release/src/adp_enhanced.user.js
// @version      1.2
// @description  Enhance ADP
// @author       m4jr0
// @match        https://mon.adp.com/redbox/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adp.com
// @grant        none
// @run-at       document-start
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/global.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/utils.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/date_utils.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/dom_utils.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/input.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/settings.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/adp_api.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/css.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/calendar.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/loader.js
// @require      https://github.com/m4jr0/adp-enhanced/raw/master/src/intro.js
// ==/UserScript==

/* global GM_info */
/* global localStorage */
/* global XMLHttpRequest */
/* global alert */
/* global Notification */
/* global Worker */
/* global Blob */
/* global self */

'use strict'

async function initialize () {
  // Hacky stuff. Regular event listeners won't work.
  setInterval(async () => {
    checkIfLoadIsNeeded()
  })

  log(
    `Hooray! ${Global.ADP_APP_NAME} is back! Let's dance! 💃 Version is ${Global.ADP_ENHANCED_VERSION}.`
  )

  await load()
}

;(() => {
  window.addEventListener(
    'load',
    () => {
      log(
        `Bootstrapping ${Global.ADP_APP_NAME} v${Global.ADP_ENHANCED_VERSION}...`,
        Log.Info
      )

      initialize() // Let's go!
    },
    false
  )
})()
