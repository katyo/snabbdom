import {VDatasetData} from '../../modules/dataset';
import {Module} from '../module';

export const datasetModule: Module<VDatasetData> = {
  write(vnode, setAttr) {
    const {dataset} = vnode.data as VDatasetData;
    if (dataset) {
      for (const key in dataset) {
        setAttr(`data-${key}`, dataset[key]);
      }
    }
  }
};

export default datasetModule;
