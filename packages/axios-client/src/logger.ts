import { AxiosError, AxiosInstance } from 'axios'
import { Logger } from './types'
import { extractAxiosHeaders } from './extract-headers'

export function applyLoggerInterceptor(instance: AxiosInstance, logFn: Logger) {
  instance.interceptors.response.use(
    (response) => {
      logFn({
        request: {
          url: response.config?.url ?? '',
          method: response.config?.method as string,
          params: response.config?.params,
          headers: response.config?.headers,
          data: response.config?.data,
        },
        response: {
          status: response.status,
          headers: extractAxiosHeaders(response.headers),
          data: response.data,
        },
      })
      return response
    },
    (error: AxiosError) => {
      logFn({
        request: {
          url: error.config?.url ?? '',
          method: error.config?.method as string,
          params: error.config?.params,
          headers: error.config?.headers,
          data: error.config?.data,
        },
        response: {
          code: error.code,
          message: !error.response?.status ? error.message : undefined,
          status: error.response?.status,
          headers: extractAxiosHeaders(error.response?.headers),
          data: error.response?.data,
        },
      })
      return Promise.reject(error)
    },
  )
}
