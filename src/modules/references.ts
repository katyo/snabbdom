import {VNode} from '../vnode';
import {Module} from '../module';

export type VNodeRef<VData> = { vnode?: VNode<VData> };

export interface VReferenceData<VData> {
  ref?: VNodeRef<VData>;
}

export function referencesModule<VData>(): Module<VReferenceData<VData>> {
  // module

  function updateReferences(oldVnode: VNode<VReferenceData<VData>>, vnode?: VNode<VReferenceData<VData>>): void {
    const {ref: oldRef} = oldVnode.data as VReferenceData<VReferenceData<VData>>,
      ref = vnode && (vnode.data as VReferenceData<VReferenceData<VData>>).ref;

    if (oldRef) {
      // remove old reference to help gc collect old vnode
      oldRef.vnode = undefined;
    }
    
    if (ref) {
      // set new reference to current vnode
      ref.vnode = vnode;
    }
  }

  return {
    create: updateReferences,
    update: updateReferences,
    destroy: updateReferences
  };
}

export default referencesModule;
