import { $ } from "../src"

declare module "../src" {
  namespace $ {
    export var alert: (content: string) => void
  }
  interface AnSelector {
    getData(key: string): string | undefined
  }
}

export default function myPlugin(app: typeof $) {
  app.alert = function (content) {
    window.alert(content)
  }
  app.fn.getData = function (key) {
    return this.el?.dataset[key]
  }
}
