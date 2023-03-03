import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { extractAxiosHeaders } from './extract-headers'

export function transformAxiosResponseForLogger(response: any) {
  return {
    request: {
      url: response.config?.url,
      method: response.config?.method,
      headers: extractAxiosHeaders(response.config?.headers),
      params: response.config?.params,
      data: parseRequestData(response.config),
    },
    response: {
      status: response?.status,
      headers: extractAxiosHeaders(response?.headers),
      data: response?.data,
    },
  }
}

export function transformAxiosErrorForLogger(e: AxiosError) {
  return {
    message: e?.message,
    name: e?.name,
    code: e?.code,
    stack: e?.stack,
    config: {
      url: e?.config?.url,
      method: e?.config?.method,
      headers: extractAxiosHeaders(e?.config?.headers),
      timeout: e?.config?.timeout,
      params: e?.config?.params,
    },
  }
}

function parseRequestData(config: InternalAxiosRequestConfig) {
  let data = config?.data
  if (typeof data === 'string' && data) {
    let contentType = ''
    if (typeof config?.headers?.['Content-Type'] === 'string') {
      contentType = config?.headers?.['Content-Type']
    }
    if (contentType.substring(0, 16) === 'application/json') {
      try {
        data = JSON.parse(config.data)
      } catch (e) {
        // No alteration to the `data` variable
      }
    } else if (contentType.substring(0, 33) === 'application/x-www-form-urlencoded') {
      try {
        const searchParams = new URLSearchParams(config.data)
        const paramsObj: Record<string, string | string[]> = {}
        searchParams.forEach((value, key, searchParams) => {
          const values = searchParams.getAll(key)
          if (values.length === 0) {
            paramsObj[key] = ''
          } else if (values.length === 1) {
            paramsObj[key] = values[0]
          } else {
            paramsObj[key] = values
          }
        })
        data = paramsObj
      } catch (e) {
        // No alteration to the `data` variable
      }
    }
  }
  return data
}
