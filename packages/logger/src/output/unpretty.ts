import { LogLevel } from '../types'
import stringify from 'json-stringify-safe'

export function unprettyOutput(method: any, level: LogLevel, output: any) {
  method(stringify({ logLevel: level, ...output }))
}
