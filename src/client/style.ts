import {StyleAPI} from '../modules/style';

const raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
function nextFrame(fn: () => void) {
  raf(() => {
    raf(fn);
  });
}

function setStyle(elm: HTMLElement, name: string, val: string, next: boolean = false) {
  const fn = name[0] === '-' && name[1] === '-' ?
    function () {
      elm.style.setProperty(name, val);
    } :
    function () {
      (elm.style as any)[name] = val;
    };

  if (!next) {
    fn();
  } else {
    nextFrame(fn);
  }
}

function removeStyle(elm: HTMLElement, name: string) {
  if (name[0] == '-' && name[1] == '-') {
    elm.style.removeProperty(name);
  } else {
    (elm.style as any)[name] = '';
  }
}

function onTransEnd(elm: HTMLElement, names: string[], callback: () => void) {
  const compStyle: CSSStyleDeclaration = getComputedStyle(elm as Element);
  const props = (compStyle as any)['transition-property'].split(', ');
  let amount = 0;
  for (let i = 0; i < props.length; ++i) {
    if (names.indexOf(props[i]) !== -1) amount++;
  }
  (elm as Element).addEventListener('transitionend', (ev: TransitionEvent) => {
    if (ev.target === elm)--amount;
    if (amount === 0) callback();
  });
}

export const styleApi: StyleAPI = {setStyle, removeStyle, onTransEnd};

export default styleApi;
