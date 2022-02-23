import stringify from 'json-stringify-safe'
import util from 'util'
import { LogLevelNumber } from './constants'
import { LoggerOptions, LogLevel } from './types'
import { transformData } from './transform/transform'

// An array of strings of valid log levels
const validLogLeveLs = Object.values(LogLevel)

export class Logger {
  public baseData: any
  public pretty: boolean
  private readonly levelName: LogLevel
  private readonly levelNumber: number

  constructor(options?: LoggerOptions) {
    this.baseData = options?.baseData || {}
    this.pretty = process?.env?.LOGGER_PRETTY === '1'
    if (options?.level && validLogLeveLs.includes(options.level)) {
      this.levelName = options.level
    } else {
      this.levelName = LogLevel.TRACE
    }
    this.levelNumber = LogLevelNumber[this.levelName]
  }

  trace(...args: any[]) {
    this.process(console.debug, LogLevelNumber[LogLevel.TRACE], LogLevel.TRACE, args)
  }

  debug(...args: any[]) {
    this.process(console.debug, LogLevelNumber[LogLevel.DEBUG], LogLevel.DEBUG, args)
  }

  info(...args: any[]) {
    this.process(console.info, LogLevelNumber[LogLevel.INFO], LogLevel.INFO, args)
  }

  warn(...args: any[]) {
    this.process(console.warn, LogLevelNumber[LogLevel.WARN], LogLevel.WARN, args)
  }

  error(...args: any[]) {
    this.process(console.error, LogLevelNumber[LogLevel.ERROR], LogLevel.ERROR, args)
  }

  text(input: string) {
    console.debug(input)
  }

  process(method: any, levelNumber: number, level: string, args: any[]) {
    let data: any
    if (levelNumber < this.levelNumber || !Array.isArray(args) || args.length === 0) {
      return
    }
    const output = { ...this.baseData, logLevel: level }
    if (typeof args[0] === 'string') {
      output.message = args[0]
      data = args.slice(1)
    } else {
      data = args
    }

    output.data = transformData(data)

    if (this.pretty) {
      method(
        util.inspect(output, {
          showHidden: false,
          depth: null,
          colors: true,
          compact: false,
          maxStringLength: null,
          maxArrayLength: null,
        }),
      )
    } else {
      method(stringify(output))
    }
  }
}
