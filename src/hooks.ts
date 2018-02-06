import {VNode} from './vnode';

export type PreHook = () => void;
export type InitHook = (vNode: VNode) => void;
export type CreateHook = (emptyVNode: VNode, vNode: VNode) => void;
export type InsertHook = (vNode: VNode) => void;
export type PrePatchHook = (oldVNode: VNode, vNode: VNode) => void;
export type UpdateHook = (oldVNode: VNode, vNode: VNode) => void;
export type PostPatchHook = (oldVNode: VNode, vNode: VNode) => void;
export type DestroyHook = (vNode: VNode) => void;
export type RemoveHook = (vNode: VNode, removeCallback: () => void) => void;
export type PostHook = () => void;

export interface Hooks {
  pre?: PreHook;
  init?: InitHook;
  create?: CreateHook;
  insert?: InsertHook;
  prepatch?: PrePatchHook;
  update?: UpdateHook;
  postpatch?: PostPatchHook;
  destroy?: DestroyHook;
  remove?: RemoveHook;
  post?: PostHook;
}
