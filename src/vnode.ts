import {Hooks} from './hooks';

export type VKey = string | number;

export interface VBaseData {
  key?: VKey;
  ns?: string; // for SVGs
}

export interface VHooksData<VData> {
  hook?: Hooks<VData>;
}

export interface VNode<VData> {
  sel?: string;
  data?: VData;
  children?: (VNode<VData> | string)[];
  elm?: Node;
  text?: string;
  key?: VKey;
}

export function vnode<VData>(
  sel: string | undefined,
  data: any | undefined,
  children: (VNode<VData> | string)[] | undefined,
  text: string | undefined,
  elm: Element | Text | undefined
): VNode<VData> {
  const key = data === undefined ? undefined : data.key;
  return {
    sel: sel, data: data, children: children,
    text: text, elm: elm, key: key
  };
}

export default vnode;
