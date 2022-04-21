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
