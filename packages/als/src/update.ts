import { container } from './create'

export function update<T = any>(data: T) {
  const store = container.getStore()
  if (store) {
    store.data = data
  }
}
