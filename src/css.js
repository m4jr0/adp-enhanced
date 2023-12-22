class Css {
  static isLoaded = false
}

const CSS = `
:root {
  --global-light-gray: lightgray;
  --global-gray: #6a6a6a;
  --global-black: #262321;
  --global-blue: #324fa5;
  --global-red: #d32f2f;
  --global-white: white;
  --global-emphasis: #0091ea;
  
  --sub-text-color: var(--global-gray);
  --sub-text-cursor: default;
  --sub-text-font-weight: 800;

  --title-color: black;
  --title-cursor: default;
  --title-font-size: 28px;
  --title-font-weight: 800;
  --title-line-height: 1;
}

#adp-title {
  color: var(--title-color);
  cursor: var(--title-cursor);
  font-size: var(--title-font-size);
  font-weight: var(--title-font-weight);
  line-height: var(--title-line-height);
}

#adp-version {
  color: var(--sub-text-color);
  cursor: var(--sub-text-cursor);
}

#adp-enhanced-toggle-button {
  bottom: 2px;
  margin-right: 20px;
  position: relative;
}

#adp-enhanced-toggle-button-logo {
  vertical-align: -0.6em;
}

#adp-enhanced-toggle-button a {
  color: var(--global-emphasis);
}

#adp-settings-icon {
  color: var(--global-light-gray);
  font-size: 1.5em;
  transition: color 0.3s ease, transform 0.3s ease;
  opacity: 1;
  transform: translateY(0);
}

#adp-settings-icon:hover {
  color: var(--global-emphasis);
  cursor: pointer;
  transform: rotate(90deg) scale(1.1);
}

#adp-settings-modal {
  max-width: initial !important;
  padding: 15px 35px 35px 35px;
  width: initial;
}

#adp-settings-modal-container {
  display: flex;
  justify-content: space-around;
}

#total-time {
  font-size: 30px !important;
}

.adp-enhanced-button-input {
  background-color: var(--global-blue);
  border: none;
  border-radius: 8px;
  box-sizing: unset;
  color: white;
  font-size: 1em;
  font-weight: 500;
  justify-content: center;
  padding: 6px 15px;
  text-transform: none;
  transition: .2s;
}

.adp-enhanced-button-input:focus {
  background-color: var(--global-blue) !important;
  box-shadow: inset 0 0 0 2px var(--global-blue), inset 0 0 0 3px var(--global-white);
  outline: 0;
}

.adp-enhanced-button-input:hover {
  background-color: var(--global-emphasis);
}

.adp-enhanced-checkbox-input .switch {
  bottom: 13px;
  display: inline-block;
  height: 28px;
  position: relative;
  transform: translateY(13px);
  width: 50px;
}

.adp-enhanced-checkbox-input-label {
  bottom: 14px;
  margin-left: 5px;
  position: relative;
}

.adp-enhanced-checkbox-input .switch input {
  display: none;
}

.adp-enhanced-checkbox-input .slider {
  background-color: var(--global-light-gray);
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: .4s;
}

.adp-enhanced-checkbox-input .slider:before {
  background-color: var(--global-white);
  bottom: 3px;
  content: "";
  height: 22px;
  left: 3px;
  position: absolute;
  transition: .4s;
  width: 22px;
}

.adp-enhanced-checkbox-input input:checked + .slider {
  background-color: var(--global-blue);
}

.adp-enhanced-checkbox-input input:checked + .slider:before {
  transform: translateX(22px);
}

.adp-enhanced-checkbox-input .slider.round {
  border-radius: 28px;
}

.adp-enhanced-checkbox-input .slider.round:before {
  border-radius: 50%;
}

.adp-settings-button-input-help-icon {
  color: var(--global-gray);
  cursor: pointer;
  font-size: 0.9em;
  position: absolute;
  transform: translate(calc(-100% - 7px), 6px);
  transition: color 0.3s ease;
}

.adp-settings-button-input-help-icon:hover {
  color: var(--global-emphasis);
}

.adp-settings-button-input-help-icon::before {
  background-color: var(--global-blue);
  border-radius: 5px;
  content: attr(data-tooltip);
  color: var(--global-white);
  cursor: pointer;
  opacity: 0;
  padding: 15px;
  position: absolute;
  text-align: center;
  transform: translate(calc(-80% - 7px), calc(-50% + 9px));
  transition: background-color 0.5s, opacity 0.3s, transform 0.3s;
  visibility: hidden;
  width: 200px;
  z-index: 1;
}

.adp-settings-button-input-help-icon:hover::before {
  background-color: var(--global-emphasis);
  cursor: pointer;
  opacity: 1;
  visibility: visible;

  transform: translate(calc(-100% - 7px), calc(-50% + 9px));
}

.adp-enhanced-hours-minutes-input {
  border: 2px solid var(--global-light-gray);
  border-radius: 5px;
  display: inline;
  font-size: 1em;
  font-weight: initial;
  height: 35px;
  outline: none;
  text-align: center;
  transition: border 0.1s ease;
  width: 75px;
}

.adp-enhanced-hours-minutes-input:focus {
  border: 3px solid var(--global-emphasis);
  outline: none;
}

.adp-enhanced-hours-minutes-input-label {
  font-size: 0.9em;
}

.adp-enhanced-modal {
  background-color: var(--global-white);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  left: 50%;
  margin: 0px;
  max-width: 400px;
  min-width: 300px;
  min-height: 100px;
  opacity: 0;
  padding: 20px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
  width: 100%;
  z-index: -100000 !important;
}

.adp-enhanced-modal h1 {
  text-align: center;
}

.adp-enhanced-modal h2 {
  color: var(--global-blue);
  font-size: 1.1em;
  font-weight: initial;
  text-align: left;
}

.adp-enhanced-modal p {
  text-align: center;
}

.adp-enhanced-modal ul {
  list-style-type: none;
  padding: 0;
}

.adp-enhanced-modal li {
  padding-left: 10px;
  position: relative;
  margin-bottom: 8px;
}

.adp-enhanced-modal li::before {
  color: var(--global-light-gray);
  content: '·';
  left: 0;
  margin-right: 10px;
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
}

.adp-enhanced-modal.show {
  opacity: 1;
  transform: translate(-50%, -50% );
  z-index: 100000 !important;
}

.adp-enhanced-modal .close-button {
  color: var(--global-light-gray);
  cursor: pointer;
  font-size: 1.5em;
  position: absolute;
  right: 15px;
  top: 15px;
  transition: color 0.3s ease, transform 0.3s ease;
  transform: rotate(0deg);
  transform-origin: center;
}

.adp-enhanced-modal .close-button:hover {
  color: var(--global-emphasis);
  transform: rotate(90deg) scale(1.1);
}

.adp-enhanced-modal-overlay {
  background: rgba(110, 110, 110, 0);
  backdrop-filter: blur(0px);
  cursor: pointer;
  left: 0;
  height: 100%;
  position: fixed;
  top: 0;
  transition: background 0.3s ease, backdrop-filter 0.3 ease !important;
  width: 100%;
  z-index:  99999 !important;
}

.adp-enhanced-modal-overlay.show {
  background: radial-gradient(circle, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
  backdrop-filter: blur(10px);
  display: block;
}

.adp-settings-checkbox {
  margin-top: 15px;
}

.adp-settings-help-icon {
  font-size:  1.2em !important;
  margin-right: 5px;
  position: relative;
  top: 1px;
}

.adp-settings-separator {
  background: linear-gradient(to bottom, transparent, var(--global-gray), transparent);
  flex: 1;
  margin-left: 50px;
  margin-right: 50px;
  width: 1px;
}

.adp-settings-subcontainer {
  flex: 1;
  min-width: 320px;
}

.adp-settings-time-input-help-icon {
  color: var(--global-gray);
  cursor: pointer;
  font-size: 0.9em;
  position: absolute;
  transform: translate(calc(-50% - 12px), calc(-50% + 40px));
  transition: color 0.3s ease;
}

.adp-settings-time-input-help-icon:hover {
  color: var(--global-emphasis);
  z-index: 10000;
}

.adp-settings-time-input-help-icon::before {
  background-color: var(--global-blue);
  border-radius: 5px;
  content: attr(data-tooltip);
  color: var(--global-white);
  cursor: pointer;
  opacity: 0;
  padding: 15px;
  position: absolute;
  text-align: center;
  transform: translate(calc(-80% - 7px), calc(-50% + 9px));
  transition: background-color 0.5s, opacity 0.3s, transform 0.3s;
  visibility: hidden;
  width: 200px;
}

.adp-settings-time-input-help-icon:hover::before {
  background-color: var(--global-emphasis);
  cursor: pointer;
  opacity: 1;
  transform: translate(calc(-100% - 7px), calc(-50% + 9px));
  visibility: visible;
}

.adp-settings-title {
  margin-top: 15px;
}

.adp-settings-title.below {
  margin-top: 55px;
}

.cumulated-weekly-delta {
  font-weight: initial;
}

.day-details {
  margin-bottom: 10px;
}

.day-details-title {
  color: var(--global-black);
  text-align: center;
  width: 100%;
}

.day-details-title {
  margin-top: 12px !important;
}

.day-leaving-time-and-delta {
  display: initial !important;
  text-transform: initial !important;
}

.day-leaving-time-delta {
  color: var(--sub-text-color);
  display: initial !important;
  font-weight: initial;
  text-transform: initial !important;
}

.day-predictions {
  display: flex;
  margin-top: 10px !important;
  font-size: 0.5em;
  font-weight: bold;
  text-align: center;
}

.day-predictions-help-icon::before {
  background-color: var(--global-blue);
  border-radius: 5px;
  content: attr(data-tooltip);
  color: var(--global-white);
  cursor: pointer;
  font-weight: initial;
  opacity: 0;
  padding: 15px;
  position: absolute;
  text-align: center;
  text-transform: initial;
  transform: translate(-145px, -70%);
  transition: background-color 0.5s, color 0.3s ease, opacity 0.3s, transform 0.3s;
  visibility: hidden;
  width: 300px;
  white-space: pre-line;
}

.day-predictions-help-icon:hover::before {
  background-color: var(--global-emphasis);
  cursor: pointer;
  opacity: 1;
  transform: translate(-145px, -105%);
  visibility: visible;
}

.day-predictions-help-icon:hover {
  color: var(--global-emphasis);
}

.day-prediction {
  flex: 2;
}

.day-predictions-help-icon {
  cursor: pointer;
}

.day-predictions-separator {
  color: var(--global-gray);
  flex: 1;
  font-size: 0.8em;
  position: relative;
  top: 2px;
}

.inputs-group {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.settings-time-input.below {
  margin-top: 10px;
}

.shake {
  transition: transform ${DomUtils.getShakePaceForCss()} !important;
}

.shake-blur {
  background: rgba(110, 110, 110, 0);
  backdrop-filter: blur(1px);
  cursor: pointer;
  left: 0;
  height: 100%;
  position: fixed;
  top: 0;
  width: 100%;
  z-index:  1000000 !important;
}

.time-arrow {
  color: var(--global-light-gray) !important;
}

.time-bullet {
  color: var(--global-light-gray) !important;
}

.time-delta {
  color: var(--sub-text-color);
  font-size: 0.9em;
  overflow: hidden;
  text-align: right;
}

.time-pair-element {
  flex: 2;
  max-height: 15px;
  overflow: hidden;
}

.time-pair-no-entries {
  color: var(--global-light-gray);
  font-size: 2em;
  font-weight: 700 !important;
  text-align: center;
}

.time-loading-animation {
  animation: time-loading-animation 2s steps(20) infinite, emphasize-horizontal 5s ease-in-out infinite alternate;
  animation-delay: 0s;
  animation-timing-function: linear;

  background: linear-gradient(
    90deg,
    var(--global-black),
    var(--global-emphasis)
  );

  background-clip: text !important;
  background-size: 500% auto !important;

  display: inline-block;
  height: 12px;
  overflow: hidden;
  text-fill-color: transparent !important;
  white-space: nowrap;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
}

.time-pair-entry {
  display: flex;
  margin-left: 5px;
  margin-right: 5px;
}

.time-pair-entry-help::before {
  background-color: var(--global-blue);
  border-radius: 5px;
  content: attr(data-tooltip);
  color: var(--global-white);
  cursor: pointer;
  max-width: 130px;
  opacity: 0;
  padding: 10px;
  position: absolute;
  text-align: center;
  transform: translate(calc(-20% + 20px), calc(-50% + 9px));
  transition: background-color 0.5s, opacity 0.3s, transform 0.3s;
  visibility: hidden;
  z-index: 1;
}

.time-pair-entry-help:hover::before {
  background-color: var(--global-emphasis);
  cursor: pointer;
  opacity: 1;
  transform: translate(calc(0% + 20px), calc(-50% + 9px));
  visibility: visible;
}

.time-pair-entry-help-icon {
  cursor: pointer;
  margin-left: 2px;
  transition: color 0.3s ease;
}

.time-pair-entry-help-icon:hover {
  color: var(--global-emphasis);
}

.time-pair-entry-help-left::before {
  transform: translate(calc(-80% - 7px), calc(-50% + 9px)) !important;
}

.time-pair-entry-help-left:hover::before {
  transform: translate(calc(-100% - 7px), calc(-50% + 9px)) !important;
  transform-origin: right center !important;
}

.time-pair-entry-help-icon:hover {
  color: var(--global-emphasis);
}

.time-separator {
  border-top: 2px dotted var(--global-light-gray) !important;
  margin-bottom: 10px !important;
  margin-left: 10px !important;
  margin-right: 10px !important;
  margin-top: 10px !important;
}

.working-day-time {
  animation: emphasize-horizontal 5s ease-in-out infinite alternate;

  background: linear-gradient(
    90deg,
    var(--global-blue),
    var(--global-emphasis)
  );

  background-clip: text !important;
  background-size: 500% auto !important;
  font-weight: 700 !important;
  font-size: 28px !important;
  line-height: 1 !important;
  text-align: center !important;

  text-fill-color: transparent !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
}

.working-global-time {
  animation: emphasize-horizontal 5s ease-in-out infinite alternate;

  background: linear-gradient(
    90deg,
    var(--global-gray),
    var(--global-emphasis)
  );

  background-clip: text;
  background-size: 500% auto;

  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.working-global-time-ring {
  animation: emphasize-radiant 2s ease-in-out infinite alternate;

  background: linear-gradient(
    90deg,
    var(--global-gray),
    var(--global-emphasis)
  );
}

.working-global-time-container {
  animation: rotate-clockwise 5s linear infinite;
  height: 100%;
  transform-origin: center;
  width: 100%;
}

.working-time-delta {
  animation: emphasize-horizontal 5s ease-in-out infinite alternate;

  background: linear-gradient(
    90deg,
    var(--global-blue),
    var(--global-emphasis)
  );

  background-clip: text !important;
  background-size: 500% auto !important;
  overflow: hidden;
  text-fill-color: transparent !important;
  white-space: nowrap;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
}

@keyframes emphasize-horizontal {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes rotate-clockwise {
	0% {
    transform: rotate(0deg)
  }
	100% {
    transform: rotate(360deg)
  }	
}

@keyframes emphasize-radiant {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes time-loading-animation {
  0% {
    width: 0;
  }
  80% {
    width: 20px;
  }
  90% {
    width: 50px;
  }
  100% {
    width: auto;
  }
}
`

function loadCss () {
  if (Css.isLoaded) {
    return
  }

  // Load Font Awesome icons.
  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = 'https://use.fontawesome.com/releases/v5.10.0/css/all.css'
  document.head.appendChild(link)

  const element = document.createElement('style')
  element.appendChild(document.createTextNode(CSS))

  document.head.appendChild(element)
  Css.isLoaded = true
}
