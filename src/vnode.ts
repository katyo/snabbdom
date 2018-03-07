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
  children?: VNodes<VData>;
  elm?: Node;
  text?: string;
  key?: VKey;
}

export type VNodeChild<VData> = VNode<VData> | string | number | null | undefined;
export type VNodes<VData> = VNodeChild<VData>[];

export function vnode<VData extends VBaseData>(
  sel?: string,
  data?: VData,
  children?: VNodes<VData>,
  text?: string,
  elm?: Node
): VNode<VData> {
  const key = data === undefined ? undefined : data.key;
  return {sel, data, children, text, elm, key};
}

export default vnode;
