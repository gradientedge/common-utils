import { LogLevel } from '../types'
import chalk from 'chalk'
import util from 'util'

export const chalkLevelPrefix = {
  [LogLevel.ERROR]: chalk.white.bgRed('        ERROR       '),
  [LogLevel.WARN]: chalk.black.bgYellow('        WARN        '),
  [LogLevel.INFO]: chalk.black.bgWhite('        INFO        '),
  [LogLevel.DEBUG]: chalk.hex('#333333').bgGray('        DEBUG       '),
  [LogLevel.TRACE]: chalk.blue.bgWhite('        TRACE       '),
}

export function prettyOutput(method: any, level: LogLevel, output: any) {
  const message = output.message
  if (output.hasOwnProperty('message')) {
    delete output.message
  }
  let outputData = true
  const args = [`\n${chalkLevelPrefix[level]} - ${message ?? '(no log message)'}`]
  if (['string', 'number', 'boolean'].includes(typeof output.data)) {
    args.push(chalk.green(output.data))
    outputData = false
  }
  method(...args)
  if (outputData && output.data !== undefined) {
    method(
      util.inspect(output.data, {
        showHidden: false,
        depth: null,
        colors: true,
        compact: false,
        sorted: true,
        maxStringLength: null,
        maxArrayLength: null,
      }),
    )
  }
}
