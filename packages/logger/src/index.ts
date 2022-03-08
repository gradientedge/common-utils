import als from '@gradientedge/als'
import { Logger } from './logger'

const systemLogger = new Logger()

export default new Proxy<Logger>(systemLogger, {
  get(target, property, receiver) {
    try {
      const requestContext = als.retrieve<any>()
      target = requestContext.logger
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return Reflect.get(target, property, receiver)
  },
})

export * from './types'
export * from './logger'
