import { AgentOptions } from 'https'

export interface RequestConfig {
  httpsAgent?: AgentOptions
  retry?: RetryConfig
}

export interface RetryConfig {
  maxRetries: number
  delayMs: number
  retryStatusCodes: number[]
}
