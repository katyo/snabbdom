(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
function listAttrs(elm) {
    var attributes = elm.attributes;
    var keys = [];
    for (var i = 0, n = attributes.length; i < n; i++) {
        var key = attributes[i].nodeName;
        keys.push(key);
    }
    return keys;
}
function getAttr(elm, key) {
    return elm.getAttribute(key);
}
function setAttr(elm, key, val) {
    if (val === true) {
        elm.setAttribute(key, "");
    }
    else if (val === false) {
        elm.removeAttribute(key);
    }
    else {
        if (key[0] != 'x') {
            elm.setAttribute(key, val);
        }
        else if (key[3] == ':') {
            // Assume xml namespace
            elm.setAttributeNS(xmlNS, key, val);
        }
        else if (key[5] == ':') {
            // Assume xlink namespace
            elm.setAttributeNS(xlinkNS, key, val);
        }
        else {
            elm.setAttribute(key, val);
        }
    }
}
function removeAttr(elm, key) {
    elm.removeAttribute(key);
}
exports.attributesApi = { listAttrs: listAttrs, getAttr: getAttr, setAttr: setAttr, removeAttr: removeAttr };
exports.default = exports.attributesApi;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addClass(elm, name) {
    elm.classList.add(name);
}
function removeClass(elm, name) {
    elm.classList.remove(name);
}
exports.classApi = { addClass: addClass, removeClass: removeClass };
exports.default = exports.classApi;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CAPS_REGEX = /[A-Z]/g;
function toKey(key) {
    return key.replace(CAPS_REGEX, '-$&').toLowerCase();
}
function listDatas(elm) {
    var d = elm.dataset;
    if (d) {
        return Object.keys(d);
    }
    else {
        var keys = [];
        var attributes = elm.attributes;
        for (var i = 0, n = attributes.length; i < n; i++) {
            var key = attributes[i].nodeName;
            if (key.length > 5 && key[4] == '-' && key[0] == 'd' && key[1] == 'a' && key[2] == 't' && key[3] == 'a') {
                keys.push(key.slice(5));
            }
        }
        return keys;
    }
}
function getData(elm, key) {
    var d = elm.dataset;
    return (d ? d[key] : elm.getAttribute("data-" + key));
}
function setData(elm, key, val) {
    var d = elm.dataset;
    if (d) {
        d[key] = val;
    }
    else {
        elm.setAttribute("data-" + toKey(key), val);
    }
}
function removeData(elm, key) {
    var d = elm.dataset;
    if (d) {
        if (key in d) {
            delete d[key];
        }
    }
    else {
        elm.removeAttribute("data-" + toKey(key));
    }
}
exports.datasetApi = { listDatas: listDatas, getData: getData, setData: setData, removeData: removeData };
exports.default = exports.datasetApi;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function insertChild(parentNode, newNode, referenceNode) {
    if (referenceNode) {
        parentNode.insertBefore(newNode, referenceNode);
    }
    else {
        parentNode.appendChild(newNode);
    }
}
function removeChild(node, child) {
    node.removeChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function firstChild(node) {
    return node.firstChild;
}
function nextSibling(node) {
    return node.nextSibling;
}
function getSelector(elm) {
    return [
        elm.tagName.toLowerCase(),
        elm.getAttribute('id') || undefined,
        elm.getAttribute('class') || undefined,
    ];
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
function htmlDomApi(document) {
    function createElement(tag, id, cls, nsUri) {
        var elm = nsUri ? document.createElementNS(nsUri, tag) : document.createElement(tag);
        if (id)
            elm.setAttribute('id', id);
        if (cls)
            elm.setAttribute('class', cls);
        return elm;
    }
    function createTextNode(text) {
        return document.createTextNode(text);
    }
    function createComment(text) {
        return document.createComment(text);
    }
    return {
        createElement: createElement,
        createTextNode: createTextNode,
        createComment: createComment,
        insertChild: insertChild,
        removeChild: removeChild,
        parentNode: parentNode,
        firstChild: firstChild,
        nextSibling: nextSibling,
        getSelector: getSelector,
        setTextContent: setTextContent,
        getTextContent: getTextContent,
        isElement: isElement,
        isText: isText,
        isComment: isComment,
    };
}
exports.htmlDomApi = htmlDomApi;
exports.default = htmlDomApi;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addEvent(elm, name, fn) {
    elm.addEventListener(name, fn, false);
}
function removeEvent(elm, name, fn) {
    elm.removeEventListener(name, fn, false);
}
exports.eventListenersApi = { addEvent: addEvent, removeEvent: removeEvent };
exports.default = exports.eventListenersApi;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getProp(elm, key) {
    return elm[key];
}
function setProp(elm, key, val) {
    elm[key] = val;
}
function removeProp(elm, key) {
    delete elm[key];
}
exports.propsApi = { getProp: getProp, setProp: setProp, removeProp: removeProp };
exports.default = exports.propsApi;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
function nextFrame(fn) {
    raf(function () {
        raf(fn);
    });
}
function listStyle(elm) {
    var style = elm.style;
    var keys = [];
    for (var key in style) {
        if (style.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}
function getStyle(elm, name) {
    return elm.style[name];
}
function setStyle(elm, name, val, next) {
    if (next === void 0) { next = false; }
    var fn = name[0] === '-' && name[1] === '-' ?
        function () {
            elm.style.setProperty(name, val);
        } : function () {
        elm.style[name] = val;
    };
    if (!next) {
        fn();
    }
    else {
        nextFrame(fn);
    }
}
function removeStyle(elm, name) {
    if (name[0] == '-' && name[1] == '-') {
        elm.style.removeProperty(name);
    }
    else {
        elm.style[name] = '';
    }
}
function onTransEnd(elm, names, callback) {
    var compStyle = getComputedStyle(elm);
    var props = compStyle['transition-property'].split(', ');
    var amount = 0;
    for (var i = 0; i < props.length; ++i) {
        if (names.indexOf(props[i]) !== -1)
            amount++;
    }
    elm.addEventListener('transitionend', function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            callback();
    });
}
exports.styleApi = { listStyle: listStyle, getStyle: getStyle, setStyle: setStyle, removeStyle: removeStyle, onTransEnd: onTransEnd };
exports.default = exports.styleApi;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var snabbdom_1 = require("./snabbdom");
function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && snabbdom_1.isDef(children)) {
        for (var i = 0; i < children.length; ++i) {
            var childData = children[i].data;
            if (snabbdom_1.isDef(childData)) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {}, children, text, i;
    if (snabbdom_1.isDef(c)) {
        data = b;
        if (snabbdom_1.isArray(c)) {
            children = c;
        }
        else if (snabbdom_1.isPrimitive(c)) {
            text = c;
        }
        else if (c && c.sel) {
            children = [c];
        }
    }
    else if (snabbdom_1.isDef(b)) {
        if (snabbdom_1.isArray(b)) {
            children = b;
        }
        else if (snabbdom_1.isPrimitive(b)) {
            text = b;
        }
        else if (b && b.sel) {
            children = [b];
        }
        else {
            data = b;
        }
    }
    if (snabbdom_1.isArray(children)) {
        for (i = 0; i < children.length; ++i) {
            if (snabbdom_1.isPrimitive(children[i]))
                children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i], undefined);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode_1.vnode(sel, data, children, text, undefined);
}
exports.h = h;
;
exports.default = h;

},{"./snabbdom":16,"./vnode":17}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function attributesModule(api) {
    function readAttrs(vnode) {
        var elm = vnode.elm, keys = api.listAttrs(elm), attrs = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (key != 'id' && key != 'class' &&
                !(key.length > 5 && key[4] == '-' && key[0] == 'd' && key[1] == 'a' && key[2] == 't' && key[3] == 'a')) {
                attrs[key] = api.getAttr(elm, key);
            }
        }
        vnode.data.attrs = attrs;
    }
    function updateAttrs(oldVnode, vnode) {
        var elm = vnode.elm;
        var key, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;
        if (!oldAttrs && !attrs)
            return;
        if (oldAttrs === attrs)
            return;
        oldAttrs = oldAttrs || {};
        attrs = attrs || {};
        // update modified attributes, add new attributes
        for (key in attrs) {
            var cur = attrs[key];
            var old = oldAttrs[key];
            if (old !== cur) {
                api.setAttr(elm, key, cur);
            }
        }
        // remove removed attributes
        // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
        // the other option is to remove all attributes with value == undefined
        for (key in oldAttrs) {
            if (!(key in attrs)) {
                api.removeAttr(elm, key);
            }
        }
    }
    return { read: readAttrs, create: updateAttrs, update: updateAttrs };
}
exports.attributesModule = attributesModule;
exports.default = attributesModule;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function classModule(api) {
    function updateClass(oldVnode, vnode) {
        var elm = vnode.elm;
        var cur, name, oldClass = oldVnode.data.class, newClass = vnode.data.class;
        if (!oldClass && !newClass)
            return;
        if (oldClass === newClass)
            return;
        oldClass = oldClass || {};
        newClass = newClass || {};
        for (name in oldClass) {
            if (!newClass[name]) {
                api.removeClass(elm, name);
            }
        }
        for (name in newClass) {
            cur = newClass[name];
            if (cur !== oldClass[name]) {
                api[cur ? 'addClass' : 'removeClass'](elm, name);
            }
        }
    }
    return { create: updateClass, update: updateClass };
}
exports.classModule = classModule;
exports.default = classModule;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function datasetModule(api) {
    function readDataset(vnode) {
        var elm = vnode.elm, keys = api.listDatas(elm), datas = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            datas[key] = api.getData(elm, key);
        }
        vnode.data.dataset = datas;
    }
    function updateDataset(oldVnode, vnode) {
        var elm = vnode.elm, oldDataset = oldVnode.data.dataset, dataset = vnode.data.dataset, key;
        if (!oldDataset && !dataset)
            return;
        if (oldDataset === dataset)
            return;
        oldDataset = oldDataset || {};
        dataset = dataset || {};
        for (key in oldDataset) {
            if (!dataset[key]) {
                api.removeData(elm, key);
            }
        }
        for (key in dataset) {
            if (oldDataset[key] !== dataset[key]) {
                api.setData(elm, key, dataset[key]);
            }
        }
    }
    return { read: readDataset, create: updateDataset, update: updateDataset };
}
exports.datasetModule = datasetModule;
exports.default = datasetModule;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invokeHandler(handler, vnode, event) {
    if (typeof handler === "function") {
        // call function handler
        handler.call(vnode, event, vnode);
    }
    else if (typeof handler === "object") {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(vnode, handler[1], event, vnode);
            }
            else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        }
        else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i]);
            }
        }
    }
}
function handleEvent(event, vnode) {
    var name = event.type, on = vnode.data.on;
    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
}
function eventListenersModule(api) {
    function updateEventListeners(oldVnode, vnode) {
        var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm);
        var name;
        // optimization for reused immutable handlers
        if (oldOn === on) {
            return;
        }
        // remove existing listeners which no longer used
        if (oldOn && oldListener) {
            // if element changed or deleted we remove all existing listeners unconditionally
            if (!on) {
                for (name in oldOn) {
                    // remove listener if element was changed or existing listeners removed
                    api.removeEvent(oldElm, name, oldListener);
                }
            }
            else {
                for (name in oldOn) {
                    // remove listener if existing listener removed
                    if (!on[name]) {
                        api.removeEvent(oldElm, name, oldListener);
                    }
                }
            }
        }
        // add new listeners which has not already attached
        if (on) {
            // reuse existing listener or create new
            var listener = vnode.listener = oldVnode.listener || createListener();
            // update vnode for listener
            listener.vnode = vnode;
            // if element changed or added we add all needed listeners unconditionally
            if (!oldOn) {
                for (name in on) {
                    // add listener if element was changed or new listeners added
                    api.addEvent(elm, name, listener);
                }
            }
            else {
                for (name in on) {
                    // add listener if new listener added
                    if (!oldOn[name]) {
                        api.addEvent(elm, name, listener);
                    }
                }
            }
        }
    }
    return {
        create: updateEventListeners,
        update: updateEventListeners,
        destroy: updateEventListeners
    };
}
exports.eventListenersModule = eventListenersModule;
exports.default = eventListenersModule;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function propsModule(api) {
    function updateProps(oldVnode, vnode) {
        var elm = vnode.elm;
        var key, cur, old, oldProps = oldVnode.data.props, props = vnode.data.props;
        if (!oldProps && !props)
            return;
        if (oldProps === props)
            return;
        oldProps = oldProps || {};
        props = props || {};
        for (key in oldProps) {
            if (!props[key]) {
                api.removeProp(elm, key);
            }
        }
        for (key in props) {
            cur = props[key];
            old = oldProps[key];
            if (old !== cur && (key !== 'value' || api.getProp(elm, key) !== cur)) {
                api.setProp(elm, key, cur);
            }
        }
    }
    return { create: updateProps, update: updateProps };
}
exports.propsModule = propsModule;
exports.default = propsModule;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function styleModule(api) {
    function readStyle(vnode) {
        var elm = vnode.elm;
        var keys = api.listStyle(elm);
        var style = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            style[key] = api.getStyle(elm, key);
        }
        vnode.data.style = style;
    }
    function updateStyle(oldVnode, vnode) {
        var elm = vnode.elm;
        var cur, name, oldStyle = oldVnode.data.style, style = vnode.data.style;
        if (!oldStyle && !style)
            return;
        if (oldStyle === style)
            return;
        oldStyle = oldStyle || {};
        style = style || {};
        var oldHasDel = 'delayed' in oldStyle;
        for (name in oldStyle) {
            if (!style[name]) {
                api.removeStyle(elm, name);
            }
        }
        for (name in style) {
            cur = style[name];
            if (name === 'delayed' && style.delayed) {
                for (var name2 in style.delayed) {
                    cur = style.delayed[name2];
                    if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                        api.setStyle(elm, name2, cur, true);
                    }
                }
            }
            else if (name !== 'remove' && cur !== oldStyle[name]) {
                api.setStyle(elm, name, cur);
            }
        }
    }
    function applyDestroyStyle(vnode) {
        var elm = vnode.elm, s = vnode.data.style;
        var style, name;
        if (!s || !(style = s.destroy))
            return;
        for (name in style) {
            api.setStyle(elm, name, style[name]);
        }
    }
    function applyRemoveStyle(vnode, rm) {
        var s = vnode.data.style;
        if (!s || !s.remove) {
            rm();
            return;
        }
        var elm = vnode.elm, style = s.remove, applied = [];
        var name;
        for (name in style) {
            applied.push(name);
            api.setStyle(elm, name, style[name]);
        }
        api.onTransEnd(elm, applied, rm);
    }
    return {
        read: readStyle,
        create: updateStyle,
        update: updateStyle,
        destroy: applyDestroyStyle,
        remove: applyRemoveStyle
    };
}
exports.styleModule = styleModule;
exports.default = styleModule;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var snabbdom_1 = require("./snabbdom");
var attributes_1 = require("./modules/attributes"); // for setting attributes on DOM elements
var class_1 = require("./modules/class"); // makes it easy to toggle classes
var props_1 = require("./modules/props"); // for setting properties on DOM elements
var style_1 = require("./modules/style"); // handles styling on elements with support for animations
var eventlisteners_1 = require("./modules/eventlisteners"); // attaches event listeners
var dataset_1 = require("./modules/dataset"); // handles dataset
var domapi_1 = require("./client/domapi"); // browser DOM API
var attributes_2 = require("./client/attributes");
var class_2 = require("./client/class");
var props_2 = require("./client/props");
var style_2 = require("./client/style");
var eventlisteners_2 = require("./client/eventlisteners");
var dataset_2 = require("./client/dataset");
var h_1 = require("./h"); // helper function for creating vnodes
exports.snabbdomModules = [
    attributes_1.attributesModule(attributes_2.attributesApi),
    class_1.classModule(class_2.classApi),
    props_1.propsModule(props_2.propsApi),
    style_1.styleModule(style_2.styleApi),
    eventlisteners_1.eventListenersModule(eventlisteners_2.eventListenersApi),
    dataset_1.datasetModule(dataset_2.datasetApi),
];
// Init patch function with choosen modules
var _a = snabbdom_1.init(exports.snabbdomModules, domapi_1.htmlDomApi(document)), read = _a.read, patch = _a.patch;
exports.snabbdomBundle = { read: read, patch: patch, h: h_1.h };
exports.default = exports.snabbdomBundle;

},{"./client/attributes":1,"./client/class":2,"./client/dataset":3,"./client/domapi":4,"./client/eventlisteners":5,"./client/props":6,"./client/style":7,"./h":8,"./modules/attributes":9,"./modules/class":10,"./modules/dataset":11,"./modules/eventlisteners":12,"./modules/props":13,"./modules/style":14,"./snabbdom":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
exports.isArray = Array.isArray;
function isPrimitive(s) {
    var t = (typeof s)[0];
    return t == 's' || t == 'n' || t == 'b';
}
exports.isPrimitive = isPrimitive;
function isDef(s) {
    return s !== undefined;
}
exports.isDef = isDef;
var emptyNode = vnode_1.vnode('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {}, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (isDef(key))
                map[key] = i;
        }
    }
    return map;
}
var hooks = ['read', 'create', 'update', 'remove', 'destroy', 'pre', 'post'];
function init(modules, api) {
    var i, j, cbs = {};
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks[i]];
            if (isDef(hook)) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent_1 = api.parentNode(childElm);
                api.removeChild(parent_1, childElm);
            }
        };
    }
    function createElm(vnode, insertedVnodeQueue) {
        var i, data = vnode.data;
        if (isDef(data)) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode);
                data = vnode.data;
            }
        }
        var children = vnode.children, sel = vnode.sel;
        if (sel === '!') {
            if (!isDef(vnode.text)) {
                vnode.text = '';
            }
            vnode.elm = api.createComment(vnode.text);
        }
        else if (isDef(sel)) {
            // Parse selector
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            var elm = vnode.elm = api.createElement(tag, hash < dot ? sel.slice(hash + 1, dot) : undefined, dotIdx > 0 ? sel.slice(dot + 1).replace(/\./g, ' ') : undefined, isDef(data) ? data.ns : undefined);
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode);
            if (exports.isArray(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (ch != null) {
                        api.insertChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            else if (isPrimitive(vnode.text)) {
                api.insertChild(elm, api.createTextNode(vnode.text));
            }
            i = vnode.data.hook; // Reuse variable
            if (isDef(i)) {
                if (i.create)
                    i.create(emptyNode, vnode);
                if (i.insert)
                    insertedVnodeQueue.push(vnode);
            }
        }
        else {
            vnode.elm = api.createTextNode(vnode.text);
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch != null) {
                api.insertChild(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var i, j, data = vnode.data;
        if (isDef(data)) {
            if (isDef(i = data.hook) && isDef(i = i.destroy))
                i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
            if (isDef(vnode.children)) {
                for (j = 0; j < vnode.children.length; ++j) {
                    i = vnode.children[j];
                    if (i != null && typeof i !== "string") {
                        invokeDestroyHook(i);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
                        cbs.remove[i_1](ch, rm);
                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                        i_1(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else {
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertChild(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertChild(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (!isDef(idxInOld)) {
                    api.insertChild(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertChild(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        api.insertChild(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            }
            else {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var i, hook;
        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
            i(oldVnode, vnode);
        }
        var elm = vnode.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (oldVnode === vnode)
            return;
        if (isDef(vnode.data)) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            i = vnode.data.hook;
            if (isDef(i) && isDef(i = i.update))
                i(oldVnode, vnode);
        }
        if (!isDef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) {
            api.setTextContent(elm, vnode.text);
        }
        if (isDef(hook) && isDef(i = hook.postpatch)) {
            i(oldVnode, vnode);
        }
    }
    function patch(oldVnode, vnode) {
        var i;
        var insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else {
            var elm = oldVnode.elm;
            var parent_2 = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent_2 !== null) {
                api.insertChild(parent_2, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent_2, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode;
    }
    ;
    function read(node) {
        var text;
        if (api.isElement(node)) {
            var _a = api.getSelector(node), tag = _a[0], id = _a[1], cls = _a[2];
            var sel = "" + tag + (id ? '#' + id : '') + (cls ? '.' + cls.replace(/ /, '.') : '');
            var children = [];
            for (var child = api.firstChild(node); child != null; child = api.nextSibling(child)) {
                children.push(read(child));
            }
            var vn = vnode_1.vnode(sel, {}, children, undefined, node);
            for (var i_2 = 0; i_2 < cbs.read.length; ++i_2)
                cbs.read[i_2](vn);
            return vn;
        }
        else if (api.isText(node)) {
            text = api.getTextContent(node);
            return vnode_1.vnode(undefined, undefined, undefined, text, node);
        }
        else if (api.isComment(node)) {
            text = api.getTextContent(node);
            return vnode_1.vnode('!', {}, [], text, node);
        }
        else {
            return vnode_1.vnode('', {}, [], undefined, node);
        }
    }
    return { read: read, patch: patch };
}
exports.init = init;

},{"./vnode":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return {
        sel: sel, data: data, children: children,
        text: text, elm: elm, key: key
    };
}
exports.vnode = vnode;
exports.default = vnode;

},{}]},{},[15])(15)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvYXR0cmlidXRlcy5qcyIsImNsaWVudC9jbGFzcy5qcyIsImNsaWVudC9kYXRhc2V0LmpzIiwiY2xpZW50L2RvbWFwaS5qcyIsImNsaWVudC9ldmVudGxpc3RlbmVycy5qcyIsImNsaWVudC9wcm9wcy5qcyIsImNsaWVudC9zdHlsZS5qcyIsImguanMiLCJtb2R1bGVzL2F0dHJpYnV0ZXMuanMiLCJtb2R1bGVzL2NsYXNzLmpzIiwibW9kdWxlcy9kYXRhc2V0LmpzIiwibW9kdWxlcy9ldmVudGxpc3RlbmVycy5qcyIsIm1vZHVsZXMvcHJvcHMuanMiLCJtb2R1bGVzL3N0eWxlLmpzIiwic25hYmJkb20uYnVuZGxlLmpzIiwic25hYmJkb20uanMiLCJ2bm9kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHhsaW5rTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XG52YXIgeG1sTlMgPSAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJztcbmZ1bmN0aW9uIGxpc3RBdHRycyhlbG0pIHtcbiAgICB2YXIgYXR0cmlidXRlcyA9IGVsbS5hdHRyaWJ1dGVzO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICB2YXIga2V5ID0gYXR0cmlidXRlc1tpXS5ub2RlTmFtZTtcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xufVxuZnVuY3Rpb24gZ2V0QXR0cihlbG0sIGtleSkge1xuICAgIHJldHVybiBlbG0uZ2V0QXR0cmlidXRlKGtleSk7XG59XG5mdW5jdGlvbiBzZXRBdHRyKGVsbSwga2V5LCB2YWwpIHtcbiAgICBpZiAodmFsID09PSB0cnVlKSB7XG4gICAgICAgIGVsbS5zZXRBdHRyaWJ1dGUoa2V5LCBcIlwiKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsID09PSBmYWxzZSkge1xuICAgICAgICBlbG0ucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoa2V5WzBdICE9ICd4Jykge1xuICAgICAgICAgICAgZWxtLnNldEF0dHJpYnV0ZShrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5WzNdID09ICc6Jykge1xuICAgICAgICAgICAgLy8gQXNzdW1lIHhtbCBuYW1lc3BhY2VcbiAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGVOUyh4bWxOUywga2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleVs1XSA9PSAnOicpIHtcbiAgICAgICAgICAgIC8vIEFzc3VtZSB4bGluayBuYW1lc3BhY2VcbiAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCBrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbG0uc2V0QXR0cmlidXRlKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZUF0dHIoZWxtLCBrZXkpIHtcbiAgICBlbG0ucmVtb3ZlQXR0cmlidXRlKGtleSk7XG59XG5leHBvcnRzLmF0dHJpYnV0ZXNBcGkgPSB7IGxpc3RBdHRyczogbGlzdEF0dHJzLCBnZXRBdHRyOiBnZXRBdHRyLCBzZXRBdHRyOiBzZXRBdHRyLCByZW1vdmVBdHRyOiByZW1vdmVBdHRyIH07XG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLmF0dHJpYnV0ZXNBcGk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdHRyaWJ1dGVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gYWRkQ2xhc3MoZWxtLCBuYW1lKSB7XG4gICAgZWxtLmNsYXNzTGlzdC5hZGQobmFtZSk7XG59XG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbG0sIG5hbWUpIHtcbiAgICBlbG0uY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbn1cbmV4cG9ydHMuY2xhc3NBcGkgPSB7IGFkZENsYXNzOiBhZGRDbGFzcywgcmVtb3ZlQ2xhc3M6IHJlbW92ZUNsYXNzIH07XG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLmNsYXNzQXBpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xhc3MuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ0FQU19SRUdFWCA9IC9bQS1aXS9nO1xuZnVuY3Rpb24gdG9LZXkoa2V5KSB7XG4gICAgcmV0dXJuIGtleS5yZXBsYWNlKENBUFNfUkVHRVgsICctJCYnKS50b0xvd2VyQ2FzZSgpO1xufVxuZnVuY3Rpb24gbGlzdERhdGFzKGVsbSkge1xuICAgIHZhciBkID0gZWxtLmRhdGFzZXQ7XG4gICAgaWYgKGQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBlbG0uYXR0cmlidXRlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IGF0dHJpYnV0ZXNbaV0ubm9kZU5hbWU7XG4gICAgICAgICAgICBpZiAoa2V5Lmxlbmd0aCA+IDUgJiYga2V5WzRdID09ICctJyAmJiBrZXlbMF0gPT0gJ2QnICYmIGtleVsxXSA9PSAnYScgJiYga2V5WzJdID09ICd0JyAmJiBrZXlbM10gPT0gJ2EnKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKGtleS5zbGljZSg1KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0RGF0YShlbG0sIGtleSkge1xuICAgIHZhciBkID0gZWxtLmRhdGFzZXQ7XG4gICAgcmV0dXJuIChkID8gZFtrZXldIDogZWxtLmdldEF0dHJpYnV0ZShcImRhdGEtXCIgKyBrZXkpKTtcbn1cbmZ1bmN0aW9uIHNldERhdGEoZWxtLCBrZXksIHZhbCkge1xuICAgIHZhciBkID0gZWxtLmRhdGFzZXQ7XG4gICAgaWYgKGQpIHtcbiAgICAgICAgZFtrZXldID0gdmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZWxtLnNldEF0dHJpYnV0ZShcImRhdGEtXCIgKyB0b0tleShrZXkpLCB2YWwpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZURhdGEoZWxtLCBrZXkpIHtcbiAgICB2YXIgZCA9IGVsbS5kYXRhc2V0O1xuICAgIGlmIChkKSB7XG4gICAgICAgIGlmIChrZXkgaW4gZCkge1xuICAgICAgICAgICAgZGVsZXRlIGRba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZWxtLnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtXCIgKyB0b0tleShrZXkpKTtcbiAgICB9XG59XG5leHBvcnRzLmRhdGFzZXRBcGkgPSB7IGxpc3REYXRhczogbGlzdERhdGFzLCBnZXREYXRhOiBnZXREYXRhLCBzZXREYXRhOiBzZXREYXRhLCByZW1vdmVEYXRhOiByZW1vdmVEYXRhIH07XG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLmRhdGFzZXRBcGk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhc2V0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gaW5zZXJ0Q2hpbGQocGFyZW50Tm9kZSwgbmV3Tm9kZSwgcmVmZXJlbmNlTm9kZSkge1xuICAgIGlmIChyZWZlcmVuY2VOb2RlKSB7XG4gICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChuZXdOb2RlKTtcbiAgICB9XG59XG5mdW5jdGlvbiByZW1vdmVDaGlsZChub2RlLCBjaGlsZCkge1xuICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQpO1xufVxuZnVuY3Rpb24gcGFyZW50Tm9kZShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUucGFyZW50Tm9kZTtcbn1cbmZ1bmN0aW9uIGZpcnN0Q2hpbGQobm9kZSkge1xuICAgIHJldHVybiBub2RlLmZpcnN0Q2hpbGQ7XG59XG5mdW5jdGlvbiBuZXh0U2libGluZyhub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubmV4dFNpYmxpbmc7XG59XG5mdW5jdGlvbiBnZXRTZWxlY3RvcihlbG0pIHtcbiAgICByZXR1cm4gW1xuICAgICAgICBlbG0udGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBlbG0uZ2V0QXR0cmlidXRlKCdpZCcpIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgZWxtLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCB1bmRlZmluZWQsXG4gICAgXTtcbn1cbmZ1bmN0aW9uIHNldFRleHRDb250ZW50KG5vZGUsIHRleHQpIHtcbiAgICBub2RlLnRleHRDb250ZW50ID0gdGV4dDtcbn1cbmZ1bmN0aW9uIGdldFRleHRDb250ZW50KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS50ZXh0Q29udGVudDtcbn1cbmZ1bmN0aW9uIGlzRWxlbWVudChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDE7XG59XG5mdW5jdGlvbiBpc1RleHQobm9kZSkge1xuICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSAzO1xufVxuZnVuY3Rpb24gaXNDb21tZW50KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gODtcbn1cbmZ1bmN0aW9uIGh0bWxEb21BcGkoZG9jdW1lbnQpIHtcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHRhZywgaWQsIGNscywgbnNVcmkpIHtcbiAgICAgICAgdmFyIGVsbSA9IG5zVXJpID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zVXJpLCB0YWcpIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgICAgICBpZiAoaWQpXG4gICAgICAgICAgICBlbG0uc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcbiAgICAgICAgaWYgKGNscylcbiAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xzKTtcbiAgICAgICAgcmV0dXJuIGVsbTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlVGV4dE5vZGUodGV4dCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbW1lbnQodGV4dCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCh0ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlRWxlbWVudDogY3JlYXRlRWxlbWVudCxcbiAgICAgICAgY3JlYXRlVGV4dE5vZGU6IGNyZWF0ZVRleHROb2RlLFxuICAgICAgICBjcmVhdGVDb21tZW50OiBjcmVhdGVDb21tZW50LFxuICAgICAgICBpbnNlcnRDaGlsZDogaW5zZXJ0Q2hpbGQsXG4gICAgICAgIHJlbW92ZUNoaWxkOiByZW1vdmVDaGlsZCxcbiAgICAgICAgcGFyZW50Tm9kZTogcGFyZW50Tm9kZSxcbiAgICAgICAgZmlyc3RDaGlsZDogZmlyc3RDaGlsZCxcbiAgICAgICAgbmV4dFNpYmxpbmc6IG5leHRTaWJsaW5nLFxuICAgICAgICBnZXRTZWxlY3RvcjogZ2V0U2VsZWN0b3IsXG4gICAgICAgIHNldFRleHRDb250ZW50OiBzZXRUZXh0Q29udGVudCxcbiAgICAgICAgZ2V0VGV4dENvbnRlbnQ6IGdldFRleHRDb250ZW50LFxuICAgICAgICBpc0VsZW1lbnQ6IGlzRWxlbWVudCxcbiAgICAgICAgaXNUZXh0OiBpc1RleHQsXG4gICAgICAgIGlzQ29tbWVudDogaXNDb21tZW50LFxuICAgIH07XG59XG5leHBvcnRzLmh0bWxEb21BcGkgPSBodG1sRG9tQXBpO1xuZXhwb3J0cy5kZWZhdWx0ID0gaHRtbERvbUFwaTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRvbWFwaS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGFkZEV2ZW50KGVsbSwgbmFtZSwgZm4pIHtcbiAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmbiwgZmFsc2UpO1xufVxuZnVuY3Rpb24gcmVtb3ZlRXZlbnQoZWxtLCBuYW1lLCBmbikge1xuICAgIGVsbS5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGZuLCBmYWxzZSk7XG59XG5leHBvcnRzLmV2ZW50TGlzdGVuZXJzQXBpID0geyBhZGRFdmVudDogYWRkRXZlbnQsIHJlbW92ZUV2ZW50OiByZW1vdmVFdmVudCB9O1xuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5ldmVudExpc3RlbmVyc0FwaTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV2ZW50bGlzdGVuZXJzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gZ2V0UHJvcChlbG0sIGtleSkge1xuICAgIHJldHVybiBlbG1ba2V5XTtcbn1cbmZ1bmN0aW9uIHNldFByb3AoZWxtLCBrZXksIHZhbCkge1xuICAgIGVsbVtrZXldID0gdmFsO1xufVxuZnVuY3Rpb24gcmVtb3ZlUHJvcChlbG0sIGtleSkge1xuICAgIGRlbGV0ZSBlbG1ba2V5XTtcbn1cbmV4cG9ydHMucHJvcHNBcGkgPSB7IGdldFByb3A6IGdldFByb3AsIHNldFByb3A6IHNldFByb3AsIHJlbW92ZVByb3A6IHJlbW92ZVByb3AgfTtcbmV4cG9ydHMuZGVmYXVsdCA9IGV4cG9ydHMucHJvcHNBcGk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcm9wcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciByYWYgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkgfHwgc2V0VGltZW91dDtcbmZ1bmN0aW9uIG5leHRGcmFtZShmbikge1xuICAgIHJhZihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJhZihmbik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBsaXN0U3R5bGUoZWxtKSB7XG4gICAgdmFyIHN0eWxlID0gZWxtLnN0eWxlO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG4gICAgICAgIGlmIChzdHlsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbn1cbmZ1bmN0aW9uIGdldFN0eWxlKGVsbSwgbmFtZSkge1xuICAgIHJldHVybiBlbG0uc3R5bGVbbmFtZV07XG59XG5mdW5jdGlvbiBzZXRTdHlsZShlbG0sIG5hbWUsIHZhbCwgbmV4dCkge1xuICAgIGlmIChuZXh0ID09PSB2b2lkIDApIHsgbmV4dCA9IGZhbHNlOyB9XG4gICAgdmFyIGZuID0gbmFtZVswXSA9PT0gJy0nICYmIG5hbWVbMV0gPT09ICctJyA/XG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsbS5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWwpO1xuICAgICAgICB9IDogZnVuY3Rpb24gKCkge1xuICAgICAgICBlbG0uc3R5bGVbbmFtZV0gPSB2YWw7XG4gICAgfTtcbiAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgZm4oKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5leHRGcmFtZShmbik7XG4gICAgfVxufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGUoZWxtLCBuYW1lKSB7XG4gICAgaWYgKG5hbWVbMF0gPT0gJy0nICYmIG5hbWVbMV0gPT0gJy0nKSB7XG4gICAgICAgIGVsbS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGVsbS5zdHlsZVtuYW1lXSA9ICcnO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG9uVHJhbnNFbmQoZWxtLCBuYW1lcywgY2FsbGJhY2spIHtcbiAgICB2YXIgY29tcFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbG0pO1xuICAgIHZhciBwcm9wcyA9IGNvbXBTdHlsZVsndHJhbnNpdGlvbi1wcm9wZXJ0eSddLnNwbGl0KCcsICcpO1xuICAgIHZhciBhbW91bnQgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKG5hbWVzLmluZGV4T2YocHJvcHNbaV0pICE9PSAtMSlcbiAgICAgICAgICAgIGFtb3VudCsrO1xuICAgIH1cbiAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGZ1bmN0aW9uIChldikge1xuICAgICAgICBpZiAoZXYudGFyZ2V0ID09PSBlbG0pXG4gICAgICAgICAgICAtLWFtb3VudDtcbiAgICAgICAgaWYgKGFtb3VudCA9PT0gMClcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG59XG5leHBvcnRzLnN0eWxlQXBpID0geyBsaXN0U3R5bGU6IGxpc3RTdHlsZSwgZ2V0U3R5bGU6IGdldFN0eWxlLCBzZXRTdHlsZTogc2V0U3R5bGUsIHJlbW92ZVN0eWxlOiByZW1vdmVTdHlsZSwgb25UcmFuc0VuZDogb25UcmFuc0VuZCB9O1xuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5zdHlsZUFwaTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0eWxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHZub2RlXzEgPSByZXF1aXJlKFwiLi92bm9kZVwiKTtcbnZhciBzbmFiYmRvbV8xID0gcmVxdWlyZShcIi4vc25hYmJkb21cIik7XG5mdW5jdGlvbiBhZGROUyhkYXRhLCBjaGlsZHJlbiwgc2VsKSB7XG4gICAgZGF0YS5ucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG4gICAgaWYgKHNlbCAhPT0gJ2ZvcmVpZ25PYmplY3QnICYmIHNuYWJiZG9tXzEuaXNEZWYoY2hpbGRyZW4pKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZERhdGEgPSBjaGlsZHJlbltpXS5kYXRhO1xuICAgICAgICAgICAgaWYgKHNuYWJiZG9tXzEuaXNEZWYoY2hpbGREYXRhKSkge1xuICAgICAgICAgICAgICAgIGFkZE5TKGNoaWxkRGF0YSwgY2hpbGRyZW5baV0uY2hpbGRyZW4sIGNoaWxkcmVuW2ldLnNlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBoKHNlbCwgYiwgYykge1xuICAgIHZhciBkYXRhID0ge30sIGNoaWxkcmVuLCB0ZXh0LCBpO1xuICAgIGlmIChzbmFiYmRvbV8xLmlzRGVmKGMpKSB7XG4gICAgICAgIGRhdGEgPSBiO1xuICAgICAgICBpZiAoc25hYmJkb21fMS5pc0FycmF5KGMpKSB7XG4gICAgICAgICAgICBjaGlsZHJlbiA9IGM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc25hYmJkb21fMS5pc1ByaW1pdGl2ZShjKSkge1xuICAgICAgICAgICAgdGV4dCA9IGM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyAmJiBjLnNlbCkge1xuICAgICAgICAgICAgY2hpbGRyZW4gPSBbY107XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoc25hYmJkb21fMS5pc0RlZihiKSkge1xuICAgICAgICBpZiAoc25hYmJkb21fMS5pc0FycmF5KGIpKSB7XG4gICAgICAgICAgICBjaGlsZHJlbiA9IGI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc25hYmJkb21fMS5pc1ByaW1pdGl2ZShiKSkge1xuICAgICAgICAgICAgdGV4dCA9IGI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYiAmJiBiLnNlbCkge1xuICAgICAgICAgICAgY2hpbGRyZW4gPSBbYl07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkYXRhID0gYjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoc25hYmJkb21fMS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChzbmFiYmRvbV8xLmlzUHJpbWl0aXZlKGNoaWxkcmVuW2ldKSlcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltpXSA9IHZub2RlXzEudm5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY2hpbGRyZW5baV0sIHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNlbFswXSA9PT0gJ3MnICYmIHNlbFsxXSA9PT0gJ3YnICYmIHNlbFsyXSA9PT0gJ2cnICYmXG4gICAgICAgIChzZWwubGVuZ3RoID09PSAzIHx8IHNlbFszXSA9PT0gJy4nIHx8IHNlbFszXSA9PT0gJyMnKSkge1xuICAgICAgICBhZGROUyhkYXRhLCBjaGlsZHJlbiwgc2VsKTtcbiAgICB9XG4gICAgcmV0dXJuIHZub2RlXzEudm5vZGUoc2VsLCBkYXRhLCBjaGlsZHJlbiwgdGV4dCwgdW5kZWZpbmVkKTtcbn1cbmV4cG9ydHMuaCA9IGg7XG47XG5leHBvcnRzLmRlZmF1bHQgPSBoO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGF0dHJpYnV0ZXNNb2R1bGUoYXBpKSB7XG4gICAgZnVuY3Rpb24gcmVhZEF0dHJzKHZub2RlKSB7XG4gICAgICAgIHZhciBlbG0gPSB2bm9kZS5lbG0sIGtleXMgPSBhcGkubGlzdEF0dHJzKGVsbSksIGF0dHJzID0ge307XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwga2V5c18xID0ga2V5czsgX2kgPCBrZXlzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c18xW19pXTtcbiAgICAgICAgICAgIGlmIChrZXkgIT0gJ2lkJyAmJiBrZXkgIT0gJ2NsYXNzJyAmJlxuICAgICAgICAgICAgICAgICEoa2V5Lmxlbmd0aCA+IDUgJiYga2V5WzRdID09ICctJyAmJiBrZXlbMF0gPT0gJ2QnICYmIGtleVsxXSA9PSAnYScgJiYga2V5WzJdID09ICd0JyAmJiBrZXlbM10gPT0gJ2EnKSkge1xuICAgICAgICAgICAgICAgIGF0dHJzW2tleV0gPSBhcGkuZ2V0QXR0cihlbG0sIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdm5vZGUuZGF0YS5hdHRycyA9IGF0dHJzO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVBdHRycyhvbGRWbm9kZSwgdm5vZGUpIHtcbiAgICAgICAgdmFyIGVsbSA9IHZub2RlLmVsbTtcbiAgICAgICAgdmFyIGtleSwgb2xkQXR0cnMgPSBvbGRWbm9kZS5kYXRhLmF0dHJzLCBhdHRycyA9IHZub2RlLmRhdGEuYXR0cnM7XG4gICAgICAgIGlmICghb2xkQXR0cnMgJiYgIWF0dHJzKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAob2xkQXR0cnMgPT09IGF0dHJzKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBvbGRBdHRycyA9IG9sZEF0dHJzIHx8IHt9O1xuICAgICAgICBhdHRycyA9IGF0dHJzIHx8IHt9O1xuICAgICAgICAvLyB1cGRhdGUgbW9kaWZpZWQgYXR0cmlidXRlcywgYWRkIG5ldyBhdHRyaWJ1dGVzXG4gICAgICAgIGZvciAoa2V5IGluIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgY3VyID0gYXR0cnNba2V5XTtcbiAgICAgICAgICAgIHZhciBvbGQgPSBvbGRBdHRyc1trZXldO1xuICAgICAgICAgICAgaWYgKG9sZCAhPT0gY3VyKSB7XG4gICAgICAgICAgICAgICAgYXBpLnNldEF0dHIoZWxtLCBrZXksIGN1cik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVtb3ZlIHJlbW92ZWQgYXR0cmlidXRlc1xuICAgICAgICAvLyB1c2UgYGluYCBvcGVyYXRvciBzaW5jZSB0aGUgcHJldmlvdXMgYGZvcmAgaXRlcmF0aW9uIHVzZXMgaXQgKC5pLmUuIGFkZCBldmVuIGF0dHJpYnV0ZXMgd2l0aCB1bmRlZmluZWQgdmFsdWUpXG4gICAgICAgIC8vIHRoZSBvdGhlciBvcHRpb24gaXMgdG8gcmVtb3ZlIGFsbCBhdHRyaWJ1dGVzIHdpdGggdmFsdWUgPT0gdW5kZWZpbmVkXG4gICAgICAgIGZvciAoa2V5IGluIG9sZEF0dHJzKSB7XG4gICAgICAgICAgICBpZiAoIShrZXkgaW4gYXR0cnMpKSB7XG4gICAgICAgICAgICAgICAgYXBpLnJlbW92ZUF0dHIoZWxtLCBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHJlYWQ6IHJlYWRBdHRycywgY3JlYXRlOiB1cGRhdGVBdHRycywgdXBkYXRlOiB1cGRhdGVBdHRycyB9O1xufVxuZXhwb3J0cy5hdHRyaWJ1dGVzTW9kdWxlID0gYXR0cmlidXRlc01vZHVsZTtcbmV4cG9ydHMuZGVmYXVsdCA9IGF0dHJpYnV0ZXNNb2R1bGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdHRyaWJ1dGVzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gY2xhc3NNb2R1bGUoYXBpKSB7XG4gICAgZnVuY3Rpb24gdXBkYXRlQ2xhc3Mob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgICAgIHZhciBlbG0gPSB2bm9kZS5lbG07XG4gICAgICAgIHZhciBjdXIsIG5hbWUsIG9sZENsYXNzID0gb2xkVm5vZGUuZGF0YS5jbGFzcywgbmV3Q2xhc3MgPSB2bm9kZS5kYXRhLmNsYXNzO1xuICAgICAgICBpZiAoIW9sZENsYXNzICYmICFuZXdDbGFzcylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKG9sZENsYXNzID09PSBuZXdDbGFzcylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb2xkQ2xhc3MgPSBvbGRDbGFzcyB8fCB7fTtcbiAgICAgICAgbmV3Q2xhc3MgPSBuZXdDbGFzcyB8fCB7fTtcbiAgICAgICAgZm9yIChuYW1lIGluIG9sZENsYXNzKSB7XG4gICAgICAgICAgICBpZiAoIW5ld0NsYXNzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgYXBpLnJlbW92ZUNsYXNzKGVsbSwgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChuYW1lIGluIG5ld0NsYXNzKSB7XG4gICAgICAgICAgICBjdXIgPSBuZXdDbGFzc1tuYW1lXTtcbiAgICAgICAgICAgIGlmIChjdXIgIT09IG9sZENsYXNzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgYXBpW2N1ciA/ICdhZGRDbGFzcycgOiAncmVtb3ZlQ2xhc3MnXShlbG0sIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IGNyZWF0ZTogdXBkYXRlQ2xhc3MsIHVwZGF0ZTogdXBkYXRlQ2xhc3MgfTtcbn1cbmV4cG9ydHMuY2xhc3NNb2R1bGUgPSBjbGFzc01vZHVsZTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNsYXNzTW9kdWxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xhc3MuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBkYXRhc2V0TW9kdWxlKGFwaSkge1xuICAgIGZ1bmN0aW9uIHJlYWREYXRhc2V0KHZub2RlKSB7XG4gICAgICAgIHZhciBlbG0gPSB2bm9kZS5lbG0sIGtleXMgPSBhcGkubGlzdERhdGFzKGVsbSksIGRhdGFzID0ge307XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwga2V5c18xID0ga2V5czsgX2kgPCBrZXlzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c18xW19pXTtcbiAgICAgICAgICAgIGRhdGFzW2tleV0gPSBhcGkuZ2V0RGF0YShlbG0sIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdm5vZGUuZGF0YS5kYXRhc2V0ID0gZGF0YXM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZURhdGFzZXQob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgICAgIHZhciBlbG0gPSB2bm9kZS5lbG0sIG9sZERhdGFzZXQgPSBvbGRWbm9kZS5kYXRhLmRhdGFzZXQsIGRhdGFzZXQgPSB2bm9kZS5kYXRhLmRhdGFzZXQsIGtleTtcbiAgICAgICAgaWYgKCFvbGREYXRhc2V0ICYmICFkYXRhc2V0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAob2xkRGF0YXNldCA9PT0gZGF0YXNldClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb2xkRGF0YXNldCA9IG9sZERhdGFzZXQgfHwge307XG4gICAgICAgIGRhdGFzZXQgPSBkYXRhc2V0IHx8IHt9O1xuICAgICAgICBmb3IgKGtleSBpbiBvbGREYXRhc2V0KSB7XG4gICAgICAgICAgICBpZiAoIWRhdGFzZXRba2V5XSkge1xuICAgICAgICAgICAgICAgIGFwaS5yZW1vdmVEYXRhKGVsbSwga2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGtleSBpbiBkYXRhc2V0KSB7XG4gICAgICAgICAgICBpZiAob2xkRGF0YXNldFtrZXldICE9PSBkYXRhc2V0W2tleV0pIHtcbiAgICAgICAgICAgICAgICBhcGkuc2V0RGF0YShlbG0sIGtleSwgZGF0YXNldFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyByZWFkOiByZWFkRGF0YXNldCwgY3JlYXRlOiB1cGRhdGVEYXRhc2V0LCB1cGRhdGU6IHVwZGF0ZURhdGFzZXQgfTtcbn1cbmV4cG9ydHMuZGF0YXNldE1vZHVsZSA9IGRhdGFzZXRNb2R1bGU7XG5leHBvcnRzLmRlZmF1bHQgPSBkYXRhc2V0TW9kdWxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YXNldC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGludm9rZUhhbmRsZXIoaGFuZGxlciwgdm5vZGUsIGV2ZW50KSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgLy8gY2FsbCBmdW5jdGlvbiBoYW5kbGVyXG4gICAgICAgIGhhbmRsZXIuY2FsbCh2bm9kZSwgZXZlbnQsIHZub2RlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGhhbmRsZXIgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgLy8gY2FsbCBoYW5kbGVyIHdpdGggYXJndW1lbnRzXG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlclswXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIHNpbmdsZSBhcmd1bWVudCBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIGlmIChoYW5kbGVyLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIGhhbmRsZXJbMF0uY2FsbCh2bm9kZSwgaGFuZGxlclsxXSwgZXZlbnQsIHZub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gaGFuZGxlci5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goZXZlbnQpO1xuICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh2bm9kZSk7XG4gICAgICAgICAgICAgICAgaGFuZGxlclswXS5hcHBseSh2bm9kZSwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBjYWxsIG11bHRpcGxlIGhhbmRsZXJzXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpbnZva2VIYW5kbGVyKGhhbmRsZXJbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gaGFuZGxlRXZlbnQoZXZlbnQsIHZub2RlKSB7XG4gICAgdmFyIG5hbWUgPSBldmVudC50eXBlLCBvbiA9IHZub2RlLmRhdGEub247XG4gICAgLy8gY2FsbCBldmVudCBoYW5kbGVyKHMpIGlmIGV4aXN0c1xuICAgIGlmIChvbiAmJiBvbltuYW1lXSkge1xuICAgICAgICBpbnZva2VIYW5kbGVyKG9uW25hbWVdLCB2bm9kZSwgZXZlbnQpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZUxpc3RlbmVyKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XG4gICAgICAgIGhhbmRsZUV2ZW50KGV2ZW50LCBoYW5kbGVyLnZub2RlKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gZXZlbnRMaXN0ZW5lcnNNb2R1bGUoYXBpKSB7XG4gICAgZnVuY3Rpb24gdXBkYXRlRXZlbnRMaXN0ZW5lcnMob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgICAgIHZhciBvbGRPbiA9IG9sZFZub2RlLmRhdGEub24sIG9sZExpc3RlbmVyID0gb2xkVm5vZGUubGlzdGVuZXIsIG9sZEVsbSA9IG9sZFZub2RlLmVsbSwgb24gPSB2bm9kZSAmJiB2bm9kZS5kYXRhLm9uLCBlbG0gPSAodm5vZGUgJiYgdm5vZGUuZWxtKTtcbiAgICAgICAgdmFyIG5hbWU7XG4gICAgICAgIC8vIG9wdGltaXphdGlvbiBmb3IgcmV1c2VkIGltbXV0YWJsZSBoYW5kbGVyc1xuICAgICAgICBpZiAob2xkT24gPT09IG9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nIGxpc3RlbmVycyB3aGljaCBubyBsb25nZXIgdXNlZFxuICAgICAgICBpZiAob2xkT24gJiYgb2xkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIC8vIGlmIGVsZW1lbnQgY2hhbmdlZCBvciBkZWxldGVkIHdlIHJlbW92ZSBhbGwgZXhpc3RpbmcgbGlzdGVuZXJzIHVuY29uZGl0aW9uYWxseVxuICAgICAgICAgICAgaWYgKCFvbikge1xuICAgICAgICAgICAgICAgIGZvciAobmFtZSBpbiBvbGRPbikge1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgbGlzdGVuZXIgaWYgZWxlbWVudCB3YXMgY2hhbmdlZCBvciBleGlzdGluZyBsaXN0ZW5lcnMgcmVtb3ZlZFxuICAgICAgICAgICAgICAgICAgICBhcGkucmVtb3ZlRXZlbnQob2xkRWxtLCBuYW1lLCBvbGRMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChuYW1lIGluIG9sZE9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBsaXN0ZW5lciBpZiBleGlzdGluZyBsaXN0ZW5lciByZW1vdmVkXG4gICAgICAgICAgICAgICAgICAgIGlmICghb25bbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5yZW1vdmVFdmVudChvbGRFbG0sIG5hbWUsIG9sZExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBhZGQgbmV3IGxpc3RlbmVycyB3aGljaCBoYXMgbm90IGFscmVhZHkgYXR0YWNoZWRcbiAgICAgICAgaWYgKG9uKSB7XG4gICAgICAgICAgICAvLyByZXVzZSBleGlzdGluZyBsaXN0ZW5lciBvciBjcmVhdGUgbmV3XG4gICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSB2bm9kZS5saXN0ZW5lciA9IG9sZFZub2RlLmxpc3RlbmVyIHx8IGNyZWF0ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICAvLyB1cGRhdGUgdm5vZGUgZm9yIGxpc3RlbmVyXG4gICAgICAgICAgICBsaXN0ZW5lci52bm9kZSA9IHZub2RlO1xuICAgICAgICAgICAgLy8gaWYgZWxlbWVudCBjaGFuZ2VkIG9yIGFkZGVkIHdlIGFkZCBhbGwgbmVlZGVkIGxpc3RlbmVycyB1bmNvbmRpdGlvbmFsbHlcbiAgICAgICAgICAgIGlmICghb2xkT24pIHtcbiAgICAgICAgICAgICAgICBmb3IgKG5hbWUgaW4gb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGxpc3RlbmVyIGlmIGVsZW1lbnQgd2FzIGNoYW5nZWQgb3IgbmV3IGxpc3RlbmVycyBhZGRlZFxuICAgICAgICAgICAgICAgICAgICBhcGkuYWRkRXZlbnQoZWxtLCBuYW1lLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChuYW1lIGluIG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCBsaXN0ZW5lciBpZiBuZXcgbGlzdGVuZXIgYWRkZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvbGRPbltuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLmFkZEV2ZW50KGVsbSwgbmFtZSwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZTogdXBkYXRlRXZlbnRMaXN0ZW5lcnMsXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlRXZlbnRMaXN0ZW5lcnMsXG4gICAgICAgIGRlc3Ryb3k6IHVwZGF0ZUV2ZW50TGlzdGVuZXJzXG4gICAgfTtcbn1cbmV4cG9ydHMuZXZlbnRMaXN0ZW5lcnNNb2R1bGUgPSBldmVudExpc3RlbmVyc01vZHVsZTtcbmV4cG9ydHMuZGVmYXVsdCA9IGV2ZW50TGlzdGVuZXJzTW9kdWxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXZlbnRsaXN0ZW5lcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBwcm9wc01vZHVsZShhcGkpIHtcbiAgICBmdW5jdGlvbiB1cGRhdGVQcm9wcyhvbGRWbm9kZSwgdm5vZGUpIHtcbiAgICAgICAgdmFyIGVsbSA9IHZub2RlLmVsbTtcbiAgICAgICAgdmFyIGtleSwgY3VyLCBvbGQsIG9sZFByb3BzID0gb2xkVm5vZGUuZGF0YS5wcm9wcywgcHJvcHMgPSB2bm9kZS5kYXRhLnByb3BzO1xuICAgICAgICBpZiAoIW9sZFByb3BzICYmICFwcm9wcylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKG9sZFByb3BzID09PSBwcm9wcylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb2xkUHJvcHMgPSBvbGRQcm9wcyB8fCB7fTtcbiAgICAgICAgcHJvcHMgPSBwcm9wcyB8fCB7fTtcbiAgICAgICAgZm9yIChrZXkgaW4gb2xkUHJvcHMpIHtcbiAgICAgICAgICAgIGlmICghcHJvcHNba2V5XSkge1xuICAgICAgICAgICAgICAgIGFwaS5yZW1vdmVQcm9wKGVsbSwga2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGtleSBpbiBwcm9wcykge1xuICAgICAgICAgICAgY3VyID0gcHJvcHNba2V5XTtcbiAgICAgICAgICAgIG9sZCA9IG9sZFByb3BzW2tleV07XG4gICAgICAgICAgICBpZiAob2xkICE9PSBjdXIgJiYgKGtleSAhPT0gJ3ZhbHVlJyB8fCBhcGkuZ2V0UHJvcChlbG0sIGtleSkgIT09IGN1cikpIHtcbiAgICAgICAgICAgICAgICBhcGkuc2V0UHJvcChlbG0sIGtleSwgY3VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBjcmVhdGU6IHVwZGF0ZVByb3BzLCB1cGRhdGU6IHVwZGF0ZVByb3BzIH07XG59XG5leHBvcnRzLnByb3BzTW9kdWxlID0gcHJvcHNNb2R1bGU7XG5leHBvcnRzLmRlZmF1bHQgPSBwcm9wc01vZHVsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByb3BzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gc3R5bGVNb2R1bGUoYXBpKSB7XG4gICAgZnVuY3Rpb24gcmVhZFN0eWxlKHZub2RlKSB7XG4gICAgICAgIHZhciBlbG0gPSB2bm9kZS5lbG07XG4gICAgICAgIHZhciBrZXlzID0gYXBpLmxpc3RTdHlsZShlbG0pO1xuICAgICAgICB2YXIgc3R5bGUgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBrZXlzXzEgPSBrZXlzOyBfaSA8IGtleXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzXzFbX2ldO1xuICAgICAgICAgICAgc3R5bGVba2V5XSA9IGFwaS5nZXRTdHlsZShlbG0sIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdm5vZGUuZGF0YS5zdHlsZSA9IHN0eWxlO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVTdHlsZShvbGRWbm9kZSwgdm5vZGUpIHtcbiAgICAgICAgdmFyIGVsbSA9IHZub2RlLmVsbTtcbiAgICAgICAgdmFyIGN1ciwgbmFtZSwgb2xkU3R5bGUgPSBvbGRWbm9kZS5kYXRhLnN0eWxlLCBzdHlsZSA9IHZub2RlLmRhdGEuc3R5bGU7XG4gICAgICAgIGlmICghb2xkU3R5bGUgJiYgIXN0eWxlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAob2xkU3R5bGUgPT09IHN0eWxlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBvbGRTdHlsZSA9IG9sZFN0eWxlIHx8IHt9O1xuICAgICAgICBzdHlsZSA9IHN0eWxlIHx8IHt9O1xuICAgICAgICB2YXIgb2xkSGFzRGVsID0gJ2RlbGF5ZWQnIGluIG9sZFN0eWxlO1xuICAgICAgICBmb3IgKG5hbWUgaW4gb2xkU3R5bGUpIHtcbiAgICAgICAgICAgIGlmICghc3R5bGVbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBhcGkucmVtb3ZlU3R5bGUoZWxtLCBuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKG5hbWUgaW4gc3R5bGUpIHtcbiAgICAgICAgICAgIGN1ciA9IHN0eWxlW25hbWVdO1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdkZWxheWVkJyAmJiBzdHlsZS5kZWxheWVkKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbmFtZTIgaW4gc3R5bGUuZGVsYXllZCkge1xuICAgICAgICAgICAgICAgICAgICBjdXIgPSBzdHlsZS5kZWxheWVkW25hbWUyXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvbGRIYXNEZWwgfHwgY3VyICE9PSBvbGRTdHlsZS5kZWxheWVkW25hbWUyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnNldFN0eWxlKGVsbSwgbmFtZTIsIGN1ciwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lICE9PSAncmVtb3ZlJyAmJiBjdXIgIT09IG9sZFN0eWxlW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgYXBpLnNldFN0eWxlKGVsbSwgbmFtZSwgY3VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBhcHBseURlc3Ryb3lTdHlsZSh2bm9kZSkge1xuICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtLCBzID0gdm5vZGUuZGF0YS5zdHlsZTtcbiAgICAgICAgdmFyIHN0eWxlLCBuYW1lO1xuICAgICAgICBpZiAoIXMgfHwgIShzdHlsZSA9IHMuZGVzdHJveSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGZvciAobmFtZSBpbiBzdHlsZSkge1xuICAgICAgICAgICAgYXBpLnNldFN0eWxlKGVsbSwgbmFtZSwgc3R5bGVbbmFtZV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFwcGx5UmVtb3ZlU3R5bGUodm5vZGUsIHJtKSB7XG4gICAgICAgIHZhciBzID0gdm5vZGUuZGF0YS5zdHlsZTtcbiAgICAgICAgaWYgKCFzIHx8ICFzLnJlbW92ZSkge1xuICAgICAgICAgICAgcm0oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtLCBzdHlsZSA9IHMucmVtb3ZlLCBhcHBsaWVkID0gW107XG4gICAgICAgIHZhciBuYW1lO1xuICAgICAgICBmb3IgKG5hbWUgaW4gc3R5bGUpIHtcbiAgICAgICAgICAgIGFwcGxpZWQucHVzaChuYW1lKTtcbiAgICAgICAgICAgIGFwaS5zZXRTdHlsZShlbG0sIG5hbWUsIHN0eWxlW25hbWVdKTtcbiAgICAgICAgfVxuICAgICAgICBhcGkub25UcmFuc0VuZChlbG0sIGFwcGxpZWQsIHJtKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZDogcmVhZFN0eWxlLFxuICAgICAgICBjcmVhdGU6IHVwZGF0ZVN0eWxlLFxuICAgICAgICB1cGRhdGU6IHVwZGF0ZVN0eWxlLFxuICAgICAgICBkZXN0cm95OiBhcHBseURlc3Ryb3lTdHlsZSxcbiAgICAgICAgcmVtb3ZlOiBhcHBseVJlbW92ZVN0eWxlXG4gICAgfTtcbn1cbmV4cG9ydHMuc3R5bGVNb2R1bGUgPSBzdHlsZU1vZHVsZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHN0eWxlTW9kdWxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3R5bGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgc25hYmJkb21fMSA9IHJlcXVpcmUoXCIuL3NuYWJiZG9tXCIpO1xudmFyIGF0dHJpYnV0ZXNfMSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvYXR0cmlidXRlc1wiKTsgLy8gZm9yIHNldHRpbmcgYXR0cmlidXRlcyBvbiBET00gZWxlbWVudHNcbnZhciBjbGFzc18xID0gcmVxdWlyZShcIi4vbW9kdWxlcy9jbGFzc1wiKTsgLy8gbWFrZXMgaXQgZWFzeSB0byB0b2dnbGUgY2xhc3Nlc1xudmFyIHByb3BzXzEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL3Byb3BzXCIpOyAvLyBmb3Igc2V0dGluZyBwcm9wZXJ0aWVzIG9uIERPTSBlbGVtZW50c1xudmFyIHN0eWxlXzEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL3N0eWxlXCIpOyAvLyBoYW5kbGVzIHN0eWxpbmcgb24gZWxlbWVudHMgd2l0aCBzdXBwb3J0IGZvciBhbmltYXRpb25zXG52YXIgZXZlbnRsaXN0ZW5lcnNfMSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvZXZlbnRsaXN0ZW5lcnNcIik7IC8vIGF0dGFjaGVzIGV2ZW50IGxpc3RlbmVyc1xudmFyIGRhdGFzZXRfMSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvZGF0YXNldFwiKTsgLy8gaGFuZGxlcyBkYXRhc2V0XG52YXIgZG9tYXBpXzEgPSByZXF1aXJlKFwiLi9jbGllbnQvZG9tYXBpXCIpOyAvLyBicm93c2VyIERPTSBBUElcbnZhciBhdHRyaWJ1dGVzXzIgPSByZXF1aXJlKFwiLi9jbGllbnQvYXR0cmlidXRlc1wiKTtcbnZhciBjbGFzc18yID0gcmVxdWlyZShcIi4vY2xpZW50L2NsYXNzXCIpO1xudmFyIHByb3BzXzIgPSByZXF1aXJlKFwiLi9jbGllbnQvcHJvcHNcIik7XG52YXIgc3R5bGVfMiA9IHJlcXVpcmUoXCIuL2NsaWVudC9zdHlsZVwiKTtcbnZhciBldmVudGxpc3RlbmVyc18yID0gcmVxdWlyZShcIi4vY2xpZW50L2V2ZW50bGlzdGVuZXJzXCIpO1xudmFyIGRhdGFzZXRfMiA9IHJlcXVpcmUoXCIuL2NsaWVudC9kYXRhc2V0XCIpO1xudmFyIGhfMSA9IHJlcXVpcmUoXCIuL2hcIik7IC8vIGhlbHBlciBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgdm5vZGVzXG5leHBvcnRzLnNuYWJiZG9tTW9kdWxlcyA9IFtcbiAgICBhdHRyaWJ1dGVzXzEuYXR0cmlidXRlc01vZHVsZShhdHRyaWJ1dGVzXzIuYXR0cmlidXRlc0FwaSksXG4gICAgY2xhc3NfMS5jbGFzc01vZHVsZShjbGFzc18yLmNsYXNzQXBpKSxcbiAgICBwcm9wc18xLnByb3BzTW9kdWxlKHByb3BzXzIucHJvcHNBcGkpLFxuICAgIHN0eWxlXzEuc3R5bGVNb2R1bGUoc3R5bGVfMi5zdHlsZUFwaSksXG4gICAgZXZlbnRsaXN0ZW5lcnNfMS5ldmVudExpc3RlbmVyc01vZHVsZShldmVudGxpc3RlbmVyc18yLmV2ZW50TGlzdGVuZXJzQXBpKSxcbiAgICBkYXRhc2V0XzEuZGF0YXNldE1vZHVsZShkYXRhc2V0XzIuZGF0YXNldEFwaSksXG5dO1xuLy8gSW5pdCBwYXRjaCBmdW5jdGlvbiB3aXRoIGNob29zZW4gbW9kdWxlc1xudmFyIF9hID0gc25hYmJkb21fMS5pbml0KGV4cG9ydHMuc25hYmJkb21Nb2R1bGVzLCBkb21hcGlfMS5odG1sRG9tQXBpKGRvY3VtZW50KSksIHJlYWQgPSBfYS5yZWFkLCBwYXRjaCA9IF9hLnBhdGNoO1xuZXhwb3J0cy5zbmFiYmRvbUJ1bmRsZSA9IHsgcmVhZDogcmVhZCwgcGF0Y2g6IHBhdGNoLCBoOiBoXzEuaCB9O1xuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5zbmFiYmRvbUJ1bmRsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNuYWJiZG9tLmJ1bmRsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB2bm9kZV8xID0gcmVxdWlyZShcIi4vdm5vZGVcIik7XG5leHBvcnRzLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuZnVuY3Rpb24gaXNQcmltaXRpdmUocykge1xuICAgIHZhciB0ID0gKHR5cGVvZiBzKVswXTtcbiAgICByZXR1cm4gdCA9PSAncycgfHwgdCA9PSAnbicgfHwgdCA9PSAnYic7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5mdW5jdGlvbiBpc0RlZihzKSB7XG4gICAgcmV0dXJuIHMgIT09IHVuZGVmaW5lZDtcbn1cbmV4cG9ydHMuaXNEZWYgPSBpc0RlZjtcbnZhciBlbXB0eU5vZGUgPSB2bm9kZV8xLnZub2RlKCcnLCB7fSwgW10sIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbmZ1bmN0aW9uIHNhbWVWbm9kZSh2bm9kZTEsIHZub2RlMikge1xuICAgIHJldHVybiB2bm9kZTEua2V5ID09PSB2bm9kZTIua2V5ICYmIHZub2RlMS5zZWwgPT09IHZub2RlMi5zZWw7XG59XG5mdW5jdGlvbiBjcmVhdGVLZXlUb09sZElkeChjaGlsZHJlbiwgYmVnaW5JZHgsIGVuZElkeCkge1xuICAgIHZhciBpLCBtYXAgPSB7fSwga2V5LCBjaDtcbiAgICBmb3IgKGkgPSBiZWdpbklkeDsgaSA8PSBlbmRJZHg7ICsraSkge1xuICAgICAgICBjaCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBpZiAoY2ggIT0gbnVsbCkge1xuICAgICAgICAgICAga2V5ID0gY2gua2V5O1xuICAgICAgICAgICAgaWYgKGlzRGVmKGtleSkpXG4gICAgICAgICAgICAgICAgbWFwW2tleV0gPSBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXA7XG59XG52YXIgaG9va3MgPSBbJ3JlYWQnLCAnY3JlYXRlJywgJ3VwZGF0ZScsICdyZW1vdmUnLCAnZGVzdHJveScsICdwcmUnLCAncG9zdCddO1xuZnVuY3Rpb24gaW5pdChtb2R1bGVzLCBhcGkpIHtcbiAgICB2YXIgaSwgaiwgY2JzID0ge307XG4gICAgZm9yIChpID0gMDsgaSA8IGhvb2tzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNic1tob29rc1tpXV0gPSBbXTtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IG1vZHVsZXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIHZhciBob29rID0gbW9kdWxlc1tqXVtob29rc1tpXV07XG4gICAgICAgICAgICBpZiAoaXNEZWYoaG9vaykpIHtcbiAgICAgICAgICAgICAgICBjYnNbaG9va3NbaV1dLnB1c2goaG9vayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlUm1DYihjaGlsZEVsbSwgbGlzdGVuZXJzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBybUNiKCkge1xuICAgICAgICAgICAgaWYgKC0tbGlzdGVuZXJzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudF8xID0gYXBpLnBhcmVudE5vZGUoY2hpbGRFbG0pO1xuICAgICAgICAgICAgICAgIGFwaS5yZW1vdmVDaGlsZChwYXJlbnRfMSwgY2hpbGRFbG0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVFbG0odm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSkge1xuICAgICAgICB2YXIgaSwgZGF0YSA9IHZub2RlLmRhdGE7XG4gICAgICAgIGlmIChpc0RlZihkYXRhKSkge1xuICAgICAgICAgICAgaWYgKGlzRGVmKGkgPSBkYXRhLmhvb2spICYmIGlzRGVmKGkgPSBpLmluaXQpKSB7XG4gICAgICAgICAgICAgICAgaSh2bm9kZSk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHZub2RlLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW4sIHNlbCA9IHZub2RlLnNlbDtcbiAgICAgICAgaWYgKHNlbCA9PT0gJyEnKSB7XG4gICAgICAgICAgICBpZiAoIWlzRGVmKHZub2RlLnRleHQpKSB7XG4gICAgICAgICAgICAgICAgdm5vZGUudGV4dCA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdm5vZGUuZWxtID0gYXBpLmNyZWF0ZUNvbW1lbnQodm5vZGUudGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNEZWYoc2VsKSkge1xuICAgICAgICAgICAgLy8gUGFyc2Ugc2VsZWN0b3JcbiAgICAgICAgICAgIHZhciBoYXNoSWR4ID0gc2VsLmluZGV4T2YoJyMnKTtcbiAgICAgICAgICAgIHZhciBkb3RJZHggPSBzZWwuaW5kZXhPZignLicsIGhhc2hJZHgpO1xuICAgICAgICAgICAgdmFyIGhhc2ggPSBoYXNoSWR4ID4gMCA/IGhhc2hJZHggOiBzZWwubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGRvdCA9IGRvdElkeCA+IDAgPyBkb3RJZHggOiBzZWwubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHRhZyA9IGhhc2hJZHggIT09IC0xIHx8IGRvdElkeCAhPT0gLTEgPyBzZWwuc2xpY2UoMCwgTWF0aC5taW4oaGFzaCwgZG90KSkgOiBzZWw7XG4gICAgICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtID0gYXBpLmNyZWF0ZUVsZW1lbnQodGFnLCBoYXNoIDwgZG90ID8gc2VsLnNsaWNlKGhhc2ggKyAxLCBkb3QpIDogdW5kZWZpbmVkLCBkb3RJZHggPiAwID8gc2VsLnNsaWNlKGRvdCArIDEpLnJlcGxhY2UoL1xcLi9nLCAnICcpIDogdW5kZWZpbmVkLCBpc0RlZihkYXRhKSA/IGRhdGEubnMgOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNicy5jcmVhdGUubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgY2JzLmNyZWF0ZVtpXShlbXB0eU5vZGUsIHZub2RlKTtcbiAgICAgICAgICAgIGlmIChleHBvcnRzLmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLmluc2VydENoaWxkKGVsbSwgY3JlYXRlRWxtKGNoLCBpbnNlcnRlZFZub2RlUXVldWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzUHJpbWl0aXZlKHZub2RlLnRleHQpKSB7XG4gICAgICAgICAgICAgICAgYXBpLmluc2VydENoaWxkKGVsbSwgYXBpLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkgPSB2bm9kZS5kYXRhLmhvb2s7IC8vIFJldXNlIHZhcmlhYmxlXG4gICAgICAgICAgICBpZiAoaXNEZWYoaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaS5jcmVhdGUpXG4gICAgICAgICAgICAgICAgICAgIGkuY3JlYXRlKGVtcHR5Tm9kZSwgdm5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChpLmluc2VydClcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0ZWRWbm9kZVF1ZXVlLnB1c2godm5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdm5vZGUuZWxtID0gYXBpLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2bm9kZS5lbG07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFkZFZub2RlcyhwYXJlbnRFbG0sIGJlZm9yZSwgdm5vZGVzLCBzdGFydElkeCwgZW5kSWR4LCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgICAgICAgZm9yICg7IHN0YXJ0SWR4IDw9IGVuZElkeDsgKytzdGFydElkeCkge1xuICAgICAgICAgICAgdmFyIGNoID0gdm5vZGVzW3N0YXJ0SWR4XTtcbiAgICAgICAgICAgIGlmIChjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYXBpLmluc2VydENoaWxkKHBhcmVudEVsbSwgY3JlYXRlRWxtKGNoLCBpbnNlcnRlZFZub2RlUXVldWUpLCBiZWZvcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGludm9rZURlc3Ryb3lIb29rKHZub2RlKSB7XG4gICAgICAgIHZhciBpLCBqLCBkYXRhID0gdm5vZGUuZGF0YTtcbiAgICAgICAgaWYgKGlzRGVmKGRhdGEpKSB7XG4gICAgICAgICAgICBpZiAoaXNEZWYoaSA9IGRhdGEuaG9vaykgJiYgaXNEZWYoaSA9IGkuZGVzdHJveSkpXG4gICAgICAgICAgICAgICAgaSh2bm9kZSk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLmRlc3Ryb3kubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgY2JzLmRlc3Ryb3lbaV0odm5vZGUpO1xuICAgICAgICAgICAgaWYgKGlzRGVmKHZub2RlLmNoaWxkcmVuKSkge1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCB2bm9kZS5jaGlsZHJlbi5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgICAgICAgICBpID0gdm5vZGUuY2hpbGRyZW5bal07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9IG51bGwgJiYgdHlwZW9mIGkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludm9rZURlc3Ryb3lIb29rKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZVZub2RlcyhwYXJlbnRFbG0sIHZub2Rlcywgc3RhcnRJZHgsIGVuZElkeCkge1xuICAgICAgICBmb3IgKDsgc3RhcnRJZHggPD0gZW5kSWR4OyArK3N0YXJ0SWR4KSB7XG4gICAgICAgICAgICB2YXIgaV8xID0gdm9pZCAwLCBsaXN0ZW5lcnMgPSB2b2lkIDAsIHJtID0gdm9pZCAwLCBjaCA9IHZub2Rlc1tzdGFydElkeF07XG4gICAgICAgICAgICBpZiAoY2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChpc0RlZihjaC5zZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIGludm9rZURlc3Ryb3lIb29rKGNoKTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzID0gY2JzLnJlbW92ZS5sZW5ndGggKyAxO1xuICAgICAgICAgICAgICAgICAgICBybSA9IGNyZWF0ZVJtQ2IoY2guZWxtLCBsaXN0ZW5lcnMpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGlfMSA9IDA7IGlfMSA8IGNicy5yZW1vdmUubGVuZ3RoOyArK2lfMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNicy5yZW1vdmVbaV8xXShjaCwgcm0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNEZWYoaV8xID0gY2guZGF0YSkgJiYgaXNEZWYoaV8xID0gaV8xLmhvb2spICYmIGlzRGVmKGlfMSA9IGlfMS5yZW1vdmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpXzEoY2gsIHJtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJtKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5yZW1vdmVDaGlsZChwYXJlbnRFbG0sIGNoLmVsbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNoaWxkcmVuKHBhcmVudEVsbSwgb2xkQ2gsIG5ld0NoLCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgICAgICAgdmFyIG9sZFN0YXJ0SWR4ID0gMCwgbmV3U3RhcnRJZHggPSAwO1xuICAgICAgICB2YXIgb2xkRW5kSWR4ID0gb2xkQ2gubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFswXTtcbiAgICAgICAgdmFyIG9sZEVuZFZub2RlID0gb2xkQ2hbb2xkRW5kSWR4XTtcbiAgICAgICAgdmFyIG5ld0VuZElkeCA9IG5ld0NoLmxlbmd0aCAtIDE7XG4gICAgICAgIHZhciBuZXdTdGFydFZub2RlID0gbmV3Q2hbMF07XG4gICAgICAgIHZhciBuZXdFbmRWbm9kZSA9IG5ld0NoW25ld0VuZElkeF07XG4gICAgICAgIHZhciBvbGRLZXlUb0lkeDtcbiAgICAgICAgdmFyIGlkeEluT2xkO1xuICAgICAgICB2YXIgZWxtVG9Nb3ZlO1xuICAgICAgICB2YXIgYmVmb3JlO1xuICAgICAgICB3aGlsZSAob2xkU3RhcnRJZHggPD0gb2xkRW5kSWR4ICYmIG5ld1N0YXJ0SWR4IDw9IG5ld0VuZElkeCkge1xuICAgICAgICAgICAgaWYgKG9sZFN0YXJ0Vm5vZGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG9sZFN0YXJ0Vm5vZGUgPSBvbGRDaFsrK29sZFN0YXJ0SWR4XTsgLy8gVm5vZGUgbWlnaHQgaGF2ZSBiZWVuIG1vdmVkIGxlZnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG9sZEVuZFZub2RlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5ld1N0YXJ0Vm5vZGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFsrK25ld1N0YXJ0SWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5ld0VuZFZub2RlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBuZXdFbmRWbm9kZSA9IG5ld0NoWy0tbmV3RW5kSWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNhbWVWbm9kZShvbGRTdGFydFZub2RlLCBuZXdTdGFydFZub2RlKSkge1xuICAgICAgICAgICAgICAgIHBhdGNoVm5vZGUob2xkU3RhcnRWbm9kZSwgbmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgICAgICAgICBvbGRTdGFydFZub2RlID0gb2xkQ2hbKytvbGRTdGFydElkeF07XG4gICAgICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc2FtZVZub2RlKG9sZEVuZFZub2RlLCBuZXdFbmRWbm9kZSkpIHtcbiAgICAgICAgICAgICAgICBwYXRjaFZub2RlKG9sZEVuZFZub2RlLCBuZXdFbmRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgICAgICAgICBvbGRFbmRWbm9kZSA9IG9sZENoWy0tb2xkRW5kSWR4XTtcbiAgICAgICAgICAgICAgICBuZXdFbmRWbm9kZSA9IG5ld0NoWy0tbmV3RW5kSWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNhbWVWbm9kZShvbGRTdGFydFZub2RlLCBuZXdFbmRWbm9kZSkpIHtcbiAgICAgICAgICAgICAgICBwYXRjaFZub2RlKG9sZFN0YXJ0Vm5vZGUsIG5ld0VuZFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICAgICAgICAgIGFwaS5pbnNlcnRDaGlsZChwYXJlbnRFbG0sIG9sZFN0YXJ0Vm5vZGUuZWxtLCBhcGkubmV4dFNpYmxpbmcob2xkRW5kVm5vZGUuZWxtKSk7XG4gICAgICAgICAgICAgICAgb2xkU3RhcnRWbm9kZSA9IG9sZENoWysrb2xkU3RhcnRJZHhdO1xuICAgICAgICAgICAgICAgIG5ld0VuZFZub2RlID0gbmV3Q2hbLS1uZXdFbmRJZHhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc2FtZVZub2RlKG9sZEVuZFZub2RlLCBuZXdTdGFydFZub2RlKSkge1xuICAgICAgICAgICAgICAgIHBhdGNoVm5vZGUob2xkRW5kVm5vZGUsIG5ld1N0YXJ0Vm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgICAgICAgICAgICAgYXBpLmluc2VydENoaWxkKHBhcmVudEVsbSwgb2xkRW5kVm5vZGUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgICAgICAgICAgb2xkRW5kVm5vZGUgPSBvbGRDaFstLW9sZEVuZElkeF07XG4gICAgICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9sZEtleVRvSWR4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb2xkS2V5VG9JZHggPSBjcmVhdGVLZXlUb09sZElkeChvbGRDaCwgb2xkU3RhcnRJZHgsIG9sZEVuZElkeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlkeEluT2xkID0gb2xkS2V5VG9JZHhbbmV3U3RhcnRWbm9kZS5rZXldO1xuICAgICAgICAgICAgICAgIGlmICghaXNEZWYoaWR4SW5PbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5pbnNlcnRDaGlsZChwYXJlbnRFbG0sIGNyZWF0ZUVsbShuZXdTdGFydFZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0Vm5vZGUgPSBuZXdDaFsrK25ld1N0YXJ0SWR4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsbVRvTW92ZSA9IG9sZENoW2lkeEluT2xkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsbVRvTW92ZS5zZWwgIT09IG5ld1N0YXJ0Vm5vZGUuc2VsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuaW5zZXJ0Q2hpbGQocGFyZW50RWxtLCBjcmVhdGVFbG0obmV3U3RhcnRWbm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSwgb2xkU3RhcnRWbm9kZS5lbG0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0Y2hWbm9kZShlbG1Ub01vdmUsIG5ld1N0YXJ0Vm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRDaFtpZHhJbk9sZF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuaW5zZXJ0Q2hpbGQocGFyZW50RWxtLCBlbG1Ub01vdmUuZWxtLCBvbGRTdGFydFZub2RlLmVsbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnRWbm9kZSA9IG5ld0NoWysrbmV3U3RhcnRJZHhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob2xkU3RhcnRJZHggPD0gb2xkRW5kSWR4IHx8IG5ld1N0YXJ0SWR4IDw9IG5ld0VuZElkeCkge1xuICAgICAgICAgICAgaWYgKG9sZFN0YXJ0SWR4ID4gb2xkRW5kSWR4KSB7XG4gICAgICAgICAgICAgICAgYmVmb3JlID0gbmV3Q2hbbmV3RW5kSWR4ICsgMV0gPT0gbnVsbCA/IG51bGwgOiBuZXdDaFtuZXdFbmRJZHggKyAxXS5lbG07XG4gICAgICAgICAgICAgICAgYWRkVm5vZGVzKHBhcmVudEVsbSwgYmVmb3JlLCBuZXdDaCwgbmV3U3RhcnRJZHgsIG5ld0VuZElkeCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlbW92ZVZub2RlcyhwYXJlbnRFbG0sIG9sZENoLCBvbGRTdGFydElkeCwgb2xkRW5kSWR4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBwYXRjaFZub2RlKG9sZFZub2RlLCB2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XG4gICAgICAgIHZhciBpLCBob29rO1xuICAgICAgICBpZiAoaXNEZWYoaSA9IHZub2RlLmRhdGEpICYmIGlzRGVmKGhvb2sgPSBpLmhvb2spICYmIGlzRGVmKGkgPSBob29rLnByZXBhdGNoKSkge1xuICAgICAgICAgICAgaShvbGRWbm9kZSwgdm5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbG0gPSB2bm9kZS5lbG0gPSBvbGRWbm9kZS5lbG07XG4gICAgICAgIHZhciBvbGRDaCA9IG9sZFZub2RlLmNoaWxkcmVuO1xuICAgICAgICB2YXIgY2ggPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKG9sZFZub2RlID09PSB2bm9kZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKGlzRGVmKHZub2RlLmRhdGEpKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLnVwZGF0ZS5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBjYnMudXBkYXRlW2ldKG9sZFZub2RlLCB2bm9kZSk7XG4gICAgICAgICAgICBpID0gdm5vZGUuZGF0YS5ob29rO1xuICAgICAgICAgICAgaWYgKGlzRGVmKGkpICYmIGlzRGVmKGkgPSBpLnVwZGF0ZSkpXG4gICAgICAgICAgICAgICAgaShvbGRWbm9kZSwgdm5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNEZWYodm5vZGUudGV4dCkpIHtcbiAgICAgICAgICAgIGlmIChpc0RlZihvbGRDaCkgJiYgaXNEZWYoY2gpKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9sZENoICE9PSBjaClcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4oZWxtLCBvbGRDaCwgY2gsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0RlZihjaCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEZWYob2xkVm5vZGUudGV4dCkpXG4gICAgICAgICAgICAgICAgICAgIGFwaS5zZXRUZXh0Q29udGVudChlbG0sICcnKTtcbiAgICAgICAgICAgICAgICBhZGRWbm9kZXMoZWxtLCBudWxsLCBjaCwgMCwgY2gubGVuZ3RoIC0gMSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRGVmKG9sZENoKSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZVZub2RlcyhlbG0sIG9sZENoLCAwLCBvbGRDaC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRGVmKG9sZFZub2RlLnRleHQpKSB7XG4gICAgICAgICAgICAgICAgYXBpLnNldFRleHRDb250ZW50KGVsbSwgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9sZFZub2RlLnRleHQgIT09IHZub2RlLnRleHQpIHtcbiAgICAgICAgICAgIGFwaS5zZXRUZXh0Q29udGVudChlbG0sIHZub2RlLnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0RlZihob29rKSAmJiBpc0RlZihpID0gaG9vay5wb3N0cGF0Y2gpKSB7XG4gICAgICAgICAgICBpKG9sZFZub2RlLCB2bm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcGF0Y2gob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgaW5zZXJ0ZWRWbm9kZVF1ZXVlID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYnMucHJlLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgY2JzLnByZVtpXSgpO1xuICAgICAgICBpZiAoc2FtZVZub2RlKG9sZFZub2RlLCB2bm9kZSkpIHtcbiAgICAgICAgICAgIHBhdGNoVm5vZGUob2xkVm5vZGUsIHZub2RlLCBpbnNlcnRlZFZub2RlUXVldWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGVsbSA9IG9sZFZub2RlLmVsbTtcbiAgICAgICAgICAgIHZhciBwYXJlbnRfMiA9IGFwaS5wYXJlbnROb2RlKGVsbSk7XG4gICAgICAgICAgICBjcmVhdGVFbG0odm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSk7XG4gICAgICAgICAgICBpZiAocGFyZW50XzIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhcGkuaW5zZXJ0Q2hpbGQocGFyZW50XzIsIHZub2RlLmVsbSwgYXBpLm5leHRTaWJsaW5nKGVsbSkpO1xuICAgICAgICAgICAgICAgIHJlbW92ZVZub2RlcyhwYXJlbnRfMiwgW29sZFZub2RlXSwgMCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGluc2VydGVkVm5vZGVRdWV1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaW5zZXJ0ZWRWbm9kZVF1ZXVlW2ldLmRhdGEuaG9vay5pbnNlcnQoaW5zZXJ0ZWRWbm9kZVF1ZXVlW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2JzLnBvc3QubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICBjYnMucG9zdFtpXSgpO1xuICAgICAgICByZXR1cm4gdm5vZGU7XG4gICAgfVxuICAgIDtcbiAgICBmdW5jdGlvbiByZWFkKG5vZGUpIHtcbiAgICAgICAgdmFyIHRleHQ7XG4gICAgICAgIGlmIChhcGkuaXNFbGVtZW50KG5vZGUpKSB7XG4gICAgICAgICAgICB2YXIgX2EgPSBhcGkuZ2V0U2VsZWN0b3Iobm9kZSksIHRhZyA9IF9hWzBdLCBpZCA9IF9hWzFdLCBjbHMgPSBfYVsyXTtcbiAgICAgICAgICAgIHZhciBzZWwgPSBcIlwiICsgdGFnICsgKGlkID8gJyMnICsgaWQgOiAnJykgKyAoY2xzID8gJy4nICsgY2xzLnJlcGxhY2UoLyAvLCAnLicpIDogJycpO1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBjaGlsZCA9IGFwaS5maXJzdENoaWxkKG5vZGUpOyBjaGlsZCAhPSBudWxsOyBjaGlsZCA9IGFwaS5uZXh0U2libGluZyhjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHJlYWQoY2hpbGQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2biA9IHZub2RlXzEudm5vZGUoc2VsLCB7fSwgY2hpbGRyZW4sIHVuZGVmaW5lZCwgbm9kZSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpXzIgPSAwOyBpXzIgPCBjYnMucmVhZC5sZW5ndGg7ICsraV8yKVxuICAgICAgICAgICAgICAgIGNicy5yZWFkW2lfMl0odm4pO1xuICAgICAgICAgICAgcmV0dXJuIHZuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFwaS5pc1RleHQobm9kZSkpIHtcbiAgICAgICAgICAgIHRleHQgPSBhcGkuZ2V0VGV4dENvbnRlbnQobm9kZSk7XG4gICAgICAgICAgICByZXR1cm4gdm5vZGVfMS52bm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0ZXh0LCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcGkuaXNDb21tZW50KG5vZGUpKSB7XG4gICAgICAgICAgICB0ZXh0ID0gYXBpLmdldFRleHRDb250ZW50KG5vZGUpO1xuICAgICAgICAgICAgcmV0dXJuIHZub2RlXzEudm5vZGUoJyEnLCB7fSwgW10sIHRleHQsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZub2RlXzEudm5vZGUoJycsIHt9LCBbXSwgdW5kZWZpbmVkLCBub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyByZWFkOiByZWFkLCBwYXRjaDogcGF0Y2ggfTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zbmFiYmRvbS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIHZub2RlKHNlbCwgZGF0YSwgY2hpbGRyZW4sIHRleHQsIGVsbSkge1xuICAgIHZhciBrZXkgPSBkYXRhID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBkYXRhLmtleTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZWw6IHNlbCwgZGF0YTogZGF0YSwgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgICAgICB0ZXh0OiB0ZXh0LCBlbG06IGVsbSwga2V5OiBrZXlcbiAgICB9O1xufVxuZXhwb3J0cy52bm9kZSA9IHZub2RlO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm5vZGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD12bm9kZS5qcy5tYXAiXX0=
