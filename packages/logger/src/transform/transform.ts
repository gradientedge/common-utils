import { transformError } from './error'
import { maskSensitiveData } from '../mask'

export function transformData(data: any[]): any {
  // Step 1 - filter out any fields we don't want
  //        - How are we going to avoid massive log output when someone tries
  //          to output a response object for example?
  // Step 2 - mask sensitive fields

  let transformedData
  data.forEach((item: any) => {
    if (item?.error instanceof Error) {
      item.error = transformError(item.error)
    }
  })
  if (data.length === 1) {
    transformedData = data[0]
  } else {
    transformedData = data
  }
  return maskSensitiveData(transformedData)
}
