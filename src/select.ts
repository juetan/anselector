import { getVersion } from './macro' with { type: 'macro' }
import { AnSelectCSS, css } from './select-css'
import { anselector, AnSelector } from './selector'

export interface AnPlugin {
  install(this: AnSelect, app: AnSelect): void
}

export interface AnSelect {
  /**
   * dom library, if there are multi elements:
   * All get operation run on first element, all set operation run on every element
   * @alias
   * `anselect` `an` `$`
   * @example
   * ```ts
   * $('.title')             // css selector
   * $('<div>content</div>') // not in dom tree, need to mount with parent()
   * $(document.body)        // html element
   * ```
   */
  <T extends HTMLElement = HTMLElement>(selector: string | T | T[] | NodeListOf<T> | null): AnSelector<T>
  <T extends AnSelector = AnSelector>(selector: T): T
  /**
   * the current version
   * @example
   * ```ts
   * 'v1.0.0'
   * ```
   */
  version: string
  /**
   * The prototype of core class, extends it to fit your needs
   * @example
   * ```ts
   * $.fn.mycall = function {}    // define
   * $('div').mycall()            // use
   * ```
   */
  fn: AnSelector
  /**
   * Use a plugin
   * @example
   * ```ts
   * functin myPlugin(this: AnSelect) {
   *   this.mystatic  = function() {}
   *   this.fn.mycall = function() {}
   * }
   * $.use(myPlugin)
   * ```
   */
  use: (plugin: AnPlugin | AnPlugin['install']) => AnSelect
  /**
   * add css to document.head
   * @example
   * ```ts
   * css('p { color: red }')         // add css
   * css('myid', 'p { color: red }') // add css with id
   * css.remove('myid')              // remove css by id
   * css.clear()                     // remove all added css
   * ```
   */
  css: AnSelectCSS
}

export const anselect = function (selector: any) {
  if (/</.test(selector)) {
    const temp = document.createElement('div')
    temp.innerHTML = selector
    const els = Array.from(temp.children) as any[]
    temp.innerHTML = ''
    return anselector(els)
  }
  if (typeof selector === 'string') {
    const els = [...(document.querySelectorAll(selector) ?? [])]
    return anselector(els as any[])
  }
  if (selector instanceof HTMLElement) {
    return anselector([selector])
  }
  if (selector instanceof AnSelector) {
    return selector
  }
  if (selector instanceof NodeList) {
    return anselector(Array.from(selector) as any)
  }
  if (Array.isArray(selector)) {
    return anselector(selector)
  }
  return anselector([])
} as AnSelect

anselect.version = getVersion()
anselect.fn = AnSelector.prototype
anselect.css = css
anselect.use = function (plugin) {
  if ((plugin as AnPlugin).install) {
    ;(plugin as AnPlugin).install.call(this, this)
    return this
  }
  if (typeof plugin === 'function') {
    plugin.call(this, this)
    return this
  }
  return this
}

export function download(url: string, name: string = 'download') {
  const el = $(`<a download="${name}" href="${url}"></a>`)
  console.log(el.el)
  el.css.hide()
  el.parent(document.body)
  el.click()
  el.parent(null)
}

/**
 * alias for anselect
 */
export const $ = anselect as AnSelect

/**
 * alias for anselect
 */
export const an = anselect as AnSelect
