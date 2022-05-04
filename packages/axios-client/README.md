# `@gradientedge/axios-client`

A simple factory function for creating an axios client for use in a nodejs environment. No
options are required when calling the `getAxiosClient` function. In this case, default values
will be used for the retry and HttpsAgent config.

Note that no `HttpAgent` config is provided. We expect all requests to be made via SSL and
therefore the only agent we care about is `HttpsAgent`.

Minimal example:
```typescript
import { getAxiosClient } from '@gradientedge/axios-client'

/**
 * No options provided, so this will use the default retry and HttpsAgent configuration.
 */
const client = getAxiosClient()
```

Full config override example:
```typescript
import { getAxiosClient } from '@gradientedge/axios-client'

const client = getAxiosClient({
  httpsAgent: {
    keepAlive: false,
    timeout: 10000,
    maxSockets: 40,
    scheduling: 'lifo',
    
  },
  retry: {
    delayMs: 100,
    maxRetries: 5,  
  }
})
```

The `client` variable above is an [AxiosInstance](https://github.com/axios/axios/blob/master/index.d.ts#L235) 
which gives you access to all the standard axios methods and functionality. 

## Default values via environment variables

The following describes below the environment variables which are read in, and which
configuration options they apply to if supplied.

- `REQUEST_TIMEOUT_MS` => `RequestConfig.httpsAgent.timeout`
- `REQUEST_MAX_SOCKETS` => `RequestConfig.httpsAgent.maxSockets`
- `REQUEST_RETRY_MAX_RETRIES` => `RequestConfig.retry.maxRetries`
- `REQUEST_RETRY_DELAY_MS` => `RequestConfig.retry.delayMs`

If no values are specified for the config properties above, then the following
fallback default values are used:

- `RequestConfig.httpsAgent.timeout` => 5000
- `RequestConfig.httpsAgent.maxSockets` => 20
- `RequestConfig.retry.maxRetries` => 5
- `RequestConfig.retry.delayMs` => 50
