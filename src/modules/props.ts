import {VNode, emptyVData as empty} from '../vnode';
import {Module} from '../module';
import {isDef} from '../utils';

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

export function propsModule(): Module<VPropsData> {
  function updateProps(oldVnode: VNode<VPropsData>, vnode: VNode<VPropsData>): void {
    const elm = vnode.elm as Node;
    let key: string, cur: any,
      oldProps = (oldVnode.data as VPropsData).props,
      props = (vnode.data as VPropsData).props;

    if (!oldProps && !props) return;
    if (oldProps === props) return;
    oldProps = oldProps || empty;
    props = props || empty;

    for (key in oldProps) {
      if (isDef(oldProps[key]) && !isDef(props[key])) {
        removeProp(elm, key);
      }
    }

    for (key in props) {
      cur = props[key];
      if (isDef(cur) && oldProps[key] !== cur &&
        (key !== 'value' || getProp(elm, key) !== cur)) {
        setProp(elm, key, cur);
      }
    }
  }

  return {create: updateProps, update: updateProps};
}

function getProp(elm: Node, key: string) {
  return (elm as any)[key];
}

function setProp(elm: Node, key: string, val: PropVal) {
  (elm as any)[key] = val;
}

function removeProp(elm: Node, key: string) {
  delete (elm as any)[key];
}

export default propsModule;
