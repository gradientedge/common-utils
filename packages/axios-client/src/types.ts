import { AgentOptions } from 'https'

export interface RequestConfig {
  httpsAgent?: AgentOptions
  retry?: RetryConfig
  logFn?: Logger
}

export interface RetryConfig {
  maxRetries: number
  delayMs: number
  retryStatusCodes?: number[]
  calculateRetryDelayFn?: (retryAttempt: number) => number
}

/**
 * Logger function interface
 *
 * Note that we do not expect an asynchronous function. If an asynchronous
 * function is passed in, it will not be waited on.
 */
export interface Logger {
  (options: LoggerParams): any
}

/**
 * Structure of the object passed in to the logger function
 */
export interface LoggerParams {
  request: {
    url: string
    method: string
    params?: Record<string, string | number | boolean>
    headers?: Record<string, string | number | boolean>
    data?: any
  }
  response: {
    code?: string | undefined
    message?: string | undefined
    status?: number
    headers?: Record<string, string | number | boolean>
    data?: any
  }
}
