import {VNode} from '../vnode';
import {Module} from './module';

export type Dataset = Record<string, string>;

export interface VDatasetData {
  dataset?: Dataset;
}

export interface DatasetAPI {
  setData(node: Node, name: string, val: string): void;
  removeData(node: Node, name: string): void;
}

export function datasetModule(api: DatasetAPI): Module<VDatasetData> {
  function updateDataset(oldVnode: VNode<VDatasetData>, vnode: VNode<VDatasetData>): void {
    let elm: HTMLElement = vnode.elm as HTMLElement,
      oldDataset = (oldVnode.data as VDatasetData).dataset,
      dataset = (vnode.data as VDatasetData).dataset,
      key: string;

    if (!oldDataset && !dataset) return;
    if (oldDataset === dataset) return;
    oldDataset = oldDataset || {};
    dataset = dataset || {};

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

  return {create: updateDataset, update: updateDataset};
}

export default datasetModule;
