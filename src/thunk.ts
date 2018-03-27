import {VNode, VKey, VBaseData, VHooksData, vnode} from './vnode';
import {Hooks} from './hooks';

export interface ThunkFn<VData extends VThunkData<VData>> {
  (...args: any[]): VNode<VData>;
}

export interface VThunkData<VData extends VThunkData<VData>> {
  fn: ThunkFn<VData>;
  args: any[];
}

export interface Thunk<VData extends VThunkData<VData>> {
  (sel: string, fn: ThunkFn<VData>, args: any[]): VNode<VData>;
  (sel: string, key: VKey, fn: ThunkFn<VData>, args: any[]): VNode<VData>;
}

function copyToThunk<VData extends VThunkData<VData>>(vnode: VNode<VData>, thunk: VNode<VData>): void {
  const old = vnode.data as VData;
  const cur = thunk.data as VData;

  old.fn = cur.fn;
  old.args = cur.args;

  thunk.data = vnode.data;
  thunk.children = vnode.children;
  thunk.text = vnode.text;
  thunk.elm = vnode.elm;
}

function init<VData extends VThunkData<VData>>(thunk: VNode<VData>): void {
  const cur = thunk.data as VData;
  copyToThunk(cur.fn.apply(undefined, cur.args), thunk);
}

function prepatch<VData extends VThunkData<VData>>(oldVnode: VNode<VData>, thunk: VNode<VData>): void {
  const old = oldVnode.data as VData;
  const cur = thunk.data as VData;

  const oldArgs = old.args;
  const args = cur.args;

  let needRender = false;

  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    needRender = true;
  } else {
    for (let i = 0; i < args.length; ++i) {
      if (oldArgs[i] !== args[i]) {
        needRender = true;
      }
    }
  }

  if (needRender) {
    oldVnode = cur.fn.apply(undefined, args);
  }

  copyToThunk(oldVnode, thunk);
}

export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>>(sel: string, fn: ThunkFn<VData>, args: any[]): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>>(sel: string, key: VKey, fn: ThunkFn<VData>, args: any[]): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>>(sel: string, key: VKey | ThunkFn<VData> | undefined, fn: ThunkFn<VData> | any[], args?: any[]): VNode<VData> {
  if (args === undefined) {
    args = fn as any[];
    fn = key as ThunkFn<VData>;
    key = undefined;
  }

  return vnode<VData>(sel, {key, hook: {init, prepatch} as Hooks<VData>, fn, args} as VData);
};

export default thunk;
