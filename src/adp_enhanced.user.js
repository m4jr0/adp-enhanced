// ==UserScript==
// @name         ADP Enhanced
// @version      0.9.1
// @description  Enhance ADP
// @author       m4jr0
// @match        https://mon.adp.com/redbox/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adp.com
// @grant        none
// @require      https://github.com/m4jr0/adp-enhanced/tree/master/src/global.js
// @require      https://github.com/m4jr0/adp-enhanced/tree/master/src/utils.js
// @require      https://github.com/m4jr0/adp-enhanced/tree/master/src/date_utils.js
// @require      https://github.com/m4jr0/adp-enhanced/tree/master/src/dom_utils.js
// @require      https://github.com/m4jr0/adp-enhanced/tree/master/src/settings.js
// @require      https://github.com/m4jr0/adp-enhanced/tree/master/src/adp_api.js
// @require      https://github.com/m4jr0/adp-enhanced/tree/master/src/css.js
// @require      https://github.com/m4jr0/adp-enhanced/tree/master/src/calendar.js
// @require      https://github.com/m4jr0/adp-enhanced/tree/master/src/loader.js
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

  console.log(
    `Hooray! ${Global.ADP_APP_NAME} is back! Let's dance! 💃 Version is ${Global.ADP_ENHANCED_VERSION}.`
  )

  await load()
}

;(() => {
  window.addEventListener(
    'load',
    () => {
      initialize() // Let's go!
    },
    false
  )
})()
