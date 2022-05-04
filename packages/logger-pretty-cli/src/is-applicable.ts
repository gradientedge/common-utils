export function isApplicable(jsonObject: any) {
  return Object.getOwnPropertyNames(jsonObject).every((name) => ['message', 'data', 'base', 'level'].includes(name))
}
