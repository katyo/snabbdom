import {VNode} from './vnode';

export type NoCtx = void;

export interface PreHook<Ctx = NoCtx> {
  (ctx: Ctx): void;
}

export interface InitHook<VData, Ctx = NoCtx> {
  (vNode: VNode<VData>, ctx: Ctx): void;
}

export interface CreateHook<VData, Ctx = NoCtx> {
  (emptyVNode: VNode<VData>, vNode: VNode<VData>, ctx: Ctx): void;
}

export interface InsertHook<VData, Ctx = NoCtx> {
  (vNode: VNode<VData>, ctx: Ctx): void;
}

export interface PrePatchHook<VData, Ctx = NoCtx> {
  (oldVNode: VNode<VData>, vNode: VNode<VData>, ctx: Ctx): void;
}

export interface UpdateHook<VData, Ctx = NoCtx> {
  (oldVNode: VNode<VData>, vNode: VNode<VData>, ctx: Ctx): void;
}

export interface PostPatchHook<VData, Ctx = NoCtx> {
  (oldVNode: VNode<VData>, vNode: VNode<VData>, ctx: Ctx): void;
}

export interface DestroyHook<VData, Ctx = NoCtx> {
  (vNode: VNode<VData>, rNode: VNode<VData> | void, ctx: Ctx): void;
}

export interface RemoveHook<VData, Ctx = NoCtx> {
  (vNode: VNode<VData>, removeCallback: () => void, ctx: Ctx): void;
}

export interface PostHook<Ctx = NoCtx> {
  (ctx: Ctx): void;
}

export interface ReadHook<VData, Ctx = NoCtx> {
  (vnode: VNode<VData>, ctx: Ctx): void;
}

export interface Hooks<VData, Ctx = NoCtx> {
  pre?: PreHook<Ctx>;
  init?: InitHook<VData, Ctx>;
  create?: CreateHook<VData, Ctx>;
  insert?: InsertHook<VData, Ctx>;
  prepatch?: PrePatchHook<VData, Ctx>;
  update?: UpdateHook<VData, Ctx>;
  postpatch?: PostPatchHook<VData, Ctx>;
  destroy?: DestroyHook<VData, Ctx>;
  remove?: RemoveHook<VData, Ctx>;
  post?: PostHook<Ctx>;
}
