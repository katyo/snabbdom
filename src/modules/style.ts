import {VNode, emptyVData as empty} from '../vnode';
import {Module} from '../module';

export type StylesFields = Exclude<{ [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends Function ? never : K }[keyof CSSStyleDeclaration], number | 'length' | 'parentRule'>;
export type Styles = { [K in StylesFields]: string } & { [name: string]: string };

export type StylesData = Styles & {
  delayed?: Styles
  remove?: Styles
}

export interface VStyleData {
  style?: StylesData;
}

export function styleModule(
  doc: Document = document,
  raf: (fn: () => void) => void = requestAnimationFrame,
  gcs: (node: Node) => CSSStyleDeclaration = getComputedStyle
): Module<VStyleData> {
  // api
  let reflowForced = false;

  interface NextFrame {
    elm: HTMLElement;
    name: string;
    val: string;
  }

  const next_frame: NextFrame[] = [];

  function setFrameStyles() {
    let frame: NextFrame | undefined;
    for (; frame = next_frame.shift(); ) {
      setStyle(frame.elm, frame.name, frame.val);
    }
  }

  function scheduleNextFrame() {
    raf(setFrameStyles);
  }

  function getStyles(elm: HTMLElement): Styles {
    const styles = {} as Styles;
    for (let i = 0; i < elm.style.length; i++) {
      const name = elm.style.item(i);
      styles[name] = elm.style.getPropertyValue(name);
    }
    return styles;
  }

  function setStyle(elm: HTMLElement, name: string, val: string) {
    elm.style.setProperty(name, val);
  }

  function setStyleNextFrame(elm: HTMLElement, name: string, val: string) {
    if (!next_frame.length) {
      raf(scheduleNextFrame);
    }
    next_frame.push({ elm, name, val });
  }

  function removeStyle(elm: HTMLElement, name: string) {
    elm.style.removeProperty(name);
  }

  function onTransEnd(elm: HTMLElement, names: string[], callback: () => void) {
    const compStyle: CSSStyleDeclaration = gcs(elm as Element);
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
    (vnode.data as VStyleData).style = getStyles(vnode.elm as HTMLElement);
  }

  function updateStyle(oldVnode: VNode<VStyleData>, vnode: VNode<VStyleData>) {
    const elm = vnode.elm as HTMLElement;
    let cur: string, name: string,
      {style: oldStyle} = oldVnode.data as VStyleData,
      {style} = vnode.data as VStyleData;

    if (!oldStyle && !style) return;
    if (oldStyle === style) return;
    oldStyle = oldStyle || empty as StylesData;
    style = style || empty as StylesData;

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
            setStyleNextFrame(elm, name2, cur);
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
    if(!reflowForced) {
	    gcs(doc.body).transform;
	    reflowForced = true;
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

  function forceReflow() {
	  reflowForced = false;
	}

  return {
    read: readStyle,
    pre: forceReflow,
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
  };
}

export default styleModule;
