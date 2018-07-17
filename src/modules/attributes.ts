import {VNode, emptyVData as empty} from '../vnode';
import {Module} from '../module';

export type AttrSome = string | number | boolean | null;
export type AttrNone = undefined;
export type AttrVal = AttrSome | AttrNone;

export type Attrs = Record<string, AttrVal>;

export interface VAttrsData {
  attrs?: Attrs;
}

function isSome(val: AttrVal): val is AttrSome {
  return val !== undefined;
}

export function attributesModule(ignore: RegExp = /^(?:(?:id|class|style)$|data\-)/): Module<VAttrsData> {
  function readAttrs(vnode: VNode<VAttrsData>) {
    const elm = vnode.elm as Element,
      keys = listAttrs(elm),
      attrs: Attrs = {};
    for (const key of keys) {
      if (!ignore.test(key)) {
        attrs[key] = getAttr(elm, key);
      }
    }
    (vnode.data as VAttrsData).attrs = attrs;
  }

  function updateAttrs(oldVnode: VNode<VAttrsData>, vnode: VNode<VAttrsData>) {
    const elm = vnode.elm as Element;
    let key: string,
      {attrs: oldAttrs} = oldVnode.data as VAttrsData,
      {attrs} = vnode.data as VAttrsData;

    if (!oldAttrs && !attrs) return;
    if (oldAttrs === attrs) return;
    oldAttrs = oldAttrs || empty;
    attrs = attrs || empty;

    // update modified attributes, add new attributes
    for (key in attrs) {
      const cur = attrs[key];
      if (isSome(cur) && oldAttrs[key] !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
      if (!isSome(attrs[key])) {
        removeAttr(elm, key);
      }
    }
  }

  return {read: readAttrs, create: updateAttrs, update: updateAttrs};
}

export default attributesModule;

// because those in TypeScript are too restrictive: https://github.com/Microsoft/TSJS-lib-generator/pull/237
declare global {
  interface Element {
    setAttribute(name: string, value: string | number | boolean | null): void;
    setAttributeNS(namespaceURI: string, qualifiedName: string, value: string | number | boolean | null): void;
  }
}

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';

function listAttrs(elm: Element): string[] {
  const {attributes} = elm;
  const keys: string[] = [];
  for (let i = 0, n = attributes.length; i < n; i++) {
    const key = attributes[i].nodeName;
    keys.push(key);
  }
  return keys;
}

function getAttr(elm: Element, key: string): AttrVal {
  return elm.getAttribute(key) as AttrVal;
}

function setAttr(elm: Element, key: string, val: AttrSome) {
  if (val === true) {
    elm.setAttribute(key, "");
  } else if (val === false) {
    elm.removeAttribute(key);
  } else {
    if (key[0] != 'x') {
      elm.setAttribute(key, val);
    } else if (key[3] == ':') {
      // Assume xml namespace
      elm.setAttributeNS(xmlNS, key, val);
    } else if (key[5] == ':') {
      // Assume xlink namespace
      elm.setAttributeNS(xlinkNS, key, val);
    } else {
      elm.setAttribute(key, val);
    }
  }
}

function removeAttr(elm: Element, key: string) {
  elm.removeAttribute(key);
}
