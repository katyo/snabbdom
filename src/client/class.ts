import {ClassAPI} from '../modules/class';

function addClass(elm: Element, name: string) {
  elm.classList.add(name);
}

function removeClass(elm: Element, name: string) {
  elm.classList.remove(name);
}

export const classApi: ClassAPI = {addClass, removeClass};

export default classApi;
