(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom_style = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL3N0eWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIHN0eWxlTW9kdWxlKGFwaSkge1xuICAgIGZ1bmN0aW9uIHJlYWRTdHlsZSh2bm9kZSkge1xuICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtO1xuICAgICAgICB2YXIga2V5cyA9IGFwaS5saXN0U3R5bGUoZWxtKTtcbiAgICAgICAgdmFyIHN0eWxlID0ge307XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwga2V5c18xID0ga2V5czsgX2kgPCBrZXlzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c18xW19pXTtcbiAgICAgICAgICAgIHN0eWxlW2tleV0gPSBhcGkuZ2V0U3R5bGUoZWxtLCBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHZub2RlLmRhdGEuc3R5bGUgPSBzdHlsZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlU3R5bGUob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgICAgIHZhciBlbG0gPSB2bm9kZS5lbG07XG4gICAgICAgIHZhciBjdXIsIG5hbWUsIG9sZFN0eWxlID0gb2xkVm5vZGUuZGF0YS5zdHlsZSwgc3R5bGUgPSB2bm9kZS5kYXRhLnN0eWxlO1xuICAgICAgICBpZiAoIW9sZFN0eWxlICYmICFzdHlsZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKG9sZFN0eWxlID09PSBzdHlsZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb2xkU3R5bGUgPSBvbGRTdHlsZSB8fCB7fTtcbiAgICAgICAgc3R5bGUgPSBzdHlsZSB8fCB7fTtcbiAgICAgICAgdmFyIG9sZEhhc0RlbCA9ICdkZWxheWVkJyBpbiBvbGRTdHlsZTtcbiAgICAgICAgZm9yIChuYW1lIGluIG9sZFN0eWxlKSB7XG4gICAgICAgICAgICBpZiAoIXN0eWxlW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgYXBpLnJlbW92ZVN0eWxlKGVsbSwgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChuYW1lIGluIHN0eWxlKSB7XG4gICAgICAgICAgICBjdXIgPSBzdHlsZVtuYW1lXTtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnZGVsYXllZCcgJiYgc3R5bGUuZGVsYXllZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG5hbWUyIGluIHN0eWxlLmRlbGF5ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gc3R5bGUuZGVsYXllZFtuYW1lMl07XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2xkSGFzRGVsIHx8IGN1ciAhPT0gb2xkU3R5bGUuZGVsYXllZFtuYW1lMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zZXRTdHlsZShlbG0sIG5hbWUyLCBjdXIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobmFtZSAhPT0gJ3JlbW92ZScgJiYgY3VyICE9PSBvbGRTdHlsZVtuYW1lXSkge1xuICAgICAgICAgICAgICAgIGFwaS5zZXRTdHlsZShlbG0sIG5hbWUsIGN1cik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYXBwbHlEZXN0cm95U3R5bGUodm5vZGUpIHtcbiAgICAgICAgdmFyIGVsbSA9IHZub2RlLmVsbSwgcyA9IHZub2RlLmRhdGEuc3R5bGU7XG4gICAgICAgIHZhciBzdHlsZSwgbmFtZTtcbiAgICAgICAgaWYgKCFzIHx8ICEoc3R5bGUgPSBzLmRlc3Ryb3kpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBmb3IgKG5hbWUgaW4gc3R5bGUpIHtcbiAgICAgICAgICAgIGFwaS5zZXRTdHlsZShlbG0sIG5hbWUsIHN0eWxlW25hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBhcHBseVJlbW92ZVN0eWxlKHZub2RlLCBybSkge1xuICAgICAgICB2YXIgcyA9IHZub2RlLmRhdGEuc3R5bGU7XG4gICAgICAgIGlmICghcyB8fCAhcy5yZW1vdmUpIHtcbiAgICAgICAgICAgIHJtKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsbSA9IHZub2RlLmVsbSwgc3R5bGUgPSBzLnJlbW92ZSwgYXBwbGllZCA9IFtdO1xuICAgICAgICB2YXIgbmFtZTtcbiAgICAgICAgZm9yIChuYW1lIGluIHN0eWxlKSB7XG4gICAgICAgICAgICBhcHBsaWVkLnB1c2gobmFtZSk7XG4gICAgICAgICAgICBhcGkuc2V0U3R5bGUoZWxtLCBuYW1lLCBzdHlsZVtuYW1lXSk7XG4gICAgICAgIH1cbiAgICAgICAgYXBpLm9uVHJhbnNFbmQoZWxtLCBhcHBsaWVkLCBybSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlYWQ6IHJlYWRTdHlsZSxcbiAgICAgICAgY3JlYXRlOiB1cGRhdGVTdHlsZSxcbiAgICAgICAgdXBkYXRlOiB1cGRhdGVTdHlsZSxcbiAgICAgICAgZGVzdHJveTogYXBwbHlEZXN0cm95U3R5bGUsXG4gICAgICAgIHJlbW92ZTogYXBwbHlSZW1vdmVTdHlsZVxuICAgIH07XG59XG5leHBvcnRzLnN0eWxlTW9kdWxlID0gc3R5bGVNb2R1bGU7XG5leHBvcnRzLmRlZmF1bHQgPSBzdHlsZU1vZHVsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0eWxlLmpzLm1hcCJdfQ==
