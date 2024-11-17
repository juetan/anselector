export function createChainable<T = any>(fn: any, context: any): T {
  const fnBinded = fn.bind(context)
  fnBinded.__ = context
  Object.assign(fnBinded, fn)
  return Object.setPrototypeOf(fnBinded, context)
}
