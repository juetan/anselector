import $, { AnSelector } from "../src/index";
import myPlugin from "./plugin";

$.use(myPlugin)

const $app = $("#app")
  .css("color: red;")
  .css("font-size: 20px;")
  .css({ color: "blue" })
  .css("color: red;")
  .css('color: #33cc99; font-weight: 700;', 'replace')
  .class("my-class")
  // .mycolor("#3c9")
  .class("my-class", null)

console.log($('.li3').parent());

console.log($app.attr("id"), $app.children())

const $child = $(`<header>header here <button class="btn">button</button> </header>`)

$child.parent($app)

// $(".btn", $app).on("click", function (e) {
//   console.log(this, e)
// })
$child.$(".btn").on("click", () => {
  console.log(toast("todo"))
})

console.log("$.n", $.version, $child)

for (const $li of $("li")) {
  console.log("li: ", $li)
}

const toast = (() => {
  let $el: AnSelector | null
  let timer: any
  const open = (content: string) => {
    if (!$el) {
      return
    }
    if (!$el.parent()) {
      $el.parent(document.body)
    }
    $el.$(".an-toast-content").text(content)
    $el.css({ display: "flex" })
  }
  const close = () => {
    if (!$el) {
      return
    }
    $el.css({ display: "none" })
  }
  const destroy = () => {
    if (!$el) {
      return
    }
    $el.parent(null)
    $el = null
  }
  const getEl = () => {
    return $el
  }
  const instance = { getEl, open, close, destroy }

  function toast(options?: string | any) {
    if (!options) {
      options = { content: "" }
    }
    if (typeof options === "string") {
      options = { content: options }
    }
    const { content, duration = 2000 } = options
    if (!$el) {
      $el = $(toasetTemplate({ content }))
    }
    if (duration) {
      if (timer) {
        clearTimeout(timer)
      }
      open(content)
      setTimeout(() => {
        close()
        timer = null
      }, duration)
    }
    return instance
  }

  return toast
})()

const toasetTemplate = ({ content }) => `
<div class="an-toast">
  <div class="an-toast-content">
    ${content}
  </div>
  <style>
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
  </style>
</div>
`
