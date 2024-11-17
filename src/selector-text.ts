import { AnSelector } from "./selector"

export interface AnText<E extends HTMLElement = HTMLElement, T = AnSelector<E>> {
  (this: T): string | undefined
  (this: T, content: string): T
  $: T
  prepend: (content: string) => T
  append: (content: string) => T
}

export const text = function (value) {
  if (value === void 0) {
    return this.el?.innerText ?? this.el?.textContent
  }
  if (!value) {
    return this
  }
  return this.each((el) => ((el.innerText = value), (el.textContent = value)))
} as AnText

text.prepend = function (v) {
  return this.$.each((el) => ((el.innerText = v + el.innerText), (el.textContent = v + el.textContent)))
}

text.append = function (v) {
  return this.$.each((el) => ((el.innerText += v), (el.textContent += v)))
}
