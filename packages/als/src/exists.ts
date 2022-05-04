import { container } from './create'

export function exists(): boolean {
  return !!container.getStore()
}
