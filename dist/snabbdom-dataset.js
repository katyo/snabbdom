(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snabbdom_dataset = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL2RhdGFzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gZGF0YXNldE1vZHVsZShhcGkpIHtcbiAgICBmdW5jdGlvbiByZWFkRGF0YXNldCh2bm9kZSkge1xuICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtLCBrZXlzID0gYXBpLmxpc3REYXRhcyhlbG0pLCBkYXRhcyA9IHt9O1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGtleXNfMSA9IGtleXM7IF9pIDwga2V5c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNfMVtfaV07XG4gICAgICAgICAgICBkYXRhc1trZXldID0gYXBpLmdldERhdGEoZWxtLCBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHZub2RlLmRhdGEuZGF0YXNldCA9IGRhdGFzO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1cGRhdGVEYXRhc2V0KG9sZFZub2RlLCB2bm9kZSkge1xuICAgICAgICB2YXIgZWxtID0gdm5vZGUuZWxtLCBvbGREYXRhc2V0ID0gb2xkVm5vZGUuZGF0YS5kYXRhc2V0LCBkYXRhc2V0ID0gdm5vZGUuZGF0YS5kYXRhc2V0LCBrZXk7XG4gICAgICAgIGlmICghb2xkRGF0YXNldCAmJiAhZGF0YXNldClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKG9sZERhdGFzZXQgPT09IGRhdGFzZXQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIG9sZERhdGFzZXQgPSBvbGREYXRhc2V0IHx8IHt9O1xuICAgICAgICBkYXRhc2V0ID0gZGF0YXNldCB8fCB7fTtcbiAgICAgICAgZm9yIChrZXkgaW4gb2xkRGF0YXNldCkge1xuICAgICAgICAgICAgaWYgKCFkYXRhc2V0W2tleV0pIHtcbiAgICAgICAgICAgICAgICBhcGkucmVtb3ZlRGF0YShlbG0sIGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChrZXkgaW4gZGF0YXNldCkge1xuICAgICAgICAgICAgaWYgKG9sZERhdGFzZXRba2V5XSAhPT0gZGF0YXNldFtrZXldKSB7XG4gICAgICAgICAgICAgICAgYXBpLnNldERhdGEoZWxtLCBrZXksIGRhdGFzZXRba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgcmVhZDogcmVhZERhdGFzZXQsIGNyZWF0ZTogdXBkYXRlRGF0YXNldCwgdXBkYXRlOiB1cGRhdGVEYXRhc2V0IH07XG59XG5leHBvcnRzLmRhdGFzZXRNb2R1bGUgPSBkYXRhc2V0TW9kdWxlO1xuZXhwb3J0cy5kZWZhdWx0ID0gZGF0YXNldE1vZHVsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGFzZXQuanMubWFwIl19
