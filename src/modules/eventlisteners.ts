import {VNode} from '../vnode';
import {Module} from '../module';

export interface VEventListener<Event, VData> {
  (event: Event, vnode: VNode<VData>): void;
}

export type On<VData> =
  {[Name in keyof HTMLElementEventMap]?: VEventListener<HTMLElementEventMap[Name], VData>}
  & {[event: string]: VEventListener<Event, VData>};

export interface VEventData<VData> {
  on?: On<VData>;
}

function invokeHandler<VData>(handler: any, vnode?: VNode<VEventData<VData>>, event?: Event): void {
  if (typeof handler === "function") {
    // call function handler
    handler.call(vnode, event, vnode);
  } else if (typeof handler === "object") {
    // call handler with arguments
    if (typeof handler[0] === "function") {
      // special case for single argument for performance
      if (handler.length === 2) {
        handler[0].call(vnode, handler[1], event, vnode);
      } else {
        const args = handler.slice(1);
        args.push(event);
        args.push(vnode);
        handler[0].apply(vnode, args);
      }
    } else {
      // call multiple handlers
      for (let i = 0; i < handler.length; i++) {
        invokeHandler(handler[i]);
      }
    }
  }
}

function handleEvent<VData>(event: Event, vnode: VNode<VEventData<VData>>) {
  const name = event.type,
    {on} = vnode.data as VEventData<VData>;

  // call event handler(s) if exists
  if (on && on[name]) {
    invokeHandler(on[name], vnode, event);
  }
}

function createListener() {
  return function handler(event: Event) {
    handleEvent(event, (handler as any).vnode);
  }
}

declare global {
  // Add IE-specific interfaces to Window
  interface Element {
    attachEvent(event: string, listener: EventListener): boolean;
    detachEvent(event: string, listener: EventListener): void;
  }
  interface Document {
    attachEvent(event: string, listener: EventListener): boolean;
    detachEvent(event: string, listener: EventListener): void;
  }
}

type Api = [
  /*addEvent*/(elm: Element, name: string, fn: (event: Event) => void) => void,
  /*removeEvent*/(elm: Element, name: string, fn: (event: Event) => void) => void
];

export function eventListenersModule<VData>(document: Document): Module<VEventData<VData>> {
  // api

  const [addEvent, removeEvent]: Api = document.addEventListener ? [
    (elm: Element, name: string, fn: (event: Event) => void) => {
      elm.addEventListener(name, fn, false);
    },
    (elm: Element, name: string, fn: (event: Event) => void) => {
      elm.removeEventListener(name, fn, false);
    }
  ] : document.attachEvent ? [
    (elm: Element, name: string, fn: (event: Event) => void) => {
      elm.attachEvent(`on${name}`, fn);
    },
    (elm: Element, name: string, fn: (event: Event) => void) => {
      elm.detachEvent(`on${name}`, fn);
    }
  ] : [
        (elm: Element, name: string, fn: (event: Event) => void) => {
          (elm as any)[`on${name}`] = fn;
        },
        (elm: Element, name: string, fn: (event: Event) => void) => {
          delete (elm as any)[`on${name}`];
        }
      ];

  // module

  function updateEventListeners(oldVnode: VNode<VEventData<VData>>, vnode?: VNode<VEventData<VData>>): void {
    const {on: oldOn} = oldVnode.data as VEventData<VData>,
      oldListener = (oldVnode as any).listener,
      oldElm = oldVnode.elm as Element,
      on = vnode && (vnode.data as VEventData<VData>).on,
      elm = (vnode && vnode.elm) as Element;
    let name: string;

    // optimization for reused immutable handlers
    if (oldOn === on) {
      return;
    }

    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
      // if element changed or deleted we remove all existing listeners unconditionally
      if (!on) {
        for (name in oldOn) {
          // remove listener if element was changed or existing listeners removed
          removeEvent(oldElm, name, oldListener);
        }
      } else {
        for (name in oldOn) {
          // remove listener if existing listener removed
          if (!on[name]) {
            removeEvent(oldElm, name, oldListener);
          }
        }
      }
    }

    // add new listeners which has not already attached
    if (on) {
      // reuse existing listener or create new
      const listener = (vnode as any).listener = (oldVnode as any).listener || createListener();
      // update vnode for listener
      listener.vnode = vnode;

      // if element changed or added we add all needed listeners unconditionally
      if (!oldOn) {
        for (name in on) {
          // add listener if element was changed or new listeners added
          addEvent(elm, name, listener);
        }
      } else {
        for (name in on) {
          // add listener if new listener added
          if (!oldOn[name]) {
            addEvent(elm, name, listener);
          }
        }
      }
    }
  }

  return {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
  };
}

export default eventListenersModule;
