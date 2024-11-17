import { AnSelector } from "./selector"

export interface AnOn<E extends HTMLElement = HTMLElement, T = AnSelector<E>> {
  // <K extends keyof HTMLElementEventMap>(
  //   this: T,
  //   event: K,
  //   listener: (this: E, e: HTMLElementEventMap[K]) => any,
  //   options?: boolean | AddEventListenerOptions
  // ): T
  (this: T, event: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): T
  $: T
}

// @ts-ignore
export const on = function (event, callback, options) {
  return this.each((el) => {
    ;(el as any)._events ??= {}
    ;(el as any)._events[event] ??= []
    ;(el as any)._events[event].push(callback)
    el.addEventListener(event, callback, options)
  })
} as AnOn

export interface AnOff<E extends HTMLElement = HTMLElement, T = AnSelector<E>> {
  (
    this: T,
    event: keyof HTMLElementEventMap,
    listener?: (...args: any[]) => any,
    options?: boolean | EventListenerOptions
  ): T
  $: T
}

export const off = function (event, callback, options) {
  return this.each((el) => {
    const items = (el as any)._events?.[event]
    if (callback) {
      el.removeEventListener(event, callback, options)
      return
    }
    if (!items) {
      return
    }
    for (const item of items) {
      el.removeEventListener(event, item, options)
    }
  })
} as AnOff
