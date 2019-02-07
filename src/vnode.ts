import {Hooks, NoCtx} from './hooks';

export type VKey = string | number;

export interface VBaseData {
  key?: VKey;
  ns?: string; // for SVGs
}

export interface VHooksData<VData, Ctx = NoCtx> {
  hook?: Hooks<VData, Ctx>;
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

export type VNodeQueue<VData> = VNode<VData>[];

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

export const emptyVData = {};
export const emptyVNode = vnode('', emptyVData, [], undefined, undefined);

export default vnode;
