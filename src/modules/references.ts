import {VNode, VKey} from '../vnode';
import {Module} from '../module';
import {isArray} from '../utils';

export type VNodeRef<VData, Tag extends VKey = 'vnode'> = { [T in Tag]?: VNode<VData> };

export type VNodeRefTagged<VData, Tag extends VKey = 'vnode'> = [VNodeRef<VData, Tag>, Tag];

export interface VReferenceData<VData> {
  ref?: VNodeRef<VData> | VNodeRefTagged<VData, VKey>;
}

export function referencesModule<VData>(): Module<VReferenceData<VData>> {
  // module

  function updateReferences(oldVnode: VNode<VReferenceData<VData>>, vnode?: VNode<VReferenceData<VData>>): void {
    const {ref: oldRef} = oldVnode.data as VReferenceData<VReferenceData<VData>>,
      ref = vnode && (vnode.data as VReferenceData<VReferenceData<VData>>).ref;

    if (oldRef) {
      // remove old reference to help gc collect old vnode
      if (isArray(oldRef)) {
        oldRef[0][oldRef[1]] = undefined;
      } else {
        oldRef.vnode = undefined;
      }
    }
    
    if (ref) {
      // set new reference to current vnode
      if (isArray(ref)) {
        ref[0][ref[1]] = vnode;
      } else {
        ref.vnode = vnode;
      }
    }
  }

  return {
    create: updateReferences,
    update: updateReferences,
    destroy: updateReferences
  };
}

export default referencesModule;
