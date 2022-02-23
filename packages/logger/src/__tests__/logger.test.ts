import { Logger } from '../logger'

describe('Logger', () => {
  it('should add some tests', () => {
    const result = new Logger()

    result.debug('Testing')
    result.debug('Testing', { test: 'Testing' })
    result.debug('Testing', 'one', 'two')
    result.debug({ test: 'Testing' })
  })
})
