import {VNode, VBaseData, VHooksData} from './vnode';
import {init} from './snabbdom';
import {Module, ModuleHooks} from './modules/module';
import {attributesModule, VAttrsData} from './modules/attributes'; // for setting attributes on DOM elements
import {classModule, VClassData} from './modules/class'; // makes it easy to toggle classes
import {propsModule, VPropsData} from './modules/props'; // for setting properties on DOM elements
import {styleModule, VStyleData} from './modules/style'; // handles styling on elements with support for animations
import {eventListenersModule, VEventData} from './modules/eventlisteners'; // attaches event listeners
import {datasetModule, VDatasetData} from './modules/dataset'; // handles dataset
import {htmlDomApi} from './client/domapi'; // browser DOM API
import {attributesApi} from './client/attributes';
import {classApi} from './client/class';
import {propsApi} from './client/props';
import {styleApi} from './client/style';
import {eventListenersApi} from './client/eventlisteners';
import {datasetApi} from './client/dataset';
import {h} from './h'; // helper function for creating vnodes
export interface VData extends VBaseData, VHooksData<VData>, VAttrsData, VClassData, VPropsData, VStyleData, VEventData<VData>, VDatasetData {}
export const snabbdomModules: Module<VData>[] = [
  attributesModule(attributesApi),
  classModule(classApi),
  propsModule(propsApi),
  styleModule(styleApi),
  eventListenersModule(eventListenersApi),
  datasetModule(datasetApi),
];
// Init patch function with choosen modules
const {read, patch} = init(snabbdomModules, htmlDomApi(document));
export {VNode, Module, ModuleHooks};
export const snabbdomBundle = {read, patch, h};
export default snabbdomBundle;
