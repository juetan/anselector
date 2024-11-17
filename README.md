<h1 align="">AnSelector</h1>

<p align="">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/anselector">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/juetan/anselector">
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/anselector">
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/anselector">
  <img alt="NPM Type Definitions" src="https://img.shields.io/npm/types/anselector">

</p>


A lightweight, modern, extendable dom library, written in typescript!

## feature

- ⚡️ lightweight, only 3 kb ungzipped
- ✨ modern, no legacy code
- 🎨 extendable, easily write your plugin
- 📦️ written in typescript

## quick start

1. install dependency

```
// node
npm install anselector
// or browser esm
import $ from '//esm.sh/enselector'
```

2. coding

```
// utils
$.version
// select element(s)
$(".title").class('active').click()
```

## api

`$` api

```
$(".title")               // css selector
$("<div>content</div>")   // no in dom tree
$(document.body)          // html element

$.version                 // v1.0.0
$.fn                      // prototype of core class
$.use                     // extends $ or $.fn
```

`$()` api

```
es                        // the elements
el                        // the (first) element

on('click', fn, options)  // listen once with `once: true` option
off('click', fn, options) // remove
click()                   // trigger click
click(fn, options)        // short for on('click', fn, options)

css()                     // get css
css('color: red;')        // append css
css({ color: 'red' })     // append css with object
css.set('color: red')     // replace css

class()                   // get classname
class('name')             // add classname
class.has('name')         // contains classname
class.set('name')         // set classname
class.remove('name')      // remove classname
class.toggle('name')      // toggle classname

text()                    // get inner text
text('value')             // replace text
html()                    // get inner html
html('value')             // set inner html

attr('key')               // get attribute
attr('key', 'value')      // set attribute
attr({})                  // set attributes with object

parent()                  // return $parent
parent('.title')          // append to parent by css selector
parent(el)                // append to parent by html element
parent($el)               // append to parent by $ element
parent(null)              // remove from parent
parent.prepend()          // prepend to parent

$('.title')               // find child with css selector
```
