import { getVersion } from './macro' with { type: 'macro' };
import { AnSelector } from "./selector";

export interface AnSelect {
  <T extends HTMLElement = HTMLElement>(selector: string): AnSelector<T>
  <T extends HTMLElement = HTMLElement>(selector: T | T[] | NodeListOf<T> | null): AnSelector<T>
  <T extends AnSelector = AnSelector>(selector: T): T
  /**
   * The version you are using
   * @example
   * ```ts
   * 'v1.0.0'
   * ```
   */
  readonly version: string
  /**
   * The prototype of core class, extends it to fit your needs
   * @example
   * ```ts
   * $.fn.mycall = function {}    // define
   * $('div').mycall()            // use
   * ```
   */
  readonly fn: AnSelector
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
  readonly use: (plugin: (this: AnSelect, app: AnSelect) => void) => AnSelect
}

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
export const $ = (()=>{
  function $(selector: any) {
    if (/</.test(selector)) {
      const temp = document.createElement("div")
      temp.innerHTML = selector
      const els = Array.from(temp.children) as any[]
      temp.innerHTML = ''
      temp.remove()
      return new AnSelector(els)
    }
    if(typeof selector === 'string') {
      const els =[...document.querySelectorAll(selector) ?? []]
      return new AnSelector(els as any[])
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
      return new AnSelector(selector)
    }
    return new AnSelector([])
  }
  
  $.fn = AnSelector.prototype
  $.version = `v${getVersion()}`
  $.use = function (fn: any) { fn.call($, $); return $; }

  return $ as AnSelect
})()
