# `@gradientedge/logger`

## Usage

This package is only intended for use within a node environment.

### Using the default logger instance

You don't need to create any objects in order to start logging.
It's as simple as:

```typescript
import log from '@gradientedge/logger'

log.debug('Your message here', { additionalData: 123 })
```

The `log` object here is a singleton that's created when the
`@gradientedge/logger` package is first imported.

### Creating your own logger instance

If you want more control over the creation of the `Logger` instance,
you can create your own:

```typescript
import { Logger, LoggerLevel } from '@gradientedge/logger'

const myLogger = new Logger({
  level: LoggerLevel.ERROR,
})

myLogger.error('Major problem!')
```

## Using with `@gradientedge/als`

The `@gradientedge/als` is a simple suite of functions that allow you to
create `AsyncLocalStorage` via the `create` function, and then retrieve
that data via the `retrieve` function.

As you'll see in the [`index.ts`](./src/index.ts) file, we use JavaScript's
`Proxy` class to check to see if we have async local storage data available
to us each time any of the `Logger` methods are called. If we do, then we 
check for `logger` property on that data object. If that exists, and is an
instance of `Logger`, then we call the log method on that `Logger` instance
rather than on the singleton instance.

Here's an example:

```typescript
import { Logger, LoggerLevel } from '@gradientedge/logger'

const myLogger = new Logger({
  level: LoggerLevel.WARN,
  baseData: {
      requestId: '1234'
  }
})

const context = {
  logger: myLogger
}

als.create(context, async () => {
  
  log.debug('Test message', { name: 'Jimmy' })
  
  // Prints the following:
  //
  // {
  //   "level": "debug",
  //   "message": "Test message",
  //   "base": {
  //     "requestId": "1234"
  //   },
  //   "data": {
  //     "name": "Jimmy"
  //   }
  // }
})
```

## Setting the log level with an environment variable

You can define a `LOGGER_LEVEL` environment variable with one of the
following values:

* `debug`
* `info`
* `warn`
* `error`

If set, this will be used as the default log level for any new instances
of the `Logger` class.
