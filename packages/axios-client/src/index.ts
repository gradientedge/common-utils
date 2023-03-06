import { HttpsAgent } from 'agentkeepalive'
import axios, { AxiosError } from 'axios'
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry'
import { RequestConfig } from './types'
import { DEFAULT_AGENT_CONFIG, DEFAULT_RETRY_CONFIG } from './constants'
import { applyLoggerInterceptor } from './logger'

/**
 * Get an axios instance configured with the given retry mechanism
 * and custom agent for socket re-use.
 */
export function getAxiosClient(options?: RequestConfig) {
  const retry = { ...DEFAULT_RETRY_CONFIG, ...options?.retry }
  const httpsAgent = new HttpsAgent({
    ...DEFAULT_AGENT_CONFIG,
    ...options?.httpsAgent,
  })
  const client = axios.create({
    httpsAgent,
    timeout: httpsAgent.options.timeout,
    transitional: {
      clarifyTimeoutError: true,
    },
  })

  if (options?.logFn) {
    applyLoggerInterceptor(client, options.logFn)
  }

  if (retry.maxRetries) {
    axiosRetry(client, {
      retries: retry.maxRetries,
      retryDelay: options?.retry?.calculateRetryDelayFn ?? getCalculateRetryDelayFn(retry.delayMs),
      shouldResetTimeout: true,
      retryCondition: function (error: AxiosError) {
        // The error code for a timeout is ECONNABORTED. Default axios-retry
        // behaviour doesn't consider timeouts 'retryable'.
        return isRequestRetryable(error, options?.retry?.retryStatusCodes ?? [])
      },
      onRetry: (retryCount, error, requestConfig) => {
        requestConfig.headers ??= {}
        requestConfig.headers['X-Retry-Count'] = retryCount
      },
    })
  }

  return client
}

/**
 * Default function for calculating the delay between a request failure and the next retry.
 */
export const getCalculateRetryDelayFn = (delayMs: number) => (retryCount: number) => delayMs * 2 ** (retryCount - 1)

/**
 * Default implementation for determining whether a request is retryable
 */
export function isRequestRetryable(error: AxiosError, retryStatusCodes: number[]) {
  return (
    isNetworkOrIdempotentRequestError(error) ||
    error.code === 'ETIMEDOUT' ||
    (error.code !== 'ECONNABORTED' && retryStatusCodes.includes(error?.response?.status ?? 0))
  )
}

export * from './transform'
export { Logger, LoggerParams } from './types'
export { AxiosError, AxiosResponse } from 'axios'
