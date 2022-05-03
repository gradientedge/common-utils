import { AsyncLocalStorage } from 'async_hooks'

export interface StorageContainer<T = any> {
  data: T
}

export const container = new AsyncLocalStorage<StorageContainer>()

export function create<T = any>(data: T, callback: () => any) {
  container.run({ data }, callback)
}
