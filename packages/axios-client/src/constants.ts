import { RetryConfig } from './types'
import { HttpsOptions } from 'agentkeepalive'

let defaultTimeoutMs = parseInt(process?.env?.REQUEST_TIMEOUT_MS ?? '', 10)
if (isNaN(defaultTimeoutMs)) {
  defaultTimeoutMs = 5000
}

let defaultMaxSockets = parseInt(process?.env?.REQUEST_MAX_SOCKETS ?? '', 10)
if (isNaN(defaultMaxSockets)) {
  defaultMaxSockets = 20
}

let defaultRetryMaxRetries = parseInt(process?.env?.REQUEST_RETRY_MAX_RETRIES ?? '', 10)
if (isNaN(defaultRetryMaxRetries)) {
  defaultRetryMaxRetries = 5
}

let defaultRetryDelayMs = parseInt(process?.env?.REQUEST_RETRY_DELAY_MS ?? '', 10)
if (isNaN(defaultRetryDelayMs)) {
  defaultRetryDelayMs = 50
}

/**
 * Default max retry attempts
 *
 * Defaults to 5 unless a valid integer value is specified in the
 * REQUEST_RETRY_MAX_RETRIES environment variable. This value is only used
 * if no specific value is passed in for the {@see RetryConfig.maxRetries}
 * property.
 */
export const DEFAULT_RETRY_MAX_RETRIES = defaultRetryMaxRetries

/**
 * Default retry delay in milliseconds
 *
 * Defaults to 50 milliseconds unless a valid integer value is specified
 * in the REQUEST_RETRY_DELAY_MS environment variable. This value is only used
 * if no specific value is passed in for the {@see RetryConfig.delayMs} property.
 */
export const DEFAULT_RETRY_DELAY_MS = defaultRetryDelayMs

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  delayMs: DEFAULT_RETRY_DELAY_MS,
  maxRetries: DEFAULT_RETRY_MAX_RETRIES,
  retryStatusCodes: [],
}

/**
 * Default timeout in milliseconds
 *
 * Defaults to 5000 milliseconds unless a valid integer value is specified
 * in the REQUEST_TIMEOUT_MS environment variable. This value is only used
 * if no specific value is passed in for the {@see HttpsOptions.timeout}
 * property.
 */
export const DEFAULT_TIMEOUT_MS = defaultTimeoutMs

/**
 * Default maximum number of sockets
 *
 * Defaults to 20 sockets unless a valid integer value is specified
 * in the REQUEST_MAX_SOCKETS environment variable. This value is only used
 * if no specific value is passed in for the {@see HttpsOptions.maxSockets}
 * property.
 */
export const DEFAULT_MAX_SOCKETS = defaultTimeoutMs

/**
 * Default https agent configuration
 *
 * The values here are merged with any provided by the user to the
 * {@see RequestConfig.httpsAgent} property.
 */
export const DEFAULT_AGENT_CONFIG: HttpsOptions = {
  keepAlive: true,
  timeout: DEFAULT_TIMEOUT_MS,
  maxSockets: DEFAULT_MAX_SOCKETS,
  scheduling: 'fifo',
}
