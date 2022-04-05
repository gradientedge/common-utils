import { Logger } from '../logger'
import { LoggerTransport, LogLevel } from '../types'

describe('Logger', () => {
  let transport: LoggerTransport
  const originalEnvVars = { ...process.env }

  beforeEach(() => {
    transport = {
      error: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      trace: jest.fn(),
      warn: jest.fn(),
    }
  })

  afterAll(() => {
    process.env = originalEnvVars
  })

  describe('constructor', () => {
    it("should set the pretty flag to false when the LOGGER_PRETTY env var is not '1' and no pretty option passed in", () => {
      process.env.LOGGER_PRETTY = '0'
      const logger = new Logger({ transport })

      expect(logger.pretty).toBeFalse()
    })

    it("should set the pretty flag to true when the LOGGER_PRETTY env var is '1' and no pretty option passed in", () => {
      process.env.LOGGER_PRETTY = '1'
      const logger = new Logger({ transport })

      expect(logger.pretty).toBeTrue()
    })

    it('should set the pretty flag to false when the pretty option passed in is false', () => {
      const logger = new Logger({ transport, pretty: false })

      expect(logger.pretty).toBeFalse()
    })

    it('should set the pretty flag to true when the pretty option passed in is true', () => {
      const logger = new Logger({ transport, pretty: true })

      expect(logger.pretty).toBeTrue()
    })

    it('should set the logLevel to `error` when the logLevel option is set to `error`', () => {
      const logger = new Logger({ transport, level: LogLevel.ERROR })

      expect(logger.levelName).toBe('error')
      expect(logger.levelNumber).toBe(50)
    })

    it('should set the logLevel to `warn` when the logLevel option is set to `warn`', () => {
      const logger = new Logger({ transport, level: LogLevel.WARN })

      expect(logger.levelName).toBe('warn')
      expect(logger.levelNumber).toBe(40)
    })

    it('should set the logLevel to `info` when the logLevel option is set to `info`', () => {
      const logger = new Logger({ transport, level: LogLevel.INFO })

      expect(logger.levelName).toBe('info')
      expect(logger.levelNumber).toBe(30)
    })

    it('should set the logLevel to `debug` when the logLevel option is set to `debug`', () => {
      const logger = new Logger({ transport, level: LogLevel.DEBUG })

      expect(logger.levelName).toBe('debug')
      expect(logger.levelNumber).toBe(20)
    })

    it('should set the logLevel to `trace` when the logLevel option is set to `trace`', () => {
      const logger = new Logger({ transport, level: LogLevel.TRACE })

      expect(logger.levelName).toBe('trace')
      expect(logger.levelNumber).toBe(10)
    })

    it('should default the logLevel to `trace` when the logLevel option is not a recognised value', () => {
      const logger = new Logger({ transport, level: 'testing' as LogLevel })

      expect(logger.levelName).toBe('trace')
      expect(logger.levelNumber).toBe(10)
    })
  })

  describe('error', () => {
    it('should call the transport `error` method when the logLevel is `error`', () => {
      const logger = new Logger({ transport, level: LogLevel.ERROR })

      logger.error('test')

      expect(logger.transport.error).toHaveBeenCalled()
    })

    it('should call the transport `error` method when the logLevel is `warn`', () => {
      const logger = new Logger({ transport, level: LogLevel.WARN })

      logger.error('test')

      expect(logger.transport.error).toHaveBeenCalled()
    })

    it('should call the transport `error` method when the logLevel is `info`', () => {
      const logger = new Logger({ transport, level: LogLevel.INFO })

      logger.error('test')

      expect(logger.transport.error).toHaveBeenCalled()
    })

    it('should call the transport `error` method when the logLevel is `debug`', () => {
      const logger = new Logger({ transport, level: LogLevel.DEBUG })

      logger.error('test')

      expect(logger.transport.error).toHaveBeenCalled()
    })

    it('should call the transport `error` method when the logLevel is `trace`', () => {
      const logger = new Logger({ transport, level: LogLevel.TRACE })

      logger.error('test')

      expect(logger.transport.error).toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('should not call the transport `warn` method when the logLevel is `error`', () => {
      const logger = new Logger({ transport, level: LogLevel.ERROR })

      logger.warn('test')

      expect(logger.transport.warn).not.toHaveBeenCalled()
    })

    it('should call the transport `warn` method when the logLevel is `warn`', () => {
      const logger = new Logger({ transport, level: LogLevel.WARN })

      logger.warn('test')

      expect(logger.transport.warn).toHaveBeenCalled()
    })

    it('should call the transport `warn` method when the logLevel is `info`', () => {
      const logger = new Logger({ transport, level: LogLevel.INFO })

      logger.warn('test')

      expect(logger.transport.warn).toHaveBeenCalled()
    })

    it('should call the transport `warn` method when the logLevel is `debug`', () => {
      const logger = new Logger({ transport, level: LogLevel.DEBUG })

      logger.warn('test')

      expect(logger.transport.warn).toHaveBeenCalled()
    })

    it('should call the transport `warn` method when the logLevel is `trace`', () => {
      const logger = new Logger({ transport, level: LogLevel.TRACE })

      logger.warn('test')

      expect(logger.transport.warn).toHaveBeenCalled()
    })
  })

  describe('info', () => {
    it('should not call the transport `info` method when the logLevel is `error`', () => {
      const logger = new Logger({ transport, level: LogLevel.ERROR })

      logger.info('test')

      expect(logger.transport.info).not.toHaveBeenCalled()
    })

    it('should not call the transport `info` method when the logLevel is `warn`', () => {
      const logger = new Logger({ transport, level: LogLevel.WARN })

      logger.info('test')

      expect(logger.transport.info).not.toHaveBeenCalled()
    })

    it('should call the transport `info` method when the logLevel is `info`', () => {
      const logger = new Logger({ transport, level: LogLevel.INFO })

      logger.info('test')

      expect(logger.transport.info).toHaveBeenCalled()
    })

    it('should call the transport `info` method when the logLevel is `debug`', () => {
      const logger = new Logger({ transport, level: LogLevel.DEBUG })

      logger.info('test')

      expect(logger.transport.info).toHaveBeenCalled()
    })

    it('should call the transport `info` method when the logLevel is `trace`', () => {
      const logger = new Logger({ transport, level: LogLevel.TRACE })

      logger.info('test')

      expect(logger.transport.info).toHaveBeenCalled()
    })
  })

  describe('debug', () => {
    it('should not call the transport `debug` method when the logLevel is `error`', () => {
      const logger = new Logger({ transport, level: LogLevel.ERROR })

      logger.debug('test')

      expect(logger.transport.debug).not.toHaveBeenCalled()
    })

    it('should not call the transport `debug` method when the logLevel is `warn`', () => {
      const logger = new Logger({ transport, level: LogLevel.WARN })

      logger.debug('test')

      expect(logger.transport.debug).not.toHaveBeenCalled()
    })

    it('should not call the transport `debug` method when the logLevel is `info`', () => {
      const logger = new Logger({ transport, level: LogLevel.INFO })

      logger.debug('test')

      expect(logger.transport.debug).not.toHaveBeenCalled()
    })

    it('should call the transport `debug` method when the logLevel is `debug`', () => {
      const logger = new Logger({ transport, level: LogLevel.DEBUG })

      logger.debug('test')

      expect(logger.transport.debug).toHaveBeenCalled()
    })

    it('should call the transport `debug` method when the logLevel is `trace`', () => {
      const logger = new Logger({ transport, level: LogLevel.TRACE })

      logger.debug('test')

      expect(logger.transport.debug).toHaveBeenCalled()
    })
  })

  describe('trace', () => {
    it('should not call the transport `trace` method when the logLevel is `error`', () => {
      const logger = new Logger({ transport, level: LogLevel.ERROR })

      logger.trace('test')

      expect(logger.transport.trace).not.toHaveBeenCalled()
    })

    it('should not call the transport `trace` method when the logLevel is `warn`', () => {
      const logger = new Logger({ transport, level: LogLevel.WARN })

      logger.trace('test')

      expect(logger.transport.trace).not.toHaveBeenCalled()
    })

    it('should not call the transport `trace` method when the logLevel is `info`', () => {
      const logger = new Logger({ transport, level: LogLevel.INFO })

      logger.trace('test')

      expect(logger.transport.trace).not.toHaveBeenCalled()
    })

    it('should not call the transport `trace` method when the logLevel is `debug`', () => {
      const logger = new Logger({ transport, level: LogLevel.DEBUG })

      logger.trace('test')

      expect(logger.transport.trace).not.toHaveBeenCalled()
    })

    it('should call the transport `trace` method when the logLevel is `trace`', () => {
      const logger = new Logger({ transport, level: LogLevel.TRACE })

      logger.trace('test')

      expect(logger.transport.trace).toHaveBeenCalled()
    })
  })

  describe('process', () => {
    it('should pass an un-colorized JSON string to the transport when pretty option is false', () => {
      const logger = new Logger({ transport, pretty: false })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LogLevel.ERROR, ['a message'])

      expect(mockTransportFn).toHaveBeenCalledWith('{"logLevel":"error","message":"a message"}')
    })

    it('should pass a colorized string to the transport when pretty option is true', () => {
      const logger = new Logger({ transport, pretty: true })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LogLevel.ERROR, ['a message'])

      expect(mockTransportFn).toHaveBeenCalledTimes(1)
      expect(mockTransportFn).toHaveBeenNthCalledWith(
        1,
        '\n\u001b[37m\u001b[41m        ERROR       \u001b[49m\u001b[39m - a message',
      )
    })

    it('should not log the message or log level as data when pretty option is true', () => {
      const logger = new Logger({ transport, pretty: true })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LogLevel.ERROR, ['a message', 123])

      expect(mockTransportFn).toHaveBeenCalledTimes(2)
      expect(mockTransportFn).toHaveBeenNthCalledWith(
        1,
        '\n\u001b[37m\u001b[41m        ERROR       \u001b[49m\u001b[39m - a message',
      )
      expect(mockTransportFn).toHaveBeenNthCalledWith(2, '\u001b[33m123\u001b[39m')
    })

    it("should set the message property to the first argument when it's a string", () => {
      const logger = new Logger({ transport, pretty: false })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LogLevel.ERROR, ['a message'])

      expect(mockTransportFn).toHaveBeenCalledWith('{"logLevel":"error","message":"a message"}')
    })

    it("should not set the message property when the first argument isn't a string", () => {
      const logger = new Logger({ transport, pretty: false })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LogLevel.ERROR, [123, 'test string'])

      expect(mockTransportFn).toHaveBeenCalledWith('{"logLevel":"error","data":[123,"test string"]}')
    })

    it('should set the data property to the first array entry when there is only one item in the args array', () => {
      const logger = new Logger({ transport, pretty: false })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LogLevel.ERROR, [123])

      expect(mockTransportFn).toHaveBeenCalledWith('{"logLevel":"error","data":123}')
    })

    it('should set the data property to the first array entry when there is only one item in the args array', () => {
      const logger = new Logger({ transport, pretty: false })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LogLevel.ERROR, [123])

      expect(mockTransportFn).toHaveBeenCalledWith('{"logLevel":"error","data":123}')
    })
  })
})
