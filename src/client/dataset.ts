import {DatasetAPI} from '../modules/dataset';

const CAPS_REGEX = /[A-Z]/g;

function setData(elm: HTMLElement, key: string, val: string) {
  const d = elm.dataset;

  if (d) {
    d[key] = val;
  } else {
    elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), val);
  }
}

function removeData(elm: HTMLElement, key: string) {
  const d = elm.dataset;

  if (d) {
    if (key in d) {
      delete d[key];
    }
  } else {
    elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
  }
}

export const datasetApi: DatasetAPI = {setData, removeData} as DatasetAPI;

export default datasetApi;
