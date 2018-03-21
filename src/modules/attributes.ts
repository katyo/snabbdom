import {VNode, emptyVData as empty} from '../vnode';
import {Module} from './module';

export type AttrSome = string | number | boolean | null;
export type AttrNone = undefined;
export type AttrVal = AttrSome | AttrNone;

export type Attrs = Record<string, AttrVal>;

export interface VAttrsData {
  attrs?: Attrs;
}

export interface AttrsAPI {
  listAttrs(elm: Node): string[];
  getAttr(elm: Node, key: string): AttrVal;
  setAttr(elm: Node, key: string, val: AttrSome): void;
  removeAttr(elm: Node, key: string): void;
}

function isSome(val: AttrVal): val is AttrSome {
  return val !== undefined;
}

export function attributesModule(api: AttrsAPI): Module<VAttrsData> {
  function readAttrs(vnode: VNode<VAttrsData>) {
    const elm = vnode.elm as Node,
      keys = api.listAttrs(elm),
      attrs: Attrs = {};
    for (const key of keys) {
      if (key != 'id' && key != 'class' &&
        !(key.length > 5 && key[4] == '-' && key[0] == 'd' && key[1] == 'a' && key[2] == 't' && key[3] == 'a')) {
        attrs[key] = api.getAttr(elm, key);
      }
    }
    (vnode.data as VAttrsData).attrs = attrs;
  }

  function updateAttrs(oldVnode: VNode<VAttrsData>, vnode: VNode<VAttrsData>) {
    const elm = vnode.elm as Node;
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
        api.setAttr(elm, key, cur);
      }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
      if (!isSome(attrs[key])) {
        api.removeAttr(elm, key);
      }
    }
  }

  return {read: readAttrs, create: updateAttrs, update: updateAttrs};
}

export default attributesModule;
