import { ActionTree, MutationTree } from 'vuex'
import { augmentKeys } from '~/modules/tools'
import { IConfig, IToken } from '~/services/Common'
import { CKB, DASBalanceTokenId } from '~/constant/chain'

const keys = {
  namespace: 'common',
  // mutations
  setTokens: 'setTokens',
  setConfig: 'setConfig',
  setHardwareWalletTipsShow: 'setHardwareWalletTipsShow',
  // actions
  fetchTokens: 'fetchTokens',
  fetchConfig: 'fetchConfig'
}

export const state = () => ({
  tokens: [] as IToken[],
  config: {} as IConfig,
  hardwareWalletTipsShow: true
})

export type CommonState = ReturnType<typeof state>

export const mutations: MutationTree<CommonState> = {
  [keys.setTokens]: (state, tokens: IToken[]) => {
    state.tokens = tokens
  },
  [keys.setConfig]: (state, config: IConfig) => {
    state.config = config
  },
  [keys.setHardwareWalletTipsShow]: (state, value: boolean) => {
    state.hardwareWalletTipsShow = value
  }
}

export const actions: ActionTree<CommonState, CommonState> = {
  async [keys.fetchTokens] ({ commit }) {
    try {
      const res = await this.$services.common.tokens()
      if (res && res.token_list && res.token_list.length > 0) {
        let portalWalletCkb = res.token_list.find((option: IToken) => {
          return option.token_id === CKB.tokenId
        })

        const otherToken = res.token_list.filter((option: IToken) => {
          return option.token_id !== CKB.tokenId
        })

        // @ts-ignore
        portalWalletCkb = {
          ...portalWalletCkb,
          name: 'Portal Wallet'
        }

        commit(keys.setTokens, res && [...otherToken, {
          ...portalWalletCkb,
          logo: '/images/components/das-balance.svg',
          name: '.bit Balance',
          token_id: DASBalanceTokenId
        }, portalWalletCkb])
      }
    }
    catch (err) {
      console.error(err)
      throw err
    }
  },
  async [keys.fetchConfig] ({ commit }) {
    try {
      const res = await this.$services.common.config()
      if (res) {
        commit(keys.setConfig, res)
      }
    }
    catch (err) {
      console.error(err)
      throw err
    }
  }
}

export const COMMON_KEYS = augmentKeys(keys, keys.namespace)
