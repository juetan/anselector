export class AnSelector<T extends HTMLElement = HTMLElement> {
  constructor(protected readonly elements: T[]) {
    if (!Array.isArray(elements)) {
      throw Error("elements must be array")
    }
  }

  // internal
  protected each(callback: (el: T) => void) {
    this.elements.forEach(callback)
    return this
  }

  // internal
  [Symbol.iterator]() {
    let index = 0
    const map = (i: any) => new AnSelector([i])
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
   * // listen once by passing `once: true` to options in modern browser
   * on('click', callback, options)
   * ```
   */
  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: T, e: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): this
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
   * css('color: red;')            // append css
   * css('set:color: red;')        // replace css
   * css({ color: 'red' })         // append css with object
   * ```
   */
  css(): string | undefined
  css(value: string | Partial<CSSStyleDeclaration>): this
  css(value?: string | object) {
    if (value === void 0) {
      return this.el?.style.cssText
    }
    if (typeof value === "object") {
      return this.each((i) => Object.assign(i.style, value))
    }
    if (value.startsWith("set:")) {
      const v = value.substring(4)
      return this.each((i) => (i.style.cssText = v))
    }
    return this.each((i) => (i.style.cssText += value))
  }

  /**
   * @example
   * ```ts
   * class()             // get classname
   * class('xx')         // append classname
   * class('set:xx')     // replace all classname
   * class('has:xx')     // if contains classname
   * class('toggle:xx')  // toggle classname
   * class('remove:xx')  // remove classname
   * ```
   */
  class(): string | undefined
  class(value: `has:${string}`): boolean
  class(value: string): this
  class(value?: string) {
    if (value === void 0) {
      return this.el?.className
    }
    if (value.startsWith("has:")) {
      const v = value.substring(4)
      return this.el?.classList.contains(v)
    }
    if (value.startsWith("set:")) {
      const v = value.substring(4)
      return this.each((i) => (i.className = v))
    }
    if (value.startsWith("remove:")) {
      const v = value.substring(7)
      return this.each((i) => i.classList.remove(v))
    }
    if (value.startsWith("toggle:")) {
      const v = value.substring(7)
      return this.each((i) => i.classList.toggle(v))
    }
    return this
  }

  /**
   * @example
   * ```ts
   * text()                      // get inner text
   * text('xx')                  // replace text
   * text('prepend:xx')          // prepend text
   * text('append:xxx')          // append text
   * ```
   */
  text(): string
  text(value: string): this
  text(value?: string) {
    if (value === void 0) {
      return this.el?.innerText ?? this.el?.textContent ?? ""
    }
    if (value.startsWith("prepend:")) {
      const v = value.substring(8)
      return this.each((i) => ((i.innerText = v + i.innerText), (i.textContent = v + i.textContent)))
    }
    if (value.startsWith("append:")) {
      const v = value.substring(7)
      return this.each((i) => ((i.innerText += v), (i.textContent += v)))
    }
    return this.each((i) => ((i.innerText = value), (i.textContent = value)))
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
    if (key && typeof key === "object") {
      const attrs = Object.entries<any>(key)
      return this.each((i) => attrs.forEach(([k, v]) => i.setAttribute(k, v)))
    }
    return this.each((i) => i.setAttribute(key, value))
  }

  /**
   * @example
   * ```ts
   * parent()                    // return $parent
   * parent(null)                // remove from parent
   * parent('.title')            // append to
   * parent('prepend:.title')    // prepend to
   * parent(el)                  // append to parent with html element
   * parent($el)                 // append to parent with $ element
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
    let call = mode === "prepend" ? "prepend" : "appendChild"
    if (typeof selector === "string") {
      if (selector.startsWith("prepend:")) {
        call = "prepend"
        selector = selector.substring(8)
      }
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
      return items.map((i) => new AnSelector([i]))
    }
    if (nodes === null) {
      return this.each((i) => (i.innerHTML = ""))
    }
    const call = mode === "prepend" ? "prepend" : "appendChild"
    if (nodes instanceof HTMLElement) {
      this.el && this.el[call](nodes)
      return this
    }
    if (nodes instanceof AnSelector) {
      nodes.el && this.el && this.el[call](nodes.el)
      return this
    }
    if (Array.isArray(nodes)) {
      return this.each((i) => i.replaceChildren(...nodes))
    }
    return this
  }
}
