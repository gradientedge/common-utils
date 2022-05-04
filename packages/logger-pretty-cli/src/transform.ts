import { Transform, TransformCallback } from 'stream'
import { prettify } from './prettify'
import { isApplicable } from './is-applicable'

export class PrettifyTransform extends Transform {
  _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    let inputString = ''

    if (encoding !== 'buffer') {
      callback(null, chunk)
      return
    }

    inputString = chunk.toString()

    try {
      const jsonObject = JSON.parse(inputString)
      if (isApplicable(jsonObject)) {
        callback(null, prettify(jsonObject) + '\n\n')
        return
      }
    } catch (e) {
      // If an exception is caught, then the `jsonString` variable
      // is not a valid JSON string, so just carry on and pass the
      // chunk through to the callback without processing it.
    }

    callback(null, inputString + '\n\n')
    return
  }
}
