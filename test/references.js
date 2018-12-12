var assert = require('assert');

var snabbdom = require('../snabbdom');
var vdom = snabbdom.init([
  require('../modules/references').default(document),
], document);
var read = vdom.read;
var patch = vdom.patch;
var h = require('../h').default;

describe('references', function() {
  var vnode0;
  beforeEach(function() {
    vnode0 = read(document.createElement('div'));
  });
  it('create back reference to root vnode', function() {
    var result = [];
    const ref = {};
    var vnode = h('div', {ref}, [
      h('span', 'Some text'),
    ]);
    assert.strictEqual(ref.vnode, undefined);
    patch(vnode0, vnode);
    assert.strictEqual(ref.vnode, vnode);
  });
  it('create back reference to child vnode', function() {
    var result = [];
    const ref = {};
    var vnode1;
    var vnode = h('div', [
      vnode1 = h('span', {ref:[ref, 'span']}, 'Some text'),
    ]);
    assert.strictEqual(ref.span, undefined);
    patch(vnode0, vnode);
    assert.strictEqual(ref.span, vnode1);
  });
  it('update back reference to root vnode', function() {
    var result = [];
    const ref = {};
    var vnode = h('div', {ref}, [
      h('span', 'Some text'),
    ]);
    patch(vnode0, vnode);
    var vnode1 = h('div', {ref}, [
      h('span', 'Some text'),
    ]);
    patch(vnode, vnode1);
    assert.strictEqual(ref.vnode, vnode1);
  });
  it('update back reference to sub vnode', function() {
    var result = [];
    const ref = {};
    var vnode = h('div', {ref:[ref, 'span']}, [
      h('span', 'Some text'),
    ]);
    patch(vnode0, vnode);
    var vnode2;
    var vnode1 = h('div', [
      vnode2 = h('span', {ref:[ref, 'span']}, 'Some text'),
    ]);
    patch(vnode, vnode1);
    assert.strictEqual(ref.span, vnode2);
  });
  it('remove back reference to root vnode', function() {
    var result = [];
    const ref = {};
    var vnode = h('div', {ref}, [
      h('span', 'Some text'),
    ]);
    patch(vnode0, vnode);
    var vnode1 = h('div', [
      h('span', 'Some text'),
    ]);
    patch(vnode, vnode1);
    assert.strictEqual(ref.vnode, undefined);
  });
  it('remove back reference to sub vnode', function() {
    var result = [];
    const ref = {};
    var vnode = h('div', {ref:[ref, 'span']}, [
      h('span', 'Some text'),
    ]);
    patch(vnode0, vnode);
    var vnode2;
    var vnode1 = h('div', [
      vnode2 = h('span', 'Some text'),
    ]);
    patch(vnode, vnode1);
    assert.strictEqual(ref.span, undefined);
  });
});
