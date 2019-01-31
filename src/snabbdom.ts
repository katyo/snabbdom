/* global module, document, Node */
import {Hooks} from './hooks';
import {Module, ModulesHooks, moduleHooks} from './module';
import {vnode, VNode, VNodeQueue, VBaseData, VKey, VHooksData, emptyVNode} from './vnode';
import {isArray, isPrimitive, isDef, selAttr, parseSel, buildSel, parseKey, buildKey} from './utils';

function sameVnode<VData>(vnode1: VNode<VData>, vnode2: VNode<VData>): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

type KeyToIndexMap = Record<string, number>;

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

export interface Read<VData> {
  (node: Node): VNode<VData>;
}

export interface Patch<VData> {
  (oldVNode: VNode<VData>, newVNode: VNode<VData>): VNode<VData>;
}

export interface VDOMAPI<VData> {
  read: Read<VData>;
  patch: Patch<VData>;
}

export function init<VData extends VBaseData & VHooksData<VData>>(modules: Module<VData>[], document: Document): VDOMAPI<VData> {
  let i: number, j: number, cbs = {} as ModulesHooks<VData>;

  for (i = 0; i < moduleHooks.length; ++i) {
    const name = moduleHooks[i];
    cbs[name] = [];
    for (j = 0; j < modules.length; ++j) {
      const hook = modules[j][name];
      if (isDef(hook)) {
        (cbs[name] as any[]).push(hook);
      }
    }
  }

  function createRmCb(childElm: Node, listeners: number) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = parentNode(childElm) as Node;
        removeChild(parent, childElm);
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
      vnode.elm = createComment(vnode.text as string);
    } else if (isDef(sel)) {
      const elm = vnode.elm = createElement(sel, vnode.key,
        isDef(data) ? (data as VData).ns : undefined);
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyVNode as VNode<VData>, vnode);
      if (isArray(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i];
          if (ch != null) {
            insertChild(elm, createElm(ch as VNode<VData>, insertedVnodeQueue));
          }
        }
      } else if (isPrimitive(vnode.text)) {
        insertChild(elm, createTextNode(vnode.text));
      }
      i = (vnode.data as VData).hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyVNode, vnode);
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      vnode.elm = createTextNode(vnode.text as string);
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
        insertChild(parentElm, createElm(ch, insertedVnodeQueue), before);
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
          removeChild(parentElm, ch.elm as Node);
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
        insertChild(parentElm, oldStartVnode.elm as Node, nextSibling(oldEndVnode.elm as Node));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        insertChild(parentElm, oldEndVnode.elm as Node, oldStartVnode.elm as Node);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.key as string];
        if (!isDef(idxInOld)) { // New element
          insertChild(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVnode.sel) {
            insertChild(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined as any;
            insertChild(parentElm, (elmToMove.elm as Node), oldStartVnode.elm as Node);
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
        if (isDef(oldVnode.text)) setTextContent(elm, '');
        addVnodes(elm, null, ch as VNode<VData>[], 0, (ch as VNode<VData>[]).length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh as VNode<VData>[], 0, (oldCh as VNode<VData>[]).length - 1);
      } else if (isDef(oldVnode.text)) {
        setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      setTextContent(elm, vnode.text as string);
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
      const parent = parentNode(elm);

      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        insertChild(parent, vnode.elm as Node, nextSibling(elm));
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
    if (isElement(node)) {
      const [sel, key] = getSelector(node);
      const data: VData = {} as VData;
      if (key) data.key = key;
      const children: VNode<VData>[] = [];
      for (let child = firstChild(node);
        child != null;
        child = nextSibling(child)) {
        children.push(read(child));
      }
      const vn = vnode(sel, data, children, undefined, node);
      for (let i = 0; i < cbs.read.length; ++i) cbs.read[i](vn);
      return vn;
    } else if (isText(node)) {
      text = getTextContent(node) as string;
      return vnode<VData>(undefined, undefined, undefined, text, node);
    } else if (isComment(node)) {
      text = getTextContent(node) as string;
      return vnode<VData>('!', {} as VData, [], text, node);
    } else {
      return vnode<VData>('', {} as VData, [], undefined, node);
    }
  }

  return {read, patch};

  function createElement(sel: string, key?: VKey, nsUri?: string): Element {
    const {tag, id, cls} = parseSel(sel);
    const elm = nsUri ?
      document.createElementNS(nsUri, tag as string) :
      document.createElement(tag as string);
    if (id) elm.setAttribute('id', id);
    if (cls) elm.setAttribute('class', cls.join(' '));
    if (id || cls || isDef(key)) { // preserve original selector
      elm.setAttribute(selAttr, buildKey({
        id: id ? true : undefined,
        cls: cls ? cls.length : undefined,
        key
      }));
    }
    return elm;
  }

  function createTextNode(text: string): Text {
    return document.createTextNode(text);
  }

  function createComment(text: string): Comment {
    return document.createComment(text);
  }
}

function insertChild(parentNode: Node, newNode: Node, referenceNode?: Node | null): void {
  if (referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  } else {
    parentNode.appendChild(newNode);
  }
}

function removeChild(node: Node, child: Node): void {
  node.removeChild(child);
}

function parentNode(node: Node): Node | null {
  return node.parentNode;
}

function firstChild(node: Node): Node | null {
  return node.firstChild;
}

function nextSibling(node: Node): Node | null {
  return node.nextSibling;
}

function getSelector(elm: Element): [string, VKey | void] {
  const tag = elm.tagName.toLowerCase();
  const sel = elm.getAttribute(selAttr);
  if (sel) {
    const {id, cls, key} = parseKey(sel);
    return [buildSel({
      tag,
      id: id && elm.getAttribute('id') || undefined,
      cls: cls && (elm.getAttribute('class') || '').split(/ /).slice(0, cls) || undefined
    }), key];
  }
  return [tag, undefined];
}

function setTextContent(node: Node, text: string | null): void {
  node.textContent = text;
}

function getTextContent(node: Node): string | null {
  return node.textContent;
}

function isElement(node: Node): node is Element {
  return node.nodeType === 1;
}

function isText(node: Node): node is Text {
  return node.nodeType === 3;
}

function isComment(node: Node): node is Comment {
  return node.nodeType === 8;
}
