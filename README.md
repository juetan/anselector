
A lightweight, modern, extendable dom library, written in typescript!


## feature

- lightweight, only 3 kb ungzipped
- modern, no legacy code
- extendable, easily write your plugin
- written in typescript

## quick start

1. install

```bash
# node
npm install anselector
```

```ts
// browser(esm)
import $ from '//esm.sh/enselector'
```

2. coding

```ts
import $ from 'anselector'
// or import { $ } from 'anselector'

$('.nav').css('color: red;').$('.title').class('myclass')
```

## $ api

`$`: the entry

```ts
$('.title')
$('<div>content</div>') // no in dom tree, use parent() to mount              
$(document.body)
```

`$.version`

```ts
$.version // v1.0.0
```

`$.fn`: the prototype of core class

```ts
$.fn.mycall = function() {}
```

`$.use`

```ts
$.use(myplugin)
```

## $() api

`$el.es`: the elements

```ts
$el.es
```

`$el.el`: the (first) element

```ts
$el.el
```

`$el.$()`: find child

```ts
$el.$('.title')
```

`$el.on()`: listen once by pass `once: true` to options in modern browser

```ts
on('click', callback, options)
```

`$el.off()`

```ts
off('click', callback, options)
```

`$el.css()`

```ts
css()                         // get css
css('color: red;')            // append css with string
css('set:color: red;')        // replace css with set:
css({ color: 'red' })         // append css with object
```

`$el.class()`

```ts
class()                  // get classname
class('xx')              // add classname
class('has:xx')          // contains classname
class('set:xx')          // set classname
class('remove:xx')       // remove classname
class('toggle:xx')       // toggle classname
```

`$el.text()`

```ts
text()                      // get inner text
text('xx')                  // replace text
text('prepend:xx')          // prepend text
text('append:xx')           // append text
```

`$el.html()`

```ts
html()            // get inner html
html('value')     // set inner html
```

`$el.attr()`

```ts
attr('key')          // get attribute
attr('key', 'value') // set attribute
attr({})             // set attributes with object
```

`$el.parent()`

```ts
parent()                // return $parent
parent('.title')        // change parent with css selector
parent('prepend:.title') // prepend to parent with css selector
parent(el)              // change parent with html element
parent($el)             // change parent with $ element
parent(null)            // remove from parent
```

`$el.children()`

```ts
children()                // return $child[]
children(el)              // append child
children([el])            // replace children
children(null)            // remove all child
```