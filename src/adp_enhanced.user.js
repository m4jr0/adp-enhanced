// ==UserScript==
// @name         ADP Enhanced
// @namespace    https://github.com/m4jr0/adp-enhanced
// @downloadURL  https://raw.githubusercontent.com/m4jr0/adp-enhanced/master/src/adp_enhanced.user.js
// @updateURL    https://raw.githubusercontent.com/m4jr0/adp-enhanced/master/src/adp_enhanced.user.js
// @version      0.5.0.0
// @description  Enhance the ADP activity web page!
// @author       m4jr0
// @match        https://hr-services.fr.adp.com/gtaweb/gtapro/*/index.php?module=declaration&action=CMD*
// @grant        none
// ==/UserScript==

/* global GM_info */
/* global localStorage */
/* global XMLHttpRequest */
/* global alert */
/* global Notification */
/* global Worker */
/* global Blob */
/* global self */

// Constants.
// Storage.
const DEBUG_IS_DEBUG_PANEL_VISIBLE_KEY = 'debug-is-debug-panel-visible'
const DEBUG_IS_DEBUG_MODE_KEY = 'debug-is-debug-mode'
const DEBUG_NOW_KEY = 'debug-now'
const DEBUG_WEEK_LABEL_KEY = 'debug-week-label'
const DEBUG_EXTRA_HOURS_HOURS_KEY = 'debug-extra-hours-hours'
const DEBUG_EXTRA_HOURS_MINUTES_KEY = 'debug-extra-hours-minutes'
const DEBUG_EXTRA_HOURS_SIGN_KEY = 'debug-extra-hours-sign'
const DEBUG_GENERATED_HOURS_KEY = 'debug-generated-hours'
const DEBUG_ACTUAL_HOURS_KEY = 'debug-actual-hours'
const MORNING_HOURS_KEY = 'morning-hours-key'
const MORNING_MINUTES_KEY = 'morning-minutes-key'
const AFTERNOON_HOURS_KEY = 'afternoon-hours-key'
const AFTERNOON_MINUTES_KEY = 'afternoon-minutes-key'
const MINIMUM_BEGINNING_WORKING_HOURS_KEY = 'minimum-beginning-working-hours-key'
const MINIMUM_BEGINNING_WORKING_MINUTES_KEY = 'minimum-beginning-working-minutes-key'
const MINIMUM_LEAVING_WORKING_HOURS_KEY = 'minimum-leaving-working-hours-key'
const MINIMUM_LEAVING_WORKING_MINUTES_KEY = 'minimum-leaving-working-minutes-key'
const MAXIMUM_LEAVING_WORKING_HOURS_KEY = 'maximum-working-hours-key'
const MAXIMUM_LEAVING_WORKING_MINUTES_KEY = 'maximum-working-minutes-key'
const MINIMUM_LUNCH_BREAK_HOURS_KEY = 'minimum-lunch-break-hours-key'
const MINIMUM_LUNCH_BREAK_MINUTES_KEY = 'minimum-lunch-break-minutes-key'
const MORNING_BREAK_HOURS_KEY = 'morning-break-hours-key'
const MORNING_BREAK_MINUTES_KEY = 'morning-break-minutes-key'
const AFTERNOON_BREAK_HOURS_KEY = 'afternoon-break-hours-key'
const AFTERNOON_BREAK_MINUTES_KEY = 'afternoon-break-minutes-key'
const RECOMMENDED_BEGINNING_WORKING_HOURS_KEY = 'recommended-beginning-working-hours-key'
const RECOMMENDED_BEGINNING_WORKING_MINUTES_KEY = 'recommended-beginning-working-minutes-key'
const RECOMMENDED_BEGINNING_LUNCH_HOURS_KEY = 'recommended-beginning-lunch-hours-key'
const RECOMMENDED_BEGINNING_LUNCH_MINUTES_KEY = 'recommended-beginning-lunch-minutes-key'
const RECOMMENDED_ENDING_LUNCH_HOURS_KEY = 'recommended-ending-lunch-hours-key'
const RECOMMENDED_ENDING_LUNCH_MINUTES_KEY = 'recommended-ending-lunch-minutes-key'
const RECOMMENDED_ENDING_WORKING_HOURS_KEY = 'recommended-ending-working-hours-key'
const RECOMMENDED_ENDING_WORKING_MINUTES_KEY = 'recommended-ending-working-minutes-key'
const RECOMMENDED_LUNCH_BREAK_HOURS_KEY = 'recommended-lunch-break-hours-key'
const RECOMMENDED_LUNCH_BREAK_MINUTES_KEY = 'recommended-lunch-break-minutes-key'
const LOWEST_TOTAL_EXTRA_HOURS_KEY = 'lowest-total-extra-hours-key'
const LOWEST_TOTAL_EXTRA_MINUTES_KEY = 'lowest-total-extra-minutes-key'
const HIGHEST_WEEKLY_EXTRA_HOURS_KEY = 'highest-weekly-extra-hours-key'
const HIGHEST_WEEKLY_EXTRA_MINUTES_KEY = 'highest-weekly-extra-minutes-key'
const HIGHEST_TOTAL_EXTRA_HOURS_KEY = 'highest-total-extra-hours-key'
const HIGHEST_TOTAL_EXTRA_MINUTES_KEY = 'highest-total-extra-minutes-key'
const IS_OVERTIME_COMPENSATION_KEY = 'is-overtime-compensation-key'
const ARE_DAYS_OFF_KEY = 'are-days-off-key'
const IS_UNPAID_TIME_OFF_KEY = 'is-unpaid-time-off-key'
const ARE_NATIONAL_HOLIDAYS_KEY = 'are-national-holiday-key'
const ARE_SICK_DAYS_KEY = 'are-sick-days-key'
const IS_OCCASIONAL_REMOTE_WORK_KEY = 'is-occasional-remote-work-key'

const LOCAL_STORAGE_TYPES = {}
LOCAL_STORAGE_TYPES[DEBUG_IS_DEBUG_PANEL_VISIBLE_KEY] = 'boolean'
LOCAL_STORAGE_TYPES[DEBUG_IS_DEBUG_MODE_KEY] = 'boolean'
LOCAL_STORAGE_TYPES[DEBUG_NOW_KEY] = 'date'
LOCAL_STORAGE_TYPES[DEBUG_WEEK_LABEL_KEY] = 'string'
LOCAL_STORAGE_TYPES[DEBUG_EXTRA_HOURS_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[DEBUG_EXTRA_HOURS_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[DEBUG_EXTRA_HOURS_SIGN_KEY] = 'number'
LOCAL_STORAGE_TYPES[DEBUG_GENERATED_HOURS_KEY] = 'string'
LOCAL_STORAGE_TYPES[DEBUG_ACTUAL_HOURS_KEY] = 'string'
LOCAL_STORAGE_TYPES[MORNING_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[MORNING_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[AFTERNOON_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[AFTERNOON_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[MINIMUM_BEGINNING_WORKING_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[MINIMUM_BEGINNING_WORKING_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[MINIMUM_LEAVING_WORKING_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[MINIMUM_LEAVING_WORKING_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[MAXIMUM_LEAVING_WORKING_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[MAXIMUM_LEAVING_WORKING_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[MINIMUM_LUNCH_BREAK_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[MINIMUM_LUNCH_BREAK_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[MORNING_BREAK_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[MORNING_BREAK_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[AFTERNOON_BREAK_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[AFTERNOON_BREAK_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_BEGINNING_WORKING_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_BEGINNING_WORKING_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_BEGINNING_LUNCH_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_BEGINNING_LUNCH_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_ENDING_LUNCH_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_ENDING_LUNCH_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_ENDING_WORKING_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_ENDING_WORKING_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_LUNCH_BREAK_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[RECOMMENDED_LUNCH_BREAK_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[LOWEST_TOTAL_EXTRA_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[LOWEST_TOTAL_EXTRA_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[HIGHEST_WEEKLY_EXTRA_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[HIGHEST_WEEKLY_EXTRA_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[HIGHEST_TOTAL_EXTRA_HOURS_KEY] = 'number'
LOCAL_STORAGE_TYPES[HIGHEST_TOTAL_EXTRA_MINUTES_KEY] = 'number'
LOCAL_STORAGE_TYPES[IS_OVERTIME_COMPENSATION_KEY] = 'boolean'
LOCAL_STORAGE_TYPES[ARE_DAYS_OFF_KEY] = 'boolean'
LOCAL_STORAGE_TYPES[IS_UNPAID_TIME_OFF_KEY] = 'boolean'
LOCAL_STORAGE_TYPES[ARE_NATIONAL_HOLIDAYS_KEY] = 'boolean'
LOCAL_STORAGE_TYPES[ARE_SICK_DAYS_KEY] = 'boolean'
LOCAL_STORAGE_TYPES[IS_OCCASIONAL_REMOTE_WORK_KEY] = 'boolean'

// Version.
const LAST_VERSION_KEY = 'last-version'
const VERSION_LABEL_DEV = 'master'
const VERSION_LABEL_BETA = 'beta'
const VERSION_LABEL_RELEASE = 'release'
const CURRENT_BRANCH = GM_info.script.updateURL.match('https://raw.githubusercontent.com/m4jr0/adp-enhanced/(.+?)/src/adp_enhanced.user.js')[1]
let CURRENT_VERSION

if (CURRENT_BRANCH === VERSION_LABEL_DEV) {
  CURRENT_VERSION = 'dev'
} else if (CURRENT_BRANCH === VERSION_LABEL_BETA) {
  CURRENT_VERSION = 'beta'
} else if (CURRENT_BRANCH === VERSION_LABEL_RELEASE) {
  CURRENT_VERSION = 'release'
} else {
  CURRENT_VERSION = 'unknown'
}

let ADP_APP_NAME = GM_info.script.name
let ADP_ENHANCED_VERSION = GM_info.script.version

if (CURRENT_VERSION !== VERSION_LABEL_RELEASE) {
  ADP_APP_NAME += ` [${CURRENT_VERSION.toUpperCase()}]`
  ADP_ENHANCED_VERSION += `-${CURRENT_VERSION}`
}

// Welcome Box.
const WELCOME_BOX_CONTAINER_ID = 'welcome-box-container'
const WELCOME_BOX_ID = 'welcome-box'
const WELCOME_BOX_ACCEPT_BUTTON_ID = 'welcome-box-accept-button'

// Pictures.
const ADP_ENHANCED_LOGO_URL = `https://raw.githubusercontent.com/m4jr0/adp-enhanced/${CURRENT_BRANCH}/assets/logo.png`
const NOTIFICATION_ICON = `https://raw.githubusercontent.com/m4jr0/adp-enhanced/${CURRENT_BRANCH}/assets/notification_icon.png`

// Various.
const HEIGHT_MARGIN = 100
const ADD_WORKED_HOURS_TIMEOUT = 400
const REFRESH_PAGE_CHECKBOX_DEFAULT_VALUE = false
const REFRESH_PAGE_DEFAULT_TIME_VALUE = 60
const GLOBAL_COUNTER_CHECKBOX_DEFAULT_VALUE = false
const END_NOTIFICATION_CHECKBOX_DEFAULT_VALUE = false
const COUNTER_SIZE_CSS = '1.4em'
const ORIGINAL_COLOR_HOURS_CSS = 'black'
const MODIFIED_COLOR_HOURS_CSS = 'blue'
const OVERTIME_COMPENSATION_TAG = 'RV'
const DAYS_OFF_TAG = 'CP'
const UNPAID_TIME_OFF_TAG = 'CS'
const NATIONAL_HOLIDAY_TAG = 'JF'
const SICK_DAYS_TAG = 'MA'
const OCCASIONAL_REMOTE_WORK_TAG = 'EF'
const HOUR_ELEMENT_EMPTY_DEFAULT_VALUE = '&nbsp;'
const HOUR_ELEMENT_EMPTY_VALUES = [
  HOUR_ELEMENT_EMPTY_DEFAULT_VALUE,
  null,
  undefined,
  ''
]
const DEFAULT_VALUE_STYLE = {
  'font-size': COUNTER_SIZE_CSS,
  'user-select': 'all'
}

let isFirstTimeLoading = true
let isRefreshPage = REFRESH_PAGE_CHECKBOX_DEFAULT_VALUE
let isOptionInput = false
let refreshRate = REFRESH_PAGE_DEFAULT_TIME_VALUE
let isGlobalCounterIncluded = GLOBAL_COUNTER_CHECKBOX_DEFAULT_VALUE
let areEndNotifications = END_NOTIFICATION_CHECKBOX_DEFAULT_VALUE
let datesContainerHeight = 0
const dailyWorkedTime = {}
let currentMondayObj = getMondayTimeObjOfCurrentAdpWeek()
let currentFridayObj = getFridayTimeObjOfCurrentAdpWeek()
let hoursInputBaseValue = null
let extraHoursAdded = 0
let isAdvancedSettingsPanelVisible = false

let globalCounterHours = 0
let globalCounterMinutes = 0
let globalCounterTime = convertToSeconds({
  hours: globalCounterHours, minutes: globalCounterMinutes
})

let overtimeCompensationTimes = {}
let overtimeCompensationHours = 0
let overtimeCompensationMinutes = 0
let overtimeCompensationTime = convertToSeconds({
  hours: overtimeCompensationHours, minutes: overtimeCompensationMinutes
})

const notificationWorker = getEndNotificationWorker()

// String.
const WEEK_PRESENT = 'present'
const WEEK_PAST = 'past'
const WEEK_FUTURE = 'future'

// Debug mode.
const DEBUG_DEBUG_PANEL_SHORTCUT = ['d', 'm']
const DEBUG_DEBUG_PANEL_SHORTCUT_TIMEOUT = 1000

const DEBUG_EXTRA_HOURS_REGEX =
  /^(?<sign>\+|-)?(?<hours>\d{1,2})?(h|:)?(?<minutes>\d{1,2})?(m|:)?$/

const DEBUG_IS_DEBUG_PANEL_VISIBLE_DEFAULT_VALUE = false
const DEBUG_IS_DEBUG_MODE_DEFAULT_VALUE = false
const DEBUG_NOW_DEFAULT_VALUE = new Date()
const DEBUG_WEEK_LABEL_DEFAULT_VALUE = WEEK_PRESENT
const DEBUG_EXTRA_HOURS_HOURS_DEFAULT_VALUE = 0
const DEBUG_EXTRA_HOURS_MINUTES_DEFAULT_VALUE = 0
const DEBUG_EXTRA_HOURS_SIGN_DEFAULT_VALUE = 1
const DEBUG_GENERATED_HOURS_DEFAULT_VALUE = null
const DEBUG_ACTUAL_HOURS_DEFAULT_VALUE = {}

const DEBUG_MODE_CONTAINER_ID = 'debug-mode-container'
const DEBUG_NOW_IS_DEBUG_CHECKBOX_ID = 'debug-now-is-debug'
const DEBUG_NOW_IS_DEBUG_CHECKBOX_NAME = DEBUG_NOW_IS_DEBUG_CHECKBOX_ID
const DEBUG_NOW_DATE_PICKER_ID = 'debug-now-date-picker'
const DEBUG_NOW_DATE_PICKER_NAME = DEBUG_NOW_DATE_PICKER_ID
const DEBUG_WEEK_LABEL_SELECT_ID = 'debug-week-label-select'
const DEBUG_WEEK_LABEL_SELECT_NAME = DEBUG_WEEK_LABEL_SELECT_ID
const DEBUG_EXTRA_HOURS_INPUT_ID = 'debug-extra-hours-input'
const DEBUG_EXTRA_HOURS_INPUT_NAME = DEBUG_EXTRA_HOURS_INPUT_ID
const DEBUG_GENERATE_HOURS_BUTTON_ID = 'debug-generate-hours-button'
const DEBUG_SAVE_HOURS_BUTTON_ID = 'debug-save-hours-button'
const DEBUG_RESTORE_HOURS_BUTTON_ID = 'debug-restore-hours-button'
const DEBUG_DELETE_HOURS_BUTTON_ID = 'debug-delete-hours-button'
const DEBUG_RESTORE_ACTUAL_HOURS_BUTTON_ID = 'debug-restore-actual-hours-button'

// Advanced settings.
const ADVANCED_SETTINGS_CONTAINER_ID = 'advanced-settings-container'
const ADVANCED_SETTINGS_MODAL_ID = 'advanced-settings-modal'
const SAVE_ADVANCED_SETTINGS_BUTTON = 'save-advanced-settings-button'
const RESTORE_DEFAULT_ADVANCED_SETTINGS_BUTTON = 'restore-default-advanced-settings-button'
const DEFAULT_IS_OVERTIME_COMPENSATION = true
const DEFAULT_ARE_DAYS_OFF = true
const DEFAULT_IS_UNPAID_TIME_OFF = true
const DEFAULT_ARE_NATIONAL_HOLIDAYS = true
const DEFAULT_ARE_SICK_DAYS = true
const DEFAULT_IS_OCCASIONAL_REMOTE_WORK = true

const isOvertimeCompensation = () => {
  return getSettingsValue(IS_OVERTIME_COMPENSATION_KEY, DEFAULT_IS_OVERTIME_COMPENSATION)
}

const areDaysOff = () => {
  return getSettingsValue(ARE_DAYS_OFF_KEY, DEFAULT_ARE_DAYS_OFF)
}

const isUnpaidTimeOff = () => {
  return getSettingsValue(IS_UNPAID_TIME_OFF_KEY, DEFAULT_IS_UNPAID_TIME_OFF)
}

const areNationalHolidays = () => {
  return getSettingsValue(ARE_NATIONAL_HOLIDAYS_KEY, DEFAULT_ARE_NATIONAL_HOLIDAYS)
}

const areSickDays = () => {
  return getSettingsValue(ARE_SICK_DAYS_KEY, DEFAULT_ARE_SICK_DAYS)
}

const isOccasionalRemoteWork = () => {
  return getSettingsValue(IS_OCCASIONAL_REMOTE_WORK_KEY, DEFAULT_IS_OCCASIONAL_REMOTE_WORK)
}

// Misc.
const now = getNow()
const ARE_COVID_HOURS_1 = now >= new Date(2021, 6, 21, 0, 0, 0, 0) &&
  now < new Date(2021, 8, 30, 0, 0, 0, 0)
const ARE_COVID_HOURS_2 = now >= new Date(2021, 11, 6, 0, 0, 0, 0)

// REGEX.
const TOKEN_REGEX = /c=[a-z0-9]+/

// local storage values.
const REFRESH_PAGE_CHECKBOX_KEY = 'refresh-page-checkbox-key'
const REFRESH_PAGE_TIME_KEY = 'refresh-page-time-key'
const GLOBAL_COUNTER_CHECKBOX_KEY = 'global-counter-checkbox-key'
const END_NOTIFICATION_CHECKBOX_KEY = 'end-notification-checkbox-key'

LOCAL_STORAGE_TYPES[REFRESH_PAGE_CHECKBOX_KEY] = 'boolean'
LOCAL_STORAGE_TYPES[REFRESH_PAGE_TIME_KEY] = 'number'
LOCAL_STORAGE_TYPES[GLOBAL_COUNTER_CHECKBOX_KEY] = 'boolean'
LOCAL_STORAGE_TYPES[END_NOTIFICATION_CHECKBOX_KEY] = 'boolean'

// HTML IDs.
const LEAVE_TIMES_ID = 'leave-times'
const LEAVE_TIME_ID = 'leave-time'
const LEAVE_TIME_TOTAL_ID = 'leave-time-total'
const DETAILS_ID = 'custom-details'
const DASHBOARD_ID = 'dashboard'
const GLOBAL_COUNTER_ID = 'global-counter'
const OVERTIME_COMPENSATION_ID = 'overtime-compensation'
const DAYS_OFF_HOURS_ID = 'days-off-hours'
const NATIONAL_HOLIDAY_HOURS_ID = 'national-holiday-hours'
const EXTRA_HOURS_BEGINNING_WEEK_ID = 'extra-hours-beginning-week'
const EXTRA_HOURS_END_WEEK_ID = 'extra-hours-end-week'
const EXTRA_HOURS_END_WEEK_ESTIMATED_ID = 'extra-hours-end-estimated-week'
const DAY_DELTA_ID = 'day-delta'
const WEEK_DELTA_ID = 'week-delta'
const REFRESH_PAGE_CONTAINER_ID = 'refresh-page-container'
const REFRESH_PAGE_CHECKBOX_ID = 'refresh-page-checkbox'
const REFRESH_PAGE_TIME_ID = 'refresh-page-time'
const GLOBAL_COUNTER_CHECKBOX_ID = 'global-counter-checkbox'
const END_NOTIFICATION_CHECKBOX_ID = 'end-notification-checkbox'
const HOURS_INPUT_CLASS_NAME = 'hours-input-element'
const IS_OVERTIME_COMPENSATION_CHECKBOX_ID = 'is-overtime-compensation-checkbox'
const ARE_DAYS_OFF_CHECKBOX_ID = 'are-days-off-checkbox'
const IS_UNPAID_TIME_OFF_CHECKBOX_ID = 'is-unpaid-time-off-checkbox'
const ARE_NATIONAL_HOLIDAY_CHECKBOX_ID = 'are-national-holiday-checkbox'
const ARE_SICK_DAYS_CHECKBOX_ID = 'are-sick-days-checkbox'
const IS_OCCASIONAL_REMOTE_WORK_CHECKBOX_ID = 'is-occasional-remote-work-checkbox'
const MORNING_HOURS_INPUT_NAME = 'morning-hours-input'
const MORNING_HOURS_INPUT_ID = MORNING_HOURS_INPUT_NAME
const MORNING_MINUTES_INPUT_NAME = 'morning-minutes-input'
const MORNING_MINUTES_INPUT_ID = MORNING_MINUTES_INPUT_NAME
const AFTERNOON_HOURS_INPUT_NAME = 'afternoon-hours-input'
const AFTERNOON_HOURS_INPUT_ID = AFTERNOON_HOURS_INPUT_NAME
const AFTERNOON_MINUTES_INPUT_NAME = 'afternoon-minutes-input'
const AFTERNOON_MINUTES_INPUT_ID = AFTERNOON_MINUTES_INPUT_NAME
const MINIMUM_BEGINNING_WORKING_HOURS_INPUT_NAME = 'minimum-beginning-working-hours-input'
const MINIMUM_BEGINNING_WORKING_HOURS_INPUT_ID = MINIMUM_BEGINNING_WORKING_HOURS_INPUT_NAME
const MINIMUM_BEGINNING_WORKING_MINUTES_INPUT_NAME = 'minimum-beginning-working-minutes-input'
const MINIMUM_BEGINNING_WORKING_MINUTES_INPUT_ID = MINIMUM_BEGINNING_WORKING_MINUTES_INPUT_NAME
const MINIMUM_LEAVING_WORKING_HOURS_INPUT_NAME = 'minimum-leaving-working-hours-input'
const MINIMUM_LEAVING_WORKING_HOURS_INPUT_ID = MINIMUM_LEAVING_WORKING_HOURS_INPUT_NAME
const MINIMUM_LEAVING_WORKING_MINUTES_INPUT_NAME = 'minimum-leaving-working-minutes-input'
const MINIMUM_LEAVING_WORKING_MINUTES_INPUT_ID = MINIMUM_LEAVING_WORKING_MINUTES_INPUT_NAME
const MAXIMUM_LEAVING_WORKING_HOURS_INPUT_NAME = 'maximum-working-hours-input'
const MAXIMUM_LEAVING_WORKING_HOURS_INPUT_ID = MAXIMUM_LEAVING_WORKING_HOURS_INPUT_NAME
const MAXIMUM_LEAVING_WORKING_MINUTES_INPUT_NAME = 'maximum-working-minutes-input'
const MAXIMUM_LEAVING_WORKING_MINUTES_INPUT_ID = MAXIMUM_LEAVING_WORKING_MINUTES_INPUT_NAME
const MINIMUM_LUNCH_BREAK_HOURS_INPUT_NAME = 'minimum-lunch-break-hours-input'
const MINIMUM_LUNCH_BREAK_HOURS_INPUT_ID = MINIMUM_LUNCH_BREAK_HOURS_INPUT_NAME
const MINIMUM_LUNCH_BREAK_MINUTES_INPUT_NAME = 'minimum-lunch-break-minutes-input'
const MINIMUM_LUNCH_BREAK_MINUTES_INPUT_ID = MINIMUM_LUNCH_BREAK_MINUTES_INPUT_NAME
const MORNING_BREAK_HOURS_INPUT_NAME = 'morning-break-hours-input'
const MORNING_BREAK_HOURS_INPUT_ID = MORNING_BREAK_HOURS_INPUT_NAME
const MORNING_BREAK_MINUTES_INPUT_NAME = 'morning-break-minutes-input'
const MORNING_BREAK_MINUTES_INPUT_ID = MORNING_BREAK_MINUTES_INPUT_NAME
const AFTERNOON_BREAK_HOURS_INPUT_NAME = 'afternoon-break-hours-input'
const AFTERNOON_BREAK_HOURS_INPUT_ID = AFTERNOON_BREAK_HOURS_INPUT_NAME
const AFTERNOON_BREAK_MINUTES_INPUT_NAME = 'afternoon-break-minutes-input'
const AFTERNOON_BREAK_MINUTES_INPUT_ID = AFTERNOON_BREAK_MINUTES_INPUT_NAME
const RECOMMENDED_BEGINNING_WORKING_HOURS_INPUT_NAME = 'recommended-beginning-working-hours-input'
const RECOMMENDED_BEGINNING_WORKING_HOURS_INPUT_ID = RECOMMENDED_BEGINNING_WORKING_HOURS_INPUT_NAME
const RECOMMENDED_BEGINNING_WORKING_MINUTES_INPUT_NAME = 'recommended-beginning-working-minutes-input'
const RECOMMENDED_BEGINNING_WORKING_MINUTES_INPUT_ID = RECOMMENDED_BEGINNING_WORKING_MINUTES_INPUT_NAME
const RECOMMENDED_BEGINNING_LUNCH_HOURS_INPUT_NAME = 'recommended-beginning-lunch-hours-input'
const RECOMMENDED_BEGINNING_LUNCH_HOURS_INPUT_ID = RECOMMENDED_BEGINNING_LUNCH_HOURS_INPUT_NAME
const RECOMMENDED_BEGINNING_LUNCH_MINUTES_INPUT_NAME = 'recommended-beginning-lunch-minutes-input'
const RECOMMENDED_BEGINNING_LUNCH_MINUTES_INPUT_ID = RECOMMENDED_BEGINNING_LUNCH_MINUTES_INPUT_NAME
const RECOMMENDED_ENDING_LUNCH_HOURS_INPUT_NAME = 'recommended-ending-lunch-hours-input'
const RECOMMENDED_ENDING_LUNCH_HOURS_INPUT_ID = RECOMMENDED_ENDING_LUNCH_HOURS_INPUT_NAME
const RECOMMENDED_ENDING_LUNCH_MINUTES_INPUT_NAME = 'recommended-ending-lunch-minutes-input'
const RECOMMENDED_ENDING_LUNCH_MINUTES_INPUT_ID = RECOMMENDED_ENDING_LUNCH_MINUTES_INPUT_NAME
const RECOMMENDED_ENDING_WORKING_HOURS_INPUT_NAME = 'recommended-ending-working-hours-input'
const RECOMMENDED_ENDING_WORKING_HOURS_INPUT_ID = RECOMMENDED_ENDING_WORKING_HOURS_INPUT_NAME
const RECOMMENDED_ENDING_WORKING_MINUTES_INPUT_NAME = 'recommended-ending-working-minutes-input'
const RECOMMENDED_ENDING_WORKING_MINUTES_INPUT_ID = RECOMMENDED_ENDING_WORKING_MINUTES_INPUT_NAME
const RECOMMENDED_LUNCH_BREAK_HOURS_INPUT_NAME = 'recommended-lunch-break-hours-input'
const RECOMMENDED_LUNCH_BREAK_HOURS_INPUT_ID = RECOMMENDED_LUNCH_BREAK_HOURS_INPUT_NAME
const RECOMMENDED_LUNCH_BREAK_MINUTES_INPUT_NAME = 'recommended-lunch-break-minutes-input'
const RECOMMENDED_LUNCH_BREAK_MINUTES_INPUT_ID = RECOMMENDED_LUNCH_BREAK_MINUTES_INPUT_NAME
const LOWEST_TOTAL_EXTRA_HOURS_INPUT_NAME = 'lowest-total-extra-hours-input'
const LOWEST_TOTAL_EXTRA_HOURS_INPUT_ID = LOWEST_TOTAL_EXTRA_HOURS_INPUT_NAME
const LOWEST_TOTAL_EXTRA_MINUTES_INPUT_NAME = 'lowest-total-extra-minutes-input'
const LOWEST_TOTAL_EXTRA_MINUTES_INPUT_ID = LOWEST_TOTAL_EXTRA_MINUTES_INPUT_NAME
const HIGHEST_WEEKLY_EXTRA_HOURS_INPUT_NAME = 'highest-weekly-extra-hours-input'
const HIGHEST_WEEKLY_EXTRA_HOURS_INPUT_ID = HIGHEST_WEEKLY_EXTRA_HOURS_INPUT_NAME
const HIGHEST_WEEKLY_EXTRA_MINUTES_INPUT_NAME = 'highest-weekly-extra-minutes-input'
const HIGHEST_WEEKLY_EXTRA_MINUTES_INPUT_ID = HIGHEST_WEEKLY_EXTRA_MINUTES_INPUT_NAME
const HIGHEST_TOTAL_EXTRA_HOURS_INPUT_NAME = 'highest-total-extra-hours-input'
const HIGHEST_TOTAL_EXTRA_HOURS_INPUT_ID = HIGHEST_TOTAL_EXTRA_HOURS_INPUT_NAME
const HIGHEST_TOTAL_EXTRA_MINUTES_INPUT_NAME = 'highest-total-extra-minutes-input'
const HIGHEST_TOTAL_EXTRA_MINUTES_INPUT_ID = HIGHEST_TOTAL_EXTRA_MINUTES_INPUT_NAME

// Messages.
const ERROR_GLOBAL_COUNTER = 'Impossible de récupérer les heures ' +
  'supplémentaires. Elles sont donc mises à zéro.'

const ERROR_OVERTIME_COMPENSATION = 'Impossible de récupérer les heures ' +
  'de récupération variables. Elles sont donc mises à zéro.'

// HTML names.
const REFRESH_PAGE_CHECKBOX_NAME = REFRESH_PAGE_CHECKBOX_ID
const REFRESH_PAGE_TIME_NAME = REFRESH_PAGE_TIME_ID
const GLOBAL_COUNTER_CHECKBOX_NAME = GLOBAL_COUNTER_CHECKBOX_ID
const END_NOTIFICATION_CHECKBOX_NAME = END_NOTIFICATION_CHECKBOX_ID
const OVERTIME_COMPENSATION_CHECKBOX_NAME = IS_OVERTIME_COMPENSATION_CHECKBOX_ID
const DAYS_OFF_CHECKBOX_NAME = ARE_DAYS_OFF_CHECKBOX_ID
const UNPAID_TIME_OFF_CHECKBOX_NAME = IS_UNPAID_TIME_OFF_CHECKBOX_ID
const NATIONAL_HOLIDAY_CHECKBOX_NAME = ARE_NATIONAL_HOLIDAY_CHECKBOX_ID
const SICK_DAYS_CHECKBOX_NAME = ARE_SICK_DAYS_CHECKBOX_ID
const OCCASIONAL_REMOTE_WORK_CHECKBOX_NAME = IS_OCCASIONAL_REMOTE_WORK_CHECKBOX_ID

// CSS.
const NEGATIVE_DELTA_COLOR = 'red'
const POSITIVE_DELTA_COLOR = 'green'

// Time constants and variables.
const DAYS_TO_COUNT = 5

const DEFAULT_MORNING_HOURS = 3
const DEFAULT_MORNING_MINUTES = 30
const getMorningTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(MORNING_HOURS_KEY, DEFAULT_MORNING_HOURS),
      minutes: getSettingsValue(MORNING_MINUTES_KEY, DEFAULT_MORNING_MINUTES)
    }
  )
}

const DEFAULT_AFTERNOON_HOURS = 3
const DEFAULT_AFTERNOON_MINUTES = 30
const getAfternoonTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(AFTERNOON_HOURS_KEY, DEFAULT_AFTERNOON_HOURS),
      minutes: getSettingsValue(AFTERNOON_MINUTES_KEY, DEFAULT_AFTERNOON_MINUTES)
    }
  )
}

const DEFAULT_MINIMUM_BEGINNING_WORKING_HOURS = ARE_COVID_HOURS_1 || ARE_COVID_HOURS_2 ? 7 : 8
const DEFAULT_MINIMUM_BEGINNING_WORKING_MINUTES = ARE_COVID_HOURS_1 || ARE_COVID_HOURS_2 ? 30 : 0
const getMinimumBeginningWorkingTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(MINIMUM_BEGINNING_WORKING_HOURS_KEY, DEFAULT_MINIMUM_BEGINNING_WORKING_HOURS),
      minutes: getSettingsValue(MINIMUM_BEGINNING_WORKING_MINUTES_KEY, DEFAULT_MINIMUM_BEGINNING_WORKING_MINUTES)
    }
  )
}

const DEFAULT_MINIMUM_LEAVING_WORKING_HOURS = ARE_COVID_HOURS_1 || ARE_COVID_HOURS_2 ? 16 : 17
const DEFAULT_MINIMUM_LEAVING_WORKING_MINUTES = 0
const getMinimumLeavingWorkingTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(MINIMUM_LEAVING_WORKING_HOURS_KEY, DEFAULT_MINIMUM_LEAVING_WORKING_HOURS),
      minutes: getSettingsValue(MINIMUM_LEAVING_WORKING_MINUTES_KEY, DEFAULT_MINIMUM_LEAVING_WORKING_MINUTES)
    }
  )
}

const DEFAULT_MAXIMUM_LEAVING_WORKING_HOURS = ARE_COVID_HOURS_1 || ARE_COVID_HOURS_2 ? 20 : 19
const DEFAULT_MAXIMUM_LEAVING_WORKING_MINUTES = 0
const getMaximumLeavingWorkingTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(MAXIMUM_LEAVING_WORKING_HOURS_KEY, DEFAULT_MAXIMUM_LEAVING_WORKING_HOURS),
      minutes: getSettingsValue(MAXIMUM_LEAVING_WORKING_MINUTES_KEY, DEFAULT_MAXIMUM_LEAVING_WORKING_MINUTES)
    }
  )
}

const DEFAULT_MINIMUM_LUNCH_BREAK_HOURS = ARE_COVID_HOURS_2 ? 0 : 1
const DEFAULT_MINIMUM_LUNCH_BREAK_MINUTES = ARE_COVID_HOURS_2 ? 30 : 0
const getMinimumLunchBreakTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(MINIMUM_LUNCH_BREAK_HOURS_KEY, DEFAULT_MINIMUM_LUNCH_BREAK_HOURS),
      minutes: getSettingsValue(MINIMUM_LUNCH_BREAK_MINUTES_KEY, DEFAULT_MINIMUM_LUNCH_BREAK_MINUTES)
    }
  )
}

const DEFAULT_MORNING_BREAK_HOURS = 0
const DEFAULT_MORNING_BREAK_MINUTES = 15
const getMorningBreakTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(MORNING_BREAK_HOURS_KEY, DEFAULT_MORNING_BREAK_HOURS),
      minutes: getSettingsValue(MORNING_BREAK_MINUTES_KEY, DEFAULT_MORNING_BREAK_MINUTES)
    }
  )
}

const DEFAULT_AFTERNOON_BREAK_HOURS = 0
const DEFAULT_AFTERNOON_BREAK_MINUTES = 15
const getAfternoonBreakTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(AFTERNOON_BREAK_HOURS_KEY, DEFAULT_AFTERNOON_BREAK_HOURS),
      minutes: getSettingsValue(AFTERNOON_BREAK_MINUTES_KEY, DEFAULT_AFTERNOON_BREAK_MINUTES)
    }
  )
}

const getDailyRequiredHours = () => {
  return getSettingsValue(MORNING_HOURS_KEY, DEFAULT_MORNING_HOURS) + getSettingsValue(AFTERNOON_HOURS_KEY, DEFAULT_AFTERNOON_HOURS)
}

const getDailyRequiredMinutes = () => {
  return getSettingsValue(MORNING_MINUTES_KEY, DEFAULT_MORNING_MINUTES) + getSettingsValue(AFTERNOON_MINUTES_KEY, DEFAULT_AFTERNOON_MINUTES)
}

const getDailyRequiredTime = () => {
  return convertToSeconds(
    {
      hours: getDailyRequiredHours(),
      minutes: getDailyRequiredMinutes()
    }
  )
}

const getWeeklyRequiredHours = () => {
  return getDailyRequiredHours() * DAYS_TO_COUNT
}

const getWeeklyRequiredMinutes = () => {
  return getDailyRequiredMinutes() * DAYS_TO_COUNT
}

const getWeeklyRequiredTime = () => {
  return convertToSeconds(
    {
      hours: getWeeklyRequiredHours(),
      minutes: getWeeklyRequiredMinutes()
    }
  )
}

const DEFAULT_RECOMMENDED_BEGINNING_WORKING_HOURS = 9
const DEFAULT_RECOMMENDED_BEGINNING_WORKING_MINUTES = 0
const getRecommendedBeginningWorkingTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(RECOMMENDED_BEGINNING_WORKING_HOURS_KEY, DEFAULT_RECOMMENDED_BEGINNING_WORKING_HOURS),
      minutes: getSettingsValue(RECOMMENDED_BEGINNING_WORKING_MINUTES_KEY, DEFAULT_RECOMMENDED_BEGINNING_WORKING_MINUTES)
    }
  )
}

const DEFAULT_RECOMMENDED_BEGINNING_LUNCH_HOURS = 12
const DEFAULT_RECOMMENDED_BEGINNING_LUNCH_MINUTES = 30
const getRecommendedBeginningLunchTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(RECOMMENDED_BEGINNING_LUNCH_HOURS_KEY, DEFAULT_RECOMMENDED_BEGINNING_LUNCH_HOURS),
      minutes: getSettingsValue(RECOMMENDED_BEGINNING_LUNCH_MINUTES_KEY, DEFAULT_RECOMMENDED_BEGINNING_LUNCH_MINUTES)
    }
  )
}

const DEFAULT_RECOMMENDED_ENDING_LUNCH_HOURS = 14
const DEFAULT_RECOMMENDED_ENDING_LUNCH_MINUTES = 0
const getRecommendedEndingLunchTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(RECOMMENDED_ENDING_LUNCH_HOURS_KEY, DEFAULT_RECOMMENDED_ENDING_LUNCH_HOURS),
      minutes: getSettingsValue(RECOMMENDED_ENDING_LUNCH_MINUTES_KEY, DEFAULT_RECOMMENDED_ENDING_LUNCH_MINUTES)
    }
  )
}

const DEFAULT_RECOMMENDED_ENDING_WORKING_HOURS = 18
const DEFAULT_RECOMMENDED_ENDING_WORKING_MINUTES = 0
const getRecommendedEndingWorkingTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(RECOMMENDED_ENDING_WORKING_HOURS_KEY, DEFAULT_RECOMMENDED_ENDING_WORKING_HOURS),
      minutes: getSettingsValue(RECOMMENDED_ENDING_WORKING_MINUTES_KEY, DEFAULT_RECOMMENDED_ENDING_WORKING_MINUTES)
    }
  )
}

const DEFAULT_RECOMMENDED_LUNCH_BREAK_HOURS = 1
const DEFAULT_RECOMMENDED_LUNCH_BREAK_MINUTES = 30
const getRecommendedLunchBreakTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(RECOMMENDED_LUNCH_BREAK_HOURS_KEY, DEFAULT_RECOMMENDED_LUNCH_BREAK_HOURS),
      minutes: getSettingsValue(RECOMMENDED_LUNCH_BREAK_MINUTES_KEY, DEFAULT_RECOMMENDED_LUNCH_BREAK_MINUTES)
    }
  )
}

const getWeekHours = () => {
  return DAYS_TO_COUNT * getDailyRequiredHours()
}

const getWeekMinutes = () => {
  return DAYS_TO_COUNT * getDailyRequiredMinutes()
}

const getWeekTime = () => {
  return convertToSeconds(
    {
      hours: getWeekHours(),
      minutes: getWeekMinutes()
    }
  )
}

const DEFAULT_LOWEST_TOTAL_EXTRA_HOURS = -3
const DEFAULT_LOWEST_TOTAL_EXTRA_MINUTES = 0
const getLowestExtraTotalTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(LOWEST_TOTAL_EXTRA_HOURS_KEY, DEFAULT_LOWEST_TOTAL_EXTRA_HOURS),
      minutes: getSettingsValue(LOWEST_TOTAL_EXTRA_MINUTES_KEY, DEFAULT_LOWEST_TOTAL_EXTRA_MINUTES)
    }
  )
}

const DEFAULT_HIGHEST_WEEKLY_EXTRA_HOURS = 3
const DEFAULT_HIGHEST_WEEKLY_EXTRA_MINUTES = 0
const getHighestWeeklyExtraTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(HIGHEST_WEEKLY_EXTRA_HOURS_KEY, DEFAULT_HIGHEST_WEEKLY_EXTRA_HOURS),
      minutes: getSettingsValue(HIGHEST_WEEKLY_EXTRA_MINUTES_KEY, DEFAULT_HIGHEST_WEEKLY_EXTRA_MINUTES)
    }
  )
}

const DEFAULT_HIGHEST_TOTAL_EXTRA_HOURS = 10
const DEFAULT_HIGHEST_TOTAL_EXTRA_MINUTES = 0
const getHighestMonthlyExtraTime = () => {
  return convertToSeconds(
    {
      hours: getSettingsValue(HIGHEST_TOTAL_EXTRA_HOURS_KEY, DEFAULT_HIGHEST_TOTAL_EXTRA_HOURS),
      minutes: getSettingsValue(HIGHEST_TOTAL_EXTRA_MINUTES_KEY, DEFAULT_HIGHEST_TOTAL_EXTRA_MINUTES)
    }
  )
}

const ADVANCED_SETTINGS_KEYS = [
  MORNING_HOURS_KEY,
  MORNING_MINUTES_KEY,
  AFTERNOON_HOURS_KEY,
  AFTERNOON_MINUTES_KEY,
  MINIMUM_BEGINNING_WORKING_HOURS_KEY,
  MINIMUM_BEGINNING_WORKING_MINUTES_KEY,
  MINIMUM_LEAVING_WORKING_HOURS_KEY,
  MINIMUM_LEAVING_WORKING_MINUTES_KEY,
  MAXIMUM_LEAVING_WORKING_HOURS_KEY,
  MAXIMUM_LEAVING_WORKING_MINUTES_KEY,
  MINIMUM_LUNCH_BREAK_HOURS_KEY,
  MINIMUM_LUNCH_BREAK_MINUTES_KEY,
  MORNING_BREAK_HOURS_KEY,
  MORNING_BREAK_MINUTES_KEY,
  AFTERNOON_BREAK_HOURS_KEY,
  AFTERNOON_BREAK_MINUTES_KEY,
  RECOMMENDED_BEGINNING_WORKING_HOURS_KEY,
  RECOMMENDED_BEGINNING_WORKING_MINUTES_KEY,
  RECOMMENDED_BEGINNING_LUNCH_HOURS_KEY,
  RECOMMENDED_BEGINNING_LUNCH_MINUTES_KEY,
  RECOMMENDED_ENDING_LUNCH_HOURS_KEY,
  RECOMMENDED_ENDING_LUNCH_MINUTES_KEY,
  RECOMMENDED_ENDING_WORKING_HOURS_KEY,
  RECOMMENDED_ENDING_WORKING_MINUTES_KEY,
  RECOMMENDED_LUNCH_BREAK_HOURS_KEY,
  RECOMMENDED_LUNCH_BREAK_MINUTES_KEY,
  LOWEST_TOTAL_EXTRA_HOURS_KEY,
  LOWEST_TOTAL_EXTRA_MINUTES_KEY,
  HIGHEST_WEEKLY_EXTRA_HOURS_KEY,
  HIGHEST_WEEKLY_EXTRA_MINUTES_KEY,
  HIGHEST_TOTAL_EXTRA_HOURS_KEY,
  HIGHEST_TOTAL_EXTRA_MINUTES_KEY,
  IS_OVERTIME_COMPENSATION_KEY,
  ARE_DAYS_OFF_KEY,
  IS_UNPAID_TIME_OFF_KEY,
  ARE_NATIONAL_HOLIDAYS_KEY,
  ARE_SICK_DAYS_KEY,
  IS_OCCASIONAL_REMOTE_WORK_KEY
]

// Save the parameter to the local storage.
function setSettingsValue (key, value) {
  let formattedValue

  switch (LOCAL_STORAGE_TYPES[key]) {
    case 'date':
      formattedValue = value.toISOString()
      break
    default:
      formattedValue = value
      break
  }

  localStorage.setItem(key, formattedValue)
}

// Retrieve a parameter from the local storage.
function getSettingsValue (key, defaultValue) {
  const value = localStorage.getItem(key)

  if (value === null) return defaultValue

  switch (LOCAL_STORAGE_TYPES[key]) {
    case 'string':
      return value
    case 'boolean':
      return value === 'true'
    case 'number':
      return parseFloat(value)
    case 'date':
      return new Date(value)
    default:
      return value
  }
}

// Remove the parameter from the local storage.
function removeSettingsValue (key) {
  localStorage.removeItem(key)
}

// Reset the advanced settings to their default values.
function resetAdvancedSettings () {
  for (const key of ADVANCED_SETTINGS_KEYS) {
    removeSettingsValue(key)
  }
}

// Save the advanced settings.
function saveAdvancedSettings () {
  for (const key of ADVANCED_SETTINGS_KEYS) {
    let input = document.getElementById(`${key.slice(0, -4)}-input`)

    if (input === null) {
      input = document.getElementById(`${key.slice(0, -4)}-checkbox`)
    }

    if (input.type === 'checkbox') {
      setSettingsValue(key, input.checked)
      continue
    }

    setSettingsValue(key, input.value)
  }
}

// Get the Monday time object of the current ADP week as an object containing
// the year, month and day.
function getMondayTimeObjOfCurrentAdpWeek () {
  const firstWeekDateArray =
    document.getElementById('dat_deb_fin').innerHTML.split(' ')[1].split('/')
  const calendarYear = parseInt(firstWeekDateArray[2])
  const calendarMonth = parseInt(firstWeekDateArray[1])
  const calendarMondayDay = parseInt(firstWeekDateArray[0])

  return {
    year: calendarYear,
    month: calendarMonth,
    day: calendarMondayDay
  }
}

// Get the Monday time of the current ADP week as a Date object.
function getMondayTimeOfCurrentAdpWeek () {
  const mondayTimeObj = getMondayTimeObjOfCurrentAdpWeek()

  return new Date(
    mondayTimeObj.year, mondayTimeObj.month - 1, mondayTimeObj.day, 0, 0, 0
  )
}

// Get the Friday time object of the current ADP week as an object containing
// the year, month and day.
function getFridayTimeObjOfCurrentAdpWeek () {
  const fridayTime = getFridayTimeOfCurrentAdpWeek()

  return {
    year: fridayTime.getFullYear(),
    month: fridayTime.getMonth() + 1,
    day: fridayTime.getDate()
  }
}

// Get the Friday time of the current ADP week as a Date object.
function getFridayTimeOfCurrentAdpWeek () {
  const mondayTime = getMondayTimeOfCurrentAdpWeek()
  let fridayTime = mondayTime
  fridayTime = new Date(fridayTime.setDate(mondayTime.getDate() + 4))

  return new Date(
    fridayTime.getFullYear(),
    fridayTime.getMonth(),
    fridayTime.getDate(),
    0,
    0,
    0
  )
}

// Return the overtime compensation for a given day.
function getOvertimeCompensation (dayNumber) {
  if (!isOvertimeCompensation()) {
    return 0
  }

  if (dayNumber in overtimeCompensationTimes) {
    return overtimeCompensationTimes[dayNumber]
  }

  return 0
}

// Get the daytime of the current ADP week as a Date object.
function getDaytimeOfCurrentAdpWeek (dayNumber) {
  const mondayTime = getMondayTimeOfCurrentAdpWeek()

  if (dayNumber === 0) {
    return mondayTime
  }

  let day = getMondayTimeOfCurrentAdpWeek()
  day = new Date(day.setDate(day.getDate() - (day.getDay() - 1) + dayNumber))

  return day
}

// "Improve" the page design.
function setEnhancedDesign () {
  const logoImg =
    document.getElementsByClassName('revitMastheadLogo')[0].children[0]
  logoImg.src = ADP_ENHANCED_LOGO_URL
  logoImg.alt = `Logo ${ADP_APP_NAME}`
  logoImg.title = ADP_APP_NAME

  const versionNumberElement = document.createElement('div')
  versionNumberElement.innerHTML =
    `<span style="position: absolute; top: 33px; left: -25px; user-select: none; color: black; font-weight: bold; width: 175px; text-align: right;" title="${ADP_ENHANCED_VERSION}">${ADP_ENHANCED_VERSION}</span>`

  document.getElementsByClassName('revitMastheadLogo')[0].appendChild(versionNumberElement)
  document.title = `Temps et Activités [${ADP_APP_NAME}]`
}

// Get the hours table element.
function getTimeTableElement () {
  return document.getElementsByClassName('declaration')[0]
    .children[1].children[1]
}

// Get a time delta object, given a day.
function getTimeDeltaObj (day) {
  const timesElements =
    getTimeTableElement().children[day].children[0].children[0]

  const morningFirstTimeList =
    timesElements.children[0].children[0].innerHTML.trim().split(':')
  const morningLastTimeList =
    timesElements.children[0].children[2].innerHTML.trim().split(':')
  const afternoonFirstTimeList =
    timesElements.children[1].children[0].innerHTML.trim().split(':')
  const afternoonLastTimeList =
    timesElements.children[1].children[2].innerHTML.trim().split(':')

  let morningDelta = null
  let afternoonDelta = null

  // We can just get the current date regardless of the day,
  // as we only use the hours and minutes.
  const currentDate = getNow()
  const currentDay = getCurrentDayNumber()

  if (day !== currentDay) {
    if (morningFirstTimeList.length < 2 &&
      morningLastTimeList.length < 2 &&
      morningLastTimeList.length < 2 &&
      morningLastTimeList.length < 2) {
      return {
        morning: 0,
        afternoon: 0
      }
    }
  }

  let firstTimeMorningHours = 0
  let lastTimeMorningHours = 0
  let firstTimeMorningMinutes = 0
  let lastTimeMorningMinutes = 0
  let lastTimeMorningTotalSeconds = 0

  if (morningFirstTimeList.length > 0 && morningLastTimeList.length > 0) {
    firstTimeMorningHours = parseInt(morningFirstTimeList[0])
    lastTimeMorningHours = parseInt(morningLastTimeList[0])
    firstTimeMorningMinutes = parseInt(morningFirstTimeList[1])
    lastTimeMorningMinutes = parseInt(morningLastTimeList[1])

    if (isNaN(lastTimeMorningHours)) {
      lastTimeMorningHours = currentDate.getHours()
    }

    if (isNaN(lastTimeMorningMinutes)) {
      lastTimeMorningMinutes = currentDate.getMinutes()
    }

    let firstTimeMorningTotalSeconds = convertToSeconds({
      hours: firstTimeMorningHours,
      minutes: firstTimeMorningMinutes
    })

    lastTimeMorningTotalSeconds = convertToSeconds({
      hours: lastTimeMorningHours,
      minutes: lastTimeMorningMinutes
    })

    if (firstTimeMorningTotalSeconds - getMinimumBeginningWorkingTime() < 0) {
      firstTimeMorningTotalSeconds = getMinimumBeginningWorkingTime()
    }

    morningDelta =
      lastTimeMorningTotalSeconds -
      (firstTimeMorningTotalSeconds + getMorningBreakTime())
  }

  let firstTimeAfternoonTotalSeconds
  let lastTimeAfternoonTotalSeconds

  if (afternoonFirstTimeList.length > 0 && afternoonLastTimeList.length > 0) {
    const firstTimeAfternoonHours = parseInt(afternoonFirstTimeList[0])
    let lastTimeAfternoonHours = parseInt(afternoonLastTimeList[0])
    const firstTimeAfternoonMinutes = parseInt(afternoonFirstTimeList[1])
    let lastTimeAfternoonMinutes = parseInt(afternoonLastTimeList[1])

    if (!isNaN(firstTimeAfternoonHours) && !isNaN(firstTimeAfternoonHours)) {
      if (isNaN(lastTimeAfternoonHours)) {
        lastTimeAfternoonHours = currentDate.getHours()
      }

      if (isNaN(lastTimeAfternoonMinutes)) {
        lastTimeAfternoonMinutes = currentDate.getMinutes()
      }

      firstTimeAfternoonTotalSeconds = convertToSeconds({
        hours: firstTimeAfternoonHours,
        minutes: firstTimeAfternoonMinutes
      })

      lastTimeAfternoonTotalSeconds = convertToSeconds({
        hours: lastTimeAfternoonHours,
        minutes: lastTimeAfternoonMinutes
      })

      const timeAtLunchBreakDelta =
        firstTimeAfternoonTotalSeconds - lastTimeMorningTotalSeconds

      const minimumLunchBreakTime = getMinimumLunchBreakTime()

      if (timeAtLunchBreakDelta < 0 ||
          timeAtLunchBreakDelta < minimumLunchBreakTime) {
        firstTimeAfternoonTotalSeconds = lastTimeMorningTotalSeconds +
          minimumLunchBreakTime
      }

      if (getMaximumLeavingWorkingTime() - lastTimeAfternoonTotalSeconds < 0) {
        lastTimeAfternoonTotalSeconds = getMaximumLeavingWorkingTime()
      }

      afternoonDelta =
        lastTimeAfternoonTotalSeconds -
        (firstTimeAfternoonTotalSeconds + getAfternoonBreakTime())
    }
  }

  return {
    morning: morningDelta,
    afternoon: afternoonDelta
  }
}

// Get the current, actual Monday compared to now.
function getCurrentMonday () {
  const currentDate = getNow()
  currentDate.setHours(0, 0, 0, 0)

  const currentDay = currentDate.getDay()
  let currentMonday

  if (currentDay === 0) {
    currentMonday = currentDate.setDate(currentDate.getDate() - 6)
  } else {
    currentMonday =
      currentDate.setDate(currentDate.getDate() - currentDay + 1)
  }

  const currentMondayDate = new Date(currentMonday)
  currentMondayDate.setHours(0, 0, 0, 0)

  return currentMondayDate
}

// Parse a string and convert it to a time object.
function parseTime (timeString, separator = ':') {
  const timeList = timeString.split(separator)
  const currentHour = parseInt(timeList[0])
  const currentMinute = parseInt(timeList[1])

  return convertToSeconds({
    hours: Math.abs(currentHour),
    minutes: Math.abs(currentMinute),
    isNegative: currentHour < 0 || currentMinute < 0
  })
}

// Convert a time object to seconds.
function convertToSeconds (timeObj) {
  let seconds = 0

  if (timeObj.days) {
    seconds += Math.abs(timeObj.days) * 86400
  }

  if (timeObj.hours) {
    seconds += Math.abs(timeObj.hours) * 3600
  }

  if (timeObj.minutes) {
    seconds += Math.abs(timeObj.minutes) * 60
  }

  if (timeObj.seconds) {
    seconds += Math.abs(timeObj.seconds)
  }

  if (timeObj.isNegative && seconds > 0) {
    seconds *= -1
  }

  return seconds
}

// Convert time to a string.
function convertToTimeString (seconds, separator = ':') {
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const minutes = Math.floor(seconds % 3600 / 60).toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

// Convert time delta to a string.
function convertToTimeDeltaString (
  seconds,
  hoursSeparator = 'h',
  minutesSeparator = 'm'
) {
  const sign = seconds < 0 ? '-' : '+'
  const absSeconds = Math.abs(seconds)
  const hours = Math.floor(absSeconds / 3600).toString().padStart(2, '0')
  const minutes =
    Math.floor(absSeconds % 3600 / 60).toString().padStart(2, '0')

  if (hours <= 0) {
    return `${sign}${minutes}${minutesSeparator}`
  }

  return `${sign}${hours}${hoursSeparator}${minutes}${minutesSeparator}`
}

// Get the current required work time, from the current day.
function getCurrentRequiredWorkTime () {
  const mondayDay = getCurrentMonday().getDate()
  const today = getNow().getDate() + 1
  let requiredTime = 0

  for (let index = mondayDay; index < today; ++index) {
    requiredTime += getMorningTime() + getAfternoonTime()
  }

  return requiredTime
}

function isDebugMode () {
  return getSettingsValue(
    DEBUG_IS_DEBUG_MODE_KEY, DEBUG_IS_DEBUG_MODE_DEFAULT_VALUE
  )
}

// Tell whether we are in the past, future or present.
function getWeekLabel () {
  if (isDebugMode()) {
    return getSettingsValue(
      DEBUG_WEEK_LABEL_KEY, DEBUG_WEEK_LABEL_DEFAULT_VALUE
    )
  }

  const currentMondayDateTime = getCurrentMonday().getTime()
  const calendarMondayDateTime = getMondayTimeOfCurrentAdpWeek().getTime()

  if (calendarMondayDateTime < currentMondayDateTime) return WEEK_PAST
  else if (calendarMondayDateTime > currentMondayDateTime) return WEEK_FUTURE

  const currentDate = getNow()
  const currentDay = currentDate.getDay()

  if (currentDay === 0 || currentDay > 5) return WEEK_PAST

  return WEEK_PRESENT
}

// Get the start morning time.
function getStartMorningTime (day, isParse = true) {
  const time =
    getTimeTableElement().children[day].children[0].children[0]
      .children[0].children[0].innerHTML

  if (HOUR_ELEMENT_EMPTY_VALUES.includes(time)) {
    return null
  } else {
    if (isParse) {
      return parseTime(time)
    } else {
      const values = time.split(':')

      return {
        hours: parseInt(values[0]),
        minutes: parseInt(values[1])
      }
    }
  }
}

// Get the end morning time.
function getEndMorningTime (day, isParse = true) {
  const time =
    getTimeTableElement().children[day].children[0].children[0]
      .children[0].children[2].innerHTML

  if (HOUR_ELEMENT_EMPTY_VALUES.includes(time)) {
    return null
  } else {
    if (isParse) {
      return parseTime(time)
    } else {
      const values = time.split(':')

      return {
        hours: parseInt(values[0]),
        minutes: parseInt(values[1])
      }
    }
  }
}

// Get the start afternoon time.
function getStartAfternoonTime (day, isParse = true) {
  const time =
    getTimeTableElement().children[day].children[0].children[0]
      .children[1].children[0].innerHTML

  if (HOUR_ELEMENT_EMPTY_VALUES.includes(time)) {
    return null
  } else {
    if (isParse) {
      return parseTime(time)
    } else {
      const values = time.split(':')

      return {
        hours: parseInt(values[0]),
        minutes: parseInt(values[1])
      }
    }
  }
}

// Get the end afternoon time.
function getEndAfternoonTime (day, isParse = true) {
  const time =
    getTimeTableElement().children[day].children[0].children[0]
      .children[1].children[2].innerHTML

  if (HOUR_ELEMENT_EMPTY_VALUES.includes(time)) {
    return null
  } else {
    if (isParse) {
      return parseTime(time)
    } else {
      const values = time.split(':')

      return {
        hours: parseInt(values[0]),
        minutes: parseInt(values[1])
      }
    }
  }
}

// Tell whether the morning is finished or not.
function isMorningFinished (day) {
  const endingMorningTime =
    getTimeTableElement().children[day].children[0].children[0]
      .children[0].children[2].innerHTML

  return !HOUR_ELEMENT_EMPTY_VALUES.includes(endingMorningTime)
}

// Tell whether the day is finished or not.
function isDayFinished (day) {
  const endingAfternoonTime =
    getTimeTableElement().children[day].children[0].children[0]
      .children[1].children[2].innerHTML

  return !HOUR_ELEMENT_EMPTY_VALUES.includes(endingAfternoonTime)
}

// Get a graded color, given a percentage.
function getGradedColor (percentage) {
  percentage = Math.min(Math.max(percentage, 0), 100)

  const red = Math.floor((255 * (100 - percentage)) / 100)
  const green = Math.floor((255 * percentage) / 100)
  const blue = 0

  return `rgb(${red}, ${green}, ${blue})`
}

// Reset the hours inputs.
function resetHoursInputs (isForceRefresh = true) {
  const hoursInputs =
    document.getElementsByClassName(HOURS_INPUT_CLASS_NAME)

  for (const hoursInput of hoursInputs) {
    resetHoursInput(hoursInput)
  }

  refreshPage(isForceRefresh)
}

// Handle a click on the window (for hours inputs).
function handleClickOnWindow (event) {
  if (isOptionInput) return

  resetHoursInputs(false)
}

// Get a "normalized" daytime object.
function getNormalizedDaytimeObj (hours, minutes) {
  if (isNaN(hours)) {
    hours = 0
  }

  if (isNaN(minutes)) {
    minutes = 0
  }

  hours +=
    Math.sign(minutes) *
    (Math.floor(Math.abs(minutes) / 60) + (minutes < 0 ? 1 : 0))

  if (hours > 23) {
    hours %= 24
  } else if (hours < 0) {
    hours += ((Math.floor(Math.abs(hours) / 24)) + 1) * 24
  }

  if (minutes > 59) {
    minutes %= 60
  } else if (minutes < 0) {
    minutes += ((Math.floor(Math.abs(minutes) / 60)) + 1) * 60
  }

  return {
    hours: hours,
    minutes: minutes
  }
}

// Get a "normalized" daytime string.
function getNormalizedDaytimeString (hours, minutes) {
  const normalizedDaytimeObj = getNormalizedDaytimeObj(hours, minutes)

  const normalizedHours = (`0${normalizedDaytimeObj.hours}`).slice(-2)
  const normalizedMinutes = (`0${normalizedDaytimeObj.minutes}`).slice(-2)

  return `${normalizedHours}:${normalizedMinutes}`
}

// Tell whether the tag represents a day off or not.
function isDayOffTag (tag) {
  if (tag === DAYS_OFF_TAG && areDaysOff()) {
    return true
  }

  if (tag === UNPAID_TIME_OFF_TAG && isUnpaidTimeOff()) {
    return true
  }

  if (tag === SICK_DAYS_TAG && areSickDays()) {
    return true
  }

  if (tag === OCCASIONAL_REMOTE_WORK_TAG && isOccasionalRemoteWork()) {
    return true
  }

  return false
}

// Tell whether the tag represents national holidays or not.
function isNationalHolidayTag (tag) {
  if (tag === NATIONAL_HOLIDAY_TAG &&
    getSettingsValue(
      ARE_NATIONAL_HOLIDAYS_KEY,
      DEFAULT_ARE_NATIONAL_HOLIDAYS)) {
    return true
  }

  return false
}

// Get a delta time object of worked hours.
function getWorkedHoursDeltaTimeObj (
  morning1,
  morning2 = null,
  afternoon1 = null,
  afternoon2 = null
) {
  const now = getNow()

  if (morning2 === null) {
    morning2 = now.getDate()
  } else if (afternoon2 === null) {
    afternoon2 = now.getDate()
  }

  morning1 = Math.max(morning1, getMinimumBeginningWorkingTime())

  if (afternoon2 !== null) {
    afternoon2 = Math.min(afternoon2, getMaximumLeavingWorkingTime())
  }

  if (morning2 < morning1) morning2 = morning1

  const morningDelta = morning2 - morning1 - getMorningBreakTime()
  let afternoonDelta = 0

  if (afternoon1 !== null) {
    if (afternoon1 - morning2 < getMinimumLunchBreakTime()) {
      afternoon1 = morning2 + getMinimumLunchBreakTime()
    }

    if (afternoon2 < afternoon1) afternoon2 = afternoon1
    afternoonDelta = afternoon2 - afternoon1 - getAfternoonBreakTime()
  }

  return {
    morningDelta: morningDelta,
    afternoonDelta: afternoonDelta
  }
}

// Get a delta time of worked hours.
function getWorkedHoursDeltaTime (
  morning1,
  morning2 = null,
  afternoon1 = null,
  afternoon2 = null
) {
  const workedHoursDeltaTimeObj = getWorkedHoursDeltaTimeObj(
    morning1,
    morning2,
    afternoon1,
    afternoon2
  )

  return workedHoursDeltaTimeObj.morningDelta +
    workedHoursDeltaTimeObj.afternoonDelta
}

// Get a delta string of worked hours.
function getWorkedHoursDeltaString (
  morning1,
  morning2 = null,
  afternoon1 = null,
  afternoon2 = null,
  hoursSeparator = 'h',
  minutesSeparator = 'm'
) {
  return convertToTimeDeltaString(
    getWorkedHoursDeltaTime(
      morning1,
      morning2,
      afternoon1,
      afternoon2
    ),
    hoursSeparator,
    minutesSeparator
  )
}

// Validate input worked hours.
function validateWorkHours (value, modifiedElement) {
  const elements = [
    modifiedElement.parentElement.parentElement.parentElement
      .children[0].children[0],
    modifiedElement.parentElement.parentElement.parentElement
      .children[0].children[2],
    modifiedElement.parentElement.parentElement.parentElement
      .children[1].children[0],
    modifiedElement.parentElement.parentElement.parentElement
      .children[1].children[2]
  ]

  let previousValue = null
  let previousTimeValue = null
  let isBlank = false

  const newHoursValues = []
  const rawValue = modifiedElement.value.trim()

  if (rawValue && rawValue.length >= 1) {
    const values = rawValue.split(':')
    const hours = parseInt(values[0])
    let minutes

    if (values.length > 0) {
      minutes = parseInt(values[1])
    } else {
      minutes = 0
    }

    modifiedElement.value = getNormalizedDaytimeString(hours, minutes)
  } else {
    modifiedElement.value = ''
  }

  elements.forEach((element) => {
    const isModifiedElement = element === modifiedElement.parentElement
    const rawValue =
      isModifiedElement ? modifiedElement.value : element.innerText

    if (!rawValue || isBlank) {
      if (isModifiedElement) {
        modifiedElement.value = ''
      } else {
        element.innerText = ''

        if (element.innerText !== rawValue) {
          element.style.color = MODIFIED_COLOR_HOURS_CSS
        }
      }

      isBlank = true
      return
    }

    const newParseTimeValue = parseTime(rawValue)

    if (newParseTimeValue < 0 || !rawValue.trim()) {
      if (isModifiedElement) {
        modifiedElement.value = ''
      } else {
        element.innerText = ''

        if (element.innerText !== rawValue) {
          element.style.color = MODIFIED_COLOR_HOURS_CSS
        }
      }

      isBlank = true
      return
    }

    if (previousValue !== null) {
      if (previousTimeValue > newParseTimeValue) {
        if (isModifiedElement) {
          modifiedElement.value = ''
        } else {
          element.innerText = ''
          element.style.color = MODIFIED_COLOR_HOURS_CSS
        }

        newHoursValues.push(previousTimeValue)
        return
      }
    }

    previousTimeValue = newParseTimeValue

    if (isModifiedElement) {
      previousValue = modifiedElement.value
    } else {
      previousValue = element.innerText
    }

    newHoursValues.push(previousTimeValue)
  })

  const dailyTimeRaw = convertToTimeDeltaString(getDailyRequiredTime(), ':', ':')
  let workedHours

  if (newHoursValues.length !== 4) {
    workedHours = '00:00'
  } else {
    workedHours = getWorkedHoursDeltaString(
      newHoursValues[0],
      newHoursValues[1],
      newHoursValues[2],
      newHoursValues[3],
      ':',
      ':'
    )

    workedHours = workedHours.slice(1, workedHours.length - 1)

    if (workedHours.length <= 2) {
      workedHours = `00:${workedHours}`
    }
  }

  const totalHoursElement =
    modifiedElement.parentElement.parentElement.parentElement.children[4]
  const previousTotalHoursElementInnerHTML =
    totalHoursElement.innerHTML.trim()
  totalHoursElement.innerHTML =
    `<td colspan="3" class="poi_htrav2">${workedHours}${HOUR_ELEMENT_EMPTY_DEFAULT_VALUE}(${dailyTimeRaw.slice(1, dailyTimeRaw.length - 1)})</td>`

  if (previousTotalHoursElementInnerHTML !== totalHoursElement.innerHTML) {
    totalHoursElement.style.color = MODIFIED_COLOR_HOURS_CSS
  }

  if (hoursInputBaseValue !== modifiedElement.value) {
    modifiedElement.parentElement.style.color = MODIFIED_COLOR_HOURS_CSS
  }

  return modifiedElement.value
}

// Go to the next input when editing hours.
function goToNextHoursInput (inputEl) {
  const currentHoursInput =
    document.getElementsByClassName(HOURS_INPUT_CLASS_NAME)[0]
  const hoursContainer =
    currentHoursInput.parentElement.parentElement.parentElement
  let element = null

  switch (currentHoursInput) {
    case hoursContainer.children[0].children[0].children[0]: {
      element = hoursContainer.children[0].children[2]
      break
    }
    case hoursContainer.children[0].children[2].children[0]: {
      element = hoursContainer.children[1].children[0]
      break
    }
    case hoursContainer.children[1].children[0].children[0]: {
      element = hoursContainer.children[1].children[2]
      break
    }
    case hoursContainer.children[1].children[2].children[0]: {
      const day = hoursContainer.parentElement.parentElement.cellIndex
      let nextDay

      if (day >= 4) {
        nextDay = 0
      } else {
        nextDay = day + 1
      }

      element = getTimeTableElement().children[nextDay]
        .children[0].children[0].children[0].children[0]
      break
    }
  }

  if (element === null) {
    return
  }

  generateHoursInput(element)
}

// Go to the previous input when editing hours.
function goToPreviousHoursInput (inputEl) {
  const currentHoursInput =
    document.getElementsByClassName(HOURS_INPUT_CLASS_NAME)[0]
  const hoursContainer =
    currentHoursInput.parentElement.parentElement.parentElement
  let element = null

  switch (currentHoursInput) {
    case hoursContainer.children[0].children[0].children[0]: {
      const day = hoursContainer.parentElement.parentElement.cellIndex
      let nextDay

      if (day <= 0) {
        nextDay = 4
      } else {
        nextDay = day - 1
      }

      element = getTimeTableElement().children[nextDay]
        .children[0].children[0].children[1].children[2]
      break
    }
    case hoursContainer.children[0].children[2].children[0]: {
      element = hoursContainer.children[0].children[0]
      break
    }
    case hoursContainer.children[1].children[0].children[0]: {
      element = hoursContainer.children[0].children[2]
      break
    }
    case hoursContainer.children[1].children[2].children[0]: {
      element = hoursContainer.children[1].children[0]
      break
    }
  }

  if (element === null) {
    return
  }

  generateHoursInput(element)
}

// Reset hours input.
function resetHoursInput (hoursInput) {
  hoursInput.removeEventListener('keyup', handleInputOnHours)
  hoursInput.removeEventListener('keydown', handleShortcutsOnHoursInput)
  const newValue = validateWorkHours(hoursInput.value, hoursInput)
  hoursInput.parentElement.innerHTML = newValue
  refreshPage(true)
}

// Handle click on a hour DOM element.
function handleClickOnHours (event) {
  event.stopPropagation()
  generateHoursInput(event.currentTarget)
}

// Generate an hours input from a given element.
function generateHoursInput (element) {
  resetHoursInputs()
  const child = element.children[0]

  if (child && child.nodeName === 'INPUT') {
    return
  }

  element.innerHTML =
    `<input type='text' style="width: 54px; text-align: center;" value='${element.textContent}' class="${HOURS_INPUT_CLASS_NAME}"/>`
  const inputElement = element.children[0]

  hoursInputBaseValue = inputElement.value
  inputElement.focus()
  inputElement.select()
  inputElement.addEventListener('keyup', handleInputOnHours)
  inputElement.addEventListener('keydown', handleShortcutsOnHoursInput)
}

// Insert a string into a string, at a given index.
function insertTextToString (baseString, stringToInsert, index = 0) {
  return `${baseString.slice(0, index)}${stringToInsert}${baseString.slice(index)}`
}

// Handle the shortcuts on the hours inputs.
function handleShortcutsOnHoursInput (event) {
  event.stopPropagation()
  const keyCode = event
    ? (event.which ? event.which : event.keyCode) : event.keyCode

  if (keyCode === 13) { // Enter key.
    resetHoursInput(event.currentTarget)
  } else if (keyCode === 9) { // Tab key.
    event.preventDefault()

    if (event.shiftKey) {
      goToPreviousHoursInput(event.currentTarget)
    } else {
      goToNextHoursInput(event.currentTarget)
    }
  }
}

// Handle the input on a hour DOM element.
function handleInputOnHours (event) {
  event.stopPropagation()
  const keyCode = event
    ? (event.which ? event.which : event.keyCode) : event.keyCode

  let rawValue = event.currentTarget.value.replace(/[^0-9]/i, '')

  if (rawValue.length > 4) {
    rawValue = rawValue.slice(0, 4)
  }

  let hours
  let minutes

  if (rawValue.length === 3) {
    if (rawValue[0] === '1' || rawValue[0] === '2') {
      hours = parseInt(`${rawValue[0]}${rawValue[1]}`)
      minutes = parseInt(rawValue[2])
    } else {
      hours = parseInt(rawValue[0])
      minutes = parseInt(`${rawValue[1]}${rawValue[2]}`)
    }
  } else if (rawValue.length === 2) {
    if (rawValue[0] === '1' || rawValue[0] === '2') {
      hours = parseInt(`${rawValue[0]}${rawValue[1]}`)
      minutes = parseInt(`${rawValue[2]}${rawValue[3]}`)
    } else {
      hours = parseInt(rawValue[0])
      minutes = parseInt(`${rawValue[1]}${rawValue[2]}`)
    }
  } else {
    hours = parseInt(`${rawValue[0]}${rawValue[1]}`)
    minutes = parseInt(`${rawValue[2]}${rawValue[3]}`)
  }

  if (rawValue.length === 2) {
    if (hours <= 9) {
      rawValue = insertTextToString(rawValue, ':', 1)
    }
  } else if (rawValue.length === 3) {
    if (hours <= 9) {
      rawValue = insertTextToString(rawValue, ':', 1)
    } else {
      rawValue = insertTextToString(rawValue, ':', 2)
    }
  } else if (rawValue.length === 4) {
    rawValue = insertTextToString(rawValue, ':', 2)
  }

  if (keyCode === 38 || keyCode === 40) {
    if (keyCode === 38) { // Up key.
      minutes++
    } else if (keyCode === 40) { // Down key.
      minutes--
    }

    event.currentTarget.value = getNormalizedDaytimeString(hours, minutes)
  } else {
    event.currentTarget.value = rawValue
  }
}

// Set up hour DOM elements to be modified by the user.
function setUpEditor () {
  for (let day = 0; day < 5; day++) {
    const timesElements = getTimeTableElement().children[day]
      .children[0].children[0]

    const morningFirstTimeElement =
      timesElements.children[0].children[0]
    const morningLastTimeElement =
      timesElements.children[0].children[2]
    const afternoonFirstTimeElement =
      timesElements.children[1].children[0]
    const afternoonLastTimeElement =
      timesElements.children[1].children[2]

    // Avoid memory leaks.
    morningFirstTimeElement.removeEventListener('click', handleClickOnHours)
    morningLastTimeElement.removeEventListener('click', handleClickOnHours)
    afternoonFirstTimeElement.removeEventListener('click', handleClickOnHours)
    afternoonLastTimeElement.removeEventListener('click', handleClickOnHours)

    morningFirstTimeElement.addEventListener('click', handleClickOnHours)
    morningFirstTimeElement.style.cusor = 'pointer'
    morningLastTimeElement.addEventListener('click', handleClickOnHours)
    morningLastTimeElement.style.cusor = 'pointer'
    afternoonFirstTimeElement.addEventListener('click', handleClickOnHours)
    afternoonFirstTimeElement.style.cusor = 'pointer'
    afternoonLastTimeElement.addEventListener('click', handleClickOnHours)
    afternoonLastTimeElement.style.cusor = 'pointer'
  }

  window.removeEventListener('click', handleClickOnWindow)
  window.addEventListener('click', handleClickOnWindow)
}

// Get the current date.
function getNow () {
  if (isDebugMode()) {
    return getSettingsValue(DEBUG_NOW_KEY, DEBUG_NOW_DEFAULT_VALUE)
  }

  return new Date() // Useful for debugging purposes.
}

// Get the estimated extra time at the end of the day.
function getEstimatedExtraTimeAtTheEndOfTheDay (day) {
  let morning1 = getStartMorningTime(day)
  let morning2 = getEndMorningTime(day)
  let afternoon1 = getStartAfternoonTime(day)
  let afternoon2 = getEndAfternoonTime(day)

  if (morning1 === null) {
    morning1 = getRecommendedBeginningWorkingTime()
    morning2 = null
    afternoon1 = null
    afternoon2 = null
  }

  if (morning2 === null) {
    morning2 = getRecommendedBeginningLunchTime()
    afternoon1 = null
    afternoon2 = null
  }

  if (afternoon1 === null) {
    afternoon1 = getRecommendedEndingLunchTime()
    afternoon2 = null
  }

  if (afternoon2 === null) {
    if (day > getNow().getDay() - 1) {
      afternoon2 = getRecommendedEndingWorkingTime()
    } else {
      let estimatedLeavingTime = dailyWorkedTime[day].dailyDelta
      estimatedLeavingTime -= extraHoursAdded

      afternoon2 = generateLeavingTime(
        day,
        day,
        estimatedLeavingTime
      )

      let now = getNow()
      now = convertToSeconds({ hours: now.getHours(), minutes: now.getMinutes() })

      if (afternoon2 < now) {
        afternoon2 = now
      }
    }
  }

  const workedHoursDeltaTime = getWorkedHoursDeltaTime(
    morning1,
    morning2,
    afternoon1,
    afternoon2
  )

  return workedHoursDeltaTime - getDailyRequiredTime()
}

// Tell whether a new month occurs this week.
function isNewMonth () {
  const monday = getMondayTimeOfCurrentAdpWeek()
  const sunday = getDaytimeOfCurrentAdpWeek(6)

  return monday.getDate() > sunday.getDate()
}

// Return the current day when estimating extra time.
function getCurrentDayNumber () {
  const currentDay = getNow().getDay() - 1

  return Math.max(0, Math.min(currentDay, 4))
}

// Add the worked hours on the ADP activity web page.
function addWorkedHours () {
  updateSettings()
  setUpEditor()
  generateDetailsContainerElement()

  if (isNewMonth()) {
    globalCounterTime = Math.min(getHighestMonthlyExtraTime(), globalCounterTime)
  }

  const weekLabel = getWeekLabel()

  if (weekLabel === WEEK_FUTURE) {
    return
  }

  const declarationList =
    document.getElementsByClassName('declaration')[0].children[1].children[2]

  let totalSeconds = 0
  let totalDayOffSeconds = 0
  let totalNationalHolidaySeconds = 0
  let cumulatedDeltaTotalSeconds = 0
  let currentGlobalCounterTime = getBeginningOfTheWeekExtraTime()
  extraHoursAdded = 0
  overtimeCompensationTime = 0

  const currentDay = getCurrentDayNumber()

  for (let day = 0; day < DAYS_TO_COUNT; ++day) {
    dailyWorkedTime[day] = {
      daily: 0
    }

    const morningTag = declarationList.children[2 * day].innerHTML
    const afternoonTag = declarationList.children[2 * day + 1].innerHTML
    const currentTimeDelta = getTimeDeltaObj(day)
    let currentTotalSeconds = 0

    if (isDayOffTag(morningTag)) {
      totalDayOffSeconds += getMorningTime()
      currentTotalSeconds += getMorningTime()
    } else if (isNationalHolidayTag(morningTag)) {
      totalNationalHolidaySeconds += getMorningTime()
      currentTotalSeconds += getMorningTime()
    } else {
      currentTotalSeconds += currentTimeDelta.morning
    }

    if (isDayOffTag(afternoonTag)) {
      totalDayOffSeconds += getAfternoonTime()
      currentTotalSeconds += getAfternoonTime()
    } else if (isNationalHolidayTag(afternoonTag)) {
      totalNationalHolidaySeconds += getAfternoonTime()
      currentTotalSeconds += getAfternoonTime()
    } else {
      currentTotalSeconds += currentTimeDelta.afternoon
    }

    const currentOvertimeCompensationTime = getOvertimeCompensation(day)
    currentTotalSeconds += currentOvertimeCompensationTime
    overtimeCompensationTime += currentOvertimeCompensationTime

    if (isGlobalCounterIncluded && weekLabel === WEEK_PRESENT) {
      if ((!isDayFinished(day) && day === currentDay) ||
          (isDayFinished(day) && day === currentDay + 1)) {
        extraHoursAdded = currentGlobalCounterTime
        currentTotalSeconds += extraHoursAdded
      }
    }

    totalSeconds += currentTotalSeconds
    dailyWorkedTime[day].daily += currentTotalSeconds

    const dailyDeltaTotalSeconds =
      dailyWorkedTime[day].daily - getDailyRequiredTime()
    dailyWorkedTime[day].dailyDelta = dailyDeltaTotalSeconds

    cumulatedDeltaTotalSeconds += dailyDeltaTotalSeconds
    dailyWorkedTime[day].cumulatedDelta = cumulatedDeltaTotalSeconds

    const leaveTimeElement =
      document.getElementById(`${LEAVE_TIME_ID}-${day}`)
    const leaveTimeTotalElement =
      document.getElementById(`${LEAVE_TIME_TOTAL_ID}-${day}`)

    leaveTimeElement.innerHTML =
      convertToTimeDeltaString(dailyWorkedTime[day].dailyDelta)
    leaveTimeTotalElement.innerHTML =
      convertToTimeDeltaString(dailyWorkedTime[day].cumulatedDelta)

    leaveTimeElement.style.color =
      dailyWorkedTime[day].dailyDelta < 0
        ? NEGATIVE_DELTA_COLOR : POSITIVE_DELTA_COLOR

    leaveTimeTotalElement.style.color =
      dailyWorkedTime[day].cumulatedDelta < 0
        ? NEGATIVE_DELTA_COLOR : POSITIVE_DELTA_COLOR

    if (day === currentDay && !isDayFinished(day)) {
      leaveTimeElement.innerHTML += ` (${convertToTimeString(
        generateLeavingTime(day, currentDay, dailyWorkedTime[day].dailyDelta)
      )})`

      leaveTimeTotalElement.innerHTML += ` (${convertToTimeString(
        generateLeavingTime(
          day, currentDay, dailyWorkedTime[day].cumulatedDelta
        )
      )})`
    }
  }

  const extraHoursEndWeekContainer =
    document.getElementById(EXTRA_HOURS_END_WEEK_ID)

  setStyle(
    extraHoursEndWeekContainer,
    getDeltaValueStyle(
      getLowestExtraTotalTime(),
      getHighestWeeklyExtraTime(),
      currentGlobalCounterTime,
      COUNTER_SIZE_CSS
    )
  )

  extraHoursEndWeekContainer.innerHTML =
   convertToTimeDeltaString(currentGlobalCounterTime)

  const monday = getMondayTimeOfCurrentAdpWeek()
  const sunday = getDaytimeOfCurrentAdpWeek(6)
  let currentExtraTime
  const isPast = weekLabel === WEEK_PAST
  const currentDayForExtraTime = getCurrentDayNumber()

  if (isPast) {
    currentExtraTime = dailyWorkedTime[4].cumulatedDelta
  } else if (isDayFinished(currentDayForExtraTime)) {
    currentExtraTime = dailyWorkedTime[currentDayForExtraTime].cumulatedDelta
  } else {
    if (currentDayForExtraTime < 1) {
      currentExtraTime = 0
    } else {
      currentExtraTime =
        dailyWorkedTime[currentDayForExtraTime - 1].cumulatedDelta
    }
  }

  if (!isPast) {
    for (let day = currentDayForExtraTime + 1; day < DAYS_TO_COUNT; day++) {
      currentExtraTime +=
        getEstimatedExtraTimeAtTheEndOfTheDay(day)
    }
  }

  let estimatedExtraHoursEndWeek = getBeginningOfTheWeekExtraTime() +
    Math.min(currentExtraTime, getHighestWeeklyExtraTime())

  if (currentGlobalCounterTime < estimatedExtraHoursEndWeek) {
    currentGlobalCounterTime = estimatedExtraHoursEndWeek
  }

  estimatedExtraHoursEndWeek -= overtimeCompensationTime

  // New month. So, the maximum of extra time is getHighestMonthlyExtraTime().
  if (monday.getDate() > sunday.getDate()) {
    estimatedExtraHoursEndWeek =
      Math.min(estimatedExtraHoursEndWeek, getHighestMonthlyExtraTime())
  }

  const extraHoursEndWeekEstimatedContainer =
    document.getElementById(EXTRA_HOURS_END_WEEK_ESTIMATED_ID)

  setStyle(
    extraHoursEndWeekEstimatedContainer,
    getDeltaValueStyle(
      getLowestExtraTotalTime(),
      getHighestWeeklyExtraTime(),
      estimatedExtraHoursEndWeek,
      COUNTER_SIZE_CSS
    )
  )

  extraHoursEndWeekEstimatedContainer.innerHTML = convertToTimeDeltaString(
    estimatedExtraHoursEndWeek
  )

  const timeDelta = totalSeconds - getWeekTime()
  const globalCounterElement = document.getElementById(GLOBAL_COUNTER_ID)

  setStyle(
    globalCounterElement,
    getDeltaValueStyle(
      0,
      getWeeklyRequiredTime(),
      totalSeconds,
      COUNTER_SIZE_CSS
    )
  )

  globalCounterElement.innerHTML =
    convertToTimeDeltaString(totalSeconds - extraHoursAdded)

  const overtimeCompensationElement =
    document.getElementById(OVERTIME_COMPENSATION_ID)
  overtimeCompensationElement.innerHTML =
    convertToTimeDeltaString(overtimeCompensationTime)

  const daysOffHoursElement = document.getElementById(DAYS_OFF_HOURS_ID)
  daysOffHoursElement.innerHTML = convertToTimeDeltaString(totalDayOffSeconds)

  const nationalHolidayHoursElement =
    document.getElementById(NATIONAL_HOLIDAY_HOURS_ID)
  nationalHolidayHoursElement.innerHTML =
    convertToTimeDeltaString(totalNationalHolidaySeconds)

  const weekDeltaElement = document.getElementById(WEEK_DELTA_ID)
  setStyle(
    weekDeltaElement,
    getDeltaValueStyle(
      -getWeeklyRequiredTime(),
      0,
      timeDelta,
      COUNTER_SIZE_CSS
    )
  )

  weekDeltaElement.innerHTML = convertToTimeDeltaString(timeDelta)

  if (weekLabel === WEEK_PRESENT) {
    const requiredTime = getCurrentRequiredWorkTime()
    const progressTimeDelta = totalSeconds - requiredTime

    const dayDeltaElement = document.getElementById(DAY_DELTA_ID)

    setStyle(
      dayDeltaElement,
      getDeltaValueStyle(
        -getDailyRequiredTime(),
        0,
        progressTimeDelta,
        COUNTER_SIZE_CSS
      )
    )

    dayDeltaElement.innerHTML = convertToTimeDeltaString(progressTimeDelta)
  }
}

// Get the (recommended) leaving time.
function generateLeavingTime (day, currentDay, secondsDelta) {
  const isToday = day === currentDay
  let currentTotalSeconds
  let endMorningTime
  let beginningAfternoonTime
  const timeTableElement = getTimeTableElement()

  if (isToday) {
    endMorningTime =
      timeTableElement.children[day].children[0].children[0].children[0]
        .children[2].innerHTML
    beginningAfternoonTime = timeTableElement.children[day].children[0]
      .children[0].children[1].children[0].innerHTML

    const currentDate = getNow()
    currentTotalSeconds = convertToSeconds({
      hours: currentDate.getHours(),
      minutes: currentDate.getMinutes()
    })
  } else {
    currentTotalSeconds = getRecommendedBeginningWorkingTime()
    endMorningTime = ''
    beginningAfternoonTime = ''
    secondsDelta += (day - currentDay + 1) * getDailyRequiredTime()
  }

  const isAfternoon =
    !HOUR_ELEMENT_EMPTY_VALUES.includes(beginningAfternoonTime)
  const isNoon =
    !HOUR_ELEMENT_EMPTY_VALUES.includes(endMorningTime) && !isAfternoon
  const isMorning = !isNoon && !isAfternoon

  let offsetSeconds = 0

  if (isNoon) {
    const endMorningTimeSeconds = parseTime(endMorningTime)

    offsetSeconds =
      getAfternoonBreakTime() + getRecommendedLunchBreakTime() -
      (currentTotalSeconds - endMorningTimeSeconds)
  } else if (isMorning) {
    offsetSeconds = getAfternoonBreakTime() +
      getRecommendedLunchBreakTime()
  } else {
    offsetSeconds = 0
  }

  const leavingTime = currentTotalSeconds + secondsDelta * -1 + offsetSeconds

  return Math.min(
    Math.max(leavingTime, getMinimumLeavingWorkingTime()),
    getMaximumLeavingWorkingTime()
  )
}

// Enable notifications to inform when it's time to leave.
function enableEndNotifications () {
  if (!('Notification' in window)) {
    alert('Votre navigateur ne supporte pas les notifications')
    disableEndNotifications()
  } else if (Notification.permission === 'granted') {
    waitToNotifyForEndingHours()
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        waitToNotifyForEndingHours()
      } else {
        disableEndNotifications()
      }
    })
  }
}

// Handle when the window is exiting.
function handleWindowExit () {
  notificationWorker.postMessage({
    type: 'empty-notifications'
  })
}

// Handle notification clicks.
function handleNotificationClick (event) {
  window.open('https://pointage.adp.com')
}

// Disable notifications to inform when it's time to leave.
function disableEndNotifications () {
  if (areEndNotifications) {
    areEndNotifications = false
    document.getElementById(END_NOTIFICATION_CHECKBOX_ID).checked =
      areEndNotifications
  }

  notificationWorker.postMessage({
    type: 'empty-notifications'
  })
}

// Get worker for background end notification tasks.
function getEndNotificationWorker () {
  const blobURL = URL.createObjectURL(
    new Blob([
      '(',
      function () {
        self.endNotificationHandles = []
        self.addEventListener('message', function (event) {
          if (event.data.type === 'notification') {
            const seconds = event.data.notification.timeout / 1000
            console.debug(`Adding notification in ${seconds} seconds...`)

            self.endNotificationHandles.push(setTimeout(() => {
              const notification = new Notification(
                event.data.notification.title,
                {
                  body: event.data.notification.body,
                  icon: event.data.notification.icon
                }
              )

              notification.onclick = (event) => {
                self.postMessage({ type: 'notification-click' })
              }
            }, event.data.notification.timeout))
          } else if (event.data.type === 'empty-notifications') {
            console.debug('Emptying notifications...')
            self.endNotificationHandles.forEach(handle => clearTimeout(handle))
          }
        }, false)
      }.toString(),
      ')()'
    ], {
      type: 'application/javascript'
    })
  )

  const worker = new Worker(blobURL)
  URL.revokeObjectURL(blobURL)

  return worker
}

// Wait for an ending hour to display a notification.
function waitToNotifyForEndingHours () {
  if (!areEndNotifications || getWeekLabel() !== WEEK_PRESENT) {
    return
  }

  notificationWorker.postMessage({
    type: 'empty-notifications'
  })

  const now = getNow()
  const currentDay = getCurrentDayNumber()
  const startMorningTimeObj = getStartMorningTime(currentDay, false)
  const endMorningTimeObj = getEndMorningTime(currentDay, false)
  const startAfternoonTimeObj = getStartAfternoonTime(currentDay, false)
  const endAfternoonTimeObj = getEndAfternoonTime(currentDay, false)

  let startMorningTime = null
  let endMorningTime = null
  let startAfternoonTime = null
  let endAfternoonTime = null

  if (startMorningTimeObj !== null) {
    startMorningTime = getNow()
    startMorningTime.setHours(startMorningTimeObj.hours)
    startMorningTime.setMinutes(startMorningTimeObj.minutes)
    startMorningTime.setSeconds(0)
  } else {
    startMorningTime = now
  }

  if (endMorningTimeObj !== null) {
    endMorningTime = getNow()
    endMorningTime.setHours(endMorningTimeObj.hours)
    endMorningTime.setMinutes(endMorningTimeObj.minutes)
    endMorningTime.setSeconds(0)
  } else {
    endMorningTime = now
  }

  if (startAfternoonTimeObj !== null) {
    startAfternoonTime = getNow()
    startAfternoonTime.setHours(startAfternoonTimeObj.hours)
    startAfternoonTime.setMinutes(startAfternoonTimeObj.minutes)
    startAfternoonTime.setSeconds(0)
  } else {
    startAfternoonTime = now
  }

  if (endAfternoonTimeObj !== null) {
    endAfternoonTime = getNow()
    endAfternoonTime.setHours(endAfternoonTimeObj.hours)
    endAfternoonTime.setMinutes(endAfternoonTimeObj.minutes)
    endAfternoonTime.setSeconds(0)
  } else {
    endAfternoonTime = now
  }

  const notificationsDescr = []

  if (now < startMorningTime) {
    notificationsDescr.push({
      endTime: startMorningTime,
      endTimeObj: startMorningTimeObj,
      action: 'aller travailler 💪'
    })
  }

  if (now < endMorningTime) {
    notificationsDescr.push({
      endTime: endMorningTime,
      endTimeObj: endMorningTimeObj,
      action: 'aller manger 🍔'
    })
  }

  if (now < startAfternoonTime) {
    notificationsDescr.push({
      endTime: startAfternoonTime,
      endTimeObj: startAfternoonTimeObj,
      action: 'aller retravailler 💪'
    })
  }

  if (now < endAfternoonTime) {
    notificationsDescr.push({
      endTime: endAfternoonTime,
      endTimeObj: endAfternoonTimeObj,
      action: 'rentrer chez vous 🏡'
    })
  }

  notificationsDescr.forEach(
    (notificationDescr) => {
      const timeout = notificationDescr.endTime - now

      if (isNaN(timeout)) {
        return
      }

      notificationWorker.postMessage({
        type: 'notification',
        notification: {
          timeout: timeout,
          title: `[${ADP_APP_NAME}] Hey, listen!`,
          body: `Il est ${convertToTimeString(
            convertToSeconds(notificationDescr.endTimeObj)
          )}, vous pouvez ${notificationDescr.action} !`,
          icon: NOTIFICATION_ICON
        }
      })
    }
  )
}

// Get a formatted dashboard header.
function getDashboardHeader (headerName) {
  return `<span style="user-select: none;">${headerName}</span>`
}

// Get a formatted dashboard value.
function getDashboardValue (id, value = null, style = null) {
  if (value === null) {
    value = '-'
  }

  if (style === null) {
    style = DEFAULT_VALUE_STYLE
  }

  let styleStringified = ''

  for (const [key, value] of Object.entries(style)) {
    styleStringified += `${key}: ${value}; `
  }

  return `<span id="${id}" style="${styleStringified}">${value}</span>`
}

// Get the delta value style.
function getDeltaValueStyle (lowest, highest, value, size) {
  const delta = highest - lowest
  const ratio = (value - lowest) / delta

  return {
    color: getGradedColor(ratio * 100),
    'font-size': size
  }
}

// Set a style for a given element.
function setStyle (element, styleDescr) {
  for (const [key, value] of Object.entries(styleDescr)) {
    element.style[key] = value
  }
}

// Generate the details container which is added at the top of the ADP page.
function generateDetailsContainerElement () {
  let detailsContainer = document.getElementById(DETAILS_ID)

  if (detailsContainer !== null) detailsContainer.remove()

  let trLeaveTimesElement = document.getElementById(LEAVE_TIMES_ID)

  if (trLeaveTimesElement !== null) trLeaveTimesElement.remove()

  detailsContainer = document.createElement('section')
  detailsContainer.id = DETAILS_ID
  detailsContainer.style.position = 'relative'
  detailsContainer.style.bottom = '20px'
  detailsContainer.style.marginBottom = '-20px'

  const calendarButtonElement = document.getElementById('btnCalendar')
  const previousButtonElement = document.getElementById('btnPrev')

  const buttonsPanelWidth =
    calendarButtonElement.getBoundingClientRect().right -
      previousButtonElement.getBoundingClientRect().left

  detailsContainer.style.width = `calc(100% - ${buttonsPanelWidth}px)`

  const dashboardContainer = document.createElement('section')
  dashboardContainer.id = DASHBOARD_ID

  setStyle(
    dashboardContainer,
    {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-around'
    }
  )

  dashboardContainer.innerHTML = `
      <div style="user-select: none;">
        <div title="Nombre d'heures total travaillées dans la semaine.">
          ${getDashboardHeader('Heures travaillées :')}<br>
          <span style="user-select: all;">${getDashboardValue(GLOBAL_COUNTER_ID)}</span><br><br>
        </div>
        <span style="font-size: 0.9em;"><span title="Heures de récupération comptées."><span style="user-select: none;">Récupération : </span><span id="${OVERTIME_COMPENSATION_ID}" style="user-select: all;">-</span></span><br>
        <span style="font-size: 0.9em;"><span title="Autres heures comptées via les événements posés par vous ou votre manager."><span style="user-select: none;">Congés payés : </span><span id="${DAYS_OFF_HOURS_ID}" style="user-select: all;">-</span></span><br>
        <span title="Heures comptées via les jours fériés."><span style="user-select: none;">Jours fériés : </span><span id="${NATIONAL_HOLIDAY_HOURS_ID}" style="user-select: all;">-</span></span></span>
      </div>
      <div>
        <div title="Temps delta cumulé : jusqu'à aujourd'hui inclus, il faut avoir travaillé ${getNow().getDay()} fois ${convertToTimeDeltaString(getDailyRequiredTime())} si on veut respecter les ${convertToTimeDeltaString(getWeeklyRequiredTime())} demandés pour une semaine. Le temps des jours de congés (et autres événements) y est compté.">
          ${getDashboardHeader('Delta journalier cumulé 🥐 :')}<br>
          ${getDashboardValue(DAY_DELTA_ID)}<br><br>
        </div>
        <div title="Nombre d'heures restantes à travailler pour une semaine complète (à savoir, ${convertToTimeDeltaString(getWeeklyRequiredTime())} en tout). Le temps des jours de congés (et autres événements) y est compté.">
          ${getDashboardHeader('Delta journalier total :')}<br>
          ${getDashboardValue(WEEK_DELTA_ID)}
        </div>
      </div>
      <div>
        <div title="Nombre d'heures supplémentaires en début de semaine (récupérées en demandant directement à l'API de l'ADP).">
          ${getDashboardHeader('Heures supplémentaires (début de semaine) :')}<br>
          ${getDashboardValue(EXTRA_HOURS_BEGINNING_WEEK_ID, getWeekLabel() === WEEK_FUTURE ? null : convertToTimeDeltaString(getBeginningOfTheWeekExtraTime()), getDeltaValueStyle(getLowestExtraTotalTime(), getHighestWeeklyExtraTime(), getBeginningOfTheWeekExtraTime(), COUNTER_SIZE_CSS))}<br><br>
        </div>
        ${getDashboardHeader('Heures supplémentaires (fin de semaine) :')}<br>
        <div style="display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-evenly; position: relative; right: 30px">
          <div title="Nombre d'heures supplémentaires actuellement gagnées (vis-à-vis du temps de travail journalier requis de ${convertToTimeDeltaString(getDailyRequiredTime())} à effectuer dans la semaine).">
            <span style="font-size: 0.9em; user-select: none;">Actuelles :</span><br>
            ${getDashboardValue(EXTRA_HOURS_END_WEEK_ID)}
          </div>
          <div title="Estimation du nombre d'heures en fin de semaine.

l'estimateur part du principe que ${convertToTimeDeltaString(getDailyRequiredTime())} d'heures de travail journalier sont effectuées pour la semaine restante.

Prend en compte les ${convertToTimeDeltaString(getHighestWeeklyExtraTime())} maximum d'heures supplémentaires par semaine, et les ${convertToTimeDeltaString(getHighestMonthlyExtraTime())} maximum d'heures supplémentaires par mois (si le nouveau mois arrive dans la semaine).">
            <span style="font-size: 0.9em; user-select: none;">Estimées :</span><br>
            ${getDashboardValue(EXTRA_HOURS_END_WEEK_ESTIMATED_ID)}
          </div>
        </div>
      </div>
  `

  detailsContainer.appendChild(dashboardContainer)

  const datesContainer = document.getElementById('poi_content_ajax')
  datesContainer.prepend(detailsContainer)
  datesContainer.style.overflow = 'visible'

  trLeaveTimesElement = document.createElement('tr')
  trLeaveTimesElement.className = 'c height_23'
  trLeaveTimesElement.id = LEAVE_TIMES_ID

  const currentDate = getNow()
  currentDate.setHours(0, 0, 0, 0)
  const currentDay = getCurrentDayNumber()
  const weekLabel = getWeekLabel()

  for (let day = 0; day < 7; ++day) {
    let tdLeaveTime = document.createElement('td')
    tdLeaveTime.id = `${LEAVE_TIME_ID}-${day}`
    tdLeaveTime.className = 'detailJournalier td_hre_cont'
    tdLeaveTime.style.cursor = 'default'

    let minimumLeavingWorkingTimeDelta =
      convertToTimeDeltaString(getMinimumLeavingWorkingTime())
    minimumLeavingWorkingTimeDelta = minimumLeavingWorkingTimeDelta.slice(
      1, minimumLeavingWorkingTimeDelta.length - 1
    )

    let maximumLeavingWorkingTimeDelta =
      convertToTimeDeltaString(getMaximumLeavingWorkingTime())
    maximumLeavingWorkingTimeDelta = maximumLeavingWorkingTimeDelta.slice(
      1, maximumLeavingWorkingTimeDelta.length - 1
    )

    if (weekLabel === WEEK_PRESENT && currentDay === day) {
      tdLeaveTime.title = `Delta pour une journée de travail + heure recommandée pour partir (si nécessaire)

L'heure recommandée pour partir si vous désirez respecter (si possible) le nombre d'heures de travail journalier de ${convertToTimeDeltaString(getDailyRequiredTime())}.
À noter que l'heure recommandée ne pourra être avant ${minimumLeavingWorkingTimeDelta} ou après ${maximumLeavingWorkingTimeDelta}.
`
    } else {
      tdLeaveTime.title = 'Delta pour une journée de travail.'
    }

    trLeaveTimesElement.appendChild(tdLeaveTime)

    tdLeaveTime = document.createElement('td')
    tdLeaveTime.id = `${LEAVE_TIME_TOTAL_ID}-${day}`
    tdLeaveTime.className = 'detailJournalier td_hre_cont'
    tdLeaveTime.style.cursor = 'default'

    if (weekLabel === WEEK_PRESENT && currentDay === day) {
      tdLeaveTime.title = `Delta cumulé sur la semaine + heure recommandée pour partir (si nécessaire)

L'heure recommandée pour partir si vous désirez respecter (si possible) le nombre d'heures de travail requises après la journée actuelle (à savoir ${convertToTimeDeltaString(getDailyRequiredTime() * (day + 1))}).
À noter que l'heure recommandée ne pourra être avant ${minimumLeavingWorkingTimeDelta} ou après ${maximumLeavingWorkingTimeDelta}.
`
    } else {
      tdLeaveTime.title = 'Delta cumulé sur la semaine.'
    }

    trLeaveTimesElement.appendChild(tdLeaveTime)
  }

  document.getElementsByClassName('declaration')[0].children[1].appendChild(
    trLeaveTimesElement
  )

  if (isFirstTimeLoading) datesContainerHeight = datesContainer.offsetHeight

  datesContainer.style.height =
    `${datesContainerHeight +
      detailsContainer.offsetHeight + HEIGHT_MARGIN}px`
  isFirstTimeLoading = false
}

// Load the page after a ADD_WORKED_HOURS_TIMEOUT milliseconds
// (because the base site is slow to load).
function loadPage () {
  window.setTimeout(async () => {
    currentMondayObj = getMondayTimeObjOfCurrentAdpWeek()
    currentFridayObj = getFridayTimeObjOfCurrentAdpWeek()
    await requestAdpExtraHours()
    await requestAdpOvertimeComposentationTime()
    addWorkedHours()

    if (isRefreshPage) {
      window.setTimeout(refreshPage, refreshRate * 1000)
    }
  }, ADD_WORKED_HOURS_TIMEOUT)
}

let refreshTimeoutId = null

const refreshPage = (isForce = false) => {
  if (!isRefreshPage && !isForce) return

  if (refreshTimeoutId !== null) clearTimeout(refreshTimeoutId)

  refreshTimeoutId = null

  addWorkedHours()

  let refreshTimeout = refreshRate

  if (isNaN(refreshTimeout) || refreshTimeout === '') {
    refreshTimeout = REFRESH_PAGE_DEFAULT_TIME_VALUE
  }

  refreshTimeoutId =
    window.setTimeout(refreshPage, refreshTimeout * 1000)

  waitToNotifyForEndingHours()
}

// Set isOptionInput to true when clicking on a checkbox element.
function handleDefaultCheckboxClick (event) {
  isOptionInput = true
}

// Handle refresh checkbox change.
function handleRefreshCheckboxChange (event) {
  isRefreshPage = event.target.checked
  setSettingsValue(REFRESH_PAGE_CHECKBOX_KEY, isRefreshPage)

  if (!isRefreshPage) return

  refreshPage()
}

// Handle refresh checkbox input.
function handleRefreshCheckboxInput (event) {
  refreshRate = event.target.value

  const refreshContainer = document.getElementById(REFRESH_PAGE_CONTAINER_ID)
  refreshContainer.title =
    `Si la case est cochée, le script se mettra à jour automatiquement, toutes les ${refreshRate} secondes.`

  setSettingsValue(REFRESH_PAGE_TIME_KEY, refreshRate)
  isOptionInput = false

  if (!isRefreshPage) return

  refreshPage()
}

// Handle global counter checkbox change.
function handleGlobalCounterCheckboxChange (event) {
  isGlobalCounterIncluded = event.target.checked
  setSettingsValue(GLOBAL_COUNTER_CHECKBOX_KEY, isGlobalCounterIncluded)
  isOptionInput = false
  addWorkedHours()
}

// Handle the end notifications' checkbox change.
function handleEndNotificationsCheckboxChange (event) {
  if (Notification.permission === 'denied') {
    areEndNotifications = event.target.checked = false
  } else {
    areEndNotifications = event.target.checked
  }

  setSettingsValue(END_NOTIFICATION_CHECKBOX_KEY, areEndNotifications)
  isOptionInput = false

  if (areEndNotifications) {
    enableEndNotifications()
  } else {
    disableEndNotifications()
  }
}

// Set the settings container.
function setSettingsContainer () {
  isRefreshPage = getSettingsValue(
    REFRESH_PAGE_CHECKBOX_KEY, REFRESH_PAGE_CHECKBOX_DEFAULT_VALUE
  )

  refreshRate = getSettingsValue(
    REFRESH_PAGE_TIME_KEY, REFRESH_PAGE_DEFAULT_TIME_VALUE
  )

  const isGlobalCounterChecked = getSettingsValue(
    GLOBAL_COUNTER_CHECKBOX_KEY, GLOBAL_COUNTER_CHECKBOX_DEFAULT_VALUE
  )

  const areEndNotificationsChecked = getSettingsValue(
    END_NOTIFICATION_CHECKBOX_KEY, END_NOTIFICATION_CHECKBOX_DEFAULT_VALUE
  )

  const settingsContainer = document.createElement('div')

  settingsContainer.innerHTML = `
    <div style="z-index: 1000; position: absolute; bottom: 10px; left: 10px; user-select: none;">
      <div id="${REFRESH_PAGE_CONTAINER_ID}" style="cursor: pointer;" title="Si la case est cochée, le script se mettra à jour automatiquement, toutes les ${refreshRate} secondes.">
        <input style="cursor: pointer;" type="checkbox" name="${REFRESH_PAGE_CHECKBOX_NAME}" id="${REFRESH_PAGE_CHECKBOX_ID}" disabled="" ${isRefreshPage ? 'checked' : ''}>
        <label for="${REFRESH_PAGE_CHECKBOX_ID}" style="width: 140px; cursor: pointer;">Rafraîchir (en secondes)</label>
        <input type="number" name="${REFRESH_PAGE_TIME_NAME}" id="${REFRESH_PAGE_TIME_ID}" placeholder="60" disabled="" style="width: 50px;" value="${refreshRate}">
      </div>
      <div style="cursor: pointer;" title="Si la case est cochée, la simulation prendra en compte les heures supplémentaires dans la simulation.">
        <input style="cursor: pointer;" type="checkbox" name="${GLOBAL_COUNTER_CHECKBOX_NAME}" id="${GLOBAL_COUNTER_CHECKBOX_ID}" ${isGlobalCounterChecked ? 'checked' : ''}>
        <label for="${GLOBAL_COUNTER_CHECKBOX_ID}" style="width: 400px; cursor: pointer;">Prendre en compte les heures supplémentaires</label>
      </div>
      <div style="cursor: pointer;" title="Si la case est cochée, une notification apparaîtra si une heure de fin est atteinte dans les heures entrées par l'utilisateur.

Si vous cliquez sur la notification, un nouvel onglet s'ouvre automatiquement pour pointer (il faut avoir autorisé les popups sur le site au préalable).

Note : pour le moment, il faut garder l'onglet des horaires OUVERT pour que les notifications fonctionnent. De plus, ces dernières se désactivent en cas de rechargement de la page (car les horaires entrées manuellement disparaissent).">
        <input style="cursor: pointer;" type="checkbox" name="${END_NOTIFICATION_CHECKBOX_NAME}" id="${END_NOTIFICATION_CHECKBOX_ID}" ${areEndNotificationsChecked ? 'checked' : ''}>
        <label for="${END_NOTIFICATION_CHECKBOX_ID}" style="width: 400px; cursor: pointer;">Activer les notifications</label>
      </div>
    </div>
  `

  document.body.appendChild(settingsContainer)

  const refreshCheckboxInput = document.getElementById(REFRESH_PAGE_CHECKBOX_ID)
  const refreshTextInput = document.getElementById(REFRESH_PAGE_TIME_ID)
  const globalCounterCheckboxInput =
    document.getElementById(GLOBAL_COUNTER_CHECKBOX_ID)
  const endNotificationsCheckboxInput =
    document.getElementById(END_NOTIFICATION_CHECKBOX_ID)

  // Prevent memory leaks.
  refreshCheckboxInput.removeEventListener(
    'change', handleRefreshCheckboxChange
  )

  refreshCheckboxInput.removeEventListener(
    'click', handleDefaultCheckboxClick
  )

  refreshTextInput.removeEventListener(
    'input', handleRefreshCheckboxInput
  )

  globalCounterCheckboxInput.removeEventListener(
    'click', handleDefaultCheckboxClick
  )

  globalCounterCheckboxInput.removeEventListener(
    'change', handleGlobalCounterCheckboxChange
  )

  endNotificationsCheckboxInput.removeEventListener(
    'click', handleDefaultCheckboxClick
  )

  endNotificationsCheckboxInput.removeEventListener(
    'change', handleEndNotificationsCheckboxChange
  )

  refreshCheckboxInput.addEventListener(
    'change', handleRefreshCheckboxChange
  )

  refreshCheckboxInput.addEventListener(
    'click', handleDefaultCheckboxClick
  )

  refreshTextInput.addEventListener(
    'input', handleRefreshCheckboxInput
  )

  globalCounterCheckboxInput.addEventListener(
    'click', handleDefaultCheckboxClick
  )

  globalCounterCheckboxInput.addEventListener(
    'change', handleGlobalCounterCheckboxChange
  )

  endNotificationsCheckboxInput.addEventListener(
    'click', handleDefaultCheckboxClick
  )

  endNotificationsCheckboxInput.addEventListener(
    'change', handleEndNotificationsCheckboxChange
  )
}

// Display or hide the advanced settings.
function handleAdvancedSettingsToggle (isDisplayed) {
  if (isAdvancedSettingsPanelVisible === isDisplayed) {
    return
  }

  isAdvancedSettingsPanelVisible = isDisplayed
  const advancedSettingsContainer = document.getElementById(ADVANCED_SETTINGS_MODAL_ID)
  advancedSettingsContainer.style.display = isAdvancedSettingsPanelVisible ? 'block' : 'none'
}

// Display or hide the advanced settings when clicking on the related button.
function handleAdvancedSettingsButtonClick (event) {
  event.stopPropagation()
  handleAdvancedSettingsToggle(!isAdvancedSettingsPanelVisible)
}

// Hide the advanced settings when focusing out of its container.
function handleAdvancedSettingsFocusOut (event) {
  event.stopPropagation()
  handleAdvancedSettingsToggle(false)
}

// Handle clicks on the advanced settings container.
function handleAdvancedSettingsClick (event) {
  event.stopPropagation()
}

// Handle clicks on the advanced settings save button.
function handleAdvancedSettingsSaveButtonClick (event) {
  event.stopPropagation()
  saveAdvancedSettings()
  handleAdvancedSettingsToggle(false)
  refreshPage(true)
}

// Handle clicks on the advanced settings restore button.
function handleAdvancedSettingsRestoreButtonClick (event) {
  event.stopPropagation()
  resetAdvancedSettings()
  setAdvancedSettingsContainer()
  refreshPage(true)
}

// Set the advanced settings container.
function setAdvancedSettingsContainer () {
  const oldModal = document.getElementById(ADVANCED_SETTINGS_MODAL_ID)

  if (oldModal !== null) {
    oldModal.remove()
  }

  const advancedSettingsButton = document.createElement('div')

  advancedSettingsButton.innerHTML = `
    <div style="height: 50px; width: 50px; background-color: #DC2033; border-radius: 50%; display: inline-block; position: fixed; right: 15px; bottom: 15px; z-index: 1001; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; display: flex; justify-content: center; cursor: pointer; user-select: none;" title="Paramètres avancés">
      <img src="https://i.imgur.com/BG7lE0I.png" alt="Icône des paramètres avancés" width="25" height="25" style="margin: auto;">
    </div>
  `
  document.body.appendChild(advancedSettingsButton)

  const advancedSettingsModal = document.createElement('div')
  const labelSize = '0.9em'
  const entryMargin = '15px'
  const subEntryMargin = '30px'

  advancedSettingsModal.innerHTML = `
    <div id="${ADVANCED_SETTINGS_MODAL_ID}" style="display: ${isAdvancedSettingsPanelVisible ? 'block' : 'none'};">
      <div id="${ADVANCED_SETTINGS_CONTAINER_ID}" style="position: fixed; width: 80%; height: 80%; margin: auto; left: 0; right: 0; z-index: 1003; user-select: none; background: #455A64; border-radius: 5px; top: 25px; bottom: 0; padding: 15px; color: white; font-size: 1.3em; overflow-y: auto;">
        <div>
          <div style="background: #253035; position: fixed; padding: 2em; left: 50%; top: 0px; width: 100%; transform: translateX(-50%); height: 20px;">
            <h1 style="position: relative; left: 15px;">Configuration de la simulation</h1>
            <div style="float: right; position: relative; bottom: 31px; right: 20px;">
              <button type="button" id="${RESTORE_DEFAULT_ADVANCED_SETTINGS_BUTTON}">Restaurer les valeurs par défaut</button>
              <button type="button" id="${SAVE_ADVANCED_SETTINGS_BUTTON}">Sauvegarder</button>
            </div>
          </div>
          <div>
            <h2 style="padding-left: ${entryMargin}; padding-top: ${entryMargin}">Prise en compte des événements</h2>
            <div style="cursor: pointer; padding-left: ${subEntryMargin};" title="Configuration de l'activation des événements à prendre en compte dans la simulation.">
              <div style="cursor: pointer;" title="Prise en compte de la récupération d'horaires variables dans la simulation.">
                <input style="cursor: pointer;" type="checkbox" name="${OVERTIME_COMPENSATION_CHECKBOX_NAME}" id="${IS_OVERTIME_COMPENSATION_CHECKBOX_ID}" ${isOvertimeCompensation() ? 'checked' : ''}>
                <label for="${IS_OVERTIME_COMPENSATION_CHECKBOX_ID}" style="font-size: ${labelSize}; width: 400px; cursor: pointer;">Récupération horaire variable (${OVERTIME_COMPENSATION_TAG})</label>
              </div>

              <div style="cursor: pointer;" title="Prise en compte des congés payés dans la simulation.">
                <input style="cursor: pointer;" type="checkbox" name="${DAYS_OFF_CHECKBOX_NAME}" id="${ARE_DAYS_OFF_CHECKBOX_ID}" ${areDaysOff() ? 'checked' : ''}>
                <label for="${ARE_DAYS_OFF_CHECKBOX_ID}" style="font-size: ${labelSize}; width: 400px; cursor: pointer;">Congés payés (${DAYS_OFF_TAG})</label>
              </div>

              <div style="cursor: pointer;" title="Prise en compte des congés sans solde dans la simulation.">
                <input style="cursor: pointer;" type="checkbox" name="${UNPAID_TIME_OFF_CHECKBOX_NAME}" id="${IS_UNPAID_TIME_OFF_CHECKBOX_ID}" ${isUnpaidTimeOff() ? 'checked' : ''}>
                <label for="${IS_UNPAID_TIME_OFF_CHECKBOX_ID}" style="font-size: ${labelSize}; width: 400px; cursor: pointer;">Des congés sans solde (${UNPAID_TIME_OFF_TAG})</label>
              </div>

              <div style="cursor: pointer;" title="Prise en compte des jours fériés dans la simulation.">
                <input style="cursor: pointer;" type="checkbox" name="${NATIONAL_HOLIDAY_CHECKBOX_NAME}" id="${ARE_NATIONAL_HOLIDAY_CHECKBOX_ID}" ${areNationalHolidays() ? 'checked' : ''}>
                <label for="${ARE_NATIONAL_HOLIDAY_CHECKBOX_ID}" style="font-size: ${labelSize}; width: 400px; cursor: pointer;">Des jours fériés (${NATIONAL_HOLIDAY_TAG})</label>
              </div>

              <div style="cursor: pointer;" title="Prise en compte des arrêts maladie dans la simulation.">
                <input style="cursor: pointer;" type="checkbox" name="${SICK_DAYS_CHECKBOX_NAME}" id="${ARE_SICK_DAYS_CHECKBOX_ID}" ${areSickDays() ? 'checked' : ''}>
                <label for="${ARE_SICK_DAYS_CHECKBOX_ID}" style="font-size: ${labelSize}; width: 400px; cursor: pointer;">Des arrêts maladie (${SICK_DAYS_TAG})</label>
              </div>

              <div style="cursor: pointer;" title="Prise en compte du télétravail occasionel.">
                <input style="cursor: pointer;" type="checkbox" name="${OCCASIONAL_REMOTE_WORK_CHECKBOX_NAME}" id="${IS_OCCASIONAL_REMOTE_WORK_CHECKBOX_ID}" ${isOccasionalRemoteWork() ? 'checked' : ''}>
                <label for="${IS_OCCASIONAL_REMOTE_WORK_CHECKBOX_ID}" style="font-size: ${labelSize}; width: 400px; cursor: pointer;">Du télétravail occasionel (${OCCASIONAL_REMOTE_WORK_TAG})</label>
              </div>
            </div>
          </div>

          <div>
            <h2 style="padding-left: ${entryMargin}; padding-top: ${entryMargin}">Temps de travail requis</h2>
            <div style="cursor: pointer; padding-left: ${subEntryMargin};" title="Configuration du temps minimal requis par l'entreprise.">
              <div>
                <label for="${MORNING_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Matin</label>
                <input type="number" name="${MORNING_HOURS_INPUT_NAME}" id="${MORNING_HOURS_INPUT_ID}" placeholder="${DEFAULT_MORNING_HOURS}" style="width: 40px;" value="${getSettingsValue(MORNING_HOURS_KEY, DEFAULT_MORNING_HOURS)}">h
                <input type="number" name="${MORNING_MINUTES_INPUT_NAME}" id="${MORNING_MINUTES_INPUT_ID}" placeholder="${DEFAULT_MORNING_MINUTES}" style="width: 40px;" value="${getSettingsValue(MORNING_MINUTES_KEY, DEFAULT_MORNING_MINUTES)}">
              </div>
              <div>
                <label for="${AFTERNOON_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Après-midi</label>
                <input type="number" name="${AFTERNOON_HOURS_INPUT_NAME}" id="${AFTERNOON_HOURS_INPUT_ID}" placeholder="${DEFAULT_AFTERNOON_HOURS}" style="width: 40px;" value="${getSettingsValue(AFTERNOON_HOURS_KEY, DEFAULT_AFTERNOON_HOURS)}">h
                <input type="number" name="${AFTERNOON_MINUTES_INPUT_NAME}" id="${AFTERNOON_MINUTES_INPUT_ID}" placeholder="${DEFAULT_AFTERNOON_MINUTES}" style="width: 40px;" value="${getSettingsValue(AFTERNOON_MINUTES_KEY, DEFAULT_AFTERNOON_MINUTES)}">
              </div>
            </div>
          </div>

          <div>
            <h2 style="padding-left: ${entryMargin}; padding-top: ${entryMargin}">Départs et arrivées</h2>
            <div style="cursor: pointer; padding-left: ${subEntryMargin};" title="Configuration des horaires d'arrivée et de départ.">
              <div>
                <label for="${MINIMUM_BEGINNING_WORKING_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Heure minimale d'arrivée</label>
                <input type="number" name="${MINIMUM_BEGINNING_WORKING_HOURS_INPUT_NAME}" id="${MINIMUM_BEGINNING_WORKING_HOURS_INPUT_ID}" placeholder="${DEFAULT_MINIMUM_BEGINNING_WORKING_HOURS}" style="width: 40px;" value="${getSettingsValue(MINIMUM_BEGINNING_WORKING_HOURS_KEY, DEFAULT_MINIMUM_BEGINNING_WORKING_HOURS)}">h
                <input type="number" name="${MINIMUM_BEGINNING_WORKING_MINUTES_INPUT_NAME}" id="${MINIMUM_BEGINNING_WORKING_MINUTES_INPUT_ID}" placeholder="${DEFAULT_MINIMUM_BEGINNING_WORKING_MINUTES}" style="width: 40px;" value="${getSettingsValue(MINIMUM_BEGINNING_WORKING_MINUTES_KEY, DEFAULT_MINIMUM_BEGINNING_WORKING_MINUTES)}">
              </div>
              <div>
                <label for="${MINIMUM_LEAVING_WORKING_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Heure minimale de départ</label>
                <input type="number" name="${MINIMUM_LEAVING_WORKING_HOURS_INPUT_NAME}" id="${MINIMUM_LEAVING_WORKING_HOURS_INPUT_ID}" placeholder="${DEFAULT_MINIMUM_LEAVING_WORKING_HOURS}" style="width: 40px;" value="${getSettingsValue(MINIMUM_LEAVING_WORKING_HOURS_KEY, DEFAULT_MINIMUM_LEAVING_WORKING_HOURS)}">h
                <input type="number" name="${MINIMUM_LEAVING_WORKING_MINUTES_INPUT_NAME}" id="${MINIMUM_LEAVING_WORKING_MINUTES_INPUT_ID}" placeholder="${DEFAULT_MINIMUM_LEAVING_WORKING_MINUTES}" style="width: 40px;" value="${getSettingsValue(MINIMUM_LEAVING_WORKING_MINUTES_KEY, DEFAULT_MINIMUM_LEAVING_WORKING_MINUTES)}">
              </div>
              <div>
                <label for="${MAXIMUM_LEAVING_WORKING_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Heure maximale de départ</label>
                <input type="number" name="${MAXIMUM_LEAVING_WORKING_HOURS_INPUT_NAME}" id="${MAXIMUM_LEAVING_WORKING_HOURS_INPUT_ID}" placeholder="${DEFAULT_MAXIMUM_LEAVING_WORKING_HOURS}" style="width: 40px;" value="${getSettingsValue(MAXIMUM_LEAVING_WORKING_HOURS_KEY, DEFAULT_MAXIMUM_LEAVING_WORKING_HOURS)}">h
                <input type="number" name="${MAXIMUM_LEAVING_WORKING_MINUTES_INPUT_NAME}" id="${MAXIMUM_LEAVING_WORKING_MINUTES_INPUT_ID}" placeholder="${DEFAULT_MAXIMUM_LEAVING_WORKING_MINUTES}" style="width: 40px;" value="${getSettingsValue(MAXIMUM_LEAVING_WORKING_MINUTES_KEY, DEFAULT_MAXIMUM_LEAVING_WORKING_MINUTES)}">
              </div>
            </div>
          </div>

          <div>
            <h2 style="padding-left: ${entryMargin}; padding-top: ${entryMargin}">Temps de pause</h2>
            <div style="cursor: pointer; padding-left: ${subEntryMargin};" title="Configuration des temps de pause.">
              <div>
                <label for="${MINIMUM_LUNCH_BREAK_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Temps minimum le midi</label>
                <input type="number" name="${MINIMUM_LUNCH_BREAK_HOURS_INPUT_NAME}" id="${MINIMUM_LUNCH_BREAK_HOURS_INPUT_ID}" placeholder="${DEFAULT_MINIMUM_LUNCH_BREAK_HOURS}" style="width: 40px;" value="${getSettingsValue(MINIMUM_LUNCH_BREAK_HOURS_KEY, DEFAULT_MINIMUM_LUNCH_BREAK_HOURS)}">h
                <input type="number" name="${MINIMUM_LUNCH_BREAK_MINUTES_INPUT_NAME}" id="${MINIMUM_LUNCH_BREAK_MINUTES_INPUT_ID}" placeholder="${DEFAULT_MINIMUM_LUNCH_BREAK_MINUTES}" style="width: 40px;" value="${getSettingsValue(MINIMUM_LUNCH_BREAK_MINUTES_KEY, DEFAULT_MINIMUM_LUNCH_BREAK_MINUTES)}">
              </div>
              <div>
                <label for="${MORNING_BREAK_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Temps de pause le matin</label>
                <input type="number" name="${MORNING_BREAK_HOURS_INPUT_NAME}" id="${MORNING_BREAK_HOURS_INPUT_ID}" placeholder="${DEFAULT_MORNING_BREAK_HOURS}" style="width: 40px;" value="${getSettingsValue(MORNING_BREAK_HOURS_KEY, DEFAULT_MORNING_BREAK_HOURS)}">h
                <input type="number" name="${MORNING_BREAK_MINUTES_INPUT_NAME}" id="${MORNING_BREAK_MINUTES_INPUT_ID}" placeholder="${DEFAULT_MORNING_BREAK_MINUTES}" style="width: 40px;" value="${getSettingsValue(MORNING_BREAK_MINUTES_KEY, DEFAULT_MORNING_BREAK_MINUTES)}">
              </div>
              <div>
                <label for="${AFTERNOON_BREAK_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Temps de pause l'après midi</label>
                <input type="number" name="${AFTERNOON_BREAK_HOURS_INPUT_NAME}" id="${AFTERNOON_BREAK_HOURS_INPUT_ID}" placeholder="${DEFAULT_AFTERNOON_BREAK_HOURS}" style="width: 40px;" value="${getSettingsValue(AFTERNOON_BREAK_HOURS_KEY, DEFAULT_AFTERNOON_BREAK_HOURS)}">h
                <input type="number" name="${AFTERNOON_BREAK_MINUTES_INPUT_NAME}" id="${AFTERNOON_BREAK_MINUTES_INPUT_ID}" placeholder="${DEFAULT_AFTERNOON_BREAK_MINUTES}" style="width: 40px;" value="${getSettingsValue(AFTERNOON_BREAK_MINUTES_KEY, DEFAULT_AFTERNOON_BREAK_MINUTES)}">
              </div>
            </div>
          </div>

          <div>
            <h2 style="padding-left: ${entryMargin}; padding-top: ${entryMargin}">Heures recommandées</h2>
            <div style="cursor: pointer; padding-left: ${subEntryMargin};" title="Configuration des heures recommandées.">
              <div>
                <label for="${RECOMMENDED_BEGINNING_WORKING_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Heure d'arrivée recommandée</label>
                <input type="number" name="${RECOMMENDED_BEGINNING_WORKING_HOURS_INPUT_NAME}" id="${RECOMMENDED_BEGINNING_WORKING_HOURS_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_BEGINNING_WORKING_HOURS}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_BEGINNING_WORKING_HOURS_KEY, DEFAULT_RECOMMENDED_BEGINNING_WORKING_HOURS)}">h
                <input type="number" name="${RECOMMENDED_BEGINNING_WORKING_MINUTES_INPUT_NAME}" id="${RECOMMENDED_BEGINNING_WORKING_MINUTES_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_BEGINNING_WORKING_MINUTES}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_BEGINNING_WORKING_MINUTES_KEY, DEFAULT_RECOMMENDED_BEGINNING_WORKING_MINUTES)}">
              </div>
              <div>
                <label for="${RECOMMENDED_BEGINNING_LUNCH_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Heure de fin de pause midi recommandée</label>
                <input type="number" name="${RECOMMENDED_BEGINNING_LUNCH_HOURS_INPUT_NAME}" id="${RECOMMENDED_BEGINNING_LUNCH_HOURS_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_BEGINNING_LUNCH_HOURS}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_BEGINNING_LUNCH_HOURS_KEY, DEFAULT_RECOMMENDED_BEGINNING_LUNCH_HOURS)}">h
                <input type="number" name="${RECOMMENDED_BEGINNING_LUNCH_MINUTES_INPUT_NAME}" id="${RECOMMENDED_BEGINNING_LUNCH_MINUTES_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_BEGINNING_LUNCH_MINUTES}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_BEGINNING_LUNCH_MINUTES_KEY, DEFAULT_RECOMMENDED_BEGINNING_LUNCH_MINUTES)}">
              </div>
              <div>
                <label for="${RECOMMENDED_ENDING_LUNCH_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Heure de fin de pause midi recommandée</label>
                <input type="number" name="${RECOMMENDED_ENDING_LUNCH_HOURS_INPUT_NAME}" id="${RECOMMENDED_ENDING_LUNCH_HOURS_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_ENDING_LUNCH_HOURS}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_ENDING_LUNCH_HOURS_KEY, DEFAULT_RECOMMENDED_ENDING_LUNCH_HOURS)}">h
                <input type="number" name="${RECOMMENDED_ENDING_LUNCH_MINUTES_INPUT_NAME}" id="${RECOMMENDED_ENDING_LUNCH_MINUTES_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_ENDING_LUNCH_MINUTES}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_ENDING_LUNCH_MINUTES_KEY, DEFAULT_RECOMMENDED_ENDING_LUNCH_MINUTES)}">
              </div>
              <div>
                <label for="${RECOMMENDED_ENDING_WORKING_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Heure de départ recommandée</label>
                <input type="number" name="${RECOMMENDED_ENDING_WORKING_HOURS_INPUT_NAME}" id="${RECOMMENDED_ENDING_WORKING_HOURS_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_ENDING_WORKING_HOURS}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_ENDING_WORKING_HOURS_KEY, DEFAULT_RECOMMENDED_ENDING_WORKING_HOURS)}">h
                <input type="number" name="${RECOMMENDED_ENDING_WORKING_MINUTES_INPUT_NAME}" id="${RECOMMENDED_ENDING_WORKING_MINUTES_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_ENDING_WORKING_MINUTES}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_ENDING_WORKING_MINUTES_KEY, DEFAULT_RECOMMENDED_ENDING_WORKING_MINUTES)}">
              </div>
              <div>
                <label for="${RECOMMENDED_LUNCH_BREAK_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Temps de pause midi recommandé</label>
                <input type="number" name="${RECOMMENDED_LUNCH_BREAK_HOURS_INPUT_NAME}" id="${RECOMMENDED_LUNCH_BREAK_HOURS_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_LUNCH_BREAK_HOURS}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_LUNCH_BREAK_HOURS_KEY, DEFAULT_RECOMMENDED_LUNCH_BREAK_HOURS)}">h
                <input type="number" name="${RECOMMENDED_LUNCH_BREAK_MINUTES_INPUT_NAME}" id="${RECOMMENDED_LUNCH_BREAK_MINUTES_INPUT_ID}" placeholder="${DEFAULT_RECOMMENDED_LUNCH_BREAK_MINUTES}" style="width: 40px;" value="${getSettingsValue(RECOMMENDED_LUNCH_BREAK_MINUTES_KEY, DEFAULT_RECOMMENDED_LUNCH_BREAK_MINUTES)}">
              </div>
            </div>
          </div>

          <div>
            <h2 style="padding-left: ${entryMargin}; padding-top: ${entryMargin}">Delta horaire variable</h2>
            <div style="cursor: pointer; padding-left: ${subEntryMargin};" title="Configuration des valeurs minimales et maximales des deltas associés aux horaires variables.">
              <div>
                <label for="${LOWEST_TOTAL_EXTRA_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Temps minimal (officiellement) autorisé</label>
                <input type="number" name="${LOWEST_TOTAL_EXTRA_HOURS_INPUT_NAME}" id="${LOWEST_TOTAL_EXTRA_HOURS_INPUT_ID}" placeholder="${DEFAULT_LOWEST_TOTAL_EXTRA_HOURS}" style="width: 40px;" value="${getSettingsValue(LOWEST_TOTAL_EXTRA_HOURS_KEY, DEFAULT_LOWEST_TOTAL_EXTRA_HOURS)}">h
                <input type="number" name="${LOWEST_TOTAL_EXTRA_MINUTES_INPUT_NAME}" id="${LOWEST_TOTAL_EXTRA_MINUTES_INPUT_ID}" placeholder="${DEFAULT_LOWEST_TOTAL_EXTRA_MINUTES}" style="width: 40px;" value="${getSettingsValue(LOWEST_TOTAL_EXTRA_MINUTES_KEY, DEFAULT_LOWEST_TOTAL_EXTRA_MINUTES)}">
              </div>
              <div>
                <label for="${HIGHEST_WEEKLY_EXTRA_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Temps maximal hebdomadaire</label>
                <input type="number" name="${HIGHEST_WEEKLY_EXTRA_HOURS_INPUT_NAME}" id="${HIGHEST_WEEKLY_EXTRA_HOURS_INPUT_ID}" placeholder="${DEFAULT_HIGHEST_WEEKLY_EXTRA_HOURS}" style="width: 40px;" value="${getSettingsValue(HIGHEST_WEEKLY_EXTRA_HOURS_KEY, DEFAULT_HIGHEST_WEEKLY_EXTRA_HOURS)}">h
                <input type="number" name="${HIGHEST_WEEKLY_EXTRA_MINUTES_INPUT_NAME}" id="${HIGHEST_WEEKLY_EXTRA_MINUTES_INPUT_ID}" placeholder="${DEFAULT_HIGHEST_WEEKLY_EXTRA_MINUTES}" style="width: 40px;" value="${getSettingsValue(HIGHEST_WEEKLY_EXTRA_MINUTES_KEY, DEFAULT_HIGHEST_WEEKLY_EXTRA_MINUTES)}">
              </div>
              <div>
                <label for="${HIGHEST_TOTAL_EXTRA_HOURS_INPUT_ID}" style="font-size: ${labelSize}; width: initial; display: inline-block;">Temps maximal mensuel</label>
                <input type="number" name="${HIGHEST_TOTAL_EXTRA_HOURS_INPUT_NAME}" id="${HIGHEST_TOTAL_EXTRA_HOURS_INPUT_ID}" placeholder="${DEFAULT_HIGHEST_TOTAL_EXTRA_HOURS}" style="width: 40px;" value="${getSettingsValue(HIGHEST_TOTAL_EXTRA_HOURS_KEY, DEFAULT_HIGHEST_TOTAL_EXTRA_HOURS)}">h
                <input type="number" name="${HIGHEST_TOTAL_EXTRA_MINUTES_INPUT_NAME}" id="${HIGHEST_TOTAL_EXTRA_MINUTES_INPUT_ID}" placeholder="${DEFAULT_HIGHEST_TOTAL_EXTRA_MINUTES}" style="width: 40px;" value="${getSettingsValue(HIGHEST_TOTAL_EXTRA_MINUTES_KEY, DEFAULT_HIGHEST_TOTAL_EXTRA_MINUTES)}">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; z-index: 1000; background: black; background: rgba(0,0,0,0.8);"</div>
    </div>
  `

  document.body.appendChild(advancedSettingsModal)
  const advancedSettingsContainer = document.getElementById(ADVANCED_SETTINGS_CONTAINER_ID)
  const saveAdvancedSettingsButton = document.getElementById(SAVE_ADVANCED_SETTINGS_BUTTON)
  const restoreDefaultAdvancedSettingsButton = document.getElementById(RESTORE_DEFAULT_ADVANCED_SETTINGS_BUTTON)

  advancedSettingsButton.removeEventListener(
    'click', handleAdvancedSettingsButtonClick
  )

  advancedSettingsContainer.removeEventListener(
    'click', handleAdvancedSettingsClick
  )

  saveAdvancedSettingsButton.removeEventListener(
    'click', handleAdvancedSettingsSaveButtonClick
  )

  restoreDefaultAdvancedSettingsButton.removeEventListener(
    'click', handleAdvancedSettingsRestoreButtonClick
  )

  advancedSettingsButton.addEventListener(
    'click', handleAdvancedSettingsButtonClick
  )

  advancedSettingsContainer.addEventListener(
    'click', handleAdvancedSettingsClick
  )

  saveAdvancedSettingsButton.addEventListener(
    'click', handleAdvancedSettingsSaveButtonClick
  )

  restoreDefaultAdvancedSettingsButton.addEventListener(
    'click', handleAdvancedSettingsRestoreButtonClick
  )
}

// Set the HXR HTTP request data to retrieve the extra hours from the ADP
// (ugly) API.
function setXhrHttpRequestData (data) {
  let requestData = ''

  for (const [key, value] of Object.entries(data)) {
    requestData += `${key}=${encodeURI(value)}&`
  }

  if (requestData) {
    requestData = requestData.substring(0, requestData.length - 1)
  }

  return requestData
}

// Get the extra time at the beginning of the week.
function getBeginningOfTheWeekExtraTime () {
  if (isDebugMode()) {
    return getDebugExtraHoursTime()
  }

  return globalCounterTime
}

// Request the ADP extra hours.
function requestAdpExtraHours () {
  return new Promise(resolve => {
    const currentUrl = window.location.href
    const ajaxUrl = `index.ajax.php?${currentUrl.match(TOKEN_REGEX)[0]}` +
      '&module_ajax=compteurs&action_ajax=RECUPERATION'

    const xhrHttpRequest = new XMLHttpRequest()

    xhrHttpRequest.onload = () => {
      if (xhrHttpRequest.status >= 200 && xhrHttpRequest.status < 300) {
        try {
          const globalCounterList =
            xhrHttpRequest.response.split('Debit credit hor.variable')[1]
              .split('<td class="d">')[1].split('</td')[0].split(':')

          let isNegative = false

          try {
            isNegative = globalCounterList[0][0] === '-'
          } catch (error) {
            console.error(
              'The XHR HTTP request from the ADP API seems to be malformed.'
            )
          }

          globalCounterHours = parseInt(globalCounterList[0])
          globalCounterMinutes = parseInt(globalCounterList[1])
          globalCounterTime = convertToSeconds({
            hours: Math.abs(globalCounterHours),
            minutes: Math.abs(globalCounterMinutes),
            isNegative: isNegative
          })
        } catch (error) {
          globalCounterHours = globalCounterMinutes = globalCounterTime = 0
          alert(ERROR_GLOBAL_COUNTER)
        }

        resolve()
      }
    }

    xhrHttpRequest.onerror = () => {
      globalCounterHours = globalCounterMinutes = globalCounterTime = 0
      alert(ERROR_GLOBAL_COUNTER)
    }

    xhrHttpRequest.open('POST', ajaxUrl, true)

    xhrHttpRequest.setRequestHeader(
      'Content-Type', 'application/x-www-form-urlencoded'
    )

    xhrHttpRequest.setRequestHeader(
      'X-Requested-With', 'XMLHttpRequest'
    )

    const dateList = currentMondayObj
    const dateString = `${dateList.year}/${dateList.month}/${dateList.day}`

    const requestData = {
      format: 1,
      date_cpt: dateString,
      perfin: 'N',
      'dojo.preventCache': 1574510256448
    }

    xhrHttpRequest.send(setXhrHttpRequestData(requestData))
  })
}

// Request the ADP overtime compensation time.
function requestAdpOvertimeComposentationTime () {
  return new Promise(resolve => {
    overtimeCompensationTimes = {}
    const currentUrl = window.location.href
    const ajaxUrl = `index.ajax.php?${currentUrl.match(TOKEN_REGEX)[0]}` +
      '&module_ajax=evenements&action_ajax=CONSULTATION_AFFICHER'

    const xhrHttpRequest = new XMLHttpRequest()

    xhrHttpRequest.onload = () => {
      if (xhrHttpRequest.status >= 200 && xhrHttpRequest.status < 300) {
        try {
          const rawResponse = xhrHttpRequest.response

          if (rawResponse.indexOf('Aucun évenement disponible.') !== -1) {
            resolve()
            return
          }

          const tmpHtmlObjParent = document.createElement('div')
          tmpHtmlObjParent.innerHTML = rawResponse
          const tmpHtmlObjs = tmpHtmlObjParent.getElementsByTagName('tbody')[0]

          for (const tmpHtmlObj of tmpHtmlObjs.children) {
            const rawDate = tmpHtmlObj.children[2].innerHTML.trim()
            const rawValue =
              tmpHtmlObj.children[4].innerHTML.trim().toLowerCase()

            const rawDateValues = rawDate.split('/')

            const date = new Date(
              Date.parse(
                `${rawDateValues[1]}/${rawDateValues[0]}/${rawDateValues[2]}`
              )
            )

            const currentDayUS = date.getDay()
            const currentDay = currentDayUS === 0 ? 6 : currentDayUS - 1

            if (rawValue === 'matin') {
              overtimeCompensationTimes[currentDay] = getMorningTime()
            } else if (rawValue === 'après-midi') {
              overtimeCompensationTimes[currentDay] = getAfternoonTime()
            } else if (rawValue === 'journée') {
              overtimeCompensationTimes[currentDay] =
                getMorningTime() + getAfternoonTime()
            } else {
              const rawNumbers = rawValue.split(':')
              const hours = parseInt(rawNumbers[0])
              const minutes = parseInt(rawNumbers[1])

              if (isNaN(hours) || isNaN(minutes)) {
                continue
              }

              overtimeCompensationTimes[currentDay] =
                hours * 3600 + minutes * 60
            }
          }
        } catch (error) {
          overtimeCompensationHours = overtimeCompensationMinutes =
            overtimeCompensationTime = 0
          alert(ERROR_OVERTIME_COMPENSATION)
        }

        resolve()
      }
    }

    xhrHttpRequest.onerror = () => {
      overtimeCompensationHours = overtimeCompensationMinutes =
        overtimeCompensationTime = 0
      alert(ERROR_OVERTIME_COMPENSATION)
    }

    xhrHttpRequest.open('POST', ajaxUrl, true)

    xhrHttpRequest.setRequestHeader(
      'Content-Type', 'application/x-www-form-urlencoded'
    )

    xhrHttpRequest.setRequestHeader(
      'X-Requested-With', 'XMLHttpRequest'
    )

    const fromDate =
      `${currentMondayObj.day}/${currentMondayObj.month}/${currentMondayObj.year}`
    const toDate =
      `${currentFridayObj.day}/${currentFridayObj.month}/${currentFridayObj.year}`

    const requestData = {
      COLONNE_TRI: 'datdeb',
      FLAG_TRI: 'DESC',
      TRI: ['DATDEB DESC', 'LIB_MOTIF ASC', 'VALIDATION ASC'],
      'STATUT[]': 3,
      date_debut: fromDate,
      date_fin: toDate,
      ALL_MOTIF: '',
      'MOTIF[]': 'RV',
      FAMILLE: 'T',
      'dojo.preventCache': 1644419511367
    }

    xhrHttpRequest.send(setXhrHttpRequestData(requestData))
  })
}

// Update the settings accordingly.
function updateSettings () {
  const weekLabel = getWeekLabel()
  const isPresent = weekLabel === WEEK_PRESENT

  const refreshCheckboxInput =
    document.getElementById(REFRESH_PAGE_CHECKBOX_ID)
  refreshCheckboxInput.disabled = !isPresent

  if (!isPresent) {
    isRefreshPage = false
    refreshCheckboxInput.checked = isRefreshPage = false
  } else {
    refreshCheckboxInput.checked = isRefreshPage =
      getSettingsValue(REFRESH_PAGE_CHECKBOX_KEY)
  }

  document.getElementById(REFRESH_PAGE_TIME_ID).disabled = !isPresent

  const globalCounterCheckboxInput =
    document.getElementById(GLOBAL_COUNTER_CHECKBOX_ID)
  globalCounterCheckboxInput.disabled = !isPresent

  if (!isPresent) {
    globalCounterCheckboxInput.checked = isGlobalCounterIncluded = false
  } else {
    globalCounterCheckboxInput.checked = isGlobalCounterIncluded =
      getSettingsValue(GLOBAL_COUNTER_CHECKBOX_KEY)
  }

  const endNotificationsCheckboxInput =
    document.getElementById(END_NOTIFICATION_CHECKBOX_ID)
  endNotificationsCheckboxInput.disabled = !isPresent

  if (!isPresent) {
    endNotificationsCheckboxInput.checked = areEndNotifications = false
  } else {
    endNotificationsCheckboxInput.checked = areEndNotifications =
      getSettingsValue(END_NOTIFICATION_CHECKBOX_KEY) &&
        Notification.permission === 'granted'
  }
}

// Handle debug mode checkbox.
function handleDebugModeCheckbox (event) {
  const oldIsDebug =
    getSettingsValue(DEBUG_IS_DEBUG_MODE_KEY, DEBUG_IS_DEBUG_MODE_DEFAULT_VALUE)
  const newIsDebug = event.target.checked
  setSettingsValue(DEBUG_IS_DEBUG_MODE_KEY, newIsDebug)

  if (oldIsDebug !== newIsDebug) {
    restoreSavedHours(newIsDebug)
  }

  updateSettings()
  refreshPage(true)
}

// Handle debug now date picker.
function handleDebugNowDatePicker (event) {
  setSettingsValue(DEBUG_NOW_KEY, new Date(event.target.value))
  updateSettings()
  refreshPage(true)
}

// Handle debug week label select.
function handleDebugWeekLabelSelect (event) {
  setSettingsValue(DEBUG_WEEK_LABEL_KEY, event.target.value)
  updateSettings()
  refreshPage(true)
}

// Handle debug extra hours input.
function handleDebugExtraHoursInput (event) {
  const rawInput = event.target.value
  const found = rawInput.match(DEBUG_EXTRA_HOURS_REGEX)

  if (found === null) {
    return
  }

  let debugExtraHoursSign
  let debugExtraHoursHours
  let debugExtraHoursMinutes

  if (found.groups.sign === undefined || found.groups.sign === '+') {
    debugExtraHoursSign = 1
  } else {
    debugExtraHoursSign = -1
  }

  if (found.groups.hours !== undefined) {
    debugExtraHoursHours = found.groups.hours
  } else {
    debugExtraHoursHours = DEBUG_EXTRA_HOURS_HOURS_DEFAULT_VALUE
  }

  if (found.groups.minutes !== undefined) {
    debugExtraHoursMinutes = found.groups.minutes
  } else {
    debugExtraHoursMinutes = DEBUG_EXTRA_HOURS_MINUTES_DEFAULT_VALUE
  }

  setSettingsValue(DEBUG_EXTRA_HOURS_HOURS_KEY, debugExtraHoursHours)
  setSettingsValue(DEBUG_EXTRA_HOURS_MINUTES_KEY, debugExtraHoursMinutes)
  setSettingsValue(DEBUG_EXTRA_HOURS_SIGN_KEY, debugExtraHoursSign)

  refreshPage(true)
}

// Insert hours for a given day (for debbuging purposes).
function insertHoursForAGivenDay (day, hoursDescr = null) {
  const dayTableElement = getTimeTableElement().children[day]
  const morning1Element = dayTableElement
    .children[0].children[0].children[0].children[0]
  const morning2Element = dayTableElement
    .children[0].children[0].children[0].children[2]
  const afternoon1Element = dayTableElement
    .children[0].children[0].children[1].children[0]
  const afternoon2Element = dayTableElement
    .children[0].children[0].children[1].children[2]

  morning1Element.style.color = ORIGINAL_COLOR_HOURS_CSS
  morning2Element.style.color = ORIGINAL_COLOR_HOURS_CSS
  afternoon1Element.style.color = ORIGINAL_COLOR_HOURS_CSS
  afternoon2Element.style.color = ORIGINAL_COLOR_HOURS_CSS

  morning1Element.parentElement.parentElement.children[4]
    .style.color = ORIGINAL_COLOR_HOURS_CSS
  morning2Element.parentElement.parentElement.children[4]
    .style.color = ORIGINAL_COLOR_HOURS_CSS
  afternoon1Element.parentElement.parentElement.children[4]
    .style.color = ORIGINAL_COLOR_HOURS_CSS
  afternoon2Element.parentElement.parentElement.children[4]
    .style.color = ORIGINAL_COLOR_HOURS_CSS

  if (hoursDescr === null) {
    const now = getNow()
    const weekLabel = getWeekLabel()
    const currentDay = getCurrentDayNumber()

    // We are in the future. Nothing to do.
    if (weekLabel === WEEK_FUTURE || currentDay < day) {
      morning1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      morning2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE

      return
    // We are in the past.
    } else if (weekLabel === WEEK_PAST || currentDay > day) {
      morning1Element.innerText =
        convertToTimeString(getRecommendedBeginningWorkingTime())
      morning2Element.innerText =
        convertToTimeString(getRecommendedBeginningLunchTime())
      afternoon1Element.innerText =
        convertToTimeString(getRecommendedEndingLunchTime())
      afternoon2Element.innerText =
        convertToTimeString(getRecommendedEndingWorkingTime())

      return
    }

    // We are in the current day, so we need to fill the hours accordingly.
    const currentTime = convertToSeconds({
      hours: now.getHours(),
      minutes: now.getMinutes()
    })

    if (currentTime < getRecommendedBeginningWorkingTime()) {
      morning1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      morning2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      return
    }

    morning1Element.innerText =
      convertToTimeString(getRecommendedBeginningWorkingTime())

    if (currentTime < getRecommendedBeginningLunchTime()) {
      morning2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      return
    }

    morning2Element.innerText =
      convertToTimeString(getRecommendedBeginningLunchTime())

    if (currentTime < getRecommendedEndingLunchTime()) {
      afternoon1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      return
    }

    afternoon1Element.innerText =
      convertToTimeString(getRecommendedEndingLunchTime())

    if (currentTime < getRecommendedEndingWorkingTime()) {
      afternoon2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      return
    }

    afternoon2Element.innerText =
      convertToTimeString(getRecommendedEndingWorkingTime())
  } else {
    if (hoursDescr.morning1 === undefined) {
      morning1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      morning2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      return
    }

    morning1Element.innerText = convertToTimeString(hoursDescr.morning1)

    if (hoursDescr.morning2 === undefined) {
      morning2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      return
    }

    morning2Element.innerText = convertToTimeString(hoursDescr.morning2)

    if (hoursDescr.afternoon1 === undefined) {
      afternoon1Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      afternoon2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      return
    }

    afternoon1Element.innerText = convertToTimeString(hoursDescr.afternoon1)

    if (hoursDescr.afternoon2 === undefined) {
      afternoon2Element.innerHTML = HOUR_ELEMENT_EMPTY_DEFAULT_VALUE
      return
    }

    afternoon2Element.innerText = convertToTimeString(hoursDescr.afternoon2)
  }
}

// Get hours for a given day (for debbuging purposes).
function extractHoursForAGivenDay (day) {
  const morning1 = getStartMorningTime(day)
  const morning2 = getEndMorningTime(day)
  const afternoon1 = getStartAfternoonTime(day)
  const afternoon2 = getEndAfternoonTime(day)

  if (morning1 === null) {
    return null
  }

  const extractedHours = { morning1: morning1 }

  if (morning2 === null) {
    return extractedHours
  }

  extractedHours.morning2 = morning2

  if (afternoon1 === null) {
    return extractedHours
  }

  extractedHours.afternoon1 = afternoon1

  if (afternoon2 === null) {
    return extractedHours
  }

  extractedHours.afternoon2 = afternoon2

  return extractedHours
}

// Generate hours (for debbuging purposes).
function generateHours (hoursDescr = null, isHoursReset = false) {
  if (hoursDescr === null) hoursDescr = []

  let currentDay

  for (currentDay = 0; currentDay < hoursDescr.length; currentDay++) {
    insertHoursForAGivenDay(currentDay, hoursDescr[currentDay])
  }

  for (currentDay; currentDay < 5; currentDay++) {
    insertHoursForAGivenDay(currentDay)
  }
}

// Extract current hours (for debbuging purposes).
function extractCurrentHours () {
  const extractedHours = []
  let extractedResult = null

  for (let currentDay = 0; currentDay < 5; currentDay++) {
    extractedResult = extractHoursForAGivenDay(currentDay)

    if (extractedResult === null) break

    extractedHours.push(extractedResult)
  }

  return extractedHours
}

// Save current hours.
function saveCurrentHours (isDebug) {
  const key = isDebug ? DEBUG_GENERATED_HOURS_KEY : DEBUG_ACTUAL_HOURS_KEY

  setSettingsValue(key, JSON.stringify(extractCurrentHours()))
}

// Restore saved hours (for debugging purposes).
function restoreSavedHours (isDebug) {
  const key = isDebug ? DEBUG_GENERATED_HOURS_KEY : DEBUG_ACTUAL_HOURS_KEY
  const defaultValue = isDebug
    ? DEBUG_GENERATED_HOURS_DEFAULT_VALUE : DEBUG_ACTUAL_HOURS_DEFAULT_VALUE

  generateHours(
    JSON.parse(getSettingsValue(key, defaultValue))
  )
}

// Handle generate hours button click.
function handleGenerateHoursButtonClick (event) {
  generateHours()
  refreshPage(true)
}

// Handle save hours button click.
function handleSaveHoursButtonClick (event) {
  saveCurrentHours(true)
  refreshPage(true)
}

// Handle restore hours button click.
function handleRestoreHoursButtonClick (event) {
  restoreSavedHours(true)
  refreshPage(true)
}

// Handle delete hours button click.
function handleDeleteHoursButtonClick (event) {
  removeSettingsValue(DEBUG_GENERATED_HOURS_KEY)
  refreshPage(true)
}

// Handle restore actual hours button click.
function handleRestoreActualHoursButtonClick (event) {
  restoreSavedHours(false)
  refreshPage(true)
}

// Get debug extra hours time.
function getDebugExtraHoursTime () {
  return getSettingsValue(
    DEBUG_EXTRA_HOURS_SIGN_KEY, DEBUG_EXTRA_HOURS_SIGN_DEFAULT_VALUE
  ) * convertToSeconds(
    {
      hours: getSettingsValue(
        DEBUG_EXTRA_HOURS_HOURS_KEY, DEBUG_EXTRA_HOURS_HOURS_DEFAULT_VALUE
      ),
      minutes: getSettingsValue(
        DEBUG_EXTRA_HOURS_MINUTES_KEY, DEBUG_EXTRA_HOURS_MINUTES_DEFAULT_VALUE
      )
    }
  )
}

// Set up debug mode.
function setUpDebugMode () {
  saveCurrentHours(false)
  const isDebugPanelVisible = getSettingsValue(
    DEBUG_IS_DEBUG_PANEL_VISIBLE_KEY, DEBUG_IS_DEBUG_PANEL_VISIBLE_DEFAULT_VALUE
  )
  const isDebugMode = getSettingsValue(
    DEBUG_IS_DEBUG_MODE_KEY, DEBUG_IS_DEBUG_MODE_DEFAULT_VALUE
  )
  const debugNow = getSettingsValue(DEBUG_NOW_KEY, DEBUG_NOW_DEFAULT_VALUE)
  const debugWeekLabel = getSettingsValue(
    DEBUG_WEEK_LABEL_KEY, DEBUG_WEEK_LABEL_DEFAULT_VALUE
  )
  const debugExtraHoursTime = getDebugExtraHoursTime()

  const buttonStyle = 'width: 30px; height: 30px;'

  const debugContainer = document.createElement('div')
  debugContainer.innerHTML = `
    <div id="${DEBUG_MODE_CONTAINER_ID}" style="background: #455A64; width: 200px; padding: 15px; border-radius: 5px; position: absolute; z-index: 9999; bottom: 15px; right: 15px; user-select: none; display: ${isDebugPanelVisible ? 'block' : 'none'};">
      <div style="margin-bottom: 10px;" title="Active le mode debug (le script prendra en compte les modifications apportées sur cette fenêtre).">
        <input style="cursor: pointer;" type="checkbox" name="${DEBUG_NOW_IS_DEBUG_CHECKBOX_NAME}" id="${DEBUG_NOW_IS_DEBUG_CHECKBOX_ID}" ${isDebugMode ? 'checked' : ''}>
        <label for="${DEBUG_NOW_IS_DEBUG_CHECKBOX_ID}" style="width: 150px; cursor: pointer; color: white; user-select: none;">Activer le mode debug</label>
      </div>
      <div style="margin-bottom: 10px;" title="Permet de simuler la date actuelle.">
        <label style="width: 100%; color: white; user-select: none;" for="${DEBUG_NOW_DATE_PICKER_ID}">Date actuelle</label>
        <input style="width: 195px; height: 25px;" type="datetime-local" id="${DEBUG_NOW_DATE_PICKER_ID}" name="${DEBUG_NOW_DATE_PICKER_NAME}" value="${debugNow.toISOString().slice(0, -5)}">
      </div>
      <div style="margin-bottom: 10px;" title="Permet de définir si la semaine est celle actuelle, dans le passé ou dans le futur.">
        <label style="width: 100%; color: white; user-select: none;" for="${DEBUG_WEEK_LABEL_SELECT_ID}">Label temporel</label>
        <select style="width: 100%; height: 30px;" name="${DEBUG_WEEK_LABEL_SELECT_NAME}" id="${DEBUG_WEEK_LABEL_SELECT_ID}">
          <option value="${WEEK_PAST}" ${debugWeekLabel === WEEK_PAST ? 'selected' : ''}>Passé</option>
          <option value="${WEEK_PRESENT}" ${debugWeekLabel === WEEK_PRESENT ? 'selected' : ''}>Présent</option>
          <option value="${WEEK_FUTURE}" ${debugWeekLabel === WEEK_FUTURE ? 'selected' : ''}>Futur</option>
        </select>
      </div>
      <div style="margin-bottom: 10px;" title="Modifie le nombre d'heures supplémentaires en début de semaine.">
        <label style="width: 100%; color: white; user-select: none;" for="${DEBUG_EXTRA_HOURS_INPUT_ID}">Heures supplémentaires</label>
        <input value="${convertToTimeDeltaString(debugExtraHoursTime)}" style="width: 190px; height: 20px;" type="text" id="${DEBUG_EXTRA_HOURS_INPUT_ID}" name="${DEBUG_EXTRA_HOURS_INPUT_NAME}">
      </div>
      <div title="Panneau de génération automatique/sauvegarde/restauration/suppression d'horaires simulées pour faciliter le debugging.">
        <label style="width: 100%; color: white; user-select: none;" for="${DEBUG_WEEK_LABEL_SELECT_ID}">Simulation des horaires</label>
        <button style="${buttonStyle}" id="${DEBUG_GENERATE_HOURS_BUTTON_ID}" title="Génère automatiquement les horaires." type="button">✚</button>
        <button style="${buttonStyle}" id="${DEBUG_SAVE_HOURS_BUTTON_ID}" title="Sauvegarde les horaires générées." type="button">▼</button>
        <button style="${buttonStyle}" id="${DEBUG_RESTORE_HOURS_BUTTON_ID}" title="Restaure les horaires générées." type="button">▲</button>
        <button style="${buttonStyle}" id="${DEBUG_DELETE_HOURS_BUTTON_ID}" title="Supprime les horaires générées sauvegardées." type="button">♻</button>
        <button style="${buttonStyle}" id="${DEBUG_RESTORE_ACTUAL_HOURS_BUTTON_ID}" title="Restaure les horaires réelles." type="button">✪</button>
      </div>
    </div>
  `

  document.body.appendChild(debugContainer)

  setUpDebugPanel()

  if (isDebugMode &&
    getSettingsValue(
      DEBUG_GENERATED_HOURS_KEY, DEBUG_GENERATED_HOURS_DEFAULT_VALUE
    ) !== null) {
    restoreSavedHours(true)
  }
}

function setUpDebugPanel () {
  const debugContainer = document.getElementById(DEBUG_MODE_CONTAINER_ID)
  let shortcutBuffer = []
  let shortcutTimeout = null
  const clearBuffer = () => {
    if (shortcutTimeout !== null) {
      window.clearTimeout(shortcutTimeout)
    }

    shortcutTimeout = null
    shortcutBuffer = []
  }

  document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase()

    if (DEBUG_DEBUG_PANEL_SHORTCUT.indexOf(key) === -1) {
      clearBuffer()
      return
    }

    shortcutBuffer.push(key)

    if (shortcutBuffer.length < DEBUG_DEBUG_PANEL_SHORTCUT.length) {
      shortcutTimeout =
        window.setTimeout(clearBuffer, DEBUG_DEBUG_PANEL_SHORTCUT_TIMEOUT)
      return
    }

    if (JSON.stringify(DEBUG_DEBUG_PANEL_SHORTCUT) ===
        JSON.stringify(shortcutBuffer)) {
      const newValue = !getSettingsValue(
        DEBUG_IS_DEBUG_PANEL_VISIBLE_KEY,
        DEBUG_IS_DEBUG_PANEL_VISIBLE_DEFAULT_VALUE
      )

      setSettingsValue(DEBUG_IS_DEBUG_PANEL_VISIBLE_KEY, newValue)
      debugContainer.style.display = newValue ? 'block' : 'none'
    }

    clearBuffer()
  })

  const isDebugCheckox = document.getElementById(DEBUG_NOW_IS_DEBUG_CHECKBOX_ID)
  const debugNowDatePicker = document.getElementById(DEBUG_NOW_DATE_PICKER_ID)
  const debugWeekLabelSelect =
    document.getElementById(DEBUG_WEEK_LABEL_SELECT_ID)
  const debugExtraHoursInput =
    document.getElementById(DEBUG_EXTRA_HOURS_INPUT_ID)
  const generateHoursButton =
    document.getElementById(DEBUG_GENERATE_HOURS_BUTTON_ID)
  const saveHoursButton =
    document.getElementById(DEBUG_SAVE_HOURS_BUTTON_ID)
  const restoreHoursButton =
    document.getElementById(DEBUG_RESTORE_HOURS_BUTTON_ID)
  const deleteHoursButton =
    document.getElementById(DEBUG_DELETE_HOURS_BUTTON_ID)
  const restoreActualHoursButton =
    document.getElementById(DEBUG_RESTORE_ACTUAL_HOURS_BUTTON_ID)

  // Prevent memory leaks.
  isDebugCheckox.removeEventListener('click', handleDefaultCheckboxClick)
  isDebugCheckox.removeEventListener('change', handleDebugModeCheckbox)
  debugNowDatePicker.removeEventListener('change', handleDebugNowDatePicker)
  debugWeekLabelSelect.removeEventListener('change', handleDebugWeekLabelSelect)
  debugExtraHoursInput.removeEventListener('input', handleDebugExtraHoursInput)
  generateHoursButton.removeEventListener(
    'click', handleGenerateHoursButtonClick
  )
  saveHoursButton.removeEventListener('click', handleSaveHoursButtonClick)
  restoreHoursButton.removeEventListener('click', handleRestoreHoursButtonClick)
  deleteHoursButton.removeEventListener('click', handleDeleteHoursButtonClick)
  restoreActualHoursButton.removeEventListener(
    'click', handleRestoreActualHoursButtonClick
  )

  isDebugCheckox.addEventListener('click', handleDefaultCheckboxClick)
  isDebugCheckox.addEventListener('change', handleDebugModeCheckbox)
  debugNowDatePicker.addEventListener('change', handleDebugNowDatePicker)
  debugWeekLabelSelect.addEventListener('change', handleDebugWeekLabelSelect)
  debugExtraHoursInput.addEventListener('input', handleDebugExtraHoursInput)
  generateHoursButton.addEventListener('click', handleGenerateHoursButtonClick)
  saveHoursButton.addEventListener('click', handleSaveHoursButtonClick)
  restoreHoursButton.addEventListener('click', handleRestoreHoursButtonClick)
  deleteHoursButton.addEventListener('click', handleDeleteHoursButtonClick)
  restoreActualHoursButton.addEventListener(
    'click', handleRestoreActualHoursButtonClick
  )
}

// Display first panel when opening for the first time.
function welcomeUser () {
  if (localStorage.getItem(LAST_VERSION_KEY) === ADP_ENHANCED_VERSION) {
    return
  }

  const debugContainer = document.createElement('div')

  debugContainer.innerHTML = `
    <div id="${WELCOME_BOX_CONTAINER_ID}" style="position: fixed; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); cursor: pointer; z-index: 9999;">
      <div id="${WELCOME_BOX_ID}" style="position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); background-color: #f2f2f2; font-size: 1.2em; border-radius: 10px; padding: 20px;">
        <h1>Bienvenue sur ${ADP_APP_NAME}</h1>
        <p style="font-size: 1.05em; margin-bottom: 5px;"><b>Version :</b> ${ADP_ENHANCED_VERSION}</p>
        ${getChangelog()}

        <button style="width: 50px; float: right; padding-right: 10px; padding-left: 10px; padding-top: 5px; padding-bottom: 5px; margin-right: 10px;" id="${WELCOME_BOX_ACCEPT_BUTTON_ID}" title="OK" type="button">OK</button>
       </div>
     </div>`

  document.body.appendChild(debugContainer)

  const welcomeBoxAcceptButton =
    document.getElementById(WELCOME_BOX_ACCEPT_BUTTON_ID)

  if (welcomeBoxAcceptButton !== null) {
    welcomeBoxAcceptButton.removeEventListener('click', handleWelcomeAcceptButton)
    welcomeBoxAcceptButton.addEventListener('click', handleWelcomeAcceptButton)
  }
}

// Handle welcome OK button.
function handleWelcomeAcceptButton () {
  localStorage.setItem(LAST_VERSION_KEY, ADP_ENHANCED_VERSION)

  const welcomeBoxContainer = document.getElementById(WELCOME_BOX_CONTAINER_ID)

  if (welcomeBoxContainer !== null) {
    welcomeBoxContainer.remove()
  }
}

// Return the current changelog.
function getChangelog () {
  return `<h3>Changelog :</h3>
  <ul>
    <li>Amélioration du système d'estimation des horaires lorsque des heures sont manuellement entrées par l'utilisateur.</li>
    <ul>
      <li>L'estimation pouvait être incorrecte lorsque des heures des jours suivants étaient renseignées.</li>
    </ul>
    <li>Ajout des paramètres avancés (le bouton rouge, en bas à droite de la fenêtre).</li>
    <ul>
      <li>Les paramètres avancés permettent de configurer le comportement du simulateur d'horaires. Par exemple, vous pouvez modifier les horaires de travail, le temps requis journalier, etc.</li>
      <li>Les informations sont sauvegardées en cache, dans le navigateur.</li>
      <li>En cas de doute, vous pouvez vider le cache en restaurant les valeurs par défaut.</li>
    </ul>
    <li>Support « réel » des horaires variables.</li>
    <ul>
      <li>Autre fois, les horaires variables ne fonctionnaient correctement qu'en demi-journées.</li>
      <li>À présent, ADP Enhanced récupère les demandes de récupérations qui ont été acceptées.</li>
    </ul>
  </ul>
`
}

// Initialize the entire script.
async function initialize () {
  console.log(`[${ADP_APP_NAME}] Enhancing ADP activity web page... 💿`)
  setUpDebugMode()
  setEnhancedDesign()
  setSettingsContainer()
  setAdvancedSettingsContainer()
  await requestAdpExtraHours()
  await requestAdpOvertimeComposentationTime()
  addWorkedHours()

  if (isRefreshPage) {
    window.setTimeout(refreshPage, refreshRate * 1000)
  }

  const adpPreviousButton = document.getElementById('btnPrev')
  const adpNextButton = document.getElementById('btnNext')
  const adpActionButton = document.getElementById('actBtn')
  const adpCloseDetailsWindowButton = document.getElementById('dj_close')

  // Prevent memory leaks.
  adpPreviousButton.removeEventListener('click', loadPage)
  adpNextButton.removeEventListener('click', loadPage)
  adpActionButton.removeEventListener('click', loadPage)
  adpCloseDetailsWindowButton.removeEventListener('click', loadPage)
  window.removeEventListener('beforeunload', handleWindowExit, false)
  window.removeEventListener('click', handleAdvancedSettingsFocusOut, false)
  notificationWorker.removeEventListener('message', handleNotificationClick)

  adpPreviousButton.addEventListener('click', loadPage)
  adpNextButton.addEventListener('click', loadPage)
  adpActionButton.addEventListener('click', loadPage)
  adpCloseDetailsWindowButton.addEventListener('click', loadPage)
  window.addEventListener('beforeunload', handleWindowExit, false)
  window.addEventListener('click', handleAdvancedSettingsFocusOut, false)
  notificationWorker.addEventListener('message', handleNotificationClick)

  welcomeUser()
}

(() => {
  initialize() // Let's go!
})()
