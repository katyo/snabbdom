import {DOMAPI} from '../snabbdom';

function createElement(tagName: string): HTMLElement {
  return document.createElement(tagName);
}

function createElementNS(namespaceURI: string, qualifiedName: string): Element {
  return document.createElementNS(namespaceURI, qualifiedName);
}

function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

function createComment(text: string): Comment {
  return document.createComment(text);
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

function tagName(elm: Element): string {
  return elm.tagName;
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

export const htmlDomApi: DOMAPI = {
  createElement,
  createElementNS,
  createTextNode,
  createComment,
  insertChild,
  removeChild,
  parentNode,
  firstChild,
  nextSibling,
  tagName,
  setTextContent,
  getTextContent,
  isElement,
  isText,
  isComment,
};

export default htmlDomApi;
