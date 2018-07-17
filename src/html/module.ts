import {VNode} from '../vnode';

export interface SetAttr {
  (key: string, val: string): void;
}

export interface Write<VData> {
  (vnode: VNode<VData>, setAttr: SetAttr): void;
}

export interface Module<VData> {
  write: Write<VData>;
}
