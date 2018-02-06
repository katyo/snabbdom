import {VNode, VBaseData, VHooksData} from './vnode';
import {init} from './snabbdom';
import {Module, ModuleHooks} from './modules/module';
import {attributesModule, VAttrsData} from './modules/attributes'; // for setting attributes on DOM elements
import {classModule, VClassData} from './modules/class'; // makes it easy to toggle classes
import {propsModule, VPropsData} from './modules/props'; // for setting properties on DOM elements
import {styleModule, VStyleData} from './modules/style'; // handles styling on elements with support for animations
import {eventListenersModule, VEventData} from './modules/eventlisteners'; // attaches event listeners
import {htmlDomApi} from './client/domapi'; // browser DOM API
import {h} from './h'; // helper function for creating vnodes
export interface VData extends VBaseData, VHooksData<VData>, VAttrsData, VClassData, VPropsData, VStyleData, VEventData {}
export const snabbdomModules: Module<VData>[] = [
  attributesModule,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
];
// Init patch function with choosen modules
const {read, patch} = init(snabbdomModules, htmlDomApi);
export {VNode, Module, ModuleHooks};
export const snabbdomBundle = {read, patch, h};
export default snabbdomBundle;
