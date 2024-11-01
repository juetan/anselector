
A lightweight, modern, extendable dom library, written in typescript!

## $ api

- `$`: the only entry

```ts
$('.title')
$('<div>content</div>') // no in dom tree, use parent() to mount              
$(document.body)
```

- `$.version`

```ts
$.version // v1.0.0
```

- `$.fn`: the prototype of core class, extends it to fit your netts.

```ts
$.fn.mycall = function() {}
```

- `$.use`: use a plugin

```ts
$.use(myplugin)
```

## $() api

- `$el.es`: the elements

```ts
$el.es
```

- `$el.el`: the (first) element

```ts
$el.el
```

- `$el.$()`: find child

```ts
$('.item').$('.title')
```

- `$el.on()`: can be listen once by pass `once: true` to options in modern browser

```ts
on('click', callback, options)
```

- `$el.off()`

```ts
off('click', callback, options)
```

- `$el.css()`

```ts
css()                         // get css
css(null)                     // remove all css
css('color: red;')            // append css with string
css('color: red;', 'replace') // replace css with string
css({ color: 'red' })         // append css with object
```

- `$el.class()`

```ts
class()                   // get classname
class(myclass)            // set classname
class(myclass, null)      // remove classname
class(myclass, 'has')     // contains classname
class(myclass, 'toggle')  // toggle classname
```

- `$el.text()`

```ts
text()                      // get inner text
text(mytext, 'prepend')     // replace(default), prepend or append text
```

- `$el.html()`

```ts
html()            // get inner html
html('value')     // set inner html
```

- `$el.attr()`

```ts
attr('key')          // get attribute
attr('key', 'value') // set attribute
attr('key', null)    // remove attribute
attr({})             // set attributes with object
```

- `$el.parent()`

```ts
parent()         // return $parent
parent('.title') // change parent with css selector
parent(el)       // change parent with html element
parent($el)      // change parent with $ element
parent(null)     // remove from parent
```

- `$el.children()`

```ts
children()                // get children
children(el)              // append child
children([el], 'replace') // replace children
children(null)            // remove all child
```