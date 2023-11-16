/**
 * Transform an error object in to something more digestible.
 *
 * @param error - The error object to transform.
 * @param recursionLevel - The current recursion level (default: 0).
 * @returns The transformed error object.
 */
export function transformError(error: Error & Record<string, any>, recursionLevel = 0): any {
  if (recursionLevel > 5) {
    return
  }
  const simpleError: Record<string, any> = {}
  Object.getOwnPropertyNames(error).forEach(function (key) {
    simpleError[key] = error[key]
  })
  if (simpleError.originalError) {
    simpleError.originalError = transformError(error.originalError, recursionLevel + 1)
  }
  return simpleError
}
