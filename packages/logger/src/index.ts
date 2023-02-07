import { Logger } from './logger'

const systemLogger = new Logger()

export default systemLogger

export { LoggerLevelValue, LoggerLevel, LoggerOptions, LoggerTransportFn, LoggerTransport, LoggerOutput } from './types'
export { Logger } from './logger'
