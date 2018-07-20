import {VStyleData} from '../../modules/style';
import {Module} from '../module';

export const styleModule: Module<VStyleData> = {
  write(vnode, setAttr) {
    const {style} = vnode.data as VStyleData;
    if (style) {
      const props: string[] = [];
      for (const key in style) {
        const val = style[key];
        if (val) props.push(`${key}:${val}`);
      }
      if (props.length) {
        setAttr('style', props.join(';'));
      }
    }
  }
};

export default styleModule;
