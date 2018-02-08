import {DOMAPI} from '../snabbdom';

const STR_CHARS_REGEX = /[\\"]/g;

function escapeStr(src: string): string {
  return src.replace(STR_CHARS_REGEX, '\\$&');
}

const HTML_CHARS_REGEX = /[&<>"']/g;

function escapeHtml(src: string): string {
  return src.replace(HTML_CHARS_REGEX, m => m == '&' ? '&amp;' : m == '<' ? '&lt;' : m == '>' ? '&gt;' : m == '"' ? '&quot;' : '&#039;');
}

export interface ToString {
  toString(): string;
}

export function render(node: Node): string {
  return (node as any as ToString).toString();
}

export class MockElement implements ToString {
  public parent: MockElement | null = null;
  public nodes: MockElement[] = [];
  public attrs: Record<string, string | number | boolean> = {};
  public class: string[] = [];
  public style: Record<string, string> = {};
  constructor(public tag: string, ns?: string, public text: string | null = null) {
    if (ns) {
      this.attrs.xmlns = ns;
    }
  }
  toString() {
    return this.tag == '!' ? this.strComment() : this.tag == '' ? this.strText() :
      `<${this.tag}${this.strClass()}${this.strAttrs()}${this.strStyle()}>${this.strNodes()}</${this.tag}>`;
  }
  strNodes() {
    if (this.text) {
      return this.strText();
    }

    let nodes = '';
    for (const node of this.nodes) {
      nodes += node.toString();
    }

    return nodes;
  }
  strAttrs() {
    let attrs = '';
    for (const key in this.attrs) {
      const v = this.attrs[key], t = (typeof v)[0];
      attrs += t != 'b' ? ` ${key}="${t == 's' ? escapeStr(v as string) : '' + v}"` : v ? ` ${key}` : '';
    }
    return attrs;
  }
  strClass() {
    return this.class.length ? ` class="${escapeStr(this.class.join(' '))}"` : '';
  }
  strStyle() {
    const style: string[] = [];
    for (const key in this.style) {
      style.push(`${key}:${this.attrs[key]}`);
    }
    return style.length ? ` style="${escapeStr(style.join(';'))} "` : '';
  }
  strText() {
    return this.text ? escapeHtml(this.text) : '';
  }
  strComment() {
    return `<!--${this.text ? escapeHtml(this.text) : ''}-->`;
  }
}

function createElement(tagName: string): MockElement {
  return new MockElement(tagName);
}

function createElementNS(namespaceURI: string, qualifiedName: string): MockElement {
  return new MockElement(qualifiedName, namespaceURI);
}

function createTextNode(text: string): MockElement {
  return new MockElement('', undefined, text);
}

function createComment(text: string): MockElement {
  return new MockElement('!', undefined, text);
}

function insertChild(parentNode: MockElement, newNode: MockElement, referenceNode?: MockElement | null): void {
  const {nodes} = parentNode;
  const index = referenceNode ? nodes.indexOf(referenceNode) : nodes.length;
  if (index != -1) {
    nodes.splice(index, 0, newNode);
    newNode.parent = parentNode;
  }
}

function removeChild(node: MockElement, child: MockElement): void {
  const index = node.nodes.indexOf(child);
  if (index != -1) {
    child.parent = null;
    node.nodes.splice(index, 1);
  }
}

function parentNode(node: MockElement): MockElement | null {
  return node.parent;
}

function firstChild(node: MockElement): MockElement | null {
  return node.nodes[0] || null;
}

function nextSibling(node: MockElement): MockElement | null {
  const parentNode = node.parent;
  if (parentNode) {
    const index = parentNode.nodes.indexOf(node);
    if (index != -1) {
      return parentNode.nodes[index + 1] || null;
    }
  }
  return null;
}

function tagName(elm: MockElement): string {
  return elm.tag;
}

function setTextContent(node: MockElement, text: string | null): void {
  node.text = text;
}

function getTextContent(node: MockElement): string | null {
  return node.text || null;
}

function isElement(node: MockElement): boolean {
  return node.tag != '' && node.tag != '!';
}

function isText(node: MockElement): boolean {
  return node.tag == '';
}

function isComment(node: MockElement): boolean {
  return node.tag == '!';
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
} as any as DOMAPI;

export default htmlDomApi;
