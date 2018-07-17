import {VNode} from './vnode';

export interface PreHook {
  (): void;
}

export interface InitHook<VData> {
  (vNode: VNode<VData>): void;
}

export interface CreateHook<VData> {
  (emptyVNode: VNode<VData>, vNode: VNode<VData>): void;
}

export interface InsertHook<VData> {
  (vNode: VNode<VData>): void;
}

export interface PrePatchHook<VData> {
  (oldVNode: VNode<VData>, vNode: VNode<VData>): void;
}

export interface UpdateHook<VData> {
  (oldVNode: VNode<VData>, vNode: VNode<VData>): void;
}

export interface PostPatchHook<VData> {
  (oldVNode: VNode<VData>, vNode: VNode<VData>): void;
}

export interface DestroyHook<VData> {
  (vNode: VNode<VData>): void;
}

export interface RemoveHook<VData> {
  (vNode: VNode<VData>, removeCallback: () => void): void;
}

export interface PostHook {
  (): void;
}

export interface ReadHook<VData> {
  (vnode: VNode<VData>): void;
}

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
