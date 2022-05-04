import { container } from './create'

export function retrieve<T>(): T {
  const store = container.getStore()
  if (!store) {
    throw Error('You must call the `create` function before retrieving the store data')
  }
  return store.data
}
