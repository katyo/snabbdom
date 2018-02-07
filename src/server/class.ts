import {ClassAPI} from '../modules/class';
import {MockElement} from './domapi';

function addClass(elm: MockElement, name: string) {
  if (elm.class.indexOf(name) == -1) {
    elm.class.push(name);
  }
}

function removeClass(elm: MockElement, name: string) {
  const index = elm.class.indexOf(name);
  if (index != -1) {
    elm.class.splice(index, 1);
  }
}

export const classApi: ClassAPI = {addClass, removeClass} as any as ClassAPI;

export default classApi;
