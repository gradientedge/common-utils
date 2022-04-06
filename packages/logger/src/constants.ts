import { LogLevel } from './types'

export const LogLevelNumber: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 10,
  [LogLevel.DEBUG]: 20,
  [LogLevel.INFO]: 30,
  [LogLevel.WARN]: 40,
  [LogLevel.ERROR]: 50,
}

export const LOGGER_PRETTY = process?.env?.LOGGER_PRETTY === '1'
