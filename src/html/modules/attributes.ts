import {VAttrsData} from '../../modules/attributes';
import {Module} from '../module';

export const attributesModule: Module<VAttrsData> = {
  write(vnode, setAttr) {
    const {attrs} = vnode.data as VAttrsData;
    if (attrs) {
      for (const key in attrs) {
        const v = attrs[key], t = typeof v;
        if (t != 'boolean' || v) {
          setAttr(key, t != 'boolean' ? (t == 'string' ? v as string : `${v}`) : '');
        }
      }
    }
  }
};

export default attributesModule;
