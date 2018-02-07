import {PropsAPI, PropVal} from '../modules/props';

function getProp(elm: Node, key: string) {
  return (elm as any)[key];
}

function setProp(elm: Node, key: string, val: PropVal) {
  (elm as any)[key] = val;
}

function removeProp(elm: Node, key: string) {
  delete (elm as any)[key];
}

export const propsApi: PropsAPI = {getProp, setProp, removeProp};

export default propsApi;
