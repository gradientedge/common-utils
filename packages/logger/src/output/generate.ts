import { LoggerLevelValue, LoggerOutput } from '../types'
import { transformData } from '../transform/transform'

export function generateOutput(
  level: LoggerLevelValue,
  baseData: Record<string, any> | null,
  args: any[],
): LoggerOutput {
  const output: LoggerOutput = {
    level,
  }
  let outputData = args
  if (baseData) {
    output.base = baseData
  }
  if (typeof outputData[0] === 'string') {
    output.message = outputData[0]
    outputData = outputData.slice(1)
  }
  if (outputData.length) {
    output.data = transformData(outputData)
  }
  return output
}
