const promiseKeys: Record<string, Promise<any> | undefined> = {}

export interface SinglePromiseParams<T = any> {
  key: string
  fn: (...args: any[]) => Promise<T>
}

export function singlePromise<T = any>(options: SinglePromiseParams<T>) {
  if (!promiseKeys[options.key]) {
    promiseKeys[options.key] = new Promise(async (resolve, reject) => {
      try {
        const response = await options.fn()
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
    promiseKeys[options.key] = promiseKeys[options.key]!.finally(() => {
      delete promiseKeys[options.key]
    })
  }
  return promiseKeys[options.key] as Promise<T>
}
