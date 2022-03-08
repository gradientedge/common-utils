import { AsyncLocalStorage } from 'async_hooks'

export interface StorageContainer<T = any> {
  data: T
}

export const contextLocalStorage = new AsyncLocalStorage<StorageContainer>()

export function create<T = any>(data: T, callback: () => any) {
  contextLocalStorage.run({ data }, callback)
}
