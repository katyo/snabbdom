import {VNode} from '../vnode';
import {Module} from './module';

export type Attrs = Record<string, string | number | boolean>;

export interface VAttrsData {
  attrs?: Attrs;
}

export type AttrVal = string | number | boolean;

export interface AttrsAPI {
  setAttr(elm: Node, key: string, val: AttrVal): void;
  removeAttr(elm: Node, key: string): void;
}

export function attributesModule(api: AttrsAPI): Module<VAttrsData> {
  function updateAttrs(oldVnode: VNode<VAttrsData>, vnode: VNode<VAttrsData>): void {
    const elm = vnode.elm as Node;
    let key: string,
      {attrs: oldAttrs} = oldVnode.data as VAttrsData,
      {attrs} = vnode.data as VAttrsData;

    if (!oldAttrs && !attrs) return;
    if (oldAttrs === attrs) return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};

    // update modified attributes, add new attributes
    for (key in attrs) {
      const cur = attrs[key];
      const old = oldAttrs[key];
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

  return {create: updateAttrs, update: updateAttrs};
}

export default attributesModule;
