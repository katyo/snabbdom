import {VNode} from '../vnode';
import {Module} from './module';

export type Dataset = Record<string, string>;

export interface VDatasetData {
  dataset?: Dataset;
}

const CAPS_REGEX = /[A-Z]/g;

function updateDataset(oldVnode: VNode<VDatasetData>, vnode: VNode<VDatasetData>): void {
  let elm: HTMLElement = vnode.elm as HTMLElement,
    oldDataset = (oldVnode.data as VDatasetData).dataset,
    dataset = (vnode.data as VDatasetData).dataset,
    key: string;

  if (!oldDataset && !dataset) return;
  if (oldDataset === dataset) return;
  oldDataset = oldDataset || {};
  dataset = dataset || {};
  const d = elm.dataset;

  for (key in oldDataset) {
    if (!dataset[key]) {
      if (d) {
        if (key in d) {
          delete d[key];
        }
      } else {
        elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
      }
    }
  }
  for (key in dataset) {
    if (oldDataset[key] !== dataset[key]) {
      if (d) {
        d[key] = dataset[key];
      } else {
        elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
      }
    }
  }
}

export const datasetModule: Module<VDatasetData> = {create: updateDataset, update: updateDataset};

export default datasetModule;
