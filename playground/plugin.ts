import { AnSelect } from '../src'

declare module '../src' {
  interface AnSelect {
    alert: (content: string) => void
  }
  interface AnSelector {
    getData(key: string): string | undefined
  }
}

export default function myPlugin(this: AnSelect) {
  this.alert = function (content) {
    window.alert(content)
  }
  this.fn.getData = function (key) {
    return this.el?.dataset[key]
  }
}
