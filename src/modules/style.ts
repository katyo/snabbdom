import {VNode, emptyVData as empty} from '../vnode';
import {Module} from '../module';

export type Styles = Record<string, string>;

export type StylesData = Styles & {
  delayed?: Styles
  remove?: Styles
}

export interface VStyleData {
  style?: StylesData;
}

export function styleModule(raf: (fn: () => void) => void): Module<VStyleData> {
  // api

  function nextFrame(fn: () => void) {
    raf(() => {
      raf(fn);
    });
  }

  function listStyle(elm: HTMLElement): string[] {
    const style = elm.getAttribute('style');
    const names: string[] = [];
    if (style) {
      for (const pair of style.split(/\s*;\s*/)) {
        const m = pair.match(/^[^:\s]+/);
        if (m) names.push(m[0]);
      }
    }
    return names;
  }

  function getStyle(elm: HTMLElement, name: string): string {
    return (elm.style as any)[name];
  }

  function setStyle(elm: HTMLElement, name: string, val: string, next: boolean = false) {
    const fn = name[0] === '-' && name[1] === '-' ?
      () => {
        elm.style.setProperty(name, val);
      } : () => {
        (elm.style as any)[name] = val;
      };

    if (!next) {
      fn();
    } else {
      nextFrame(fn);
    }
  }

  function removeStyle(elm: HTMLElement, name: string) {
    if (name[0] == '-' && name[1] == '-') {
      elm.style.removeProperty(name);
    } else {
      (elm.style as any)[name] = '';
    }
  }

  function onTransEnd(elm: HTMLElement, names: string[], callback: () => void) {
    const compStyle: CSSStyleDeclaration = getComputedStyle(elm as Element);
    const props = (compStyle as any)['transition-property'].split(', ');
    let amount = 0;
    for (let i = 0; i < props.length; ++i) {
      if (names.indexOf(props[i]) !== -1) amount++;
    }
    (elm as Element).addEventListener('transitionend', (ev: TransitionEvent) => {
      if (ev.target === elm)--amount;
      if (amount === 0) callback();
    });
  }

  // module

  function readStyle(vnode: VNode<VStyleData>) {
    const elm = vnode.elm as HTMLElement;
    const keys = listStyle(elm);
    const style: StylesData = {};
    for (const key of keys) {
      style[key] = getStyle(elm, key);
    }
    (vnode.data as VStyleData).style = style;
  }

  function updateStyle(oldVnode: VNode<VStyleData>, vnode: VNode<VStyleData>) {
    const elm = vnode.elm as HTMLElement;
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
        removeStyle(elm, name);
      }
    }

    for (name in style) {
      cur = style[name];
      if (name === 'delayed' && style.delayed) {
        for (let name2 in style.delayed) {
          cur = style.delayed[name2];
          if (!oldHasDel || cur !== (oldStyle.delayed as any)[name2]) {
            setStyle(elm, name2, cur, true);
          }
        }
      } else if (name !== 'remove' && cur !== oldStyle[name]) {
        setStyle(elm, name, cur);
      }
    }
  }

  function applyDestroyStyle(vnode: VNode<VStyleData>) {
    const elm = vnode.elm as HTMLElement,
      {style: s} = vnode.data as VStyleData;
    let style: any, name: string;
    if (!s || !(style = s.destroy)) return;
    for (name in style) {
      setStyle(elm, name, style[name]);
    }
  }

  function applyRemoveStyle(vnode: VNode<VStyleData>, rm: () => void) {
    const {style: s} = vnode.data as VStyleData;
    if (!s || !s.remove) {
      rm();
      return;
    }
    const elm = vnode.elm as HTMLElement,
      style = s.remove,
      applied: string[] = [];
    let name: string;
    for (name in style) {
      applied.push(name);
      setStyle(elm, name, style[name]);
    }
    onTransEnd(elm, applied, rm);
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
