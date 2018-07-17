import {VClassData} from '../../modules/class';
import {Module} from '../module';

export const classModule: Module<VClassData> = {
  write(vnode, setAttr) {
    const {class: classes} = vnode.data as VClassData;
    if (classes) {
      const list: string[] = [];
      for (const key in classes) {
        if (classes[key]) {
          list.push(key);
        }
      }
      if (list.length) {
        setAttr('class', list.join(' '));
      }
    }
  }
};

export default classModule;
