import stringify from 'json-stringify-safe'
import util from 'util'
import { LogLevelNumber } from './constants'
import { LoggerOptions, LoggerTransport, LogLevel } from './types'
import { transformData } from './transform/transform'
import chalk from 'chalk'

const chalkLevelPrefix = {
  [LogLevel.ERROR]: chalk.white.bgRed('        ERROR       '),
  [LogLevel.WARN]: chalk.black.bgYellow('        WARN        '),
  [LogLevel.INFO]: chalk.black.bgWhite('        INFO        '),
  [LogLevel.DEBUG]: chalk.hex('#333333').bgGray('        DEBUG       '),
  [LogLevel.TRACE]: chalk.blue.bgWhite('        TRACE       '),
}

function colorizedLevel(level: LogLevel) {
  return chalkLevelPrefix[level]
}

// An array of strings of valid log levels
const validLogLeveLs = Object.values(LogLevel)

export class Logger {
  public baseData: any
  public pretty: boolean
  public readonly levelName: LogLevel
  public readonly levelNumber: number
  public readonly transport: LoggerTransport

  constructor(options?: LoggerOptions) {
    this.baseData = options?.baseData || {}
    if (typeof options?.pretty === 'boolean') {
      this.pretty = options.pretty
    } else {
      this.pretty = process?.env?.LOGGER_PRETTY === '1'
    }
    if (options?.level && validLogLeveLs.includes(options.level)) {
      this.levelName = options.level
    } else {
      this.levelName = LogLevel.TRACE
    }
    this.levelNumber = LogLevelNumber[this.levelName]

    if (options?.transport) {
      this.transport = options.transport
    } else {
      this.transport = console
    }
  }

  trace(...args: any[]) {
    this.process(this.transport.trace, LogLevel.TRACE, args)
  }

  debug(...args: any[]) {
    this.process(this.transport.debug, LogLevel.DEBUG, args)
  }

  info(...args: any[]) {
    this.process(this.transport.info, LogLevel.INFO, args)
  }

  warn(...args: any[]) {
    this.process(this.transport.warn, LogLevel.WARN, args)
  }

  error(...args: any[]) {
    this.process(this.transport.error, LogLevel.ERROR, args)
  }

  text(input: string) {
    this.transport.debug(input)
  }

  process(method: (...args: any[]) => any, level: LogLevel, args: any[]) {
    let data: any
    const levelNumber = LogLevelNumber[level]
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

    if (data.length) {
      output.data = transformData(data)
    }

    if (this.pretty) {
      const message = output.message
      // eslint-disable-next-line no-prototype-builtins
      if (output.hasOwnProperty('message')) {
        delete output.message
      }
      delete output.logLevel
      let outputData = true
      const args = [`\n${colorizedLevel(level)} - ${message ?? '(no log message)'}`]
      if (typeof output.data === 'string') {
        args.push(chalk.green(output.data))
        outputData = false
      }
      method(...args)
      if (outputData && output.data !== undefined) {
        method(
          util.inspect(output.data, {
            showHidden: false,
            depth: null,
            colors: true,
            compact: false,
            sorted: true,
            maxStringLength: null,
            maxArrayLength: null,
          }),
        )
      }
    } else {
      method(stringify(output))
    }
  }
}
