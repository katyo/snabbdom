import {VNode} from '../vnode';
import {Module} from './module';

export type Dataset = Record<string, string>;

export interface VDatasetData {
  dataset?: Dataset;
}

export interface DatasetAPI {
  listDatas(elm: Node): string[];
  getData(elm: Node, key: string): string;
  setData(node: Node, name: string, val: string): void;
  removeData(node: Node, name: string): void;
}

const empty: Dataset = {};

export function datasetModule(api: DatasetAPI): Module<VDatasetData> {
  function readDataset(vnode: VNode<VDatasetData>) {
    const elm = vnode.elm as Node,
      keys = api.listDatas(elm),
      datas: Dataset = {};
    for (const key of keys) {
      if (key != 'sel') {
        datas[key] = api.getData(elm, key);
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
        api.removeData(elm, key);
      }
    }

    for (key in dataset) {
      if (oldDataset[key] !== dataset[key]) {
        api.setData(elm, key, dataset[key]);
      }
    }
  }

  return {read: readDataset, create: updateDataset, update: updateDataset};
}

export default datasetModule;
