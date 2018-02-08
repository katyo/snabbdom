(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom_class = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL2NsYXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGNsYXNzTW9kdWxlKGFwaSkge1xuICAgIGZ1bmN0aW9uIHVwZGF0ZUNsYXNzKG9sZFZub2RlLCB2bm9kZSkge1xuICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtO1xuICAgICAgICB2YXIgY3VyLCBuYW1lLCBvbGRDbGFzcyA9IG9sZFZub2RlLmRhdGEuY2xhc3MsIG5ld0NsYXNzID0gdm5vZGUuZGF0YS5jbGFzcztcbiAgICAgICAgaWYgKCFvbGRDbGFzcyAmJiAhbmV3Q2xhc3MpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChvbGRDbGFzcyA9PT0gbmV3Q2xhc3MpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIG9sZENsYXNzID0gb2xkQ2xhc3MgfHwge307XG4gICAgICAgIG5ld0NsYXNzID0gbmV3Q2xhc3MgfHwge307XG4gICAgICAgIGZvciAobmFtZSBpbiBvbGRDbGFzcykge1xuICAgICAgICAgICAgaWYgKCFuZXdDbGFzc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGFwaS5yZW1vdmVDbGFzcyhlbG0sIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobmFtZSBpbiBuZXdDbGFzcykge1xuICAgICAgICAgICAgY3VyID0gbmV3Q2xhc3NbbmFtZV07XG4gICAgICAgICAgICBpZiAoY3VyICE9PSBvbGRDbGFzc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgIGFwaVtjdXIgPyAnYWRkQ2xhc3MnIDogJ3JlbW92ZUNsYXNzJ10oZWxtLCBuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBjcmVhdGU6IHVwZGF0ZUNsYXNzLCB1cGRhdGU6IHVwZGF0ZUNsYXNzIH07XG59XG5leHBvcnRzLmNsYXNzTW9kdWxlID0gY2xhc3NNb2R1bGU7XG5leHBvcnRzLmRlZmF1bHQgPSBjbGFzc01vZHVsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNsYXNzLmpzLm1hcCJdfQ==
