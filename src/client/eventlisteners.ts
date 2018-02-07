import {EventAPI} from '../modules/eventlisteners';

function addEvent(elm: Element, name: string, fn: (event: Event) => void) {
  elm.addEventListener(name, fn, false);
}

function removeEvent(elm: Element, name: string, fn: (event: Event) => void) {
  elm.removeEventListener(name, fn, false);
}

export const eventListenersApi: EventAPI = {addEvent, removeEvent};

export default eventListenersApi;
