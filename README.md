# Snabbdom

A virtual DOM library with focus on simplicity, modularity, powerful features
and performance.

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/snabbdom-ng.svg)](https://badge.fury.io/js/snabbdom-ng) [![npm downloads](https://img.shields.io/npm/dm/snabbdom-ng.svg)](https://www.npmjs.com/package/snabbdom-ng) [![Build Status](https://travis-ci.org/katyo/snabbdom.svg?branch=nextgen)](https://travis-ci.org/katyo/snabbdom/tree/nextgen)

[![Join the chat at https://gitter.im/paldepind/snabbdom](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/paldepind/snabbdom?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

__IMPORTANT NOTE:__ _This is a fork of original snabbdom with partially incompatible API. See the [changes and improvements](#changes-and-improvements) to know more._

## Table of contents

* [Introduction](#introduction)
* [Features](#features)
* [Inline example](#inline-example)
* [Examples](#examples)
* [Core documentation](#core-documentation)
* [Modules documentation](#modules-documentation)
* [Helpers](#helpers)
* [Virtual Node documentation](#virtual-node)
* [Changes and improvements](#changes-and-improvements)
* [Structuring applications](#structuring-applications)

## Why

Virtual DOM is awesome. It allows us to express our application's view
as a function of its state. But existing solutions were way way too
bloated, too slow, lacked features, had an API biased towards OOP
and/or lacked features I needed.

## Introduction

Snabbdom consists of an extremely simple, performant and extensible
core that is only ≈ 200 SLOC. It offers a modular architecture with
rich functionality for extensions through custom modules. To keep the
core simple, all non-essential functionality is delegated to modules.

You can mold Snabbdom into whatever you desire! Pick, choose and
customize the functionality you want. Alternatively you can just use
the default extensions and get a virtual DOM library with high
performance, small size and all the features listed below.

## Features

* Core features
  * About 200 SLOC – you could easily read through the entire core and fully
    understand how it works.
  * Extendable through modules.
  * A rich set of hooks available, both per vnode and globally for modules,
    to hook into any part of the diff and patch process.
  * Splendid performance. Snabbdom is among the fastest virtual DOM libraries
    in the [Virtual DOM Benchmark](http://vdom-benchmark.github.io/vdom-benchmark/).
  * Patch function with a function signature equivalent to a reduce/scan
    function. Allows for easier integration with a FRP library.
* Features in modules
  * `h` function for easily creating virtual DOM nodes.
  * [SVG _just works_ with the `h` helper](#svg).
  * Features for doing complex CSS animations.
  * Powerful event listener functionality.
  * [Thunks](#thunks) to optimize the diff and patch process even further.
* Third party features
  * JSX support thanks to [snabbdom-pragma](https://github.com/Swizz/snabbdom-pragma).
  * Server-side HTML output provided by [snabbdom-to-html](https://github.com/acstll/snabbdom-to-html).
  * Compact virtual DOM creation with [snabbdom-helpers](https://github.com/krainboltgreene/snabbdom-helpers).
  * Template string support using [snabby](https://github.com/jamen/snabby).

## Inline example

```javascript
var snabbdom = require('snabbdom');
var htmlDomApi = require('snabbdom/client/domapi').default;
var attrsApi = require('snabbdom/client/attributes').default;
var classApi = require('snabbdom/client/class').default;
var propsApi = require('snabbdom/client/props').default;
var styleApi = require('snabbdom/client/style').default;
var eventApi = require('snabbdom/client/eventlisteners').default;
var vdom = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/attributes').default(attrsApi), // handles attributes
  require('snabbdom/modules/class').default(classApi), // makes it easy to toggle classes
  require('snabbdom/modules/props').default(propsApi), // for setting properties on DOM elements
  require('snabbdom/modules/style').default(styleApi), // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default(eventApi), // attaches event listeners
  require('snabbdom/modules/references').default(), // back references to vnodes
], htmlDomApi(document));
var read = vdom.read;
var patch = vdom.patch;
var h = require('snabbdom/h').default; // helper function for creating vnodes

var container = document.getElementById('container');

var vnode = h('div#container.two.classes', {on: {click: someFn}}, [
  h('span', {style: {fontWeight: 'bold'}}, 'This is bold'),
  ' and this is just normal text',
  h('a', {props: {href: '/foo'}}, 'I\'ll take you places!')
]);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(read(container), vnode);

var newVnode = h('div#container.two.classes', {on: {click: anotherEventHandler}}, [
  h('span', {style: {fontWeight: 'normal', fontStyle: 'italic'}}, 'This is now italic type'),
  ' and this is still just normal text',
  h('a', {props: {href: '/bar'}}, 'I\'ll take you places!')
]);
// Second `patch` invocation
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state
```

## Examples

* [Animated reordering of elements](http://snabbdom.github.io/snabbdom/examples/reorder-animation/)
* [Hero transitions](http://snabbdom.github.io/snabbdom/examples/hero/)
* [SVG Carousel](http://snabbdom.github.io/snabbdom/examples/carousel-svg/)

## Core documentation

The core of Snabbdom provides only the most essential functionality.
It is designed to be as simple as possible while still being fast and
extendable.

### `snabbdom.init`

The core exposes only one single function `snabbdom.init`. This `init`
takes a list of modules and returns an `vdom` object which contains two
functions.

The first `read` function that should be used to convert some DOM node
to initial virtual node in bootstrap purpose.

The second `patch` function that uses the specified set of modules
to patching DOM using the previous and the next virtual nodes.

```javascript
var vdom = snabbdom.init([
  require('snabbdom/modules/class').default(classApi),
  require('snabbdom/modules/style').default(styleApi),
], htmlDomApi(document));
var read = vdom.read;
var patch = vdom.patch;
```

The `domApi` parameter is required and can be used either _client/domapi_ for patching DOM tree in browsers or _server/domapi_ to get HTML output on server.

### `read`

Converts a DOM node into a virtual node.

```javascript
var rootVNode = read(document.documentElement); // read the root html node
var initVNode = read(document.querySelector('.container'));
```

Especially good for patching over an pre-existing, server-side generated content.

```javascript
var snabbdom = require('snabbdom');
var vdom = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default(classApi), // makes it easy to toggle classes
  require('snabbdom/modules/props').default(propsApi), // for setting properties on DOM elements
  require('snabbdom/modules/style').default(styleApi), // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default(eventListenersApi), // attaches event listeners
], htmlDomApi(document));
var read = vdom.read;
var patch = vdom.patch;
var h = require('snabbdom/h').default; // helper function for creating vnodes

var nextVNode = h('div', {style: {color: '#000'}}, [
  h('h1', 'Headline'),
  h('p', 'A paragraph'),
]);

var container = document.querySelector('.container');
var initialVNode = read(container);
patch(initialVNode, nextVNode);
```

### `patch`

The `patch` function returned by `init` takes two arguments. The first
is vnode representing the current view. The second is a vnode
representing the new, updated view.

Snabbdom will efficiently modify DOM nodes to match the description
in the new vnode.

Any old vnode passed must be the resulting vnode from a previous call
to `patch` or `read`. This is necessary since Snabbdom stores information in the
vnode. This makes it possible to implement a simpler and more
performant architecture. This also avoids the creation of a new old
vnode tree.

```javascript
patch(oldVnode, newVnode);
```

### `snabbdom/h`

It is recommended that you use `snabbdom/h` to create vnodes. `h` accepts a
tag/selector as a string, an optional data object and an optional string or
array of children.

```javascript
var h = require('snabbdom/h').default;
var vnode = h('div', {style: {color: '#000'}}, [
  h('h1', 'Headline'),
  h('p', 'A paragraph'),
]);
```

### Hooks

Hooks are a way to hook into the lifecycle of DOM nodes. Snabbdom
offers a rich selection of hooks. Hooks are used both by modules to
extend Snabbdom, and in normal code for executing arbitrary code at
desired points in the life of a virtual node.

#### Overview

| Name        | Triggered when                                     | Arguments to callback   |
| ----------- | --------------                                     | ----------------------- |
| `pre`       | the patch process begins                           | none                    |
| `init`      | a vnode has been added                             | `vnode`                 |
| `create`    | a DOM element has been created based on a vnode    | `emptyVnode, vnode`     |
| `insert`    | an element has been inserted into the DOM          | `vnode`                 |
| `prepatch`  | an element is about to be patched                  | `oldVnode, vnode`       |
| `update`    | an element is being updated                        | `oldVnode, vnode`       |
| `postpatch` | an element has been patched                        | `oldVnode, vnode`       |
| `destroy`   | an element is directly or indirectly being removed | `vnode`                 |
| `remove`    | an element is directly being removed from the DOM  | `vnode, removeCallback` |
| `post`      | the patch process is done                          | none                    |

The following hooks are available for modules: `pre`, `create`,
`update`, `destroy`, `remove`, `post`.

The following hooks are available in the `hook` property of individual
elements: `init`, `create`, `insert`, `prepatch`, `update`,
`postpatch`, `destroy`, `remove`.

#### Usage

To use hooks, pass them as an object to `hook` field of the data
object argument.

```javascript
h('div.row', {
  key: movie.rank,
  hook: {
    insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight; }
  }
});
```

#### The `init` hook

This hook is invoked during the patch process when a new virtual node
has been found. The hook is called before Snabbdom has processed the
node in any way. I.e., before it has created a DOM node based on the
vnode.

#### The `insert` hook

This hook is invoked once the DOM element for a vnode has been
inserted into the document _and_ the rest of the patch cycle is done.
This means that you can do DOM measurements (like using
[getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
in this hook safely, knowing that no elements will be changed
afterwards that could affect the position of the inserted elements.

#### The `remove` hook

Allows you to hook into the removal of an element. The hook is called
once a vnode is to be removed from the DOM. The handling function
receives both the vnode and a callback. You can control and delay the
removal with the callback. The callback should be invoked once the
hook is done doing its business, and the element will only be removed
once all `remove` hooks have invoked their callback.

The hook is only triggered when an element is to be removed from its
parent – not if it is the child of an element that is removed. For
that, see the `destroy` hook.

#### The `destroy` hook

This hook is invoked on a virtual node when its DOM element is removed
from the DOM or if its parent is being removed from the DOM.

To see the difference between this hook and the `remove` hook,
consider an example.

```js
var vnode1 = h('div', [h('div', [h('span', 'Hello')])]);
var vnode2 = h('div', []);
patch(container, vnode1);
patch(vnode1, vnode2);
```

Here `destroy` is triggered for both the inner `div` element _and_ the
`span` element it contains. `remove`, on the other hand, is only
triggered on the `div` element because it is the only element being
detached from its parent.

You can, for instance, use `remove` to trigger an animation when an
element is being removed and use the `destroy` hook to additionally
animate the disappearance of the removed element's children.

### Creating modules

Modules works by registering global listeners for [hooks](#hooks). A module is simply a dictionary mapping hook names to functions.

```javascript
function myModule(api) {
  return {
    create: function(oldVnode, vnode) {
      // invoked whenever a new virtual node is created
    },
    update: function(oldVnode, vnode) {
      // invoked whenever a virtual node is updated
    }
  };
}
```

With this mechanism you can easily augment the behaviour of Snabbdom.
For demonstration, take a look at the implementations of the default
modules.

## Modules documentation

This describes the core modules. All modules are optional.

### The class module

The class module provides an easy way to dynamically toggle classes on
elements. It expects an object in the `class` data property. The
object should map class names to booleans that indicates whether or
not the class should stay or go on the vnode.

```javascript
h('a', {class: {active: true, selected: false}}, 'Toggle');
```

### The props module

Allows you to set properties on DOM elements.

```javascript
h('a', {props: {href: '/foo'}}, 'Go to Foo');
```

### The attributes module

Same as props, but set attributes instead of properties on DOM elements.

```javascript
h('a', {attrs: {href: '/foo'}}, 'Go to Foo');
```

Attributes are added and updated using `setAttribute`. In case of an
attribute that had been previously added/set and is no longer present
in the `attrs` object, it is removed from the DOM element's attribute
list using `removeAttribute`.

In the case of boolean attributes (e.g. `disabled`, `hidden`,
`selected` ...), the meaning doesn't depend on the attribute value
(`true` or `false`) but depends instead on the presence/absence of the
attribute itself in the DOM element. Those attributes are handled
differently by the module: if a boolean attribute is set to a
[falsy value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
(`0`, `-0`, `null`, `false`,`NaN`, `undefined`, or the empty string
(`""`)), then the attribute will be removed from the attribute list of
the DOM element.

### The dataset module

Allows you to set custom data attributes (`data-*`) on DOM elements. These can then be accessed with the [HTMLElement.dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) property.

```javascript
h('button', {dataset: {action: 'reset'}}, 'Reset');
```

### The style module

The style module is for making your HTML look slick and animate smoothly. At
its core it allows you to set CSS properties on elements.

```javascript
h('span', {
  style: {border: '1px solid #bada55', color: '#c0ffee', fontWeight: 'bold'}
}, 'Say my name, and every colour illuminates');
```

Note that the style module does not remove style attributes if they
are removed as properties from the style object. To remove a style,
you should instead set it to the empty string.

```javascript
h('div', {
  style: {position: shouldFollow ? 'fixed' : ''}
}, 'I, I follow, I follow you');
```

#### Custom properties (CSS variables)

CSS custom properties (aka CSS variables) are supported, they must be prefixed
with `--`

```javascript
h('div', {
  style: {'--warnColor': 'yellow'}
}, 'Warning');
```

#### Delayed properties

You can specify properties as being delayed. Whenever these properties
change, the change is not applied until after the next frame.

```javascript
h('span', {
  style: {opacity: '0', transition: 'opacity 1s', delayed: {opacity: '1'}}
}, 'Imma fade right in!');
```

This makes it easy to declaratively animate the entry of elements.

#### Set properties on `remove`

Styles set in the `remove` property will take effect once the element
is about to be removed from the DOM. The applied styles should be
animated with CSS transitions. Only once all the styles are done
animating will the element be removed from the DOM.

```javascript
h('span', {
  style: {opacity: '1', transition: 'opacity 1s',
          remove: {opacity: '0'}}
}, 'It\'s better to fade out than to burn away');
```

This makes it easy to declaratively animate the removal of elements.

#### Set properties on `destroy`

```javascript
h('span', {
  style: {opacity: '1', transition: 'opacity 1s',
          destroy: {opacity: '0'}}
}, 'It\'s better to fade out than to burn away');
```

### Eventlisteners module

The event listeners module gives powerful capabilities for attaching
event listeners.

You can attach a function to an event on a vnode by supplying an
object at `on` with a property corresponding to the name of the event
you want to listen to. The function will be called when the event
happens and will be passed the event object that belongs to it.

```javascript
function clickHandler(ev) { console.log('got clicked'); }
h('div', {on: {click: clickHandler}});
```

Very often, however, you're not really interested in the event object
itself. Often you have some data associated with the element that
triggers an event and you want that data passed along instead.

Consider a counter application with three buttons, one to increment
the counter by 1, one to increment the counter by 2 and one to
increment the counter by 3. You don't really care exactly which button
was pressed. Instead you're interested in what number was associated
with the clicked button. The event listeners module allows one to
express that by supplying an array at the named event property. The
first element in the array should be a function that will be invoked
with the value in the second element once the event occurs.

```javascript
function clickHandler(number) { console.log('button ' + number + ' was clicked!'); }
h('div', [
  h('a', {on: {click: [clickHandler, 1]}}),
  h('a', {on: {click: [clickHandler, 2]}}),
  h('a', {on: {click: [clickHandler, 3]}}),
]);
```

Snabbdom allows swapping event handlers between renders. This happens without
actually touching the event handlers attached to the DOM.

Note, however, that **you should be careful when sharing event
handlers between vnodes**, because of the technique this module uses
to avoid re-binding event handlers to the DOM. (And in general,
sharing data between vnodes is not guaranteed to work, because modules
are allowed to mutate the given data).

In particular, you should **not** do something like this:

```javascript
// Does not work
var sharedHandler = {
  change: function(e){ console.log('you chose: ' + e.target.value); }
};
h('div', [
  h('input', {props: {type: 'radio', name: 'test', value: '0'},
              on: sharedHandler}),
  h('input', {props: {type: 'radio', name: 'test', value: '1'},
              on: sharedHandler}),
  h('input', {props: {type: 'radio', name: 'test', value: '2'},
              on: sharedHandler})
]);
```

For many such cases, you can use array-based handlers instead (described above).
Alternatively, simply make sure each node is passed unique `on` values:

```javascript
// Works
var sharedHandler = function(e){ console.log('you chose: ' + e.target.value); };
h('div', [
  h('input', {props: {type: 'radio', name: 'test', value: '0'},
              on: {change: sharedHandler}}),
  h('input', {props: {type: 'radio', name: 'test', value: '1'},
              on: {change: sharedHandler}}),
  h('input', {props: {type: 'radio', name: 'test', value: '2'},
              on: {change: sharedHandler}})
]);
```

### References module

Sometimes you would like access to DOM nodes from something else than event listeners.
For example, when you need access to canvas to drawing shapes or to input/textarea values.

This module allows to get references to virtual nodes in easy way by passing empty objects as `ref` values:

```javascript
// reference to input vnode
const input_ref = {};

// reference to canvas vnode
const canvas_ref = {};

const vnode = h('div', [
    h('input', { ref: input_ref, attrs: {type: 'text'} }),
    h('canvas', { ref: canvas_ref })
]);

patch(oldVnode, vnode);

// get input value
const value = input_ref.vnode.elm.value;

// get access to canvas
const context = canvas_ref.vnode.elm.getContext('2d');
```

As alternative you can get multiple references using single object:

```javascript
// references to vnodes
const refs = {};

const vnode = h('div', [
    h('input', { ref: [refs, 'input'], attrs: {type: 'text'} }),
    h('canvas', { ref: [refs, 'canvas'] })
]);

patch(oldVnode, vnode);

// get input value
const value = refs.input.elm.value;

// get access to canvas
const context = refs.canvas.elm.getContext('2d');
```

## Helpers

### SVG

SVG just works when using the `h` function for creating virtual
nodes. SVG elements are automatically created with the appropriate
namespaces.

```javascript
var vnode = h('div', [
  h('svg', {attrs: {width: 100, height: 100}}, [
    h('circle', {attrs: {cx: 50, cy: 50, r: 40, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}})
  ])
]);
```

See also the [SVG example](./examples/svg) and the [SVG Carousel example](./examples/carousel-svg/).

#### Using Classes in SVG Elements

Certain browsers (like IE <=11) [do not support `classList` property in SVG elements](http://caniuse.com/#feat=classlist).
Hence, the _class_ module (which uses `classList` property internally) will not work for these browsers.

The classes in selectors for SVG elements work fine from version 0.6.7.

You can add dynamic classes to SVG elements for these cases by using the _attributes_ module and an Array as shown below:

```js
h('svg', [
  h('text.underline', { // 'underline' is a selector class, remain unchanged between renders.
      attrs: {
        // 'active' and 'red' are dynamic classes, they can change between renders
        // so we need to put them in the class attribute.
        // (Normally we'd use the classModule, but it doesn't work inside SVG)
        class: [isActive && "active", isColored && "red"].filter(Boolean).join(" ")
      }
    },
    'Hello World'
  )
])
```

### Thunks

The `thunk` function takes a selector, a key for identifying a thunk,
a function that returns a vnode and a variable amount of state
parameters. If invoked, the render function will receive the state
arguments.

`thunk(selector, key, renderFn, [stateArguments])`

The `key` is optional. It should be supplied when the `selector` is
not unique among the thunks siblings. This ensures that the thunk is
always matched correctly when diffing.

Thunks are an optimization strategy that can be used when one is
dealing with immutable data.

Consider a simple function for creating a virtual node based on a number.

```js
function numberView(n) {
  return h('div', 'Number is: ' + n);
}
```

The view depends only on `n`. This means that if `n` is unchanged,
then creating the virtual DOM node and patching it against the old
vnode is wasteful. To avoid the overhead we can use the `thunk` helper
function.

```js
function render(state) {
  return thunk('num', numberView, [state.number]);
}
```

Instead of actually invoking the `numberView` function this will only
place a dummy vnode in the virtual tree. When Snabbdom patches this
dummy vnode against a previous vnode, it will compare the value of
`n`. If `n` is unchanged it will simply reuse the old vnode. This
avoids recreating the number view and the diff process altogether.

The view function here is only an example. In practice thunks are only
relevant if you are rendering a complicated view that takes
significant computational time to generate.

## Virtual Node
**Properties**
 - [sel](#sel--string)
 - [data](#data--object)
 - [children](#children--array)
 - [text](#text--string)
 - [elm](#elm--element)
 - [key](#key--string--number)

#### sel : String

The `.sel` property of a virtual node is the CSS selector passed to
[`h()`](#snabbdomh) during creation. For example: `h('div#container',
{}, [...])` will create a a virtual node which has `div#container` as
its `.sel` property.

#### data : Object

The `.data` property of a virtual node is the place to add information
for [modules](#modules-documentation) to access and manipulate the
real DOM element when it is created; Add styles, CSS classes,
attributes, etc.

The data object is the (optional) second parameter to [`h()`](#snabbdomh)

For example `h('div', {props: {className: 'container'}}, [...])` will produce a virtual node with
```js
{
  "props": {
    className: "container"
  }
}
```
as its `.data` object.

#### children : VNode[]

The `.children` property of a virtual node is the third (optional)
parameter to [`h()`](#snabbdomh) during creation. `.children` is
simply an Array of virtual nodes that should be added as children of
the parent DOM node upon creation.

For example `h('div', {}, [ h('h1', {}, 'Hello, World') ])` will
create a virtual node with

```js
[
 {
   sel: 'h1',
   data: {},
   children: undefined,
   text: 'Hello, World',
   elm: Element,
   key: undefined,
 }
]
```

as its `.children` property.

#### text : string

The `.text` property is created when a virtual node is created with
only a single child that possesses text and only requires
`document.createTextNode()` to be used.

For example: `h('h1', {}, 'Hello')` will create a virtual node with
`Hello` as its `.text` property.

#### elm : Element

The `.elm` property of a virtual node is a pointer to the real DOM
node created by snabbdom. This property is very useful to do
calculations in [hooks](#hooks) as well as
[modules](#modules-documentation).

#### key : string | number

The `.key` property is created when a key is provided inside of your
[`.data`](#data--object) object. The `.key` property is used to keep
pointers to DOM nodes that existed previously to avoid recreating them
if it is unnecessary. This is very useful for things like list
reordering. A key must be either a string or a number to allow for
proper lookup as it is stored internally as a key/value pair inside of
an object, where `.key` is the key and the value is the
[`.elm`](#elm--element) property created.

For example: `h('div', {key: 1}, [])` will create a virtual node
object with a `.key` property with the value of `1`.

## Changes and improvements

### Parametrized VNode

At this moment the _TypeScript_ fork of __snabbdom__ doesn't use parametrization.
The `VNodeData` is declared using excess property checks what assumes less strict type checking.

In this fork the `VNode` declared using `VNodeData` as parameter like so:

```typescript
interface VNode<VNodeData> {
  sel?: string;
  data?: VNodeData;
  children?: (VNode<VNodeData> | string)[];
  elm?: Node;
  text?: string;
  key?: Key;
}
```

This allows strict type checking for `VNodeData` which actually used by application.

```typescript
import {VBaseData, VHooksData} from 'snabbdom/vnode';
import {init} from 'snabbdom';
import {attributesModule, VAttrsData} from 'snabbdom/modules/attributes';
import {classModule, VClassData} from 'snabbdom/modules/class';

// Declaring own VNodeData which application actually uses
interface VData extends VBaseData, VHooksData<VData>, VAttrsData, VClassData {}

let vdom = init<VData>([
  attributesModule(attributesApi),
  classModule(classApi)
], domApi);
```

### The `toVNode` merged into core

To avoid polymorphism in `patch` call it no longer accepts DOM node as a first argument.
Now you need get initial `VNode` to patch it.
So the `toVNode` call moved into core and called `read`.

```typescript
interface VDOMAPI<VData> {
  read(node: Node): VNode<VData>;
  patch(oldVNode: VNode<VData>, newVNode: VNode<VData>): VNode<VData>;
}

interface Init<VData> {
  init(modules: Module<VData>[], api: DOMAPI): VDOMAPI<VData>;
}
```

The proper way of bootstrapping in browser applications:

```typescript
const {read, patch} = init(modules, domApi);

function render(newVNode: VNode) {
  patch(vnode, newVNode);
  vnode = newVNode;
}

// bootstrap
let vnode = read(appNode);

// first render
render(appRender());
```

### Reorganized codebase

Quite simple and tiny module _snabbdom/is_ now is away, the exported utilities merged into core (_snabbdom_).
The _core_ also exports `isDef` which was converted into type guard:

In order to avoid unnecessary dependencies the API declarations moved to the modules where it is actually used.
Particularly the `DOMAPI` interface declared in core, i.e. into _snabbdom_ itself.

The module _snabbdom/htmldomapi_ moved to _client/domapi_. So the server-side `DOMAPI` implementation will be at _server/domapi_.

### Required `domApi` argument

The second optional argument of `init` call (`domApi`) now is required.

This allows to eliminate dependency from _snabbdom/htmldomapi_ when it redundant, for example, on server where HTML output is used.

### Instantiating `htmlDomApi` with custom `document`

Now the `htmlDomApi` is a function which required `document` as argument to make it possible to use any other DOM libraries (like _jsdom_, _dom.js_, _cheerio_, _domino_ and etc.) both on client and server.

### Own APIs for modules

To finally isolate platform-dependent code now the modules has own APIs to interact with DOM.

This allow us to have two different API implementations: one to interact with document tree nodes in browsers and another to work with much simpler document tree on server.

### The proper way of usage

For example usage in browser environment may looks like so:

```typescript
import {VBaseData, VHooksData} from 'snabbdom/vnode';

import {init} from 'snabbdom';

// Importing modules
import {attributesModule, VAttrsData} from 'snabbdom/modules/attributes';
import {classModule, VClassData} from 'snabbdom/modules/class';
import {styleModule, VStyleData} from 'snabbdom/modules/class';
import {eventListenersModule, VEventData} from 'snabbdom/modules/eventlisteners';

// Importing browser APIs
import htmlDomApi from 'snabbdom/client/domapi';
import attributesApi from 'snabbdom/client/attributes';
import classApi from 'snabbdom/client/class';
import styleApi from 'snabbdom/client/style';
import eventListenersApi from 'snabbdom/client/eventlisteners';

interface VData extends VBaseData, VHooksData<VData>, VAttrsData, VClassData, VStyleData {}

const {read, patch} = init<VData>([
  attributesModule(attributesApi),
  classModule(classApi),
  styleModule(styleApi),
  eventListenersModule(eventListenersApi),
], htmlDomApi(document));

// bootstrap
let vnode = read(document.documentElement);

// render
const newVNode = appRender();

// patch
patch(vnode, newVNode);
vnode = newVNode;
```

And the usage on server environment will be like so:

```typescript
import {VBaseData, VHooksData} from 'snabbdom/vnode';

import {init} from 'snabbdom';

// Importing modules
import {attributesModule, VAttrsData} from 'snabbdom/modules/attributes';
import {classModule, VClassData} from 'snabbdom/modules/class';

// We don't need render style property to HTML
import {VStyleData} from 'snabbdom/modules/class';

// We couldn't have event listeners in HTML
import {VEventData} from 'snabbdom/modules/eventlisteners';

// Importing html APIs
import htmlDomApi, {render} from 'snabbdom/server/domapi';
import attributesApi from 'snabbdom/server/attributes';
import classApi from 'snabbdom/server/class';

interface VData extends VBaseData, VHooksData<VData>, VAttrsData, VClassData, VStyleData {}

const {read, patch} = init<VData>([
  attributesModule(attributesApi),
  classModule(classApi),
], htmlDomApi);

const documentElement = htmlDomApi.createElement('html');

// bootstrap
let vnode = read(documentElement);

// render
const newVNode = appRender();

// patch
patch(vnode, newVNode);
vnode = newVNode;

// output
const html = '<!DOCTYPE html>' + render(documentElement);
```

## Structuring applications

Snabbdom is a low-level virtual DOM library. It is unopinionated with
regards to how you should structure your application.

Here are some approaches to building applications with Snabbdom.

* [functional-frontend-architecture](https://github.com/paldepind/functional-frontend-architecture) –
  a repository containing several example applications that
  demonstrates an architecture that uses Snabbdom.
* [Cycle.js](https://cycle.js.org/) –
  "A functional and reactive JavaScript framework for cleaner code"
  uses Snabbdom
* [Vue.js](http://vuejs.org/) use a fork of snabbdom.
* [scheme-todomvc](https://github.com/amirouche/scheme-todomvc/) build
  redux-like architecture on top of snabbdom bindings.
* [kaiju](https://github.com/AlexGalays/kaiju) -
  Stateful components and observables on top of snabbdom
* [Tweed](https://tweedjs.github.io) –
  An Object Oriented approach to reactive interfaces.
* [Cyclow](http://cyclow.js.org) -
  "A reactive frontend framework for JavaScript"
  uses Snabbdom
* [Tung](https://github.com/Reon90/tung) –
  A JavaScript library for rendering html. Tung helps to divide html and JavaScript development.
* [sprotty](https://github.com/theia-ide/sprotty) - "A web-based diagramming framework" uses Snabbdom.

Be sure to share it if you're building an application in another way
using Snabbdom.
