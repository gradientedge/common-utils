import { transformError } from '../transform/error'

describe('transformError', () => {
  it('should transform an error object', () => {
    const error = new Error('Test Error')
    const transformedError = transformError(error)
    expect(transformedError).toHaveProperty('message', 'Test Error')
    expect(transformedError).toHaveProperty('stack')
  })

  it('should handle Axios errors', () => {
    const axiosError: any = {
      name: 'AxiosError',
      message: 'some message',
      isAxiosError: true,
      config: {
        url: 'https://example.com',
        method: 'GET',
      },
      response: {
        status: 404,
      },
    }

    const axiosFields = pickAxiosErrorFields(axiosError)

    const transformedError = transformError(axiosFields)
    expect(transformedError).toMatchObject({
      name: 'AxiosError',
      message: 'some message',
      config: {
        url: 'https://example.com',
        method: 'GET',
      },
      response: {
        status: 404,
      },
    })
  })
})

/*
 * This test is an example of how to use a custom error transformation function.
 */
describe('transformGraphQLError', () => {
  it('should transform a GraphQL error object using the custom output option', () => {
    const graphQLError = {
      name: 'GraphQLError',
      message: 'GraphQL Error',
      locations: [{ line: 2, column: 5 }],
      originalError: new Error('Original Error'),
    }

    const transformedError = transformError(graphQLError, 0, myCustomTransformError)
    expect(transformedError).toMatchObject({
      message: 'GraphQL Error',
      locations: [{ line: 2, column: 5 }],
      originalError: {
        message: 'Original Error',
      },
    })
  })
})

/**
 * Return only the fields we really want to see from the Axios error object.
 * If we don't do this, then we get many thousands of lines of log lines as
 * the HttpsAgent is a huge deeply nested object.
 */
export function pickAxiosErrorFields(error: any) {
  let config: any
  let response: any
  if (error?.config) {
    config = {
      url: error?.config?.url,
      method: error?.config?.method,
      headers: error?.config?.headers,
      timeout: error?.config?.timeout,
      params: error?.config?.params,
    }
  }
  if (error?.response) {
    response = {
      status: error?.response?.status,
      headers: error?.response?.headers,
      data: error?.response?.data,
    }
  }
  return {
    message: error?.message,
    name: error?.name,
    code: error?.code,
    stack: error?.stack,
    config,
    response,
  }
}

/**
 * This is an example of a custom error transformation function.
 * It is used in the transformGraphQLError test.
 *
 * @param error - The error object to transform.
 * @returns The transformed error object.
 */
export function myCustomTransformError(error: any) {
  return transformGraphQLError(error, 0)
}

/**
 * Example function to transform a GraphQL error object.
 * This is used in the myCustomTransformError function.
 *
 * @param error - The error object to transform.
 * @param recursionLevel - The current recursion level.
 */
export function transformGraphQLError(error: any, recursionLevel: number): any {
  return {
    message: error?.message,
    stack: error?.stack,
    locations: error?.locations,
    path: error?.path,
    originalError: error?.originalError && transformGraphQLError(error.originalError, recursionLevel + 1),
  }
}
