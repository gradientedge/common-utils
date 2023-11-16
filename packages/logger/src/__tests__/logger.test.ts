import { Logger } from '../logger'
import { LoggerTransport, LoggerLevel, LoggerLevelValue } from '../types'

describe('Logger', () => {
  let transport: LoggerTransport

  beforeEach(() => {
    transport = {
      error: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    }

    jest.useFakeTimers().setSystemTime(new Date('2023-09-28'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('constructor', () => {
    it('should set the logLevel to `error` when the logLevel option is set to `error`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.ERROR })

      expect(logger.levelName).toBe('error')
      expect(logger.levelNumber).toBe(40)
    })

    it('should set the logLevel to `warn` when the logLevel option is set to `warn`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.WARN })

      expect(logger.levelName).toBe('warn')
      expect(logger.levelNumber).toBe(30)
    })

    it('should set the logLevel to `info` when the logLevel option is set to `info`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.INFO })

      expect(logger.levelName).toBe('info')
      expect(logger.levelNumber).toBe(20)
    })

    it('should set the logLevel to `debug` when the logLevel option is set to `debug`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.DEBUG })

      expect(logger.levelName).toBe('debug')
      expect(logger.levelNumber).toBe(10)
    })

    it('should default the logLevel to `debug` when the logLevel option is not a recognised value', () => {
      const logger = new Logger({ transport, level: 'testing' as LoggerLevelValue })

      expect(logger.levelName).toBe('debug')
      expect(logger.levelNumber).toBe(10)
    })

    it('should set the transformer', () => {
      const transformer = jest.fn()
      const logger = new Logger({ transport, transformer })

      expect(logger.transformer).toBe(transformer)
    })
  })

  describe('error', () => {
    it('should call the transport `error` method when the logLevel is `error`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.ERROR })

      logger.error('test')

      expect(logger.transport.error).toHaveBeenCalled()
    })

    it('should call the transport `error` method when the logLevel is `warn`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.WARN })

      logger.error('test')

      expect(logger.transport.error).toHaveBeenCalled()
    })

    it('should call the transport `error` method when the logLevel is `info`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.INFO })

      logger.error('test')

      expect(logger.transport.error).toHaveBeenCalled()
    })

    it('should call the transport `error` method when the logLevel is `debug`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.DEBUG })

      logger.error('test')

      expect(logger.transport.error).toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('should not call the transport `warn` method when the logLevel is `error`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.ERROR })

      logger.warn('test')

      expect(logger.transport.warn).not.toHaveBeenCalled()
    })

    it('should call the transport `warn` method when the logLevel is `warn`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.WARN })

      logger.warn('test')

      expect(logger.transport.warn).toHaveBeenCalled()
    })

    it('should call the transport `warn` method when the logLevel is `info`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.INFO })

      logger.warn('test')

      expect(logger.transport.warn).toHaveBeenCalled()
    })

    it('should call the transport `warn` method when the logLevel is `debug`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.DEBUG })

      logger.warn('test')

      expect(logger.transport.warn).toHaveBeenCalled()
    })
  })

  describe('info', () => {
    it('should not call the transport `info` method when the logLevel is `error`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.ERROR })

      logger.info('test')

      expect(logger.transport.info).not.toHaveBeenCalled()
    })

    it('should not call the transport `info` method when the logLevel is `warn`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.WARN })

      logger.info('test')

      expect(logger.transport.info).not.toHaveBeenCalled()
    })

    it('should call the transport `info` method when the logLevel is `info`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.INFO })

      logger.info('test')

      expect(logger.transport.info).toHaveBeenCalled()
    })

    it('should call the transport `info` method when the logLevel is `debug`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.DEBUG })

      logger.info('test')

      expect(logger.transport.info).toHaveBeenCalled()
    })
  })

  describe('debug', () => {
    it('should not call the transport `debug` method when the logLevel is `error`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.ERROR })

      logger.debug('test')

      expect(logger.transport.debug).not.toHaveBeenCalled()
    })

    it('should not call the transport `debug` method when the logLevel is `warn`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.WARN })

      logger.debug('test')

      expect(logger.transport.debug).not.toHaveBeenCalled()
    })

    it('should not call the transport `debug` method when the logLevel is `info`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.INFO })

      logger.debug('test')

      expect(logger.transport.debug).not.toHaveBeenCalled()
    })

    it('should call the transport `debug` method when the logLevel is `debug`', () => {
      const logger = new Logger({ transport, level: LoggerLevel.DEBUG })

      logger.debug('test')

      expect(logger.transport.debug).toHaveBeenCalled()
    })
  })

  describe('process', () => {
    it('should pass a JSON string to the transport', () => {
      const logger = new Logger({ transport })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LoggerLevel.ERROR, ['a message'])

      expect(mockTransportFn).toHaveBeenCalledWith(
        '{"level":"error","timestamp":"2023-09-28T00:00:00.000Z","message":"a message"}',
      )
    })

    it("should set the message property to the first argument when it's a string", () => {
      const logger = new Logger({ transport })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LoggerLevel.ERROR, ['a message'])

      expect(mockTransportFn).toHaveBeenCalledWith(
        '{"level":"error","timestamp":"2023-09-28T00:00:00.000Z","message":"a message"}',
      )
    })

    it("should not set the message property when the first argument isn't a string", () => {
      const logger = new Logger({ transport })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LoggerLevel.ERROR, [123, 'test string'])

      expect(mockTransportFn).toHaveBeenCalledWith(
        '{"level":"error","timestamp":"2023-09-28T00:00:00.000Z","data":[123,"test string"]}',
      )
    })

    it('should set the data property to the first array entry when there is only one item in the args array', () => {
      const logger = new Logger({ transport })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LoggerLevel.ERROR, [123])

      expect(mockTransportFn).toHaveBeenCalledWith(
        '{"level":"error","timestamp":"2023-09-28T00:00:00.000Z","data":123}',
      )
    })

    it('should set the data property to the first array entry when there is only one item in the args array', () => {
      const logger = new Logger({ transport })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LoggerLevel.ERROR, [123])

      expect(mockTransportFn).toHaveBeenCalledWith(
        '{"level":"error","timestamp":"2023-09-28T00:00:00.000Z","data":123}',
      )
    })

    it('should use the custom transformer to modify output', () => {
      const mockTransformerFn = jest.fn(() => ({
        level: 'error',
        timestamp: '2023-09-28T00:00:00.000Z',
        message: 'a transformed message',
      }))
      const logger = new Logger({ transport, transformer: mockTransformerFn })
      const mockTransportFn = jest.fn()

      logger.process(mockTransportFn, LoggerLevel.ERROR, ['a message'])

      expect(mockTransportFn).toHaveBeenCalledWith(
        '{"level":"error","timestamp":"2023-09-28T00:00:00.000Z","message":"a transformed message"}',
      )
    })
  })
})
