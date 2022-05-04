import { pipeline } from 'stream'
import split from 'split2'
import { PrettifyTransform } from './transform'

const transform = new PrettifyTransform()

pipeline(process.stdin, split(), transform, process.stdout, (err: NodeJS.ErrnoException | null): void => {
  if (err === null || err === undefined) return
  console.error('PrettyTransformFailed', err)
})
