import { RetryConfig } from './types'
import { HttpsOptions } from 'agentkeepalive'

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  delayMs: 20,
  maxRetries: 3,
}

export const DEFAULT_AGENT_CONFIG: HttpsOptions = {
  keepAlive: true,
  timeout: 5000,
  maxSockets: 20,
  scheduling: 'fifo',
}
