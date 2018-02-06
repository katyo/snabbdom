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

const raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
function nextFrame(fn: () => void) {
  raf(() => {
    raf(fn);
  });
}

function setNextFrame(obj: any, prop: string, val: any): void {
  nextFrame(() => {
    obj[prop] = val;
  });
}

function updateStyle(oldVnode: VNode<VStyleData>, vnode: VNode<VStyleData>): void {
  const elm = vnode.elm;
  let cur: any, name: string,
    {style: oldStyle} = oldVnode.data as VStyleData,
    {style} = vnode.data as VStyleData;

  if (!oldStyle && !style) return;
  if (oldStyle === style) return;
  oldStyle = oldStyle || {} as StylesData;
  style = style || {} as StylesData;
  const oldHasDel = 'delayed' in oldStyle;

  for (name in oldStyle) {
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        (elm as any).style.removeProperty(name);
      } else {
        (elm as any).style[name] = '';
      }
    }
  }
  for (name in style) {
    cur = style[name];
    if (name === 'delayed' && style.delayed) {
      for (let name2 in style.delayed) {
        cur = style.delayed[name2];
        if (!oldHasDel || cur !== (oldStyle.delayed as any)[name2]) {
          setNextFrame((elm as any).style, name2, cur);
        }
      }
    } else if (name !== 'remove' && cur !== oldStyle[name]) {
      if (name[0] === '-' && name[1] === '-') {
        (elm as any).style.setProperty(name, cur);
      } else {
        (elm as any).style[name] = cur;
      }
    }
  }
}

function applyDestroyStyle(vnode: VNode<VStyleData>): void {
  const elm = vnode.elm, {style: s} = vnode.data as VStyleData;
  let style: any, name: string;
  if (!s || !(style = s.destroy)) return;
  for (name in style) {
    (elm as any).style[name] = style[name];
  }
}

function applyRemoveStyle(vnode: VNode<VStyleData>, rm: () => void): void {
  const {style: s} = vnode.data as VStyleData;
  if (!s || !s.remove) {
    rm();
    return;
  }
  const elm = vnode.elm;
  let name: string, i = 0, compStyle: CSSStyleDeclaration,
    style = s.remove, amount = 0, applied: Array<string> = [];
  for (name in style) {
    applied.push(name);
    (elm as any).style[name] = style[name];
  }
  compStyle = getComputedStyle(elm as Element);
  const props = (compStyle as any)['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1) amount++;
  }
  (elm as Element).addEventListener('transitionend', (ev: TransitionEvent) => {
    if (ev.target === elm)--amount;
    if (amount === 0) rm();
  });
}

export const styleModule: Module<VStyleData> = {
  create: updateStyle,
  update: updateStyle,
  destroy: applyDestroyStyle,
  remove: applyRemoveStyle
};

export default styleModule;
