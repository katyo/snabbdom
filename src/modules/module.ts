import {ReadHook, PreHook, CreateHook, UpdateHook, DestroyHook, RemoveHook, PostHook} from '../hooks';

export interface ModuleHooks<VData> {
  read: ReadHook<VData>;
  pre: PreHook;
  create: CreateHook<VData>;
  update: UpdateHook<VData>;
  destroy: DestroyHook<VData>;
  remove: RemoveHook<VData>;
  post: PostHook;
}

export type Module<VData> = Partial<ModuleHooks<VData>>;
