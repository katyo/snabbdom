import {StyleAPI} from '../modules/style';
import {MockElement} from './domapi';

function listStyle(elm: MockElement): string[] {
  return Object.keys(elm.style);
}

function getStyle(elm: MockElement, name: string): string {
  return elm.style[name] as string;
}

function setStyle(elm: MockElement, name: string, val: string, next: boolean = false) {
  elm.style[name] = val;
}

function removeStyle(elm: MockElement, name: string) {
  delete elm.style[name];
}

function onTransEnd(elm: MockElement, names: string[], callback: () => void) {
  callback();
}

export const styleApi: StyleAPI = {listStyle, getStyle, setStyle, removeStyle, onTransEnd} as any as StyleAPI;

export default styleApi;
