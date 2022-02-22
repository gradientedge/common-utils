import { contextLocalStorage } from './create'

export function retrieve<T>(): T {
  const requestContext = contextLocalStorage.getStore()
  if (!requestContext) {
    throw Error('Cannot retrieve the request context as local storage has not yet been set')
  }
  return requestContext.data
}
