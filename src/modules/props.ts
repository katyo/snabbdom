import {VNode} from '../vnode';
import {Module} from './module';

export type Props = Record<string, any>;

export interface VPropsData {
  props?: Props;
}

function updateProps(oldVnode: VNode<VPropsData>, vnode: VNode<VPropsData>): void {
  var key: string, cur: any, old: any, elm = vnode.elm,
    oldProps = (oldVnode.data as VPropsData).props,
    props = (vnode.data as VPropsData).props;

  if (!oldProps && !props) return;
  if (oldProps === props) return;
  oldProps = oldProps || {};
  props = props || {};

  for (key in oldProps) {
    if (!props[key]) {
      delete (elm as any)[key];
    }
  }
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || (elm as any)[key] !== cur)) {
      (elm as any)[key] = cur;
    }
  }
}

export const propsModule: Module<VPropsData> = {create: updateProps, update: updateProps};

export default propsModule;
