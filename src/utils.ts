import {VKey} from './vnode';

export const isArray: (v: any) => v is any[] = Array.isArray || (v => v instanceof Array);

export function isPrimitive(s: any): s is (string | number | boolean) {
  const t = typeof s;
  return t == 'string' || t == 'number' || t == 'boolean';
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
