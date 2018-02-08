import {DatasetAPI} from '../modules/dataset';

const CAPS_REGEX = /[A-Z]/g;

function toKey(key: string): string {
  return key.replace(CAPS_REGEX, '-$&').toLowerCase();
}

function listDatas(elm: HTMLElement): string[] {
  const d = elm.dataset;

  if (d) {
    return Object.keys(d);
  } else {
    const keys: string[] = [];
    const {attributes} = elm;
    for (let i = 0, n = attributes.length; i < n; i++) {
      const key = attributes[i].nodeName;
      if (key.length > 5 && key[4] == '-' && key[0] == 'd' && key[1] == 'a' && key[2] == 't' && key[3] == 'a') {
        keys.push(key.slice(5));
      }
    }
    return keys;
  }
}

function getData(elm: HTMLElement, key: string): string {
  const d = elm.dataset;
  return (d ? d[key] : elm.getAttribute(`data-${key}`)) as string;
}

function setData(elm: HTMLElement, key: string, val: string) {
  const d = elm.dataset;

  if (d) {
    d[key] = val;
  } else {
    elm.setAttribute(`data-${toKey(key)}`, val);
  }
}

function removeData(elm: HTMLElement, key: string) {
  const d = elm.dataset;

  if (d) {
    if (key in d) {
      delete d[key];
    }
  } else {
    elm.removeAttribute(`data-${toKey(key)}`);
  }
}

export const datasetApi: DatasetAPI = {listDatas, getData, setData, removeData} as DatasetAPI;

export default datasetApi;
