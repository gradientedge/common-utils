import { transformError } from './error'
import { maskSensitiveData } from '../mask'

export function transformData(data: any[]) {
  let transformedData
  data.forEach((item: any) => {
    if (item?.error instanceof Error) {
      item.error = transformError(item.error)
    }
  })
  if (data.length === 1) {
    transformedData = data[0]
  } else {
    transformedData = undefined
  }
  return maskSensitiveData(transformedData)
}
