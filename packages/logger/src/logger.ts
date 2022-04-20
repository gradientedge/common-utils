import { LOGGER_PRETTY, LogLevelNumber } from './constants'
import { LoggerOptions, LoggerOutput, LoggerTransport, LogLevel } from './types'
import { transformData } from './transform/transform'
import { prettyOutput } from './output/pretty'
import { unprettyOutput } from './output/unpretty'

// An array of strings of valid log levels
const validLogLeveLs = Object.values(LogLevel)

function generateOutput(baseData: Record<string, any> | null, args: any[]): LoggerOutput {
  const output: LoggerOutput = {}
  let outputData = args
  if (baseData) {
    output.requestData = baseData
  }
  if (typeof outputData[0] === 'string') {
    output.message = outputData[0]
    outputData = outputData.slice(1)
  }
  if (outputData.length) {
    output.data = transformData(outputData)
  }
  return output
}

export class Logger {
  public baseData: Record<string, any> | null
  public pretty: boolean
  public readonly levelName: LogLevel
  public readonly levelNumber: number
  public readonly transport: LoggerTransport

  constructor(options?: LoggerOptions) {
    this.baseData = options?.baseData ?? null
    if (typeof options?.pretty === 'boolean') {
      this.pretty = options.pretty
    } else {
      this.pretty = LOGGER_PRETTY
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
      this.transport = { ...console, trace: console.debug }
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
    const levelNumber = LogLevelNumber[level]

    if (levelNumber < this.levelNumber || !Array.isArray(args) || args.length === 0) {
      return
    }

    const output = generateOutput(this.baseData, args)

    if (this.pretty) {
      prettyOutput(method, level, output)
    } else {
      unprettyOutput(method, level, output)
    }
  }
}
