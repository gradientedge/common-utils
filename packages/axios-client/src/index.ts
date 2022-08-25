import { HttpsAgent } from 'agentkeepalive'
import axios, { AxiosError } from 'axios'
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry'
import { RequestConfig } from './types'
import { DEFAULT_AGENT_CONFIG, DEFAULT_RETRY_CONFIG } from './constants'

/**
 * Get an axios instance configured with the given retry mechanism
 * and custom agent for socket re-use.
 */
export function getAxiosClient(options?: RequestConfig) {
  const retry = options?.retry || DEFAULT_RETRY_CONFIG
  const httpsAgent = new HttpsAgent({
    ...DEFAULT_AGENT_CONFIG,
    ...options?.httpsAgent,
  })
  const client = axios.create({
    httpsAgent,
    timeout: httpsAgent.options.timeout,
  })

  if (retry.maxRetries) {
    axiosRetry(client, {
      retries: retry.maxRetries,
      retryDelay: getCalculateRetryDelayFn(retry.delayMs),
      shouldResetTimeout: true,
      retryCondition: function (error: AxiosError) {
        // The error code for a timeout is ECONNABORTED. Default axios-retry
        // behaviour doesn't consider timeouts 'retryable'.
        return isRequestRetryable(error)
      },
    })
  }

  return client
}

export function getCalculateRetryDelayFn(delayMs: number) {
  return (retryCount: number) => {
    if (retryCount === 0) {
      return 0
    }
    return delayMs * 2 ** (retryCount - 1)
  }
}

export function isRequestRetryable(error: AxiosError) {
  return (
    isNetworkOrIdempotentRequestError(error) ||
    (!error.response && error.code === 'ECONNABORTED') ||
    error.response?.status === 429
  )
}

export * from './transform'
