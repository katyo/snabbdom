import {AttrVal, AttrsAPI} from '../modules/attributes';
import {MockElement} from './domapi';

function setAttr(elm: MockElement, key: string, val: AttrVal) {
  elm.attrs[key] = val;
}

function removeAttr(elm: MockElement, key: string) {
  delete elm.attrs[key];
}

export const attributesApi: AttrsAPI = {setAttr, removeAttr} as any as AttrsAPI;

export default attributesApi;
