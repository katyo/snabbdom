import {AttrVal, AttrsAPI} from '../modules/attributes';

// because those in TypeScript are too restrictive: https://github.com/Microsoft/TSJS-lib-generator/pull/237
type SetAttribute = (name: string, value: string | number | boolean) => void;
type SetAttributeNS = (namespaceURI: string, qualifiedName: string, value: string | number | boolean) => void;

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';

function setAttr(elm: Element, key: string, val: AttrVal) {
  if (val === true) {
    elm.setAttribute(key, "");
  } else if (val === false) {
    elm.removeAttribute(key);
  } else {
    if (key[0] != 'x') {
      (elm.setAttribute as SetAttribute)(key, val);
    } else if (key[3] == ':') {
      // Assume xml namespace
      (elm.setAttributeNS as SetAttributeNS)(xmlNS, key, val);
    } else if (key[5] == ':') {
      // Assume xlink namespace
      (elm.setAttributeNS as SetAttributeNS)(xlinkNS, key, val);
    } else {
      (elm.setAttribute as SetAttribute)(key, val);
    }
  }
}

function removeAttr(elm: Element, key: string) {
  elm.removeAttribute(key);
}

export const attributesApi: AttrsAPI = {setAttr, removeAttr};

export default attributesApi;
