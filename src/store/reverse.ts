import { ActionTree, MutationTree } from 'vuex'
import { augmentKeys } from '~/modules/tools'
import { IAccountListRes, IReverseLatestRes } from '~/services/DasReverse'
import { ME_KEYS } from '~/store/me'

const keys = {
  namespace: 'reverse',
  // mutations
  setAccountList: 'setAccountList',
  setDasReverse: 'setDasReverse',
  // actions
  fetchAccountList: 'fetchAccountList',
  fetchDasReverse: 'fetchDasReverse'
}

export const state = () => ({
  accountList: [] as IAccountListRes[],
  dasReverse: {
    account: '',
    is_valid: false
  } as IReverseLatestRes
})

export type CommonState = ReturnType<typeof state>

export const mutations: MutationTree<CommonState> = {
  [keys.setAccountList]: (state, accountList: IAccountListRes[]) => {
    state.accountList = accountList
  },
  [keys.setDasReverse]: (state, dasReverse: IReverseLatestRes) => {
    state.dasReverse = dasReverse
  },
  [keys.setAccountList]: (state, accountList: IAccountListRes[]) => {
    state.accountList = accountList
  }
}

export const actions: ActionTree<CommonState, CommonState> = {
  async [keys.fetchAccountList] ({ rootState, commit, rootGetters }) {
    try {
      const chainType = rootGetters[ME_KEYS.computedChainType]
      // @ts-ignore
      const address = rootState.me.connectedAccount.address

      if (!chainType || !address) {
        return
      }

      const res = await this.$services.dasReverse.accountList({
        chainType,
        address
      })
      if (res && res.list) {
        commit(keys.setAccountList, res.list)
      }
    }
    catch (err) {
      console.error(err)
      throw err
    }
  },
  async [keys.fetchDasReverse] ({ commit, rootState, rootGetters }) {
    // @ts-ignore
    const connectedAccount = rootState.me.connectedAccount
    if (!connectedAccount.address) {
      return
    }
    try {
      const res = await this.$services.dasReverse.reverseLatest({
        chainType: rootGetters[ME_KEYS.computedChainType],
        address: connectedAccount.address
      })
      if (res) {
        commit(keys.setDasReverse, res)
      }
    }
    catch (err) {
      console.error(err)
      throw err
    }
  }
}

export const REVERSE_KEYS = augmentKeys(keys, keys.namespace)
