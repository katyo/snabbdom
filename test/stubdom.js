var assert = require('assert');
var shuffle = require('knuth-shuffle').knuthShuffle;

var snabbdom = require('../snabbdom');
var document = require('../stub').document;
var h = require('../h').default;
var vdom = snabbdom.init([], document);
var read = vdom.read;
var patch = vdom.patch;
var vnode = require('../vnode').default;

function prop(name) {
  return function(obj) {
    return obj[name];
  };
}

function map(fn, list) {
  var ret = [];
  for (var i = 0; i < list.length; ++i) {
    ret[i] = fn(list[i]);
  }
  return ret;
}

function inner(x) {
  return x.childNodes[0].textContent;
}

describe('stubdom', function() {
  var elm, vnode0;
  beforeEach(function() {
    elm = document.createElement('div');
    vnode0 = read(elm);
  });
  describe('hyperscript', function() {
    it('can create vnode with proper tag', function() {
      assert.equal(h('div').sel, 'div');
      assert.equal(h('a').sel, 'a');
    });
    it('can create vnode with children', function() {
      var vnode = h('div', [h('span#hello'), h('b.world')]);
      assert.equal(vnode.sel, 'div');
      assert.equal(vnode.children[0].sel, 'span#hello');
      assert.equal(vnode.children[1].sel, 'b.world');
    });
    it('can create vnode with one child vnode', function() {
      var vnode = h('div', h('span#hello'));
      assert.equal(vnode.sel, 'div');
      assert.equal(vnode.children[0].sel, 'span#hello');
    });
    it('can create vnode with props and one child vnode', function() {
      var vnode = h('div', {}, h('span#hello'));
      assert.equal(vnode.sel, 'div');
      assert.equal(vnode.children[0].sel, 'span#hello');
    });
    it('can create vnode with text content', function() {
      var vnode = h('a', ['I am a string']);
      assert.equal(vnode.children[0].text, 'I am a string');
    });
    it('can create vnode with text content in string', function() {
      var vnode = h('a', 'I am a string');
      assert.equal(vnode.text, 'I am a string');
    });
    it('can create vnode with props and text content in string', function() {
      var vnode = h('a', {}, 'I am a string');
      assert.equal(vnode.text, 'I am a string');
    });
    it('can create vnode for comment', function() {
      var vnode = h('!', 'test');
      assert.equal(vnode.sel, '!');
      assert.equal(vnode.text, 'test');
    });
  });
  describe('created element', function() {
    it('has tag', function() {
      elm = patch(vnode0, h('div')).elm;
      assert.equal(elm.tagName, 'DIV');
    });
    it('has different tag and id', function() {
      var elm = document.createElement('div');
      vnode0.elm.appendChild(elm);
      var vnode1 = h('span#id');
      elm = patch(read(elm), vnode1).elm;
      assert.equal(elm.tagName, 'SPAN');
      assert.equal(elm.id, 'id');
    });
    it('has id', function() {
      elm = patch(vnode0, h('div', [h('div#unique')])).elm;
      assert.equal(elm.firstChild.id, 'unique');
    });
    it('has correct namespace', function() {
      var SVGNamespace = 'http://www.w3.org/2000/svg';
      var XHTMLNamespace = 'http://www.w3.org/1999/xhtml';

      elm = patch(vnode0, h('div', [h('div', {ns: SVGNamespace})])).elm;
      assert.equal(elm.firstChild.namespaceURI, SVGNamespace);
      
      // verify that svg tag automatically gets svg namespace
      elm = patch(vnode0, h('svg', [
        h('foreignObject', [
          h('div', ['I am HTML embedded in SVG'])
        ])
      ])).elm;

      assert.equal(elm.namespaceURI, SVGNamespace);
      assert.equal(elm.firstChild.namespaceURI, SVGNamespace);
      //assert.equal(elm.firstChild.firstChild.namespaceURI, XHTMLNamespace);

      // verify that svg tag with extra selectors gets svg namespace
      elm = patch(vnode0, h('svg#some-id')).elm;
      assert.equal(elm.namespaceURI, SVGNamespace);

      // verify that non-svg tag beginning with 'svg' does NOT get namespace
      elm = patch(vnode0, h('svg-custom-el')).elm;
      assert.notEqual(elm.namespaceURI, SVGNamespace);
    });
    it('receives classes in selector', function() {
      elm = patch(vnode0, h('div', [h('i.am.a.class')])).elm;
      assert(elm.firstChild.class == 'am a class');
    });
    it('receives classes in selector when namespaced', function() {
      elm = patch(vnode0,
        h('svg', [
          h('g.am.a.class.too')
        ])
      ).elm;
      assert(elm.firstChild.class, 'am a class');
    });
    it('can create elements with text content', function() {
      elm = patch(vnode0, h('div', ['I am a string'])).elm;
      assert.equal(elm.childNodes.length, 1);
      assert.equal(elm.childNodes[0].textContent, 'I am a string');
    });
    it('can create elements with span and text content', function() {
      elm = patch(vnode0, h('a', [h('span'), 'I am a string'])).elm;
      assert.equal(elm.childNodes[0].tagName, 'SPAN');
      assert.equal(elm.childNodes[1].textContent, 'I am a string');
    });
    it('can create an element created inside an iframe', function(done) {
      // Only run if srcdoc is supported.
      var frame = document.createElement('iframe');
      if (typeof frame.srcdoc !== 'undefined') {
        frame.srcdoc = "<div>Thing 1</div>";
        frame.onload = function() {
          patch(read(frame.contentDocument.body.querySelector('div')), h('div', 'Thing 2'));
          assert.equal(frame.contentDocument.body.querySelector('div').textContent, 'Thing 2');
          frame.remove();
          done();
        };
        document.body.appendChild(frame);
      } else {
        done();
      }
    });
    it('is a patch of the root element', function () {
      var elmWithIdAndClass = document.createElement('div');
      elmWithIdAndClass.id = 'id';
      elmWithIdAndClass.class = 'class';
      elmWithIdAndClass['data-sel'] = '#.';
      var vnode1 = h('div#id.class', [h('span', 'Hi')]);
      elm = patch(read(elmWithIdAndClass), vnode1).elm;
      assert.strictEqual(elm, elmWithIdAndClass);
      assert.equal(elm.tagName, 'DIV');
      assert.equal(elm.id, 'id');
      assert.equal(elm.class, 'class');
    });
    it('can create comments', function() {
      elm = patch(vnode0, h('!', 'test')).elm;
      assert.equal(elm.nodeType, document.COMMENT_NODE);
      assert.equal(elm.textContent, 'test');
    });
  });
  describe('patching an element', function() {
    describe('using read()', function () {
      it('can remove previous children of the root element', function () {
        var h2 = document.createElement('h2');
        h2.textContent = 'Hello'
        var prevElm = document.createElement('div');
        prevElm.id = 'id';
        prevElm.class = 'class';
        prevElm['data-sel'] = '#.';
        prevElm.appendChild(h2);
        var nextVNode = h('div#id.class', [h('span', 'Hi')]);
        elm = patch(read(prevElm), nextVNode).elm;
        assert.strictEqual(elm, prevElm);
        assert.equal(elm.tagName, 'DIV');
        assert.equal(elm.id, 'id');
        assert.equal(elm.class, 'class');
        assert.strictEqual(elm.childNodes.length, 1);
        assert.strictEqual(elm.childNodes[0].tagName, 'SPAN');
        assert.strictEqual(elm.childNodes[0].childNodes.length, 1);
        assert.strictEqual(elm.childNodes[0].childNodes[0].textContent, 'Hi');
      });
      it('can support patching in a DocumentFragment', function () {
        var prevElm = document.createDocumentFragment();
        var nextVNode = vnode('', {}, [
          h('div#id.class', [h('span', 'Hi')])
        ], undefined, prevElm);
        elm = patch(read(prevElm), nextVNode).elm;
        assert.strictEqual(elm, prevElm);
        assert.equal(elm.nodeType, 11);
        assert.equal(elm.childNodes.length, 1);
        assert.equal(elm.childNodes[0].tagName, 'DIV');
        assert.equal(elm.childNodes[0].id, 'id');
        assert.equal(elm.childNodes[0].class, 'class');
        assert.strictEqual(elm.childNodes[0].childNodes.length, 1);
        assert.strictEqual(elm.childNodes[0].childNodes[0].tagName, 'SPAN');
        assert.strictEqual(elm.childNodes[0].childNodes[0].childNodes.length, 1);
        assert.strictEqual(elm.childNodes[0].childNodes[0].childNodes[0].textContent, 'Hi');
      });
      it('can remove some children of the root element', function () {
        var h2 = document.createElement('h2');
        h2.textContent = 'Hello'
        var prevElm = document.createElement('div');
        prevElm.id = 'id';
        prevElm.class = 'class';
        prevElm['data-sel'] = '#.';
        var text = document.createTextNode('Foobar');
        text.testProperty = function () {}; // ensures we dont recreate the Text Node
        prevElm.appendChild(text);
        prevElm.appendChild(h2);
        var nextVNode = h('div#id.class', ['Foobar']);
        elm = patch(read(prevElm), nextVNode).elm;
        assert.strictEqual(elm, prevElm);
        assert.equal(elm.tagName, 'DIV');
        assert.equal(elm.id, 'id');
        assert.equal(elm.class, 'class');
        assert.strictEqual(elm.childNodes.length, 1);
        assert.strictEqual(elm.childNodes[0].nodeType, 3);
        assert.strictEqual(elm.childNodes[0].textContent, 'Foobar');
        assert.strictEqual(typeof elm.childNodes[0].testProperty, 'function');
      });
      it('can remove text elements', function () {
        var h2 = document.createElement('h2');
        h2.textContent = 'Hello'
        var prevElm = document.createElement('div');
        prevElm.id = 'id';
        prevElm.class = 'class';
        prevElm['data-sel'] = '#.';
        var text = document.createTextNode('Foobar');
        prevElm.appendChild(text);
        prevElm.appendChild(h2);
        var nextVNode = h('div#id.class', [h('h2', 'Hello')]);
        elm = patch(read(prevElm), nextVNode).elm;
        assert.strictEqual(elm, prevElm);
        assert.equal(elm.tagName, 'DIV');
        assert.equal(elm.id, 'id');
        assert.equal(elm.class, 'class');
        assert.strictEqual(elm.childNodes.length, 1);
        assert.strictEqual(elm.childNodes[0].nodeType, 1);
        assert.strictEqual(elm.childNodes[0].textContent, 'Hello');
      });
    });
    describe('updating children with keys', function() {
      function spanNum(n) {
        if (n == null) {
          return n;
        } else if (typeof n === 'string') {
          return h('span', {}, n);
        } else {
          return h('span', {key: n}, n.toString());
        }
      }
      describe('addition of elements', function() {
        it('appends elements', function() {
          var vnode1 = h('span', [1].map(spanNum));
          var vnode2 = h('span', [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 1);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 3);
          assert.equal(elm.childNodes[1].childNodes[0].textContent, '2');
          assert.equal(elm.childNodes[2].childNodes[0].textContent, '3');
        });
        it('prepends elements', function() {
          var vnode1 = h('span', [4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 2);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.childNodes), ['1', '2', '3', '4', '5']);
        });
        it('add elements in the middle', function() {
          var vnode1 = h('span', [1, 2, 4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 4);
          assert.equal(elm.childNodes.length, 4);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.childNodes), ['1', '2', '3', '4', '5']);
        });
        it('add elements at begin and end', function() {
          var vnode1 = h('span', [2, 3, 4].map(spanNum));
          var vnode2 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 3);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.childNodes), ['1', '2', '3', '4', '5']);
        });
        it('adds children to parent with no children', function() {
          var vnode1 = h('span', {key: 'span'});
          var vnode2 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 0);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.childNodes), ['1', '2', '3']);
        });
        it('removes all children from parent', function() {
          var vnode1 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
          var vnode2 = h('span', {key: 'span'});
          elm = patch(vnode0, vnode1).elm;
          assert.deepEqual(map(inner, elm.childNodes), ['1', '2', '3']);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 0);
        });
        it('update one child with same key but different sel', function() {
          var vnode1 = h('span', {key: 'span'}, [1, 2, 3].map(spanNum));
          var vnode2 = h('span', {key: 'span'}, [spanNum(1), h('i', {key: 2}, '2'), spanNum(3)]);
          elm = patch(vnode0, vnode1).elm;
          assert.deepEqual(map(inner, elm.childNodes), ['1', '2', '3']);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.childNodes), ['1', '2', '3']);
          assert.equal(elm.childNodes.length, 3);
          assert.equal(elm.childNodes[1].tagName, 'I');
        });
      });
      describe('removal of elements', function() {
        it('removes elements from the beginning', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [3, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 5);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.childNodes), ['3', '4', '5']);
        });
        it('removes elements from the end', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 5);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 3);
          assert.deepEqual(map(inner, elm.childNodes), ['1', '2', '3']);
        });
        it('removes elements from the middle', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [1, 2, 4, 5].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 5);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 4);
          assert.deepEqual(map(inner, elm.childNodes), ['1', '2', '4', '5']);
        });
      });
      describe('element reordering', function() {
        it('moves element forward', function() {
          var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          var vnode2 = h('span', [2, 3, 1, 4].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 4);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 4);
          assert.deepEqual(map(inner, elm.childNodes), ['2', '3', '1', '4']);
        });
        it('moves element to end', function() {
          var vnode1 = h('span', [1, 2, 3].map(spanNum));
          var vnode2 = h('span', [2, 3, 1].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 3);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 3);
          assert.deepEqual(map(inner, elm.childNodes), ['2', '3', '1']);
        });
        it('moves element backwards', function() {
          var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          var vnode2 = h('span', [1, 4, 2, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 4);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 4);
          assert.deepEqual(map(inner, elm.childNodes), ['1', '4', '2', '3']);
        });
        it('swaps first and last', function() {
          var vnode1 = h('span', [1, 2, 3, 4].map(spanNum));
          var vnode2 = h('span', [4, 2, 3, 1].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 4);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 4);
          assert.deepEqual(map(inner, elm.childNodes), ['4', '2', '3', '1']);
        });
      });
      describe('combinations of additions, removals and reorderings', function() {
        it('move to left and replace', function() {
          var vnode1 = h('span', [1, 2, 3, 4, 5].map(spanNum));
          var vnode2 = h('span', [4, 1, 2, 3, 6].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 5);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 5);
          assert.deepEqual(map(inner, elm.childNodes), ['4', '1', '2', '3', '6']);
        });
        it('moves to left and leaves hole', function() {
          var vnode1 = h('span', [1, 4, 5].map(spanNum));
          var vnode2 = h('span', [4, 6].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 3);
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.childNodes), ['4', '6']);
        });
        it('handles moved and set to undefined element ending at the end', function() {
          var vnode1 = h('span', [2, 4, 5].map(spanNum));
          var vnode2 = h('span', [4, 5, 3].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 3);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 3);
          assert.deepEqual(map(inner, elm.childNodes), ['4', '5', '3']);
        });
        it('moves a key in non-keyed nodes with a size up', function() {
          var vnode1 = h('span', [1, 'a', 'b', 'c'].map(spanNum));
          var vnode2 = h('span', ['d', 'a', 'b', 'c', 1, 'e'].map(spanNum));
          elm = patch(vnode0, vnode1).elm;
          assert.equal(elm.childNodes.length, 4);
          assert.deepEqual(map(inner, elm.childNodes), ['1', 'a', 'b', 'c']);
          elm = patch(vnode1, vnode2).elm;
          assert.equal(elm.childNodes.length, 6);
          assert.deepEqual(map(inner, elm.childNodes), ['d', 'a', 'b', 'c', '1', 'e']);
        });
      });
      it('reverses elements', function() {
        var vnode1 = h('span', [1, 2, 3, 4, 5, 6, 7, 8].map(spanNum));
        var vnode2 = h('span', [8, 7, 6, 5, 4, 3, 2, 1].map(spanNum));
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes.length, 8);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['8', '7', '6', '5', '4', '3', '2', '1']);
      });
      it('something', function() {
        var vnode1 = h('span', [0, 1, 2, 3, 4, 5].map(spanNum));
        var vnode2 = h('span', [4, 3, 2, 1, 5, 0].map(spanNum));
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes.length, 6);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['4', '3', '2', '1', '5', '0']);
      });
      it('supports null/undefined children', function() {
        var vnode1 = h('i', [0, 1, 2, 3, 4, 5].map(spanNum));
        var vnode2 = h('i', [null, 2, undefined, null, 1, 0, null, 5, 4, null, 3, undefined].map(spanNum));
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes.length, 6);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['2', '1', '0', '5', '4', '3']);
      });
      it('supports all null/undefined children', function() {
        var vnode1 = h('i', [0, 1, 2, 3, 4, 5].map(spanNum));
        var vnode2 = h('i', [null, null, undefined, null, null, undefined]);
        var vnode3 = h('i', [5, 4, 3, 2, 1, 0].map(spanNum));
        patch(vnode0, vnode1);
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes.length, 0);
        elm = patch(vnode2, vnode3).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['5', '4', '3', '2', '1', '0']);
      });
      it('handles random shuffles with null/undefined children', function() {
        var i, j, r, len, arr, maxArrLen = 15, samples = 5, vnode1 = vnode0, vnode2;
        for (i = 0; i < samples; ++i, vnode1 = vnode2) {
          len = Math.floor(Math.random() * maxArrLen);
          arr = [];
          for (j = 0; j < len; ++j) {
            if ((r = Math.random()) < 0.5) arr[j] = String(j);
            else if (r < 0.75) arr[j] = null;
            else arr[j] = undefined;
          }
          shuffle(arr);
          vnode2 = h('div', arr.map(spanNum));
          elm = patch(vnode1, vnode2).elm;
          assert.deepEqual(map(inner, elm.childNodes), arr.filter(function(x) {return x != null;}));
        }
      });
    });
    describe('updating children without keys', function() {
      it('appends elements', function() {
        var vnode1 = h('div', [h('span', 'Hello')]);
        var vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['Hello']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['Hello', 'World']);
      });
      it('handles unmoved text nodes', function() {
        var vnode1 = h('div', ['Text', h('span', 'Span')]);
        var vnode2 = h('div', ['Text', h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
      });
      it('handles changing text children', function() {
        var vnode1 = h('div', ['Text', h('span', 'Span')]);
        var vnode2 = h('div', ['Text2', h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text2');
      });
      it('handles unmoved comment nodes', function() {
        var vnode1 = h('div', [h('!', 'Text'), h('span', 'Span')]);
        var vnode2 = h('div', [h('!', 'Text'), h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
      });
      it('handles changing comment text', function() {
        var vnode1 = h('div', [h('!', 'Text'), h('span', 'Span')]);
        var vnode2 = h('div', [h('!', 'Text2'), h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Text2');
      });
      it('handles changing empty comment', function() {
        var vnode1 = h('div', [h('!'), h('span', 'Span')]);
        var vnode2 = h('div', [h('!', 'Test'), h('span', 'Span')]);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes[0].textContent, '');
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes[0].textContent, 'Test');
      });
      it('prepends element', function() {
        var vnode1 = h('div', [h('span', 'World')]);
        var vnode2 = h('div', [h('span', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['World']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['Hello', 'World']);
      });
      it('prepends element of different tag type', function() {
        var vnode1 = h('div', [h('span', 'World')]);
        var vnode2 = h('div', [h('div', 'Hello'), h('span', 'World')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['World']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(prop('tagName'), elm.childNodes), ['DIV', 'SPAN']);
        assert.deepEqual(map(inner, elm.childNodes), ['Hello', 'World']);
      });
      it('removes elements', function() {
        var vnode1 = h('div', [h('span', 'One'), h('span', 'Two'), h('span', 'Three')]);
        var vnode2 = h('div', [h('span', 'One'), h('span', 'Three')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['One', 'Two', 'Three']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['One', 'Three']);
      });
      it('removes a single text node', function() {
        var vnode1 = h('div', 'One');
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        assert.equal(elm.textContent, 'One');
        patch(vnode1, vnode2);
        assert.equal(elm.textContent, '');
      });
      it('removes a single text node when children are updated', function() {
        var vnode1 = h('div', 'One');
        var vnode2 = h('div', [ h('div', 'Two'), h('span', 'Three') ]);
        patch(vnode0, vnode1);
        assert.equal(elm.textContent, 'One');
        patch(vnode1, vnode2);
        assert.deepEqual(map(prop('textContent'), elm.childNodes), ['Two', 'Three']);
      });
      it('removes a text node among other elements', function() {
        var vnode1 = h('div', [ 'One', h('span', 'Two') ]);
        var vnode2 = h('div', [ h('div', 'Three')]);
        patch(vnode0, vnode1);
        assert.deepEqual(map(prop('textContent'), elm.childNodes), ['One', 'Two']);
        patch(vnode1, vnode2);
        assert.equal(elm.childNodes.length, 1);
        assert.equal(elm.childNodes[0].tagName, 'DIV');
        assert.equal(elm.childNodes[0].textContent, 'Three');
      });
      it('reorders elements', function() {
        var vnode1 = h('div', [h('span', 'One'), h('div', 'Two'), h('b', 'Three')]);
        var vnode2 = h('div', [h('b', 'Three'), h('span', 'One'), h('div', 'Two')]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['One', 'Two', 'Three']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(prop('tagName'), elm.childNodes), ['B', 'SPAN', 'DIV']);
        assert.deepEqual(map(inner, elm.childNodes), ['Three', 'One', 'Two']);
      });
      it('supports null/undefined children', function() {
        var vnode1 = h('i', [null, h('i', '1'), h('i', '2'), null]);
        var vnode2 = h('i', [h('i', '2'), undefined, undefined, h('i', '1'), undefined]);
        var vnode3 = h('i', [null, h('i', '1'), undefined, null, h('i', '2'), undefined, null]);
        elm = patch(vnode0, vnode1).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['1', '2']);
        elm = patch(vnode1, vnode2).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['2', '1']);
        elm = patch(vnode2, vnode3).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['1', '2']);
      });
      it('supports all null/undefined children', function() {
        var vnode1 = h('i', [h('i', '1'), h('i', '2')]);
        var vnode2 = h('i', [null, undefined]);
        var vnode3 = h('i', [h('i', '2'), h('i', '1')]);
        patch(vnode0, vnode1);
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes.length, 0);
        elm = patch(vnode2, vnode3).elm;
        assert.deepEqual(map(inner, elm.childNodes), ['2', '1']);
      });
    });
  });
  describe('hooks', function() {
    describe('element hooks', function() {
      it('calls `create` listener before inserted into parent but after children', function() {
        var result = [];
        function cb(empty, vnode) {
          assert.equal(vnode.elm.nodeType, document.ELEMENT_NODE);
          assert.equal(vnode.elm.childNodes.length, 2);
          assert.equal(vnode.elm.parentNode, null);
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {create: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
          h('span', 'Can\'t touch me'),
        ]);
        patch(vnode0, vnode1);
        assert.equal(1, result.length);
      });
      it('calls `insert` listener after both parents, siblings and children have been inserted', function() {
        var result = [];
        function cb(vnode) {
          assert.equal(vnode.elm.nodeType, document.ELEMENT_NODE);
          assert.equal(vnode.elm.childNodes.length, 2);
          assert.equal(vnode.elm.parentNode.childNodes.length, 3);
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {insert: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
          h('span', 'Can touch me'),
        ]);
        patch(vnode0, vnode1);
        assert.equal(1, result.length);
      });
      it('calls `prepatch` listener', function() {
        var result = [];
        function cb(oldVnode, vnode) {
          assert.strictEqual(oldVnode, vnode1.children[1]);
          assert.strictEqual(vnode, vnode2.children[1]);
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(result.length, 1);
      });
      it('calls `postpatch` after `prepatch` listener', function() {
        var pre = [], post = [];
        function preCb(oldVnode, vnode) {
          pre.push(pre);
        }
        function postCb(oldVnode, vnode) {
          assert.equal(pre.length, post.length + 1);
          post.push(post);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {prepatch: preCb, postpatch: postCb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(pre.length, 1);
        assert.equal(post.length, 1);
      });
      it('calls `update` listener', function() {
        var result1 = [];
        var result2 = [];
        function cb(result, oldVnode, vnode) {
          if (result.length > 0) {
            assert.strictEqual(result[result.length-1], oldVnode);
          }
          result.push(vnode);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {update: cb.bind(null, result1)}}, [
            h('span', 'Child 1'),
            h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {update: cb.bind(null, result1)}}, [
            h('span', 'Child 1'),
            h('span', {hook: {update: cb.bind(null, result2)}}, 'Child 2'),
          ]),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(result1.length, 1);
        assert.equal(result2.length, 1);
      });
      it('calls `remove` listener', function() {
        var result = [];
        function cb(vnode, rm) {
          var parent = vnode.elm.parentNode;
          assert.equal(vnode.elm.nodeType, document.ELEMENT_NODE);
          assert.equal(vnode.elm.childNodes.length, 2);
          assert.equal(parent.childNodes.length, 2);
          result.push(vnode);
          rm();
          assert.equal(parent.childNodes.length, 1);
        }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', {hook: {remove: cb}}, [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div', [
          h('span', 'First sibling'),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(1, result.length);
      });
      it('calls `init` and `prepatch` listeners on root', function() {
          var count = 0;
          function init(vnode) {
            assert.strictEqual(vnode, vnode2);
            count += 1;
          }
          function prepatch(oldVnode, vnode) {
            assert.strictEqual(vnode, vnode1);
            count += 1;
          }
          var vnode1 = h('div', {hook: {init: init, prepatch: prepatch}});
          patch(vnode0, vnode1);
          assert.equal(1, count);
          var vnode2 = h('span', {hook: {init: init, prepatch: prepatch}});
          patch(vnode1, vnode2);
          assert.equal(2, count);
      });
      it('removes element when all remove listeners are done', function() {
        var rm1, rm2, rm3;
        var patch = snabbdom.init([
          {remove: function(_, rm) { rm1 = rm; }},
          {remove: function(_, rm) { rm2 = rm; }},
        ], document).patch;
        var vnode1 = h('div', [h('a', {hook: {remove: function(_, rm) { rm3 = rm; }}})]);
        var vnode2 = h('div', []);
        elm = patch(vnode0, vnode1).elm;
        assert.equal(elm.childNodes.length, 1);
        elm = patch(vnode1, vnode2).elm;
        assert.equal(elm.childNodes.length, 1);
        rm1();
        assert.equal(elm.childNodes.length, 1);
        rm3();
        assert.equal(elm.childNodes.length, 1);
        rm2();
        assert.equal(elm.childNodes.length, 0);
      });
      it('invokes remove hook on replaced root', function() {
        var result = [];
        var parent = document.createElement('div');
        var vnode0 = read(document.createElement('div'));
        parent.appendChild(vnode0.elm);
        function cb(vnode, rm) {
          result.push(vnode);
          rm();
        }
        var vnode1 = h('div', {hook: {remove: cb}}, [
          h('b', 'Child 1'),
          h('i', 'Child 2'),
        ]);
        var vnode2 = h('span', [
          h('b', 'Child 1'),
          h('i', 'Child 2'),
        ]);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(1, result.length);
      });
    });
    describe('module hooks', function() {
      it('invokes `pre` and `post` hook', function() {
        var result = [];
        var patch = snabbdom.init([
          {pre: function() { result.push('pre'); }},
          {post: function() { result.push('post'); }},
        ], document).patch;
        var vnode1 = h('div');
        patch(vnode0, vnode1);
        assert.deepEqual(result, ['pre', 'post']);
      });
      it('invokes global `destroy` hook for all removed children', function() {
        var result = [];
        function cb(vnode) { result.push(vnode); }
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', [
            h('span', {hook: {destroy: cb}}, 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(result.length, 1);
      });
      it('handles text vnodes with `undefined` `data` property', function() {
        var vnode1 = h('div', [
          ' '
        ]);
        var vnode2 = h('div', []);
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
      });
      it('invokes `destroy` module hook for all removed children', function() {
        var created = 0;
        var destroyed = 0;
        var patch = snabbdom.init([
          {create: function() { created++; }},
          {destroy: function() { destroyed++; }},
        ], document).patch;
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', [
            h('span', 'Child 1'),
            h('span', 'Child 2'),
          ]),
        ]);
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(created, 4);
        assert.equal(destroyed, 4);
      });
      it('does not invoke `create` and `remove` module hook for text nodes', function() {
        var created = 0;
        var removed = 0;
        var patch = snabbdom.init([
          {create: function() { created++; }},
          {remove: function() { removed++; }},
        ], document).patch;
        var vnode1 = h('div', [
          h('span', 'First child'),
          '',
          h('span', 'Third child'),
        ]);
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(created, 2);
        assert.equal(removed, 2);
      });
      it('does not invoke `destroy` module hook for text nodes', function() {
        var created = 0;
        var destroyed = 0;
        var patch = snabbdom.init([
          {create: function() { created++; }},
          {destroy: function() { destroyed++; }},
        ], document).patch;
        var vnode1 = h('div', [
          h('span', 'First sibling'),
          h('div', [
            h('span', 'Child 1'),
            h('span', ['Text 1', 'Text 2']),
          ]),
        ]);
        var vnode2 = h('div');
        patch(vnode0, vnode1);
        patch(vnode1, vnode2);
        assert.equal(created, 4);
        assert.equal(destroyed, 4);
      });
    });
  });
  describe('short circuiting', function() {
    it('does not update strictly equal vnodes', function() {
      var result = [];
      function cb(vnode) { result.push(vnode); }
      var vnode1 = h('div', [
        h('span', {hook: {update: cb}}, 'Hello'),
        h('span', 'there'),
      ]);
      patch(vnode0, vnode1);
      patch(vnode1, vnode1);
      assert.equal(result.length, 0);
    });
    it('does not update strictly equal children', function() {
      var result = [];
      function cb(vnode) { result.push(vnode); }
      var vnode1 = h('div', [
        h('span', {hook: {patch: cb}}, 'Hello'),
        h('span', 'there'),
      ]);
      var vnode2 = h('div');
      vnode2.children = vnode1.children;
      patch(vnode0, vnode1);
      patch(vnode1, vnode2);
      assert.equal(result.length, 0);
    });
  });

  describe('vnodes reusing', function() {
    it('moving backward', function() {
      var sharedNode = h('div', {}, 'Selected');
      var vnode1 = h('div', [
        h('div', {}, ['One']),
        h('div', {}, ['Two']),
        h('div', {}, [sharedNode]),
      ]);
      patch(vnode0, vnode1);
      var vnode2 = h('div', [
        h('div', {}, ['One']),
        h('div', {}, [sharedNode]),
        h('div', {}, ['Three']),
      ]);
      patch(vnode1, vnode2);
    });
  });
  
  describe('html rendering', function() {
    var renderer = require('../html');
    var render = renderer.init([]);

    it('can render single node', function() {
      var str = renderer.stringWriter();
      var elm = h('p', 'Hello world');
      render(elm, str);
      assert.equal(str.str, '<p>Hello world</p>');
    });

    it('can render multiple nodes', function() {
      var str = renderer.stringWriter();
      var elm = h('div', [
        h('h2', 'Heading'),
        '\n',
        h('p', [
          'Hello ',
          h('span', 'there')
        ]),
        ' ',
      ]);
      render(elm, str);
      assert.equal(str.str, '<div><h2>Heading</h2>\n<p>Hello <span>there</span></p> </div>');
    });

    it('can escape text content', function() {
      var str = renderer.stringWriter();
      var elm = h('p', '<\'Hello\'&"world">');
      render(elm, str);
      assert.equal(str.str, "<p>&lt;'Hello'&amp;\"world\"&gt;</p>");
    });
  });
});
