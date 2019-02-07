import {NoCtx, ReadHook, PreHook, CreateHook, UpdateHook, DestroyHook, RemoveHook, PostHook} from './hooks';

export interface ModuleHooks<VData, Ctx = NoCtx> {
  read: ReadHook<VData, Ctx>;
  pre: PreHook<Ctx>;
  create: CreateHook<VData, Ctx>;
  update: UpdateHook<VData, Ctx>;
  destroy: DestroyHook<VData, Ctx>;
  remove: RemoveHook<VData, Ctx>;
  post: PostHook<Ctx>;
}

export type Module<VData, Ctx = NoCtx> = Partial<ModuleHooks<VData, Ctx>>;

export type ArraysOf<T> = {
  [K in keyof T]: (T[K])[];
}

export type ModulesHooks<VData, Ctx = NoCtx> = ArraysOf<ModuleHooks<VData, Ctx>>;

export const moduleHooks: (keyof ModuleHooks<void, NoCtx>)[] = ['read', 'create', 'update', 'remove', 'destroy', 'pre', 'post'];
