import { DEFAULT_LOG_LEVEL, LogLevelNumber, VALID_LOGGER_LEVEL_VALUES } from './constants'
import { LoggerOptions, LoggerTransport, LoggerLevelValue } from './types'
import { generateOutput } from './output'
import stringify from 'json-stringify-safe'
import { Console } from 'node:console'

export class Logger {
  public baseData: Record<string, any> | null
  public readonly levelName: LoggerLevelValue
  public readonly levelNumber: number
  public readonly transport: LoggerTransport

  constructor(options?: LoggerOptions) {
    this.baseData = options?.baseData ?? null

    if (options?.level && VALID_LOGGER_LEVEL_VALUES.includes(options.level)) {
      this.levelName = options.level
    } else {
      this.levelName = DEFAULT_LOG_LEVEL
    }
    this.levelNumber = LogLevelNumber[this.levelName]

    if (options?.transport) {
      this.transport = options.transport
    } else {
      this.transport = new Console({
        stdout: process.stdout,
        stderr: process.stderr,
      })
    }
  }

  debug(...args: any[]) {
    this.process(this.transport.debug, 'debug', args)
  }

  info(...args: any[]) {
    this.process(this.transport.info, 'info', args)
  }

  warn(...args: any[]) {
    this.process(this.transport.warn, 'warn', args)
  }

  error(...args: any[]) {
    this.process(this.transport.error, 'error', args)
  }

  text(input: string) {
    this.transport.debug(input)
  }

  process(method: (...args: any[]) => any, level: LoggerLevelValue, args: any[]) {
    const levelNumber = LogLevelNumber[level]

    if (levelNumber < this.levelNumber || !Array.isArray(args) || args.length === 0) {
      return
    }

    const output = generateOutput(level, this.baseData, args)

    method(stringify(output))
  }
}
