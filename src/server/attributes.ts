import {AttrVal, AttrsAPI} from '../modules/attributes';
import {MockElement} from './domapi';

function listAttrs(elm: MockElement): string[] {
  return Object.keys(elm.attrs);
}

function getAttr(elm: MockElement, key: string): AttrVal {
  return elm.attrs[key];
}

function setAttr(elm: MockElement, key: string, val: AttrVal) {
  elm.attrs[key] = val;
}

function removeAttr(elm: MockElement, key: string) {
  delete elm.attrs[key];
}

export const attributesApi: AttrsAPI = {listAttrs, getAttr, setAttr, removeAttr} as any as AttrsAPI;

export default attributesApi;
