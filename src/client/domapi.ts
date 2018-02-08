import {DOMAPI, DOMSel} from '../snabbdom';

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

function getSelector(elm: Element): DOMSel {
  return [
    elm.tagName.toLowerCase(),
    elm.getAttribute('id') || undefined,
    elm.getAttribute('class') || undefined,
  ];
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

export function htmlDomApi(document: Document): DOMAPI {
  function createElement(tag: string, id?: string, cls?: string, nsUri?: string): Element {
    const elm = nsUri ? document.createElementNS(nsUri, tag) : document.createElement(tag);
    if (id) elm.setAttribute('id', id);
    if (cls) elm.setAttribute('class', cls);
    return elm;
  }

  function createTextNode(text: string): Text {
    return document.createTextNode(text);
  }

  function createComment(text: string): Comment {
    return document.createComment(text);
  }

  return {
    createElement,
    createTextNode,
    createComment,
    insertChild,
    removeChild,
    parentNode,
    firstChild,
    nextSibling,
    getSelector,
    setTextContent,
    getTextContent,
    isElement,
    isText,
    isComment,
  };
}

export default htmlDomApi;
