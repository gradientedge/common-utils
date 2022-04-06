/**
 * Options for the {@see ExtendedError} constructor
 */
export interface ExtendedErrorOptions {
  code?: string
  data?: Record<string, any> | undefined
  originalError?: unknown
}

/**
 * An extension of the standard {@see Error} class that allows you to
 * pass in a message, error code and any additional useful information
 * for debugging.
 */
export class ExtendedError extends Error {
  public readonly code: string | undefined
  public readonly data?: Record<string, any>
  public readonly originalError: unknown

  constructor(message: string, options?: ExtendedErrorOptions) {
    super(message)
    this.code = options?.code
    this.data = options?.data
    this.originalError = options?.originalError
  }
}
