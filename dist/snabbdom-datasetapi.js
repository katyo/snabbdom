(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom_datasetapi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvZGF0YXNldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ0FQU19SRUdFWCA9IC9bQS1aXS9nO1xuZnVuY3Rpb24gdG9LZXkoa2V5KSB7XG4gICAgcmV0dXJuIGtleS5yZXBsYWNlKENBUFNfUkVHRVgsICctJCYnKS50b0xvd2VyQ2FzZSgpO1xufVxuZnVuY3Rpb24gbGlzdERhdGFzKGVsbSkge1xuICAgIHZhciBkID0gZWxtLmRhdGFzZXQ7XG4gICAgaWYgKGQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBlbG0uYXR0cmlidXRlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IGF0dHJpYnV0ZXNbaV0ubm9kZU5hbWU7XG4gICAgICAgICAgICBpZiAoa2V5Lmxlbmd0aCA+IDUgJiYga2V5WzRdID09ICctJyAmJiBrZXlbMF0gPT0gJ2QnICYmIGtleVsxXSA9PSAnYScgJiYga2V5WzJdID09ICd0JyAmJiBrZXlbM10gPT0gJ2EnKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKGtleS5zbGljZSg1KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0RGF0YShlbG0sIGtleSkge1xuICAgIHZhciBkID0gZWxtLmRhdGFzZXQ7XG4gICAgcmV0dXJuIChkID8gZFtrZXldIDogZWxtLmdldEF0dHJpYnV0ZShcImRhdGEtXCIgKyBrZXkpKTtcbn1cbmZ1bmN0aW9uIHNldERhdGEoZWxtLCBrZXksIHZhbCkge1xuICAgIHZhciBkID0gZWxtLmRhdGFzZXQ7XG4gICAgaWYgKGQpIHtcbiAgICAgICAgZFtrZXldID0gdmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZWxtLnNldEF0dHJpYnV0ZShcImRhdGEtXCIgKyB0b0tleShrZXkpLCB2YWwpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZURhdGEoZWxtLCBrZXkpIHtcbiAgICB2YXIgZCA9IGVsbS5kYXRhc2V0O1xuICAgIGlmIChkKSB7XG4gICAgICAgIGlmIChrZXkgaW4gZCkge1xuICAgICAgICAgICAgZGVsZXRlIGRba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZWxtLnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtXCIgKyB0b0tleShrZXkpKTtcbiAgICB9XG59XG5leHBvcnRzLmRhdGFzZXRBcGkgPSB7IGxpc3REYXRhczogbGlzdERhdGFzLCBnZXREYXRhOiBnZXREYXRhLCBzZXREYXRhOiBzZXREYXRhLCByZW1vdmVEYXRhOiByZW1vdmVEYXRhIH07XG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLmRhdGFzZXRBcGk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhc2V0LmpzLm1hcCJdfQ==
