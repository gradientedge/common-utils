import { LoggerLevel, LoggerOutput } from '@gradientedge/logger'
import chalk from 'chalk'
import util from 'util'

export const chalkLevelPrefix = {
  [LoggerLevel.ERROR]: chalk.white.bgRed('        ERROR       '),
  [LoggerLevel.WARN]: chalk.black.bgYellow('        WARN        '),
  [LoggerLevel.INFO]: chalk.black.bgWhite('        INFO        '),
  [LoggerLevel.DEBUG]: chalk.hex('#333333').bgGray('        DEBUG       '),
}

export function prettify(data: LoggerOutput): string {
  const output: any = { ...data }
  const lines: string[] = []
  let message: string | undefined
  if (output.hasOwnProperty('message')) {
    message = output.message
    delete output.message
  }
  let line1 = `${chalkLevelPrefix[data.level]} - ${message ?? '(no log message)'}`
  delete output.level
  if (['string', 'number', 'boolean'].includes(typeof data.data)) {
    line1 = `${line1}: ${chalk.green(data.data)}`
    delete output.data
  }
  if (!output.base?.getOwnPropertyNames()?.length) {
    delete output.base
  }
  lines.push(line1)
  if (output.data !== undefined || output.base) {
    lines.push(
      util.inspect(output, {
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
  return lines.join('\n')
}
