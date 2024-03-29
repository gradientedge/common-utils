/**
 * Transform an Error object in to something more digestible.
 * We do some specific transformation of Axios errors.
 */
export function transformError(error: Error & Record<string, any>, recursionLevel = 0): any {
  if (recursionLevel > 5) {
    return
  }
  let simpleError: Record<string, any> = {}
  Object.getOwnPropertyNames(error).forEach(function (key) {
    simpleError[key] = error[key]
  })
  if (error.name === 'GraphQLError') {
    return transformGraphQLError(error, recursionLevel + 1)
  }
  if (error?.isAxiosError) {
    simpleError = pickAxiosErrorFields(simpleError)
  }
  if (error?.data?.error?.isAxiosError) {
    simpleError.data.error = pickAxiosErrorFields(simpleError)
  }
  if (simpleError.originalError) {
    simpleError.originalError = transformError(error.originalError, recursionLevel + 1)
  }
  return simpleError
}

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
 * Return a lightweight GraphQL error object. In particular, we don't want the `nodes`
 * property, which potentially contains a massive object containing most of the GraphQL
 * schema object.
 */
export function transformGraphQLError(error: any, recursionLevel: number): any {
  return {
    message: error?.message,
    stack: error?.stack,
    locations: error?.locations,
    path: error?.path,
    originalError: error?.originalError && transformError(error.originalError, recursionLevel + 1),
  }
}
