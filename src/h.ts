import {vnode, VNode, VNodeChild, VNodes, VBaseData} from './vnode';
import {isArray, isPrimitive, isDef} from './snabbdom';

export type VNodeChildren<VData> = VNodeChild<VData> | VNodes<VData>;

function addNS<VData extends VBaseData>(data: VData, children?: VNodes<VData>, sel?: string): void {
  data.ns = 'http://www.w3.org/2000/svg';
  if (sel !== 'foreignObject' && isDef(children)) {
    for (let i = 0; i < children.length; ++i) {
      const child = children[i];
      if (child != null && !isPrimitive(child)) {
        if (isDef(child.data)) {
          addNS(child.data, child.children, child.sel);
        }
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
export function h<VData extends VBaseData>(sel: string, b?: VData | VNodeChildren<VData>, c?: VNodeChildren<VData>): VNode<VData> {
  let data: VData | undefined, children: VNodeChild<VData>[] | undefined, text: string | undefined, i: number;

  if (isDef(c)) {
    data = b as VData;

    if (isArray(c)) {
      children = c;
    } else if (isPrimitive(c)) {
      text = c as string;
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (isDef(b)) {
    if (isArray(b)) {
      children = b;
    } else if (isPrimitive(b)) {
      text = b as string;
    } else if (b && (b as VNode<VData>).sel) {
      children = [b];
    } else {
      data = b as VData;
    }
  }

  if (!data) {
    data = {} as VData;
  }

  if (isDef(children)) {
    for (i = 0; i < children.length; ++i) {
      if (isPrimitive(children[i])) children[i] =
        vnode<VData>(undefined, undefined, undefined, children[i] as string, undefined);
    }
  }

  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
    addNS(data, children as VNodes<VData> | undefined, sel);
  }

  return vnode(sel, data, children as VNodes<VData> | undefined, text, undefined);
};

export default h;
