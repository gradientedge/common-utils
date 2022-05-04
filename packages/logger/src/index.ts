import als from '@gradientedge/als'
import { Logger } from './logger'

const systemLogger = new Logger()

export default new Proxy<Logger>(systemLogger, {
  get(target, property, receiver) {
    try {
      const data = als.retrieve<any>()
      if (data.logger instanceof Logger) {
        target = data.logger
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return Reflect.get(target, property, receiver)
  },
})

export { LoggerLevelValue, LoggerLevel, LoggerOptions, LoggerTransportFn, LoggerTransport, LoggerOutput } from './types'
export { Logger } from './logger'
