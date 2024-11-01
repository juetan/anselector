import { GlobalRegistrator } from "@happy-dom/global-registrator"
import { describe, expect, test } from "vitest"
import pkg from "../package.json"
import $ from "../src"

GlobalRegistrator.register()

document.body.innerHTML = `
<div class="box">
  <button>Mybutton</button>
  <button class="my">Mybutton</button>
</div>
<div class="box1">
  <link>Mylink1</link>
  <link class="my1">Mylink</link>
</div> 
<div class="css" style="color: blue;"></div>
<div class="class class1 class2" ></div>
<div class="text">mycontent</div>
<div class="html">myhtml</div>
<div class="attr" data-id="id1">myhtml</div>
<div class="parent"><div class="child"></div></div>
<div class="parent1"></div>
<div class="p1"><div class="c"></div></div>
<div class="p2"></div>
<div class="p3"><div class="c3"></div></div>
<div class="p4"></div>
<div class="p5"><div class="c5"></div></div>
`

describe("$", () => {
  test("$.version should work", () => {
    expect($.version).toBe(`v${pkg.version}`)
  })

  test("$.fn should exist", () => {
    expect($.fn).toBeDefined()
  })

  test("$.use should exist", () => {
    expect($.use).toBeDefined
  })
})

describe("$()", () => {
  test('$(".css") should work', () => {
    expect($(".my").es.length).eq(1)
    expect($("button").es.length).eq(2)
  })

  test('$("<div />") should work', () => {
    const $div = $('<div id="box">content</div>')
    expect($div.es.length).eq(1)
    expect($div.el).toBeDefined()
    expect($div.el?.id).toBe("box")
    expect($div.el?.parentElement).toBeFalsy()
  })

  test("$(el) should work", () => {
    const btn = document.querySelector<HTMLButtonElement>(".my")
    expect($(btn).es.length).eq(1)
    const btns = document.querySelectorAll<HTMLButtonElement>("button")
    expect($(btns).es.length).eq(2)
  })

  test("$($()) should work", () => {
    const $btn = $(".my")
    expect($($btn).es.length).eq(1)
    const $btns = $("button")
    expect($($btns).es.length).eq(2)
  })

  test("$() should be iteratable", () => {
    const $btns = $("button")
    expect(Array.from($btns).length).eq(2)
  })
})

describe("$el.es", () => {
  test("$el.es should work", () => {
    expect($("button").es).toBeDefined()
    expect($("button").es.length).eq(2)
    expect($(".xxxxx").es.length).eq(0)
  })
})

describe("$el.el", () => {
  test("$el.el should work", () => {
    expect($(".my").el).toBeDefined()
    expect($(".my").el).toEqual($(".my").es[0])
    expect($(".notexist").el).toBeUndefined()
  })
})

describe("$el.$()", () => {
  test("$el.$() should work", () => {
    expect($(".box").$).toBeDefined()
    expect($(".box").$(".my").el).toBeDefined()
    expect($(".box").$(".my1").el).toBeUndefined()
  })
})

describe("$el.on()", () => {
  test("$el.on() should work", () => {
    let msg = ''
    $(".box").on('click', () => msg= 'hello')
    document.querySelector<HTMLDivElement>('.box')?.click()
    expect(msg).toBe('hello')
  })

  test("$el.on() once should work", () => {
    let count = 0
    $(".box").on('click', () => count+=1, { once: true })
    const el = document.querySelector<HTMLDivElement>('.box')
    el?.click()
    el?.click()
    el?.click()
    expect(count).toBe(1)
  })
})

describe("$el.off()", () => {
  test("$el.off() should work", () => {
    let count = 0
    const cb =  () => count += 1
    const $el = $(".box").on('click', cb)
    const el = document.querySelector<HTMLDivElement>('.box')
    el?.click()
    el?.click()
    $el.off('click', cb)
    el?.click()
    expect(count).toBe(2)
  })
})

describe("$el.css()", () => {
  test("$el.css() should return css", () => {
    expect($(".css").css()).toBeDefined()
    expect($(".css").css()).contain("color")
  })

  test("$el.css('xx') should append css", () => {
    expect($(".css").css("width:10px;").css()).contain("color").contain("width")
  })

  test("$el.css('xx','replace') should replace css", () => {
    const css = $(".css").css("width:10px;", 'replace').css()
    expect(css?.includes("color")).toBe(false)
    expect(css?.includes("width")).toBe(true)
  })

  test("$el.css({}) should append css", () => {
    const css = $(".css").css({ border: '1px solid red' }).css()
    expect(css?.includes("border")).toBe(true)
  })

  test("$el.css(null) should remove all css", () => {
    const css = $(".css").css(null).css()
    expect(css).toBe("")
  })
})

describe("$el.class()", () => {
  test("$el.class() should return class", () => {
    expect($(".class").class()).toBeDefined()
    expect($(".class").class()).contain("class1")
  })

  test("$el.class('xx') should add class", () => {
    expect($(".class").class("class3").class()).contain("class3")
  })

  test("$el.class('xx', null) should remove class", () => {
    const $el = $(".class")
    $el.class("class4")
    expect($el.class()?.includes("class4")).toBe(true)
    $el.class('class4', null)
    expect($el.class()?.includes("class4")).toBe(false)
  })

  test("$el.class('xx', 'has') should work", () => {
    const $el = $(".class")
    expect($el.class("class5", 'has')).toBe(false)
    $el.class('class5')
    expect($el.class("class5", 'has')).toBe(true)
  })

  test("$el.class('xx', 'toggle') should work", () => {
    const $el = $(".class")
    $el.class("class6", 'toggle')
    expect($el.class()?.includes("class6")).toBe(true)
    $el.class('class6', 'toggle')
    expect($el.class()?.includes("class6")).toBe(false)
  })

  test("$el.class('xx', 'replace') should work", () => {
    const $el = $(".class").class('class7', 'replace')
    expect($el.class()).eq('class7')
  })
})

describe("$el.text()", () => {
  test("$el.text() should return text", () => {
    expect($('.text').text()).toEqual("mycontent")
  })

  test("$el.text('xx') should replace text", () => {
    expect($('.text').text('hello').text()).toEqual("hello")
  })

  test("$el.text('xx', 'append') should append text", () => {
    expect($('.text').text(',world', 'append').text()).toEqual("hello,world")
  })

  test("$el.text('xx', 'prepend') should prepend text", () => {
    expect($('.text').text('$', 'prepend').text()).toEqual("$hello,world")
  })
})

describe("$el.html()", () => {
  test("$el.html() should return html", () => {
    expect($('.html').html()).toEqual("myhtml")
  })

  test("$el.html('xx') should replace html", () => {
    expect($('.html').html('hello').html()).toEqual("hello")
  })
})

describe("$el.attr()", () => {
  test("$el.attr(key) should return attribute", () => {
    expect($('.attr').attr('class')).toEqual("attr")
  })

  test("$el.attr(key, value) should work", () => {
    const $el = $('.attr')
    expect($el.attr('data-id')).toEqual("id1")
    $el.attr('data-id', 'id2')
    expect($el.attr('data-id')).toEqual("id2")
  })

  test("$el.attr({}) should work", () => {
    const $el = $('.attr')
    $el.attr({ data1: 'data1' })
    expect($el.attr('data1')).toEqual("data1")
  })
})

describe("$el.parent()", () => {
  test("$el.parent() should return parent", () => {
    expect($('.child').parent()).toBeDefined()
    expect($('.child').parent()?.el).toBeDefined()
    expect($('.child').parent()?.el).toEqual($('.parent').el)
    expect($('.child').parent() instanceof $.fn.constructor).toEqual(true)
  })

  test("$el.parent('.xx') should change parent", () => {
    expect($('.parent').el?.children.length).toEqual(1)
    expect($('.parent1').el?.children.length).toEqual(0)
    $('.child').parent('.parent1')
    expect($('.parent').el?.children.length).toEqual(0)
    expect($('.parent1').el?.children.length).toEqual(1)
  })

  test("$el.parent(el) should change parent", () => {
    const p1 = document.querySelector<HTMLDivElement>('.p1')
    const p2 = document.querySelector<HTMLDivElement>('.p2')
    expect(p1?.children.length).toEqual(1)
    expect(p2?.children.length).toEqual(0)
    $('.c').parent(p2!)
    expect(p1?.children.length).toEqual(0)
    expect(p2?.children.length).toEqual(1)
  })

  test("$el.parent($new) should change parent", () => {
    const p3 = $('.p3')
    const p4 = $('.p4')
    expect(p3.el?.children.length).toEqual(1)
    expect(p4.el?.children.length).toEqual(0)
    $('.c3').parent(p4)
    expect(p3.el?.children.length).toEqual(0)
    expect(p4.el?.children.length).toEqual(1)
  })

  test("$el.parent(null) should unmount from parent", () => {
    expect($('.p5').el?.children.length).toEqual(1)
    expect($('.c5').el?.parentElement).toBeTruthy()
    $('.c5').parent(null)
    expect($('.p5').el?.children.length).toEqual(0)
    expect($('.c5').el?.parentElement).toBeFalsy()
  })
})