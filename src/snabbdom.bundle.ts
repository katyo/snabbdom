import { init } from './snabbdom';
import { attributesModule } from './modules/attributes'; // for setting attributes on DOM elements
import { classModule } from './modules/class'; // makes it easy to toggle classes
import { propsModule } from './modules/props'; // for setting properties on DOM elements
import { styleModule } from './modules/style'; // handles styling on elements with support for animations
import { eventListenersModule } from './modules/eventlisteners'; // attaches event listeners
import { htmlDomApi } from './client/domapi'; // browser DOM API
import { h } from './h'; // helper function for creating vnodes
var vdom = init([ // Init patch function with choosen modules
    attributesModule,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule
], htmlDomApi);
export const snabbdomBundle = { read: vdom.read as (node: any) => any, patch: vdom.patch as (oldVNode: any, vnode: any) => any, h: h as any };
export default snabbdomBundle;
