import {VNode} from '../vnode';
import {Module} from './module';

export type Styles = Record<string, string>;

export type StylesData = Styles & {
  delayed?: Styles
  remove?: Styles
}

export interface VStyleData {
  style?: StylesData;
}

export interface StyleAPI {
  listStyle(elm: Node): string[];
  getStyle(elm: Node, name: string): string;
  setStyle(elm: Node, name: string, val: string, next?: boolean): void;
  removeStyle(elm: Node, name: string): void;
  onTransEnd(elm: Node, names: string[], callback: () => void): void;
}

const empty: Styles = {};

export function styleModule(api: StyleAPI): Module<VStyleData> {
  function readStyle(vnode: VNode<VStyleData>) {
    const elm = vnode.elm as Node;
    const keys = api.listStyle(elm);
    const style: StylesData = {};
    for (const key of keys) {
      style[key] = api.getStyle(elm, key);
    }
    (vnode.data as VStyleData).style = style;
  }

  function updateStyle(oldVnode: VNode<VStyleData>, vnode: VNode<VStyleData>) {
    const elm = vnode.elm as Node;
    let cur: any, name: string,
      {style: oldStyle} = oldVnode.data as VStyleData,
      {style} = vnode.data as VStyleData;

    if (!oldStyle && !style) return;
    if (oldStyle === style) return;
    oldStyle = oldStyle || empty;
    style = style || empty;

    const oldHasDel = 'delayed' in oldStyle;

    for (name in oldStyle) {
      if (!style[name]) {
        api.removeStyle(elm, name);
      }
    }

    for (name in style) {
      cur = style[name];
      if (name === 'delayed' && style.delayed) {
        for (let name2 in style.delayed) {
          cur = style.delayed[name2];
          if (!oldHasDel || cur !== (oldStyle.delayed as any)[name2]) {
            api.setStyle(elm, name2, cur, true);
          }
        }
      } else if (name !== 'remove' && cur !== oldStyle[name]) {
        api.setStyle(elm, name, cur);
      }
    }
  }

  function applyDestroyStyle(vnode: VNode<VStyleData>) {
    const elm = vnode.elm as Node,
      {style: s} = vnode.data as VStyleData;
    let style: any, name: string;
    if (!s || !(style = s.destroy)) return;
    for (name in style) {
      api.setStyle(elm, name, style[name]);
    }
  }

  function applyRemoveStyle(vnode: VNode<VStyleData>, rm: () => void) {
    const {style: s} = vnode.data as VStyleData;
    if (!s || !s.remove) {
      rm();
      return;
    }
    const elm = vnode.elm as Node,
      style = s.remove,
      applied: string[] = [];
    let name: string;
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

export default styleModule;
