export function createChainable<T = any>(fn: any, context: any): T {
  const fnBinded = fn.bind(context)
  fnBinded.$ = context
  return Object.setPrototypeOf(fnBinded, fn)
}
