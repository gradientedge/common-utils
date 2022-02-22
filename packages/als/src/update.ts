import { contextLocalStorage } from './create'

export function update<T = any>(data: T) {
  const store = contextLocalStorage.getStore()
  if (store) {
    store.data = data
  }
}
