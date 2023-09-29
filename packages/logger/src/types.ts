export type LoggerLevelValue = (typeof LoggerLevel)[keyof typeof LoggerLevel]

/**
 * Log level constants
 */
export const LoggerLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const

/**
 * Options for the {@see Logger} constructor
 */
export interface LoggerOptions {
  level?: LoggerLevelValue
  baseData?: Record<string, any>
  transport?: LoggerTransport
  bufferEnabled?: boolean
}

/**
 *
 */
export interface LoggerTransportFn {
  (...args: any[]): any
}

export type LoggerTransport = {
  [key in LoggerLevelValue]: LoggerTransportFn
}

export interface LoggerOutput {
  level: LoggerLevelValue
  timestamp: string
  message?: string
  base?: Record<string, any>
  data?: any
}
