import {VStyleData} from '../../modules/style';
import {Module} from '../module';

export const styleModule: Module<VStyleData> = {
  write(vnode, setAttr) {
    const {style} = vnode.data as VStyleData;
    if (style) {
      const props: string[] = [];
      for (const key in style) {
        props.push(`${key}:${this.style[key]}`);
      }
      if (props.length) {
        setAttr('style', props.join(';'));
      }
    }
  }
};

export default styleModule;
