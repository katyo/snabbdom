import {VNode} from './vnode';
import {h} from './h';

export interface VThunkData {
  fn: () => VNode<VThunkData>;
  args: any[];
}

export interface ThunkFn {
  (sel: string, fn: Function, args: any[]): VNode<VThunkData>;
  (sel: string, key: any, fn: Function, args: any[]): VNode<VThunkData>;
}

function copyToThunk(vnode: VNode<VThunkData>, thunk: VNode<VThunkData>): void {
  thunk.elm = vnode.elm;
  (vnode.data as VThunkData).fn = (thunk.data as VThunkData).fn;
  (vnode.data as VThunkData).args = (thunk.data as VThunkData).args;
  thunk.data = vnode.data;
  thunk.children = vnode.children;
  thunk.text = vnode.text;
  thunk.elm = vnode.elm;
}

function init(thunk: VNode<VThunkData>): void {
  const cur = thunk.data as VThunkData;
  const vnode = (cur.fn as any).apply(undefined, cur.args);
  copyToThunk(vnode, thunk);
}

function prepatch(oldVnode: VNode<VThunkData>, thunk: VNode<VThunkData>): void {
  let i: number, old = oldVnode.data as VThunkData, cur = thunk.data as VThunkData;
  const oldArgs = old.args, args = cur.args;
  if (old.fn !== cur.fn || (oldArgs as any).length !== (args as any).length) {
    copyToThunk((cur.fn as any).apply(undefined, args), thunk);
    return;
  }
  for (i = 0; i < (args as any).length; ++i) {
    if ((oldArgs as any)[i] !== (args as any)[i]) {
      copyToThunk((cur.fn as any).apply(undefined, args), thunk);
      return;
    }
  }
  copyToThunk(oldVnode, thunk);
}

export const thunk = function thunk(sel: string, key?: any, fn?: any, args?: any): VNode<VThunkData> {
  if (args === undefined) {
    args = fn;
    fn = key;
    key = undefined;
  }
  return h(sel, {
    key: key,
    hook: {init: init, prepatch: prepatch},
    fn: fn,
    args: args
  });
} as ThunkFn;

export default thunk;
