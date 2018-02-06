import {VNode} from '../vnode';
import {Module} from './module';

export type Classes = Record<string, boolean>;

export interface VClassData {
  class?: Classes;
}

function updateClass(oldVnode: VNode<VClassData>, vnode: VNode<VClassData>): void {
  const elm: Element = vnode.elm as Element;
  let cur: any, name: string,
    oldClass = (oldVnode.data as VClassData).class,
    newClass = (vnode.data as VClassData).class;

  if (!oldClass && !newClass) return;
  if (oldClass === newClass) return;
  oldClass = oldClass || {};
  newClass = newClass || {};

  for (name in oldClass) {
    if (!newClass[name]) {
      elm.classList.remove(name);
    }
  }
  for (name in newClass) {
    cur = newClass[name];
    if (cur !== oldClass[name]) {
      (elm.classList as any)[cur ? 'add' : 'remove'](name);
    }
  }
}

export const classModule: Module<VClassData> = {create: updateClass, update: updateClass};

export default classModule;
