import { contextLocalStorage } from './create'

export function exists(): boolean {
  return !!contextLocalStorage.getStore()
}
