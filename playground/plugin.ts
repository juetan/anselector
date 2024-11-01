import { AnSelect } from "../src"

declare module "../src" {
  interface AnSelect {
    alert: (content: string) => void
  }
  interface AnSelector {
    getData(key: string): string | undefined
  }
}

export default function myPlugin($: AnSelect) {
  $.alert = function (content) {
    window.alert(content)
  }
  $.fn.getData = function (key) {
    return this.el?.dataset[key]
  }
}
