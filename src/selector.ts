import { AnClass, classes } from './selector-class'
import { AnCss, css } from './selector-css'
import { AnParent, parent } from './selector-parent'
import { createChainable } from './utils'

export function anselector<T extends HTMLElement = HTMLElement>(elements: T[]): AnSelector<T> {
  const instance = new AnSelector(elements)
  const callable = instance.$.bind(instance)
  Object.setPrototypeOf(callable, instance)
  return callable as any
}

export class AnSelector<T extends HTMLElement = HTMLElement> {
  constructor(protected readonly elements: T[] = []) {}

  protected [Symbol.iterator]() {
    let index = 0
    const map = (i: any) => anselector([i])
    const items = this.elements.map(map)
    const next = (): { done: boolean; value: AnSelector<T> } => {
      if (index < items.length) {
        return { done: false, value: items[index++] }
      }
      return { done: true, value: undefined as any }
    }
    return { next }
  }

  /**
   *
   * @example
   * ```ts
   * $('div').el   // the (first) element
   * ```
   */
  get el(): T | null {
    return this.elements[0]
  }

  /**
   *
   * @example
   * ```ts
   * $('div').es   // the elements
   * ```
   */
  get es(): T[] {
    return this.elements
  }

  each(callback: (el: T) => void) {
    this.elements.forEach(callback)
    return this
  }

  /**
   * @example
   * ```ts
   * // listen once by passing `once: true` to options in modern browser
   * on('click', callback, options)
   * ```
   */
  on<K extends keyof HTMLElementEventMap>(
    event: K,
    listener: (this: T, e: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): this
  on(event: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): this
  on(event: any, callback: any, options?: boolean | AddEventListenerOptions) {
    return this.each((el: any) => {
      if (!options || options === true || !options.once) {
        el._events ??= {}
        el._events[event] ??= []
        el._events[event].push(callback)
      }
      el.addEventListener(event, callback, options)
    })
  }

  /**
   * bind event or trigger click
   * @example
   * ```ts
   * click()            // trigger click
   * click(() => null)  // add listenner
   * ```
   */
  click(listener?: (e: HTMLElementEventMap['click']) => any, options?: boolean | AddEventListenerOptions) {
    if (listener == void 0) {
      return this.each(el => el.click())
    }
    return this.on('click', listener, options)
  }

  /**
   * @example
   * ```ts
   * off('click', listener, options)            // remove event listener
   * ```
   */
  off(event: keyof HTMLElementEventMap, callback?: (...args: any[]) => any, options?: boolean | EventListenerOptions) {
    return this.each(el => {
      const callbacks = (el as any)._events?.[event]
      if (callback) {
        el.removeEventListener(event, callback, options)
        return
      }
      if (!callbacks) {
        return
      }
      for (const fn of callbacks) {
        el.removeEventListener(event, fn, options)
      }
      delete (el as any)._events
    })
  }

  /**
   * @example
   * ```ts
   * css()                         // get css
   * css('color: red;')            // append css
   * css({ color: 'red' })         // append css with object
   * css.set('color: red;')        // replace css
   * ```
   */
  css: AnCss<T> = createChainable(css, this)

  /**
   * @example
   * ```ts
   * class()             // get classname
   * class('xx')         // append classname
   * class.set('xx')     // replace all classname
   * class.has('xx')     // if contains classname
   * class.toggle('xx')  // toggle classname
   * class.remove('xx')  // remove classname
   * ```
   */
  class: AnClass<T> = createChainable(classes, this)

  /**
   * @example
   * ```ts
   * text()                      // get text
   * text('xx')                  // set text
   * ```
   */
  text(): string | undefined
  text(value: string): this
  text(value?: string) {
    if (value === void 0) {
      return this.el?.innerText ?? this.el?.textContent
    }
    return this.each(el => ((el.innerText = value), (el.textContent = value)))
  }

  /**
   * @example
   * ```ts
   * html()            // get html
   * html('value')     // set html
   * ```
   */
  html(): string | undefined
  html(value: string): this
  html(value?: string) {
    if (value === void 0) {
      return this.el?.innerHTML
    }
    return this.each(el => (el.innerHTML = value))
  }

  /**
   * @example
   * ```ts
   * attr('key')           // get attribute
   * attr('key', 'value')  // set attribute
   * attr({ id: 'title' }) // set attribute
   * ```
   */
  attr(key: string): string | null
  attr(key: string, value: any): this
  attr(values: Record<string, any>): this
  attr(key: any, value?: any) {
    if (value === void 0) {
      return this.el?.getAttribute(key)
    }
    if (key && typeof key === 'object') {
      const attrs = Object.entries<any>(key)
      return this.each(el => attrs.forEach(([k, v]) => el.setAttribute(k, v)))
    }
    return this.each(el => el.setAttribute(key, value))
  }

  /**
   * @example
   * ```ts
   * parent()                    // return $parent
   * parent('.title')            // append to
   * parent(el)                  // append to parent with html element
   * parent($el)                 // append to parent with $ element
   * parent(null)                // remove from parent
   * parent.prepend()            // prepend to
   * ```
   */
  parent: AnParent<T> = createChainable(parent, this)

  /**
   * select child(ren) from current el.
   *
   * @example
   * ```ts
   * $()           // get the direct children
   * $('.title')   // find child(ren) with css selector
   * $(null)       // remove all children
   * ```
   */
  $<T extends HTMLElement = HTMLElement>(value?: string) {
    if (value === void 0) {
      const els = Array.from(this.el?.children ?? [])
      return anselector(els as T[])
    }
    if (value === null) {
      return this.each(el => (el.innerHTML = ''))
    }
    const els = [...(this.el?.querySelectorAll(value) ?? [])]
    return anselector(els as T[])
  }
}

export interface AnSelector<T extends HTMLElement = HTMLElement> {
  (selector: string): this
}