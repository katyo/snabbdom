/* global module, document, Node */
import {Module, ModuleHooks} from './modules/module';
import {Hooks} from './hooks';
import {vnode, VNode, VBaseData, VKey, VHooksData} from './vnode';

export interface DOMAPI {
  createElement: (sel: string, key?: VKey, nsUri?: string) => Element;
  createTextNode: (text: string) => Text;
  createComment: (text: string) => Comment;
  insertChild: (parentNode: Node, newNode: Node, referenceNode?: Node | null) => void;
  removeChild: (node: Node, child: Node) => void;
  parentNode: (node: Node) => Node | null;
  firstChild: (node: Node) => Node | null;
  nextSibling: (node: Node) => Node | null;
  getSelector: (elm: Element) => [string, VKey | void];
  setTextContent: (node: Node, text: string | null) => void;
  getTextContent: (node: Node) => string | null;
  isElement: (node: Node) => node is Element;
  isText: (node: Node) => node is Text;
  isComment: (node: Node) => node is Comment;
}

export const {isArray} = Array;

export function isPrimitive(s: any): s is (string | number | boolean) {
  const t = (typeof s)[0];
  return t == 's' || t == 'n' || t == 'b';
}

export function isDef<Type>(s: Type | undefined): s is Type {
  return s !== undefined;
}

export interface Selector {
  tag?: string;
  id?: string;
  cls?: string[];
}

// tag?, id?, class?, num-key?, str-key?
const selRegExp = /^([^#\.$@]+)?(?:#([^\.$@]+))?(?:\.([^$@]+))?(?:[$](.+))?(?:@(.*))?$/;

export function parseSel(sel: string): Selector {
  const [, tag, id, cls] = sel.match(selRegExp) as RegExpMatchArray;
  return {tag, id, cls: cls ? cls.split(/\./) : undefined};
}

export function buildSel({tag, id, cls}: Selector): string {
  return `${tag || ''}${id ? '#' + id : ''}${cls ? '.' + cls.join('.') : ''}`;
}

export interface KeyInfo {
  id?: true;    // has id
  cls?: number; // has first N classes
  key?: VKey;   // has key
}

// has-id, num-class, num-key?, str-key?
const keyRegExp = /^(#)?(?:\.(\d*))?(?:[$](.+))?(?:@(.*))?$/;

export function parseKey(sel: string): KeyInfo {
  const [, id, cls, nkey, skey] = sel.match(keyRegExp) as RegExpMatchArray;
  return {
    id: id === '#' ? true : undefined,
    cls: cls === '' ? 1 : cls ? parseInt(cls) : undefined,
    key: nkey != null ? parseFloat(nkey) : skey
  };
}

export function buildKey({id, cls, key}: KeyInfo): string {
  return `${id ? '#' : ''}${cls ? '.' + (cls > 1 ? cls : '') : ''}${key !== undefined ? (typeof key == 'number' ? '$' : '@') + key : ''}`;
}

export const selAttr = 'data-sel';

type VNodeQueue<VData> = VNode<VData>[];

const emptyNode = vnode('', {}, [], undefined, undefined);

function sameVnode<VData>(vnode1: VNode<VData>, vnode2: VNode<VData>): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

type KeyToIndexMap = Record<string, number>;

type ArraysOf<T> = {
  [K in keyof T]: (T[K])[];
}

type ModulesHooks<VData> = ArraysOf<ModuleHooks<VData>>;

function createKeyToOldIdx<VData>(children: VNode<VData>[], beginIdx: number, endIdx: number): KeyToIndexMap {
  let i: number, map: KeyToIndexMap = {}, key: VKey | undefined, ch;
  for (i = beginIdx; i <= endIdx; ++i) {
    ch = children[i];
    if (ch != null) {
      key = ch.key;
      if (isDef(key)) map[key] = i;
    }
  }
  return map;
}

const hooks: (keyof Module<void>)[] = ['read', 'create', 'update', 'remove', 'destroy', 'pre', 'post'];

export interface VDOMAPI<VData> {
  read(node: Node): VNode<VData>;
  patch(oldVNode: VNode<VData>, newVNode: VNode<VData>): VNode<VData>;
}

export function init<VData extends VBaseData & VHooksData<VData>>(modules: Module<VData>[], api: DOMAPI): VDOMAPI<VData> {
  let i: number, j: number, cbs = {} as ModulesHooks<VData>;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      const hook = modules[j][hooks[i]];
      if (isDef(hook)) {
        (cbs[hooks[i]] as any[]).push(hook);
      }
    }
  }

  function createRmCb(childElm: Node, listeners: number) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = api.parentNode(childElm) as Node;
        api.removeChild(parent, childElm);
      }
    };
  }

  function createElm(vnode: VNode<VData>, insertedVnodeQueue: VNodeQueue<VData>): Node {
    let i: any, data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode);
        data = vnode.data;
      }
    }
    let children = vnode.children, sel = vnode.sel;
    if (sel === '!') {
      if (!isDef(vnode.text)) {
        vnode.text = '';
      }
      vnode.elm = api.createComment(vnode.text as string);
    } else if (isDef(sel)) {
      const elm = vnode.elm = api.createElement(sel, vnode.key,
        isDef(data) ? (data as VData).ns : undefined);
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode as VNode<VData>, vnode);
      if (isArray(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i];
          if (ch != null) {
            api.insertChild(elm, createElm(ch as VNode<VData>, insertedVnodeQueue));
          }
        }
      } else if (isPrimitive(vnode.text)) {
        api.insertChild(elm, api.createTextNode(vnode.text));
      }
      i = (vnode.data as VData).hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode);
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      vnode.elm = api.createTextNode(vnode.text as string);
    }
    return vnode.elm;
  }

  function addVnodes(
    parentElm: Node,
    before: Node | null,
    vnodes: VNode<VData>[],
    startIdx: number,
    endIdx: number,
    insertedVnodeQueue: VNodeQueue<VData>
  ) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch != null) {
        api.insertChild(parentElm, createElm(ch, insertedVnodeQueue), before);
      }
    }
  }

  function invokeDestroyHook(vnode: VNode<VData>) {
    let i: any, j: number, data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      if (isDef(vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          i = vnode.children[j];
          if (i != null && typeof i !== "string") {
            invokeDestroyHook(i);
          }
        }
      }
    }
  }

  function removeVnodes(parentElm: Node,
    vnodes: VNode<VData>[],
    startIdx: number,
    endIdx: number): void {
    for (; startIdx <= endIdx; ++startIdx) {
      let i: any, listeners: number, rm: () => void, ch = vnodes[startIdx];
      if (ch != null) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm as Node, listeners);
          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else { // Text node
          api.removeChild(parentElm, ch.elm as Node);
        }
      }
    }
  }

  function updateChildren(parentElm: Node,
    oldCh: VNode<VData>[],
    newCh: VNode<VData>[],
    insertedVnodeQueue: VNodeQueue<VData>) {
    let oldStartIdx = 0, newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx: any;
    let idxInOld: number;
    let elmToMove: VNode<VData>;
    let before: any;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertChild(parentElm, oldStartVnode.elm as Node, api.nextSibling(oldEndVnode.elm as Node));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertChild(parentElm, oldEndVnode.elm as Node, oldStartVnode.elm as Node);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.key as string];
        if (!isDef(idxInOld)) { // New element
          api.insertChild(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVnode.sel) {
            api.insertChild(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined as any;
            api.insertChild(parentElm, (elmToMove.elm as Node), oldStartVnode.elm as Node);
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }

  function patchVnode(oldVnode: VNode<VData>, vnode: VNode<VData>, insertedVnodeQueue: VNodeQueue<VData>) {
    let i: any, hook: any;
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode);
    }
    const elm = vnode.elm = (oldVnode.elm as Node);
    let oldCh = oldVnode.children;
    let ch = vnode.children;
    if (oldVnode === vnode) return;
    if (isDef(vnode.data)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
      i = vnode.data.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    if (!isDef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh as VNode<VData>[], ch as VNode<VData>[], insertedVnodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
        addVnodes(elm, null, ch as VNode<VData>[], 0, (ch as VNode<VData>[]).length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh as VNode<VData>[], 0, (oldCh as VNode<VData>[]).length - 1);
      } else if (isDef(oldVnode.text)) {
        api.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      api.setTextContent(elm, vnode.text as string);
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode);
    }
  }

  function patch(oldVnode: VNode<VData>, vnode: VNode<VData>): VNode<VData> {
    let i: number;
    const insertedVnodeQueue: VNodeQueue<VData> = [];
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
      const elm = oldVnode.elm as Node;
      const parent = api.parentNode(elm);

      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        api.insertChild(parent, vnode.elm as Node, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      (((insertedVnodeQueue[i].data as VData).hook as Hooks<VData>).insert as any)(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    return vnode;
  };

  function read(node: Node): VNode<VData> {
    let text: string;
    if (api.isElement(node)) {
      const [sel, key] = api.getSelector(node);
      const data: VData = {} as VData;
      if (key) data.key = key;
      const children: VNode<VData>[] = [];
      for (let child = api.firstChild(node);
        child != null;
        child = api.nextSibling(child)) {
        children.push(read(child));
      }
      const vn = vnode(sel, data, children, undefined, node);
      for (let i = 0; i < cbs.read.length; ++i) cbs.read[i](vn);
      return vn;
    } else if (api.isText(node)) {
      text = api.getTextContent(node) as string;
      return vnode(undefined, undefined, undefined, text, node);
    } else if (api.isComment(node)) {
      text = api.getTextContent(node) as string;
      return vnode('!', {}, [], text, node as any);
    } else {
      return vnode('', {}, [], undefined, node as any);
    }
  }

  return {read, patch};
}
