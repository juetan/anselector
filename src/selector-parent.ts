import { AnSelector, anselector } from "./selector"

export interface AnParent<E extends HTMLElement = HTMLElement, T = AnSelector<E>> {
  (this: T): T | null
  (this: T, parent: string | null | AnSelector | HTMLElement): T
  $: T
  prepend: (content: string) => T
}

const clean = (els: HTMLElement[]) => {
  els.forEach((el) => el.parentElement?.removeChild(el))
  els.splice(1)
}

const resolveEl = (el: any): HTMLElement | undefined | null => {
  if (typeof el === "string") {
    return document.querySelector<HTMLElement>(el)
  }
  if (el instanceof HTMLElement) {
    return el
  }
  if (anselector instanceof AnSelector) {
    return anselector.el
  }
  return null
}

export const parent = function (selector) {
  if (selector === void 0) {
    const el = this.el?.parentElement
    return el && new AnSelector([el])
  }
  clean(this.elements)
  const el = resolveEl(selector)
  this.el && el && el.appendChild(this.el)
  return this
} as AnParent

parent.prepend = function (selector) {
  clean(this.$.es)
  const el = resolveEl(selector)
  this.$.el && el && el.prepend(this.$.el)
  return this.$
}
