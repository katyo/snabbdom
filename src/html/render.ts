import {VNode, VBaseData} from '../vnode';
import {parseSel, isDef, buildKey, Selector, isPrimitive} from '../snabbdom';
import {Module} from './module';

export interface WriteFn {
  (chunk: string): void;
}

export interface Render<VData> {
  (vnode: VNode<VData>, write: WriteFn): void;
}

export function init<VData extends VBaseData>(modules: Module<VData>[]): Render<VData> {
  return renderNode;

  function renderNode(vnode: VNode<VData>, write: WriteFn) {
    const {text, sel} = vnode;
    if (sel) {
      const selProps = parseSel(sel);
      if (selProps.tag == '!') {
        write(`<!--${text ? escapeHtml(text) : ''}-->`);
      } else {
        renderElement(vnode, selProps, write);
      }
    } else if (text) {
      write(escapeHtml(text));
    }
  }

  function renderElement(vnode: VNode<VData>, {tag, id, cls}: Selector, write: WriteFn) {
    const {key, text, children} = vnode;

    const attrs: Attrs = {};

    function setAttr(key: string, val: string) {
      attrs[key] = val;
    }

    for (let i = 0; i < modules.length; i++) {
      modules[i].write(vnode, setAttr);
    }

    if (id || cls || isDef(key)) {
      setAttr('data-sel', buildKey({
        id: id ? true : undefined,
        cls: cls ? cls.length : undefined,
        key
      }));

      if (id) {
        setAttr('id', id);
      }

      if (cls) {
        if (attrs.class) {
          attrs.class += cls.join(' ');
        } else {
          setAttr('class', cls.join(' '));
        }
      }
    }

    write(`<${tag}${renderAttrs(attrs)}>`);

    if (text) {
      write(escapeHtml(text));
    } else if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isPrimitive(child)) {
          write(escapeHtml(`${child}`));
        } else if (child) {
          renderNode(child, write);
        }
      }
    }

    write(`</${tag}>`);
  }
}

export type Attrs = Record<string, string>;

function renderAttrs(attrs: Attrs): string {
  let out = '';
  for (const key in attrs) {
    const val = attrs[key];
    out += ` ${key}`;
    if (val) {
      out += `="${escapeStr(val)}"`;
    }
  }
  return out;
}

export interface WriteFnStr extends WriteFn {
  str: string;
}

export function stringWriter(): WriteFnStr {
  const write = (chunk => {
    write.str += chunk;
  }) as WriteFnStr;
  write.str = '';
  return write;
}

export interface Writable {
  write(chunk: string): void;
}

export function streamWriter(stream: Writable): WriteFn {
  return chunk => {stream.write(chunk);};
}

const STR_CHARS_REGEX = /["&]/g;

function escapeStr(src: string): string {
  return src.replace(STR_CHARS_REGEX, m => m == '"' ? '&#34;' : '&amp;');
}

const HTML_CHARS_REGEX = /[<>&]/g;

function escapeHtml(src: string): string {
  return src.replace(HTML_CHARS_REGEX, m => m == '<' ? '&lt;' : m == '>' ? '&gt;' : '&amp;');
}
