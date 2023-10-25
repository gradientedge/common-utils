import { transformError } from './error'

export function transformData(data: any[]): any {
  // filter out any fields we don't want
  // How are we going to avoid massive log output when someone tries
  // to output a response object for example?

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
  return transformedData
}
