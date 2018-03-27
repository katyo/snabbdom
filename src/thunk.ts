import {VNode, VKey, VBaseData, VHooksData, vnode} from './vnode';
import {Hooks} from './hooks';

export interface ThunkFn<VData> {
  (...args: any[]): VNode<VData>;
}

export interface VThunkData<VData extends VThunkData<VData>> {
  fn?: ThunkFn<VData>;
  args?: any[];
}

export interface Thunk<VData extends VThunkData<VData>> {
  // non-keyed
  <A1>(sel: string, fn: (arg1: A1) => VNode<VData>, a1: A1): VNode<VData>;
  <A1, A2>(sel: string, fn: (a1: A1, a2: A2) => VNode<VData>, a1: A1, a2: A2): VNode<VData>;
  <A1, A2, A3>(sel: string, fn: (a1: A1, a2: A2, a3: A3) => VNode<VData>, a1: A1, a2: A2, a3: A3): VNode<VData>;
  <A1, A2, A3, A4>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4): VNode<VData>;
  <A1, A2, A3, A4, A5>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): VNode<VData>;
  <A1, A2, A3, A4, A5, A6>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): VNode<VData>;
  <A1, A2, A3, A4, A5, A6, A7>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): VNode<VData>;
  <A1, A2, A3, A4, A5, A6, A7, A8>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): VNode<VData>;
  <A1, A2, A3, A4, A5, A6, A7, A8, A9>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9): VNode<VData>;
  // keyed
  <A1>(sel: string, key: VKey, fn: (arg1: A1) => VNode<VData>, a1: A1): VNode<VData>;
  <A1, A2>(sel: string, key: VKey, fn: (a1: A1, a2: A2) => VNode<VData>, a1: A1, a2: A2): VNode<VData>;
  <A1, A2, A3>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3) => VNode<VData>, a1: A1, a2: A2, a3: A3): VNode<VData>;
  <A1, A2, A3, A4>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4): VNode<VData>;
  <A1, A2, A3, A4, A5>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): VNode<VData>;
  <A1, A2, A3, A4, A5, A6>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): VNode<VData>;
  <A1, A2, A3, A4, A5, A6, A7>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): VNode<VData>;
  <A1, A2, A3, A4, A5, A6, A7, A8>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): VNode<VData>;
  <A1, A2, A3, A4, A5, A6, A7, A8, A9>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9): VNode<VData>;
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
  copyToThunk((cur.fn as ThunkFn<VData>).apply(undefined, cur.args), thunk);
}

function prepatch<VData extends VThunkData<VData>>(oldVnode: VNode<VData>, thunk: VNode<VData>): void {
  const old = oldVnode.data as VData;
  const cur = thunk.data as VData;

  const oldArgs = old.args as any[];
  const args = cur.args as any[];

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
    oldVnode = (cur.fn as ThunkFn<VData>).apply(undefined, args);
  }

  copyToThunk(oldVnode, thunk);
}

// non-keyed
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1>(sel: string, fn: (a1: A1) => VNode<VData>, a1: A1): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2>(sel: string, fn: (a1: A1, a2: A2) => VNode<VData>, a1: A1, a2: A2): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3>(sel: string, fn: (a1: A1, a2: A2, a3: A3) => VNode<VData>, a1: A1, a2: A2, a3: A3): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5, A6>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5, A6, A7>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5, A6, A7, A8>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5, A6, A7, A8, A9>(sel: string, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9): VNode<VData>;
// keyed
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1>(sel: string, key: VKey, fn: (a1: A1) => VNode<VData>, a1: A1): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2>(sel: string, key: VKey, fn: (a1: A1, a2: A2) => VNode<VData>, a1: A1, a2: A2): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3) => VNode<VData>, a1: A1, a2: A2, a3: A3): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5, A6>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5, A6, A7>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5, A6, A7, A8>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8): VNode<VData>;
export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>, A1, A2, A3, A4, A5, A6, A7, A8, A9>(sel: string, key: VKey, fn: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9) => VNode<VData>, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9): VNode<VData>;

export function thunk<VData extends VBaseData & VHooksData<VData> & VThunkData<VData>>(sel: string, key: VKey | ThunkFn<VData> | undefined, fn: ThunkFn<VData> | any[], ...args: any[]): VNode<VData> {
  if (typeof key == 'function') {
    args.unshift(fn);
    fn = key as ThunkFn<VData>;
    key = undefined;
  }

  return vnode<VData>(sel, {key, hook: {init, prepatch} as Hooks<VData>, fn, args} as VData);
};

export default thunk;
