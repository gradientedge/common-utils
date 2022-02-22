export const LOG_LEVEL_NAME = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
}

export const LOG_LEVEL_DEBUG = 10
export const LOG_LEVEL_INFO = 20
export const LOG_LEVEL_WARN = 40
export const LOG_LEVEL_ERROR = 50

export const LOG_LEVEL_NUMBER = {
  [LOG_LEVEL_NAME.DEBUG]: 10,
  [LOG_LEVEL_NAME.INFO]: 20,
  [LOG_LEVEL_NAME.WARN]: 40,
  [LOG_LEVEL_NAME.ERROR]: 50,
}

/**
 * The default log level
 */
export const DEFAULT_LOG_LEVEL = LOG_LEVEL_NAME.DEBUG

/**
 * Determine whether or not we're in a production nodejs environment
 */
export const LOG_LEVEL = process.env.LOG_LEVEL || 'debug'
