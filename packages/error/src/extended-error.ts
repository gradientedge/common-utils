import { ExtendedErrorLogLevel } from './types'

/**
 * Options for the {@see ExtendedError} constructor
 */
export interface ExtendedErrorOptions {
  /**
   * A code that helps to identify the exception.
   *
   * This code is expected to be a more succinct, perhaps
   * unique value to represent this particular type of error.
   */
  code?: string
  /**
   * Property for storing any data relevant to the exception,
   * perhaps because you want to ensure that some specific
   * data is logged by the catching code.
   */
  data?: Record<string, any> | undefined
  /**
   * Where this exception is being thrown as the result of
   * another exception, this is a reference to that other exception.
   */
  originalError?: unknown
  /**
   * Indicates the way that the exception should be logged.
   *
   * While you might expect an exception to be logged as an
   * error, there are plenty of reasons where you may instead
   * want to log the exception as perhaps a warning or a debug
   * message. This property allows you to suggest to the
   * catching caught, how the exception should be logged.
   */
  logLevel?: ExtendedErrorLogLevel
}

/**
 * An extension of the standard {@see Error} class that allows you to
 * pass in a message, error code and any additional useful information
 * for debugging.
 */
export class ExtendedError extends Error {
  public readonly code: string | undefined
  public readonly logLevel?: ExtendedErrorLogLevel
  public readonly data?: Record<string, any>
  public readonly originalError: unknown

  constructor(message: string, options?: ExtendedErrorOptions) {
    super(message)
    this.code = options?.code
    this.data = options?.data
    this.logLevel = options?.logLevel
    this.originalError = options?.originalError
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      data: this.data,
      logLevel: this.logLevel,
    }
  }
}
