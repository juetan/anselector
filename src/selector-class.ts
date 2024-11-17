import { AnSelector } from "./selector"

export interface AnClass<E extends HTMLElement = HTMLElement, T = AnSelector<E>> {
  (this: T): string | undefined
  (this: T, name: string): T
  $: T
  has: (name: string) => boolean
  set: (name: string) => T
  remove: (name: string) => T
  toggle: (name: string) => T
}

export const classes: AnClass = function (name) {
  if (name == void 0) {
    return this.el?.className
  }
  if (!name) {
    return this
  }
  return this.each((i) => i.classList.add(name))
} as AnClass

classes.has = function (name) {
  return this.$.el?.classList.contains(name) ?? false
}

classes.set = function (name) {
  return this.$.each((i) => (i.className = name))
}

classes.toggle = function (name) {
  return this.$.each((i) => i.classList.toggle(name))
}

classes.remove = function (name) {
  return this.$.each((i) => i.classList.remove(name))
}
