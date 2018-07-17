import {VNode, emptyVData as empty} from '../vnode';
import {Module} from '../module';

export type Dataset = Record<string, string>;

export interface VDatasetData {
  dataset?: Dataset;
}

const CAPS_REGEX = /[A-Z]/g;

function toKey(key: string): string {
  return key.replace(CAPS_REGEX, '-$&').toLowerCase();
}

type Api = [
  /*listDatas*/(elm: HTMLElement) => string[],
  /*getData*/(elm: HTMLElement, key: string) => string,
  /*setData*/(elm: HTMLElement, key: string, val: string) => void,
  /*removeData*/(elm: HTMLElement, key: string) => void
];

export function datasetModule(document: Document): Module<VDatasetData> {
  // api

  const [
    listDatas, getData, setData, removeData
  ]: Api = document.createElement('p').dataset ? [
    (elm: HTMLElement) => Object.keys(elm.dataset),
    (elm: HTMLElement, key: string) => elm.dataset[key] as string, // because we gets only existing datas
    (elm: HTMLElement, key: string, val: string) => {elm.dataset[key] = val},
    (elm: HTMLElement, key: string) => {delete elm.dataset[key];}
  ] : [
        (elm: HTMLElement) => {
          const keys: string[] = [];
          const {attributes} = elm;
          for (let i = 0, n = attributes.length; i < n; i++) {
            const key = attributes[i].nodeName;
            if (key.length > 5 && key[4] == '-' && key[0] == 'd' && key[1] == 'a' && key[2] == 't' && key[3] == 'a') {
              keys.push(key.slice(5));
            }
          }
          return keys;
        },
        (elm: HTMLElement, key: string) => elm.getAttribute(`data-${key}`) as string, // because we gets only existing datas
        (elm: HTMLElement, key: string, val: string) => {elm.setAttribute(`data-${toKey(key)}`, val);},
        (elm: HTMLElement, key: string) => {elm.removeAttribute(`data-${toKey(key)}`);}
      ];

  // module

  function readDataset(vnode: VNode<VDatasetData>) {
    const elm = vnode.elm as HTMLElement,
      keys = listDatas(elm),
      datas: Dataset = {};
    for (const key of keys) {
      if (key != 'sel') {
        datas[key] = getData(elm, key);
      }
    }
    (vnode.data as VDatasetData).dataset = datas;
  }

  function updateDataset(oldVnode: VNode<VDatasetData>, vnode: VNode<VDatasetData>) {
    let elm: HTMLElement = vnode.elm as HTMLElement,
      oldDataset = (oldVnode.data as VDatasetData).dataset,
      dataset = (vnode.data as VDatasetData).dataset,
      key: string;

    if (!oldDataset && !dataset) return;
    if (oldDataset === dataset) return;
    oldDataset = oldDataset || empty;
    dataset = dataset || empty;

    for (key in oldDataset) {
      if (!dataset[key]) {
        removeData(elm, key);
      }
    }

    for (key in dataset) {
      if (oldDataset[key] !== dataset[key]) {
        setData(elm, key, dataset[key]);
      }
    }
  }

  return {
    read: readDataset,
    create: updateDataset,
    update: updateDataset
  };
}

export default datasetModule;
