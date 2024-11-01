export class AnSelector<T extends HTMLElement = HTMLElement> {
  constructor(protected readonly elements: T[]) {}

  // internal
  protected each(callback: (el: T) => void) {
    this.elements.forEach(callback)
    return this
  }

  // internal
  [Symbol.iterator]() {
    let index = 0
    const map = (i: any) => new AnSelector(i)
    const items = this.elements.map(map) as any[]
    const next = (): { done: boolean; value: AnSelector<T> } => {
      if (index < items.length) {
        return { done: false, value: items[index++] }
      }
      return { done: true, value: undefined as any }
    }
    return { next }
  }

  /**
   * the (first) element
   * @example
   * ```ts
   * $('div').el
   * ```
   */
  get el(): T | null {
    return this.elements[0]
  }

  /**
   * the elements
   * @example
   * ```ts
   * $('div').es
   * ```
   */
  get es(): T[] {
    return [...this.elements]
  }

  /**
   * select child(ren) from current el.
   *
   * @example
   * ```ts
   * $('.item').$('.title') // new instance
   * ```
   */
  $<T extends HTMLElement = HTMLElement>(selector: string) {
    const els = [...(this.el?.querySelectorAll(selector) ?? [])]
    return new AnSelector<T>(els as T[])
  }

  /**
   * @example
   * ```ts
   * // can be once by passing `once: true` to options in modern browser
   * on('click', callback, options)
   * ```
   */
  on<K extends keyof HTMLElementEventMap>(type: K,listener: (this: T, e: HTMLElementEventMap[K]) => any,options?: boolean | AddEventListenerOptions): this
  on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): this
  on(event: any, value: any, options?: any) {
    return this.each((i) => i.addEventListener(event, value, options))
  }

  /**
   * @example
   * ```ts
   * off('click', listener, options)            // remove event listener
   * ```
   */
  off(type: keyof HTMLElementEventMap, listener: (...args: any[]) => any, options?: boolean | EventListenerOptions) {
    return this.each((i) => i.removeEventListener(type, listener, options))
  }

  /**
   * @example
   * ```ts
   * css()                         // get css
   * css(null)                     // remove all css
   * css('color: red;', 'replace') // replace, append(default) css
   * css({ color: 'red' })         // append css with object
   * ```
   */
  css(): string | undefined
  css(value: null | Partial<CSSStyleDeclaration>): this
  css(value: string, mode?: "replace"): this
  css(value?: any, mode?: any) {
    if (value === void 0) {
      return this.el?.style.cssText
    }
    if (value === null) {
      return this.each((i) => (i.style.cssText = ""))
    }
    if (typeof value === "object") {
      return this.each((i) => Object.assign(i.style, value))
    }
    if (mode === void 0) {
      return this.each((i) => (i.style.cssText += value))
    }
    if (mode === "replace") {
      return this.each((i) => (i.style.cssText = value))
    }
    return this
  }

  /**
   * @example
   * ```ts
   * class()                   // get classname
   * class(myclass)            // append classname
   * class(myclass, null)      // remove classname
   * class(myclass, 'has')     // if contains classname
   * class(myclass, 'toggle')  // toggle classname
   * ```
   */
  class(): string | undefined
  class(name: string, mode: "has"): boolean
  class(name: string, mode?: "toggle" | "replace" | null): this
  class(name?: any, mode?: any) {
    if (name === void 0) {
      return this.el?.className
    }
    if (mode === void 0) {
      return this.each((i) => i.classList.add(name))
    }
    if (mode === null) {
      return this.each((i) => i.classList.remove(name))
    }
    if (mode === "has") {
      return this.el?.classList.contains(name)
    }
    if (mode === "toggle") {
      return this.each((i) => i.classList.toggle(name))
    }
    if (mode === "replace") {
      return this.each((i) => (i.className = name))
    }
    return this
  }

  /**
   * @example
   * ```ts
   * text()                      // get inner text
   * text(mytext, 'prepend')     // replace(default), prepend or append text
   * ```
   */
  text(): string
  text(value: string, mode?: "prepend" | "append"): this
  text(value?: any, mode?: any) {
    if (value === void 0) {
      return this.el?.innerText ?? this.el?.textContent ?? ""
    }
    const setText = (i: T) => {
      let txt = value
      if (mode === "prepend") {
        txt = value + (i.innerText || i.textContent)
      } else if (mode === "append") {
        txt = (i.innerText || i.textContent) + value
      }
      i.innerText = txt
      i.textContent = txt
    }
    return this.each(setText)
  }

  /**
   * @example
   * ```ts
   * html()            // get inner html
   * html('value')     // replace inner html
   * ```
   */
  html(): string | undefined
  html(value: string): this
  html(value?: string) {
    if (value === void 0) {
      return this.el?.innerHTML
    }
    return this.each((i) => (i.innerHTML = value))
  }

  /**
   * @example
   * ```ts
   * attr('key')          // get attribute
   * attr('key', null)    // remove attribute
   * attr('key', 'value') // set attribute
   * ```
   */
  attr(key: string): string | null
  attr(key: string, value: any): this
  attr(values: Record<string, any>): this
  attr(key: any, value?: any) {
    if (typeof key === "object") {
      const attrs = Object.entries<any>(key)
      return this.each((i) => attrs.forEach(([k, v]) => i.setAttribute(k, v)))
    }
    if (value === void 0) {
      return this.el?.getAttribute(key)
    }
    if (value === null) {
      return this.each((i) => i.removeAttribute(key))
    }
    return this.each((i) => i.setAttribute(key, value))
  }

  /**
   * @example
   * ```ts
   * parent()                    // return $parent
   * parent(null)                // remove from parent
   * parent('.title', 'prepend') // prepend or append(default)
   * parent(el)                  // change parent with html element
   * parent($el)                 // change parent with $ element
   * ```
   */
  parent<E extends HTMLElement = HTMLElement>(): AnSelector<E> | null
  parent(selector: null): this
  parent(selector: string | HTMLElement | AnSelector, mode?: "prepend"): this
  parent(selector?: any, mode?: any) {
    if (selector === void 0) {
      const parent = this.el?.parentElement
      return parent && new AnSelector([parent])
    }
    this.each((i) => i.parentElement?.removeChild(i))
    this.elements.splice(1)
    if (selector === null) {
      return this
    }
    const call = mode === "prepend" ? "prepend" : "appendChild"
    if (typeof selector === "string") {
      this.el && document.querySelector(selector)?.[call](this.el)
      return this
    }
    if (selector instanceof AnSelector) {
      this.el && selector.el?.[call](this.el)
      return this
    }
    if (selector instanceof HTMLElement) {
      this.el && selector[call](this.el)
      return this
    }
    return this
  }

  /**
   * @example
   * ```ts
   * children()                // return $child[]
   * children(null)            // remove children
   * children(el, 'prepend')   // append(default) or prepend child
   * children([el])            // replace children
   * ```
   */
  children<E extends HTMLElement = HTMLElement>(): AnSelector<E>[]
  children(node: null): this
  children(node: HTMLElement | AnSelector, mode?: "prepend"): this
  children(node: HTMLElement[]): this
  children(nodes?: any, mode?: any) {
    if (nodes === void 0) {
      const items = Array.from(this.el?.children ?? []) as any[]
      return items.map((i) => new AnSelector(i))
    }
    if (nodes === null) {
      return this.each((i) => (i.innerHTML = ""))
    }
    const call = mode === "prepend" ? "prepend" : "appendChild"
    if (nodes instanceof HTMLElement) {
      return this.each((i) => i[call](nodes))
    }
    if (nodes instanceof AnSelector) {
      nodes.el && this.each((i) => i[call](nodes.el))
      return this
    }
    if (Array.isArray(nodes)) {
      return this.each((i) => i.replaceChildren(...nodes))
    }
    return this
  }
}
