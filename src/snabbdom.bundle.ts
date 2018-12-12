import {VNode, VBaseData, VHooksData} from './vnode';
import {Module, ModuleHooks} from './module';
import {Read, Patch, init} from './snabbdom';
import {attributesModule, VAttrsData} from './modules/attributes'; // for setting attributes on DOM elements
import {classModule, VClassData} from './modules/class'; // makes it easy to toggle classes
import {propsModule, VPropsData} from './modules/props'; // for setting properties on DOM elements
import {styleModule, VStyleData} from './modules/style'; // handles styling on elements with support for animations
import {eventListenersModule, VEventData} from './modules/eventlisteners'; // attaches event listeners
import {datasetModule, VDatasetData} from './modules/dataset'; // handles dataset
import {referencesModule, VReferenceData} from './modules/references'; // handles references to vnode
import {h} from './h'; // helper function for creating vnodes
export interface VData extends VBaseData, VHooksData<VData>, VAttrsData, VClassData, VPropsData, VStyleData, VEventData<VData>, VDatasetData, VReferenceData<VData> {}
export const snabbdomModules: Module<VData>[] = [
  attributesModule(),
  classModule(document),
  propsModule(),
  styleModule(window.requestAnimationFrame || setTimeout),
  eventListenersModule(document),
  datasetModule(document),
  referencesModule(),
];
// Init patch function with choosen modules
const {read, patch} = init(snabbdomModules, document);
export {VNode, Module, ModuleHooks, Read, Patch};
export const snabbdomBundle = {read, patch, h};
export default snabbdomBundle;
