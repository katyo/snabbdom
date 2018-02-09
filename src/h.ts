import {vnode, VNode, VBaseData} from './vnode';
import {isArray, isPrimitive, isDef} from './snabbdom';

export type VNodes<VData> = VNode<VData>[];
export type VNodeChild<VData> = VNode<VData> | string | number | undefined | null;
export type ArrayOrElement<T> = T | T[];
export type VNodeChildren<VData> = ArrayOrElement<VNodeChild<VData>>;

function addNS<VData extends VBaseData>(data: VData, children: VNodes<VData> | undefined, sel: string | undefined): void {
  data.ns = 'http://www.w3.org/2000/svg';
  if (sel !== 'foreignObject' && isDef(children)) {
    for (let i = 0; i < children.length; ++i) {
      let childData = children[i].data;
      if (isDef(childData)) {
        addNS(childData, (children[i] as VNode<VData>).children as VNodes<VData>, children[i].sel);
      }
    }
  }
}

export interface H<VData extends VBaseData> {
  (sel: string): VNode<VData>;
  (sel: string, data: VData): VNode<VData>;
  (sel: string, children: VNodeChildren<VData>): VNode<VData>;
  (sel: string, data: VData, children: VNodeChildren<VData>): VNode<VData>;
}

export function h<VData extends VBaseData>(sel: string): VNode<VData>;
export function h<VData extends VBaseData>(sel: string, data: VData): VNode<VData>;
export function h<VData extends VBaseData>(sel: string, children: VNodeChildren<VData>): VNode<VData>;
export function h<VData extends VBaseData>(sel: string, data: VData, children: VNodeChildren<VData>): VNode<VData>;
export function h<VData extends VBaseData>(sel: any, b?: any, c?: any): VNode<VData> {
  let data = {} as VData, children: any, text: any, i: number;
  if (isDef(c)) {
    data = b;
    if (isArray(c)) {
      children = c;
    } else if (isPrimitive(c)) {
      text = c;
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (isDef(b)) {
    if (isArray(b)) {
      children = b;
    } else if (isPrimitive(b)) {
      text = b;
    } else if (b && b.sel) {
      children = [b];
    } else {
      data = b;
    }
  }
  if (isArray(children)) {
    for (i = 0; i < children.length; ++i) {
      if (isPrimitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
    addNS(data, children, sel);
  }
  return vnode(sel, data, children, text, undefined);
};

export default h;
