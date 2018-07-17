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

type Api = [
  /*addClass*/(elm: Element, name: string) => void,
  /*removeClass*/(elm: Element, name: string) => void
];

export function classModule(document: Document): Module<VClassData> {
  /* api */

  function getClasses(elm: Element): string[] {
    return elm.className.split(/ /);
  }

  const [addClass, removeClass]: Api = !document.createElement('p').classList ? [
    (elm: Element, name: string) => {
      const names = elm.className.split(/ /);
      if (names.indexOf(name) == -1) {
        elm.className += ` ${name}`;
      }
    },
    (elm: Element, name: string) => {
      const names = elm.className.split(/ /);
      const index = names.indexOf(name);
      if (index != -1) {
        names.splice(index, 1);
        elm.className = names.join(' ');
      }
    }
  ] : [
      (elm: Element, name: string) => {
        elm.classList.add(name);
      },
      (elm: Element, name: string) => {
        elm.classList.remove(name);
      }
    ];

  /* module */

  function readClass(vnode: VNode<VClassData>) {
    const elm = vnode.elm as Element;
    const classes = {} as Classes;
    for (const name in getClasses(elm)) {
      classes[name] = true;
    }
    (vnode.data as VClassData).class = classes;
  }

  function updateClass(oldVnode: VNode<VClassData>, vnode: VNode<VClassData>): void {
    const elm = vnode.elm as Element;
    let cur: any, name: string,
      oldClass = (oldVnode.data as VClassData).class,
      newClass = (vnode.data as VClassData).class;

    if (!oldClass && !newClass) return;
    if (oldClass === newClass) return;
    oldClass = oldClass || empty;
    newClass = newClass || empty;

    for (name in oldClass) {
      if (!newClass[name]) {
        removeClass(elm, name);
      }
    }
    for (name in newClass) {
      cur = newClass[name];
      if (cur !== oldClass[name]) {
        (cur ? addClass : removeClass)(elm, name);
      }
    }
  }

  return {read: readClass, create: updateClass, update: updateClass};
}

export default classModule;
