import {VNode} from '../vnode';
import {Module} from './module';

export type Props = Record<string, any>;

export interface VPropsData {
  props?: Props;
}

export type PropVal = string | number | boolean;

export interface PropsAPI {
  getProp(elm: Node, key: string): PropVal;
  setProp(elm: Node, key: string, val: PropVal): void;
  removeProp(elm: Node, key: string): void;
}

const empty: Props = {};

export function propsModule(api: PropsAPI): Module<VPropsData> {
  function updateProps(oldVnode: VNode<VPropsData>, vnode: VNode<VPropsData>): void {
    const elm = vnode.elm as Node;
    let key: string, cur: any, old: any,
      oldProps = (oldVnode.data as VPropsData).props,
      props = (vnode.data as VPropsData).props;

    if (!oldProps && !props) return;
    if (oldProps === props) return;
    oldProps = oldProps || empty;
    props = props || empty;

    for (key in oldProps) {
      if (!props[key]) {
        api.removeProp(elm, key);
      }
    }
    for (key in props) {
      cur = props[key];
      old = oldProps[key];
      if (old !== cur && (key !== 'value' || api.getProp(elm, key) !== cur)) {
        api.setProp(elm, key, cur);
      }
    }
  }

  return {create: updateProps, update: updateProps};
}

export default propsModule;
