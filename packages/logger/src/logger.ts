import { DEFAULT_LOG_LEVEL, LOG_BUFFER_ENABLED, VALID_LOGGER_LEVEL_VALUES, LogLevelNumber } from './constants'
import { LoggerOptions, LoggerOutput, LoggerTransport, LoggerLevelValue } from './types'
import { generateOutput } from './output'
import stringify from 'json-stringify-safe'
import { Console } from 'node:console'

export interface LogBuffer {
  method: (...args: any[]) => any
  level: LoggerLevelValue
  timestamp: string
  args: any[]
}
export interface Transformer {
  (input: LoggerOutput): LoggerOutput
}

export class Logger {
  public baseData: Record<string, any> | null
  public readonly levelName: LoggerLevelValue
  public readonly levelNumber: number
  public readonly transport: LoggerTransport
  public buffer: LogBuffer[]
  public bufferEnabled: boolean
  public bufferInitiallyEnabled: boolean
  public transformer?: Transformer

  constructor(options?: LoggerOptions) {
    this.buffer = []
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

    this.bufferEnabled = LOG_BUFFER_ENABLED

    if (options?.bufferEnabled !== undefined) {
      this.bufferEnabled = options?.bufferEnabled
    }

    this.bufferInitiallyEnabled = this.bufferEnabled

    if (options?.transformer !== undefined) {
      this.transformer = options.transformer
    }
  }

  debug(...args: any[]) {
    this.processWithBuffer(this.transport.debug, 'debug', args)
  }

  info(...args: any[]) {
    this.process(this.transport.info, 'info', args)
  }

  warn(...args: any[]) {
    this.process(this.transport.warn, 'warn', args)
  }

  error(...args: any[]) {
    // Turn off further buffering.
    this.disableBuffering()
    this.flushBuffer()
    this.process(this.transport.error, 'error', args)
  }

  text(input: string) {
    this.transport.debug(input)
  }

  process(
    method: (...args: any[]) => any,
    level: LoggerLevelValue,
    args: any[],
    timestamp?: string,
    forceOutput?: boolean,
  ) {
    const levelNumber = LogLevelNumber[level]

    if ((levelNumber < this.levelNumber || !Array.isArray(args) || args.length === 0) && !forceOutput) {
      return
    }

    if (!timestamp) {
      timestamp = new Date().toISOString()
    }

    let output: LoggerOutput = generateOutput(level, timestamp, this.baseData, args)

    if (this.transformer) {
      output = this.transformer(output)
    }

    method(stringify(output))
  }

  processWithBuffer(method: (...args: any[]) => any, level: LoggerLevelValue, args: any[]) {
    if (this.levelNumber > LogLevelNumber[level] && level === 'debug' && this.bufferEnabled) {
      this.buffer.push({ method, level, timestamp: new Date().toISOString(), args })
    } else {
      this.process(method, level, args)
    }
  }

  flushBuffer() {
    while (this.buffer.length) {
      const log: LogBuffer | undefined = this.buffer.shift()

      if (log) {
        this.process(log.method, log.level, log.args, log.timestamp, true)
      }
    }
  }

  clearBuffer() {
    this.buffer = []
    // Restore buffering to its initial state.
    this.bufferEnabled = this.bufferInitiallyEnabled
  }

  enableBuffering() {
    this.bufferEnabled = true
  }

  disableBuffering() {
    this.bufferEnabled = false
  }
}
