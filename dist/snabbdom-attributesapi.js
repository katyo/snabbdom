(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom_attributesapi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvYXR0cmlidXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHhsaW5rTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XG52YXIgeG1sTlMgPSAnaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlJztcbmZ1bmN0aW9uIGxpc3RBdHRycyhlbG0pIHtcbiAgICB2YXIgYXR0cmlidXRlcyA9IGVsbS5hdHRyaWJ1dGVzO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICB2YXIga2V5ID0gYXR0cmlidXRlc1tpXS5ub2RlTmFtZTtcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xufVxuZnVuY3Rpb24gZ2V0QXR0cihlbG0sIGtleSkge1xuICAgIHJldHVybiBlbG0uZ2V0QXR0cmlidXRlKGtleSk7XG59XG5mdW5jdGlvbiBzZXRBdHRyKGVsbSwga2V5LCB2YWwpIHtcbiAgICBpZiAodmFsID09PSB0cnVlKSB7XG4gICAgICAgIGVsbS5zZXRBdHRyaWJ1dGUoa2V5LCBcIlwiKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsID09PSBmYWxzZSkge1xuICAgICAgICBlbG0ucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoa2V5WzBdICE9ICd4Jykge1xuICAgICAgICAgICAgZWxtLnNldEF0dHJpYnV0ZShrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5WzNdID09ICc6Jykge1xuICAgICAgICAgICAgLy8gQXNzdW1lIHhtbCBuYW1lc3BhY2VcbiAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGVOUyh4bWxOUywga2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleVs1XSA9PSAnOicpIHtcbiAgICAgICAgICAgIC8vIEFzc3VtZSB4bGluayBuYW1lc3BhY2VcbiAgICAgICAgICAgIGVsbS5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCBrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbG0uc2V0QXR0cmlidXRlKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZUF0dHIoZWxtLCBrZXkpIHtcbiAgICBlbG0ucmVtb3ZlQXR0cmlidXRlKGtleSk7XG59XG5leHBvcnRzLmF0dHJpYnV0ZXNBcGkgPSB7IGxpc3RBdHRyczogbGlzdEF0dHJzLCBnZXRBdHRyOiBnZXRBdHRyLCBzZXRBdHRyOiBzZXRBdHRyLCByZW1vdmVBdHRyOiByZW1vdmVBdHRyIH07XG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLmF0dHJpYnV0ZXNBcGk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdHRyaWJ1dGVzLmpzLm1hcCJdfQ==
