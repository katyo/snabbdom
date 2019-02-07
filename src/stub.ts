export const document = {
  createElement(tag: string) {
    return new StubElement(tag) as any as HTMLElement;
  },
  
  createElementNS(ns: string, tag: string) {
    return new StubElement(tag, ns) as any as HTMLElement;
  },
  
  createTextNode(text: string) {
    return new StubText(text) as any as Text;
  },
  
  createComment(text: string) {
    return new StubComment(text) as any as Comment;
  },
  
  createDocumentFragment() {
    return new StubFragment as any as DocumentFragment;
  },
  
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  COMMENT_NODE: 8,
  DOCUMENT_FRAGMENT_NODE: 11,
} as Document;

export interface StubNode {
  nodeType: number;
  stub: true;
}

export interface StubChild extends StubNode {
  parentNode?: StubParent;
  nextSibling?: StubNode;
}

export class StubText implements StubChild {
  nodeType: number = document.TEXT_NODE;
  stub: true = true;

  textContent: string;

  constructor(text: string) {
    this.textContent = text;
  }

  toString() {
    return this.textContent;
  }
}

export class StubComment implements StubChild {
  nodeType: number = document.COMMENT_NODE;
  stub: true = true;

  textContent: string;

  constructor(text: string) {
    this.textContent = text;
  }

  toString() {
    return '<!--' + this.textContent + '-->';
  }
}

export interface StubParent extends StubChild {
  firstChild?: StubNode;

  insertBefore<T extends StubChild, R extends StubChild>(node: T, ref: R): T;
  appendChild<T extends StubChild>(node: T): T;
  removeChild<T extends StubChild>(node: T): T;
}

export class StubFragment implements StubParent {
  nodeType: number = document.DOCUMENT_FRAGMENT_NODE;
  stub: true = true;

  firstChild?: StubChild;

  childNodes: StubChild[] = [];
  
  insertBefore<T extends StubChild, R extends StubChild>(node: T, ref: R): T {
    const { childNodes } = this;
    let index = childNodes.indexOf(ref);
    if (index < 0) throw 'not found';
    if (node.parentNode) {
      node.parentNode.removeChild(node);
      index = childNodes.indexOf(ref);
    }
    node.parentNode = this;
    node.nextSibling = ref;
    if (index) {
      childNodes[index - 1].nextSibling = node;
    } else {
      this.firstChild = node;
    }
    childNodes.splice(index, 0, node);
    return node;
  }
  
  appendChild<T extends StubChild>(node: T): T {
    const { childNodes } = this;
    if (node.parentNode) node.parentNode.removeChild(node);
    node.parentNode = this;
    if (childNodes.length) {
      childNodes[childNodes.length - 1].nextSibling = node;
    } else {
      this.firstChild = node;
    }
    childNodes.push(node);
    return node;
  }
  
  removeChild<T extends StubChild>(node: T): T {
    const { childNodes } = this;
    const index = childNodes.indexOf(node);
    if (index < 0) throw 'not found';
    delete node.parentNode;
    delete node.nextSibling;
    childNodes.splice(index, 1);
    if (index) {
      childNodes[index - 1].nextSibling = childNodes[index];
    } else {
      this.firstChild = childNodes[0];
    }
    return node;
  }

  // magic textContent property
  get textContent(): string | null {
    return this.childNodes.length == 1 &&
      this.childNodes[0].nodeType == document.TEXT_NODE ?
      (this.childNodes[0] as StubText).textContent :
      '';
  }

  set textContent(text: string | null) {
    if (text) {
      if (this.childNodes.length == 1 &&
          this.childNodes[0].nodeType == document.TEXT_NODE) {
        (this.childNodes[0] as StubText).textContent = text as string;
      } else {
        this.childNodes = [new StubText(text || '')];
      }
    } else {
      this.childNodes = [];
    }
  }

  toString() {
    return '<>';
  }
}

export class StubElement extends StubFragment {
  nodeType: number = document.ELEMENT_NODE;

  tagName: string;

  namespaceURI?: string;

  constructor(tag: string, ns?: string) {
    super();
    this.tagName = tag.toUpperCase();
    this.namespaceURI = ns;
  }
  
  getAttribute(key: string): any {
    return (this as Record<string, any>)[key];
  }
  
  setAttribute(key: string, val: any) {
    (this as Record<string, any>)[key] = val;
  }

  toString() {
    return '<' + this.tagName + '>';
  }
}
