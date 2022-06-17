import { isPlainObject } from 'is-plain-object'

export function isApplicable(jsonObject: any) {
  const propNames = Object.getOwnPropertyNames(jsonObject)
  return (
    isPlainObject(jsonObject) &&
    propNames.length &&
    propNames.every((name) => ['message', 'data', 'base', 'level'].includes(name))
  )
}
