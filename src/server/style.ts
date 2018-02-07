import {StyleAPI} from '../modules/style';
import {MockElement} from './domapi';

function setStyle(elm: MockElement, name: string, val: string, next: boolean = false) {
  elm.style[name] = val;
}

function removeStyle(elm: MockElement, name: string) {
  delete elm.style[name];
}

function onTransEnd(elm: MockElement, names: string[], callback: () => void) {
  callback();
}

export const styleApi: StyleAPI = {setStyle, removeStyle, onTransEnd} as any as StyleAPI;

export default styleApi;
