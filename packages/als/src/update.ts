import { contextLocalStorage } from './create'

export function update<T = any>(data: T) {
  contextLocalStorage.getStore().data = data
}
