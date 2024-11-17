import { AnSelector } from "./selector"

export interface AnCss<E extends HTMLElement = HTMLElement, T = AnSelector<E>> {
  (this: T): string | undefined
  (this: T, content: string | Partial<CSSStyleDeclaration>): T
  $: T
  set: (content: string) => T
  hide: (value?: boolean) => T
  toggle: () => T
}

export const css = function (content) {
  if (content == void 0) {
    return this.el?.style.cssText
  }
  if (!content) {
    return
  }
  if (typeof content === "object") {
    return this.each((el) => Object.assign(el.style, content))
  }
  return this.each((el) => (el.style.cssText += content))
} as AnCss

css.set = function (content) {
  return this.$.each((el) => (el.style.cssText = content))
}

css.hide = function (value = true) {
  const display = value ? "none" : ""
  return this.$.each((el) => (el.style.display = display))
}

css.toggle = function () {
  return this.$.each((el) => {
    const display = el.style.display === "none" ? "" : "none"
    el.style.display = display
  })
}
