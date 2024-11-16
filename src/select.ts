import { getVersion } from './macro' with { type: 'macro' };
import { AnSelector } from "./selector";

/**
 * dom library, if there are multi elements:
 * All get operation run on first element, all set operation run on every element
 * @example
 * ```ts
 * $('.title')
 * $('<div>content</div>')              // not in dom tree, need to mount with parent()
 * $(document.body)
 * ```
 */
export function $<T extends HTMLElement = HTMLElement>(selector: string): AnSelector<T>
export function $<T extends HTMLElement = HTMLElement>(selector: T | T[] | NodeListOf<T> | null): AnSelector<T>
export function $<T extends AnSelector = AnSelector>(selector: T): T
export function $(selector: any) {
  if (/</.test(selector)) {
    const temp = document.createElement("div")
    temp.innerHTML = selector
    const els = Array.from(temp.children) 
    temp.innerHTML = ''
    return new AnSelector(els as HTMLElement[])
  }
  if(typeof selector === 'string') {
    const els =[...document.querySelectorAll(selector) ?? []]
    return new AnSelector(els as HTMLElement[])
  }
  if (selector instanceof HTMLElement) {
    return new AnSelector([selector])
  }
  if (selector instanceof AnSelector) {
    return selector
  }
  if(selector instanceof NodeList) {
    return new AnSelector(Array.from(selector) as any)
  }
  if(Array.isArray(selector)) {
    if(selector.every(i => i instanceof HTMLElement)) {
      return new AnSelector(selector)
    }
  }
  return new AnSelector([])
}

export namespace $ {
  /**
   * the current version
   * @example
   * ```ts
   * 'v1.0.0'
   * ```
   */
  export const version = `v${getVersion()}`
  /**
   * The prototype of core class, extends it to fit your needs
   * @example
   * ```ts
   * $.fn.mycall = function {}    // define
   * $('div').mycall()            // use
   * ```
   */
  export const fn = AnSelector.prototype
  /**
   * Use a plugin
   * @example
   * ```ts
   * functin myplugin($: AnSelect) {
   *   $.mystatic  = function() {}
   *   $.fn.mycall = function() {}
   * }
   * $.use(myplugin)
   * ```
   */
  export function use(this: typeof $, fn: (this: typeof $, app: typeof $) => void) {
    fn.call(this, this); 
    return this;
  }
}