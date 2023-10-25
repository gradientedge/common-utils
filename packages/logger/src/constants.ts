import { LoggerLevel, LoggerLevelValue } from './types'

/**
 * Numeric value associated with a specific log level
 *
 * This allows us to easily determine if a call to say the `info`
 * method should result in any output, if the actual log level is
 * say `error`.
 */
export const LogLevelNumber: Record<LoggerLevelValue, number> = {
  [LoggerLevel.DEBUG]: 10,
  [LoggerLevel.INFO]: 20,
  [LoggerLevel.WARN]: 30,
  [LoggerLevel.ERROR]: 40,
}

/**
 * The log level used by a new instance of {@see Logger} if none explicitly passed in
 *
 * Reads from the `LOGGER_LEVEL` env var, then the `LOG_LEVEL` env var, and then
 * defaults to {@see LoggerLevel.DEBUG} if not set.
 */
let logLevel: LoggerLevelValue = LoggerLevel.DEBUG
if (process?.env?.LOGGER_LEVEL && Object.values<string>(LoggerLevel).includes(process.env.LOGGER_LEVEL)) {
  logLevel = process.env.LOGGER_LEVEL as LoggerLevelValue
} else if (process?.env?.LOG_LEVEL && Object.values<string>(LoggerLevel).includes(process.env.LOG_LEVEL)) {
  logLevel = process.env.LOG_LEVEL as LoggerLevelValue
}

export const DEFAULT_LOG_LEVEL = logLevel

export const LOG_BUFFER_ENABLED = process?.env?.LOG_BUFFER_ENABLED !== '0'

export const VALID_LOGGER_LEVEL_VALUES = Object.values(LoggerLevel)
