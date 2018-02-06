import {VNode} from './vnode';

export type PreHook = () => void;
export type InitHook<VData> = (vNode: VNode<VData>) => void;
export type CreateHook<VData> = (emptyVNode: VNode<VData>, vNode: VNode<VData>) => void;
export type InsertHook<VData> = (vNode: VNode<VData>) => void;
export type PrePatchHook<VData> = (oldVNode: VNode<VData>, vNode: VNode<VData>) => void;
export type UpdateHook<VData> = (oldVNode: VNode<VData>, vNode: VNode<VData>) => void;
export type PostPatchHook<VData> = (oldVNode: VNode<VData>, vNode: VNode<VData>) => void;
export type DestroyHook<VData> = (vNode: VNode<VData>) => void;
export type RemoveHook<VData> = (vNode: VNode<VData>, removeCallback: () => void) => void;
export type PostHook = () => void;

export interface Hooks<VData> {
  pre?: PreHook;
  init?: InitHook<VData>;
  create?: CreateHook<VData>;
  insert?: InsertHook<VData>;
  prepatch?: PrePatchHook<VData>;
  update?: UpdateHook<VData>;
  postpatch?: PostPatchHook<VData>;
  destroy?: DestroyHook<VData>;
  remove?: RemoveHook<VData>;
  post?: PostHook;
}
