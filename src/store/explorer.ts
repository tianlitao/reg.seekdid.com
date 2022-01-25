import { ActionTree, MutationTree } from 'vuex'
import { augmentKeys } from '~/modules/tools'

const keys = {
  namespace: 'explorer'
  // mutations
  // actions
}

export const state = () => ({

})

export type ExplorerState = ReturnType<typeof state>

export const mutations: MutationTree<ExplorerState> = {

}

export const actions: ActionTree<ExplorerState, ExplorerState> = {

}

export const EXPLORER_KEYS = augmentKeys(keys, keys.namespace)
