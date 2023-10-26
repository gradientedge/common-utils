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

## Setting the log level with an environment variable

You can define a `LOGGER_LEVEL` environment variable with one of the
following values:

* `debug`
* `info`
* `warn`
* `error`

If set, this will be used as the default log level for any new instances
of the `Logger` class.
