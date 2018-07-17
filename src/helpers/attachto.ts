import {VNode, VBaseData, VHooksData} from '../vnode';

export interface AttachData {
  [key: string]: any
  [i: number]: any
  placeholder?: any
  real?: Node
}

export interface VAttachData {
  attachData: AttachData
}

function pre(vnode: VNode<VAttachData>, newVnode: VNode<VAttachData>): void {
  const {attachData} = vnode.data as VAttachData;
  // Copy created placeholder and real element from old vnode
  (newVnode.data as VAttachData).attachData.placeholder = attachData.placeholder;
  // Mount real element in vnode so the patch process operates on it
  vnode.elm = (newVnode.data as VAttachData).attachData.real = attachData.real;
}

function post(_: any, vnode: VNode<VAttachData>): void {
  // Mount dummy placeholder in vnode so potential reorders use it
  vnode.elm = (vnode.data as VAttachData).attachData.placeholder;
}

function destroy(vnode: VNode<VAttachData>): void {
  // Remove placeholder
  if (vnode.elm !== undefined) {
    (vnode.elm.parentNode as HTMLElement).removeChild(vnode.elm);
  }
  // Remove real element from where it was inserted
  vnode.elm = (vnode.data as VAttachData).attachData.real;
}

function create(_: any, vnode: VNode<VAttachData>): void {
  const real = vnode.elm, {attachData} = vnode.data as VAttachData;
  const placeholder = document.createElement('span');
  // Replace actual element with dummy placeholder
  // Snabbdom will then insert placeholder instead
  vnode.elm = placeholder;
  attachData.target.appendChild(real);
  attachData.real = real;
  attachData.placeholder = placeholder;
}

export function attachTo(target: Element, vnode: VNode<VAttachData & VBaseData & VHooksData<VAttachData>>): VNode<VAttachData & VBaseData & VHooksData<VAttachData>> {
  if (vnode.data === undefined) vnode.data = {} as VAttachData;
  if (vnode.data.hook === undefined) vnode.data.hook = {};
  const data = vnode.data;
  const hook = vnode.data.hook;
  data.attachData = {target: target, placeholder: undefined, real: undefined};
  hook.create = create;
  hook.prepatch = pre;
  hook.postpatch = post;
  hook.destroy = destroy;
  return vnode;
};

export default attachTo;
