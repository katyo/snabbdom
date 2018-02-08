(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom_styleapi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvc3R5bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHJhZiA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB8fCBzZXRUaW1lb3V0O1xuZnVuY3Rpb24gbmV4dEZyYW1lKGZuKSB7XG4gICAgcmFmKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmFmKGZuKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGxpc3RTdHlsZShlbG0pIHtcbiAgICB2YXIgc3R5bGUgPSBlbG0uc3R5bGU7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gc3R5bGUpIHtcbiAgICAgICAgaWYgKHN0eWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xufVxuZnVuY3Rpb24gZ2V0U3R5bGUoZWxtLCBuYW1lKSB7XG4gICAgcmV0dXJuIGVsbS5zdHlsZVtuYW1lXTtcbn1cbmZ1bmN0aW9uIHNldFN0eWxlKGVsbSwgbmFtZSwgdmFsLCBuZXh0KSB7XG4gICAgaWYgKG5leHQgPT09IHZvaWQgMCkgeyBuZXh0ID0gZmFsc2U7IH1cbiAgICB2YXIgZm4gPSBuYW1lWzBdID09PSAnLScgJiYgbmFtZVsxXSA9PT0gJy0nID9cbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWxtLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbCk7XG4gICAgICAgIH0gOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVsbS5zdHlsZVtuYW1lXSA9IHZhbDtcbiAgICB9O1xuICAgIGlmICghbmV4dCkge1xuICAgICAgICBmbigpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbmV4dEZyYW1lKGZuKTtcbiAgICB9XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZShlbG0sIG5hbWUpIHtcbiAgICBpZiAobmFtZVswXSA9PSAnLScgJiYgbmFtZVsxXSA9PSAnLScpIHtcbiAgICAgICAgZWxtLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZWxtLnN0eWxlW25hbWVdID0gJyc7XG4gICAgfVxufVxuZnVuY3Rpb24gb25UcmFuc0VuZChlbG0sIG5hbWVzLCBjYWxsYmFjaykge1xuICAgIHZhciBjb21wU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsbSk7XG4gICAgdmFyIHByb3BzID0gY29tcFN0eWxlWyd0cmFuc2l0aW9uLXByb3BlcnR5J10uc3BsaXQoJywgJyk7XG4gICAgdmFyIGFtb3VudCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAobmFtZXMuaW5kZXhPZihwcm9wc1tpXSkgIT09IC0xKVxuICAgICAgICAgICAgYW1vdW50Kys7XG4gICAgfVxuICAgIGVsbS5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgIGlmIChldi50YXJnZXQgPT09IGVsbSlcbiAgICAgICAgICAgIC0tYW1vdW50O1xuICAgICAgICBpZiAoYW1vdW50ID09PSAwKVxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuc3R5bGVBcGkgPSB7IGxpc3RTdHlsZTogbGlzdFN0eWxlLCBnZXRTdHlsZTogZ2V0U3R5bGUsIHNldFN0eWxlOiBzZXRTdHlsZSwgcmVtb3ZlU3R5bGU6IHJlbW92ZVN0eWxlLCBvblRyYW5zRW5kOiBvblRyYW5zRW5kIH07XG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLnN0eWxlQXBpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3R5bGUuanMubWFwIl19
