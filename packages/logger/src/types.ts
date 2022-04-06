export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LoggerOptions {
  level?: LogLevel
  pretty?: boolean
  baseData?: Record<string, any>
  transport?: LoggerTransport
}

export interface LoggerTransportFn {
  (...args: any[]): any
}

export type LoggerTransport = {
  [key in LogLevel]: LoggerTransportFn
}

export interface LoggerOutput {
  requestData?: Record<string, any>
  message?: string
  data?: any
}
