import {DatasetAPI} from '../modules/dataset';
import {MockElement} from './domapi';

const CAPS_REGEX = /[A-Z]/g;

function toKey(key: string): string {
  return key.replace(CAPS_REGEX, '-$&').toLowerCase();
}

function setData(elm: MockElement, key: string, val: string) {
  elm.attrs[`data-${toKey(key)}`] = val;
}

function removeData(elm: MockElement, key: string) {
  delete elm.attrs[`data-${toKey(key)}`];
}

export const datasetApi: DatasetAPI = {setData, removeData} as any as DatasetAPI;

export default datasetApi;
