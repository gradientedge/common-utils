# `@gradientedge/single-promise`

Given a function (that returns a promise) and a key, this function ensures that the function is not 
called multiple times, but instead allows multiple calls to it to all wait on the same promise.

Minimal example:
```typescript
import { singlePromise } from '@gradientedge/single-promise'

const grant = await singlePromise('accessToken', () => {
  return client.post('https://some-auth-endpoint')
})
```

In the example above, it's the anonymous function that only gets called once while there may have been
multiple calls to the actual `singlePromise` function. The `accessToken` string is the key that the
`singlePromise` function uses internally to check for an existing promise.
