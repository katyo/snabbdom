(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom_props = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL3Byb3BzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gcHJvcHNNb2R1bGUoYXBpKSB7XG4gICAgZnVuY3Rpb24gdXBkYXRlUHJvcHMob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgICAgIHZhciBlbG0gPSB2bm9kZS5lbG07XG4gICAgICAgIHZhciBrZXksIGN1ciwgb2xkLCBvbGRQcm9wcyA9IG9sZFZub2RlLmRhdGEucHJvcHMsIHByb3BzID0gdm5vZGUuZGF0YS5wcm9wcztcbiAgICAgICAgaWYgKCFvbGRQcm9wcyAmJiAhcHJvcHMpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChvbGRQcm9wcyA9PT0gcHJvcHMpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIG9sZFByb3BzID0gb2xkUHJvcHMgfHwge307XG4gICAgICAgIHByb3BzID0gcHJvcHMgfHwge307XG4gICAgICAgIGZvciAoa2V5IGluIG9sZFByb3BzKSB7XG4gICAgICAgICAgICBpZiAoIXByb3BzW2tleV0pIHtcbiAgICAgICAgICAgICAgICBhcGkucmVtb3ZlUHJvcChlbG0sIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChrZXkgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGN1ciA9IHByb3BzW2tleV07XG4gICAgICAgICAgICBvbGQgPSBvbGRQcm9wc1trZXldO1xuICAgICAgICAgICAgaWYgKG9sZCAhPT0gY3VyICYmIChrZXkgIT09ICd2YWx1ZScgfHwgYXBpLmdldFByb3AoZWxtLCBrZXkpICE9PSBjdXIpKSB7XG4gICAgICAgICAgICAgICAgYXBpLnNldFByb3AoZWxtLCBrZXksIGN1cik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgY3JlYXRlOiB1cGRhdGVQcm9wcywgdXBkYXRlOiB1cGRhdGVQcm9wcyB9O1xufVxuZXhwb3J0cy5wcm9wc01vZHVsZSA9IHByb3BzTW9kdWxlO1xuZXhwb3J0cy5kZWZhdWx0ID0gcHJvcHNNb2R1bGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcm9wcy5qcy5tYXAiXX0=
