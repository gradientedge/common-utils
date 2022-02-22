import stringify from 'json-stringify-safe'
import util from 'util'
import cloneDeep from 'lodash.clonedeep'
import traverse from 'traverse'
import {
  LOG_LEVEL,
  LOG_LEVEL_DEBUG,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_INFO,
  LOG_LEVEL_NUMBER,
  LOG_LEVEL_WARN,
} from './constants'
import { LoggerOptions } from './types'

const DEFAULT_MASKING_STRING = '********'
const VALID_LEVEL_NAMES = ['debug', 'info', 'warn', 'error']

const sensitivePropertyNames = ['password', 'authorization', 'auth-token']

export class Logger {
  public baseData: any
  public pretty: boolean
  private readonly levelName: string
  private readonly levelNumber: number

  constructor(options?: LoggerOptions) {
    this.baseData = options?.baseData || {}
    this.pretty = process?.env.NODE_ENV === 'development'
    if (VALID_LEVEL_NAMES.includes(options?.level)) {
      this.levelName = options?.level
    } else if (VALID_LEVEL_NAMES.includes(LOG_LEVEL)) {
      this.levelName = options?.level
    }

    this.levelNumber = LOG_LEVEL_NUMBER[this.levelName]
  }

  debug(...args: any[]) {
    this.process(console.debug, LOG_LEVEL_DEBUG, 'debug', args)
  }

  info(...args: any[]) {
    this.process(console.info, LOG_LEVEL_INFO, 'info', args)
  }

  warn(...args: any[]) {
    this.process(console.warn, LOG_LEVEL_WARN, 'warn', args)
  }

  error(...args: any[]) {
    this.process(console.error, LOG_LEVEL_ERROR, 'error', args)
  }

  text(input: string) {
    console.debug(input)
  }

  process(method: any, levelInt: number, level: string, args: any[]) {
    if (levelInt < this.levelNumber) {
      return
    }
    if (!Array.isArray(args) || args.length === 0) {
      return
    }
    let logData = { ...this.baseData, logLevel: level }
    if (typeof args[0] === 'string') {
      logData.message = args[0]
      logData.data = args.slice(1)
    } else {
      logData.data = args
    }
    if (Array.isArray(logData.data)) {
      logData.data.forEach((item: any) => {
        if (item?.error instanceof Error) {
          item.error = transformError(item.error)
        }
      })
      if (logData.data.length === 1) {
        logData.data = logData.data[0]
      }
    }
    logData = maskSensitiveData(logData, sensitivePropertyNames)
    if (this.pretty) {
      method(
        util.inspect(logData, {
          showHidden: false,
          depth: null,
          colors: true,
          compact: false,
          maxStringLength: null,
          maxArrayLength: null,
        }),
      )
    } else {
      method(stringify(logData))
    }
  }
}

/**
 * Mask all properties defined by {@see propertyNames} in the given {@see data} object
 * with the mask string defined by the {@see mask} parameter.
 */
export function maskSensitiveData(data: unknown, propertyNames: string[], mask = DEFAULT_MASKING_STRING) {
  if (typeof data === 'object') {
    propertyNames = propertyNames.map((name) => name.toLowerCase())
    const mutatedData = cloneDeep(data)
    traverse(mutatedData).forEach(function () {
      if (propertyNames.includes(this.key?.toLowerCase() ?? '')) {
        this.update(mask)
      }
    })
    return mutatedData
  }
  return data
}

/**
 * Transform an Error object in to something more digestible.
 * We do some specific transformation of Axios errors.
 */
function transformError(error: Error & Record<string, any>, recursionLevel = 0) {
  if (recursionLevel > 5) {
    return
  }
  let simpleError: Record<string, any> = {}
  Object.getOwnPropertyNames(error).forEach(function (key) {
    simpleError[key] = error[key]
  })
  if (error.name === 'GraphQLError') {
    return transformGraphQLError(error, recursionLevel)
  }
  if (error?.isAxiosError) {
    simpleError = pickAxiosErrorFields(simpleError)
  }
  if (error?.data?.error?.isAxiosError) {
    simpleError.data.error = pickAxiosErrorFields(simpleError)
  }
  return simpleError
}

/**
 * Return only the fields we really want to see from the Axios error object.
 * If we don't do this, then we get many thousands of lines of log lines as
 * the HttpsAgent is a huge deeply nested object.
 */
function pickAxiosErrorFields(error: any) {
  return {
    message: error?.message,
    name: error?.name,
    code: error?.code,
    stack: error?.stack,
    config: {
      url: error?.config?.url,
      method: error?.config?.method,
      headers: error?.config?.headers,
      timeout: error?.config?.timeout,
      params: error?.config?.params,
    },
  }
}

/**
 * Return a lightweight GraphQL error object. In particular, we don't want the `nodes`
 * property, which potentially contains a massive object containing most of the GraphQL
 * schema object.
 */
function transformGraphQLError(error: any, recursionLevel: number) {
  return {
    message: error?.message,
    stack: error?.stack,
    locations: error?.locations,
    path: error?.path,
    originalError: error?.originalError && transformError(error.originalError, recursionLevel + 1),
  }
}
