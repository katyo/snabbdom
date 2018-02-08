(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom_attributes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL2F0dHJpYnV0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBhdHRyaWJ1dGVzTW9kdWxlKGFwaSkge1xuICAgIGZ1bmN0aW9uIHJlYWRBdHRycyh2bm9kZSkge1xuICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtLCBrZXlzID0gYXBpLmxpc3RBdHRycyhlbG0pLCBhdHRycyA9IHt9O1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGtleXNfMSA9IGtleXM7IF9pIDwga2V5c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNfMVtfaV07XG4gICAgICAgICAgICBpZiAoa2V5ICE9ICdpZCcgJiYga2V5ICE9ICdjbGFzcycgJiZcbiAgICAgICAgICAgICAgICAhKGtleS5sZW5ndGggPiA1ICYmIGtleVs0XSA9PSAnLScgJiYga2V5WzBdID09ICdkJyAmJiBrZXlbMV0gPT0gJ2EnICYmIGtleVsyXSA9PSAndCcgJiYga2V5WzNdID09ICdhJykpIHtcbiAgICAgICAgICAgICAgICBhdHRyc1trZXldID0gYXBpLmdldEF0dHIoZWxtLCBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZub2RlLmRhdGEuYXR0cnMgPSBhdHRycztcbiAgICB9XG4gICAgZnVuY3Rpb24gdXBkYXRlQXR0cnMob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgICAgIHZhciBlbG0gPSB2bm9kZS5lbG07XG4gICAgICAgIHZhciBrZXksIG9sZEF0dHJzID0gb2xkVm5vZGUuZGF0YS5hdHRycywgYXR0cnMgPSB2bm9kZS5kYXRhLmF0dHJzO1xuICAgICAgICBpZiAoIW9sZEF0dHJzICYmICFhdHRycylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKG9sZEF0dHJzID09PSBhdHRycylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgb2xkQXR0cnMgPSBvbGRBdHRycyB8fCB7fTtcbiAgICAgICAgYXR0cnMgPSBhdHRycyB8fCB7fTtcbiAgICAgICAgLy8gdXBkYXRlIG1vZGlmaWVkIGF0dHJpYnV0ZXMsIGFkZCBuZXcgYXR0cmlidXRlc1xuICAgICAgICBmb3IgKGtleSBpbiBhdHRycykge1xuICAgICAgICAgICAgdmFyIGN1ciA9IGF0dHJzW2tleV07XG4gICAgICAgICAgICB2YXIgb2xkID0gb2xkQXR0cnNba2V5XTtcbiAgICAgICAgICAgIGlmIChvbGQgIT09IGN1cikge1xuICAgICAgICAgICAgICAgIGFwaS5zZXRBdHRyKGVsbSwga2V5LCBjdXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlbW92ZSByZW1vdmVkIGF0dHJpYnV0ZXNcbiAgICAgICAgLy8gdXNlIGBpbmAgb3BlcmF0b3Igc2luY2UgdGhlIHByZXZpb3VzIGBmb3JgIGl0ZXJhdGlvbiB1c2VzIGl0ICguaS5lLiBhZGQgZXZlbiBhdHRyaWJ1dGVzIHdpdGggdW5kZWZpbmVkIHZhbHVlKVxuICAgICAgICAvLyB0aGUgb3RoZXIgb3B0aW9uIGlzIHRvIHJlbW92ZSBhbGwgYXR0cmlidXRlcyB3aXRoIHZhbHVlID09IHVuZGVmaW5lZFxuICAgICAgICBmb3IgKGtleSBpbiBvbGRBdHRycykge1xuICAgICAgICAgICAgaWYgKCEoa2V5IGluIGF0dHJzKSkge1xuICAgICAgICAgICAgICAgIGFwaS5yZW1vdmVBdHRyKGVsbSwga2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyByZWFkOiByZWFkQXR0cnMsIGNyZWF0ZTogdXBkYXRlQXR0cnMsIHVwZGF0ZTogdXBkYXRlQXR0cnMgfTtcbn1cbmV4cG9ydHMuYXR0cmlidXRlc01vZHVsZSA9IGF0dHJpYnV0ZXNNb2R1bGU7XG5leHBvcnRzLmRlZmF1bHQgPSBhdHRyaWJ1dGVzTW9kdWxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXR0cmlidXRlcy5qcy5tYXAiXX0=
