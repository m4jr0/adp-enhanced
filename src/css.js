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

#total-time {
  font-size: 30px !important;
}

#adp-enhanced-toggle-button a {
  color: var(--global-emphasis);
}

.day-details {
  margin-bottom: 10px;
}

.day-details-title {
  color: var(--global-black);
  text-align: center;
  width: 100%;
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
  background-color: var(--global-emphasis);
  content: attr(data-tooltip);
  color: var(--global-white);
  cursor: pointer;
  border-radius: 5px;
  opacity: 0;
  padding: 5px;
  position: absolute;
  text-align: center;
  transform: translate(5px, -2px);
  transition: background-color 0.7s, opacity 0.3s, transform 0.3s;
  visibility: hidden;
  width: 120px;
  z-index: 1;
}

.time-pair-entry-help:hover::before {
  background-color: var(--global-blue);
  cursor: pointer;
  opacity: 1;
  transform: translate(20px, -2px);
  visibility: visible;
}

.time-pair-entry-help-icon {
  cursor: pointer;
  margin-left: 2px;
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

  const element = document.createElement('style')
  element.appendChild(document.createTextNode(CSS))
  document.head.appendChild(element)
  Css.isLoaded = true
}
