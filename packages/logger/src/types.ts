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

export interface LoggerTransport {
  trace: (...args: any) => void
  debug: (...args: any) => void
  info: (...args: any) => void
  warn: (...args: any) => void
  error: (...args: any) => void
}
