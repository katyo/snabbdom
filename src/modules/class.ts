import {VNode, emptyVData as empty} from '../vnode';
import {Module} from '../module';

export type Classes = Record<string, boolean>;

export interface VClassData {
  class?: Classes;
}

export interface ClassAPI {
  addClass(elm: Node, name: string): void;
  removeClass(elm: Node, name: string): void;
}

export function classModule(api: ClassAPI): Module<VClassData> {
  function updateClass(oldVnode: VNode<VClassData>, vnode: VNode<VClassData>): void {
    const elm = vnode.elm as Node;
    let cur: any, name: string,
      oldClass = (oldVnode.data as VClassData).class,
      newClass = (vnode.data as VClassData).class;

    if (!oldClass && !newClass) return;
    if (oldClass === newClass) return;
    oldClass = oldClass || empty;
    newClass = newClass || empty;

    for (name in oldClass) {
      if (!newClass[name]) {
        api.removeClass(elm, name);
      }
    }
    for (name in newClass) {
      cur = newClass[name];
      if (cur !== oldClass[name]) {
        api[cur ? 'addClass' : 'removeClass'](elm, name);
      }
    }
  }

  return {create: updateClass, update: updateClass};
}

export default classModule;
