import { transformError } from '../transform/error'

describe('transformError', () => {
  it('should transform an error object', () => {
    const error = new Error('Test error message')
    const transformedError = transformError(error)

    expect(transformedError).toHaveProperty('message', 'Test error message')
    expect(transformedError).toHaveProperty('stack')
  })

  it('should transform a nested error object', () => {
    const originalError = new Error('Original error message')
    const someError: any = {
      name: 'MyError',
      message: 'Some error message',
    }
    someError.originalError = originalError
    const transformedError = transformError(someError)

    expect(transformedError).toHaveProperty('message', 'Some error message')
    expect(transformedError).toHaveProperty('name', 'MyError')
    expect(transformedError).toHaveProperty('originalError')
    expect(transformedError.originalError).toHaveProperty('message', 'Original error message')
    expect(transformedError.originalError).toHaveProperty('stack')
  })
})
