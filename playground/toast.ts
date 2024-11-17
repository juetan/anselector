import { an, AnSelector, AnSelect } from '../src'

declare module '../src' {
  interface AnSelect {
    tip: AnTip
  }
}

const dom = `
<div class="an-toast">
  <div class="an-toast-content">
  </div>
</div>
`

const css = `
.an-toast {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  pointer-events: none;
}
.an-toast-content {
  padding: 10px 20px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
}
`

const cssid = '__antip__'
const msgid = '.an-toast-content'

interface AnTip {
  (message: string): void
  el: AnSelector | null
  duration: number
  timer: any
  close(): void
  destroy(): void
  install(this: AnSelect, app: AnSelect): void
}

export const tip = function (message: string) {
  console.log('runs')
  if (!tip.el) {
    an.css(cssid, css)
    tip.el = an(dom)
    tip.el.parent(document.body)
  }
  tip.el(msgid).text(message)
  tip.el.css('display: flex')
  if (tip.timer) {
    clearTimeout(tip.timer)
  }
  tip.timer = setTimeout(() => ((tip.timer = null), tip.close()), tip.duration)
} as AnTip

tip.duration = 2000

tip.close = function () {
  tip.el?.css.hide()
}

tip.destroy = function () {
  if (tip.timer) {
    clearTimeout(tip.timer)
  }
  if (tip.el) {
    tip.el.parent(null)
    tip.el = null
  }
  an.css.remove(cssid)
}

tip.install = app => {
  console.log('call install')
  app.tip = tip
}
