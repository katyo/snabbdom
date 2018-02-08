(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom_domapi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvZG9tYXBpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBpbnNlcnRDaGlsZChwYXJlbnROb2RlLCBuZXdOb2RlLCByZWZlcmVuY2VOb2RlKSB7XG4gICAgaWYgKHJlZmVyZW5jZU5vZGUpIHtcbiAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgcmVmZXJlbmNlTm9kZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKG5ld05vZGUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZUNoaWxkKG5vZGUsIGNoaWxkKSB7XG4gICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZCk7XG59XG5mdW5jdGlvbiBwYXJlbnROb2RlKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5wYXJlbnROb2RlO1xufVxuZnVuY3Rpb24gZmlyc3RDaGlsZChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuZmlyc3RDaGlsZDtcbn1cbmZ1bmN0aW9uIG5leHRTaWJsaW5nKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5uZXh0U2libGluZztcbn1cbmZ1bmN0aW9uIGdldFNlbGVjdG9yKGVsbSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIGVsbS50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgIGVsbS5nZXRBdHRyaWJ1dGUoJ2lkJykgfHwgdW5kZWZpbmVkLFxuICAgICAgICBlbG0uZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8IHVuZGVmaW5lZCxcbiAgICBdO1xufVxuZnVuY3Rpb24gc2V0VGV4dENvbnRlbnQobm9kZSwgdGV4dCkge1xuICAgIG5vZGUudGV4dENvbnRlbnQgPSB0ZXh0O1xufVxuZnVuY3Rpb24gZ2V0VGV4dENvbnRlbnQobm9kZSkge1xuICAgIHJldHVybiBub2RlLnRleHRDb250ZW50O1xufVxuZnVuY3Rpb24gaXNFbGVtZW50KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gMTtcbn1cbmZ1bmN0aW9uIGlzVGV4dChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDM7XG59XG5mdW5jdGlvbiBpc0NvbW1lbnQobm9kZSkge1xuICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4O1xufVxuZnVuY3Rpb24gaHRtbERvbUFwaShkb2N1bWVudCkge1xuICAgIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodGFnLCBpZCwgY2xzLCBuc1VyaSkge1xuICAgICAgICB2YXIgZWxtID0gbnNVcmkgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnNVcmksIHRhZykgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgICAgIGlmIChpZClcbiAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuICAgICAgICBpZiAoY2xzKVxuICAgICAgICAgICAgZWxtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjbHMpO1xuICAgICAgICByZXR1cm4gZWxtO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVUZXh0Tm9kZSh0ZXh0KSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlQ29tbWVudCh0ZXh0KSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVDb21tZW50KHRleHQpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50LFxuICAgICAgICBjcmVhdGVUZXh0Tm9kZTogY3JlYXRlVGV4dE5vZGUsXG4gICAgICAgIGNyZWF0ZUNvbW1lbnQ6IGNyZWF0ZUNvbW1lbnQsXG4gICAgICAgIGluc2VydENoaWxkOiBpbnNlcnRDaGlsZCxcbiAgICAgICAgcmVtb3ZlQ2hpbGQ6IHJlbW92ZUNoaWxkLFxuICAgICAgICBwYXJlbnROb2RlOiBwYXJlbnROb2RlLFxuICAgICAgICBmaXJzdENoaWxkOiBmaXJzdENoaWxkLFxuICAgICAgICBuZXh0U2libGluZzogbmV4dFNpYmxpbmcsXG4gICAgICAgIGdldFNlbGVjdG9yOiBnZXRTZWxlY3RvcixcbiAgICAgICAgc2V0VGV4dENvbnRlbnQ6IHNldFRleHRDb250ZW50LFxuICAgICAgICBnZXRUZXh0Q29udGVudDogZ2V0VGV4dENvbnRlbnQsXG4gICAgICAgIGlzRWxlbWVudDogaXNFbGVtZW50LFxuICAgICAgICBpc1RleHQ6IGlzVGV4dCxcbiAgICAgICAgaXNDb21tZW50OiBpc0NvbW1lbnQsXG4gICAgfTtcbn1cbmV4cG9ydHMuaHRtbERvbUFwaSA9IGh0bWxEb21BcGk7XG5leHBvcnRzLmRlZmF1bHQgPSBodG1sRG9tQXBpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZG9tYXBpLmpzLm1hcCJdfQ==
