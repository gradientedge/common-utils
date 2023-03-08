/* eslint-disable @typescript-eslint/ban-ts-comment */

import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { Logger } from './types'
import { extractAxiosHeaders } from './extract-headers'

export function applyLoggerInterceptor(instance: AxiosInstance, logFn: Logger) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // @ts-ignore
    config.__startTime = Date.now()
    return config
  })
  instance.interceptors.response.use(
    (response) => {
      logFn({
        request: {
          baseUrl: response.config?.baseURL,
          url: response.config?.url ?? '',
          method: response.config?.method as string,
          params: response.config?.params,
          headers: extractAxiosHeaders(response.config?.headers),
          data: response.config?.data,
        },
        response: {
          status: response.status,
          headers: extractAxiosHeaders(response.headers),
          data: response.data,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          elapsedTimeMs: response.config?.__startTime ? Date.now() - response.config?.__startTime : null,
        },
      })
      return response
    },
    (error: AxiosError) => {
      logFn({
        request: {
          baseUrl: error.config?.baseURL,
          url: error.config?.url ?? '',
          method: error.config?.method as string,
          params: error.config?.params,
          headers: extractAxiosHeaders(error.config?.headers),
          data: error.config?.data,
        },
        response: {
          code: error.code,
          message: !error.response?.status ? error.message : undefined,
          status: error.response?.status,
          headers: extractAxiosHeaders(error.response?.headers),
          data: error.response?.data,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          elapsedTimeMs: error.config?.__startTime ? Date.now() - error.config?.__startTime : null,
        },
      })
      return Promise.reject(error)
    },
  )
}
