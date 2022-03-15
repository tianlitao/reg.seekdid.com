import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { augmentKeys, chainIdHexToNumber } from '~/modules/tools'
import { BSC, ETH, IMainChain, Polygon } from '~/constant/chain'
import { IAccountInfo } from '~/services/Account'

export interface IConnectedAccount {
  address: string
  chain: IMainChain,
  walletName: string
}

const keys = {
  namespace: 'me',
  // mutations
  setInviter: 'setInviter',
  setChannel: 'setChannel',
  setConnectedAccount: 'setConnectedAccount',
  setLoggedIn: 'setLoggedIn',
  setRegisteringAccounts: 'setRegisteringAccounts',
  // actions
  fetchRegisteringAccounts: 'fetchRegisteringAccounts',
  // getters
  computedChainId: 'computedChainId',
  computedEvmChainId: 'computedEvmChainId'
}

export const state = () => ({
  inviter: '',
  channel: '',
  connectedAccount: {
    address: ''
  } as IConnectedAccount,
  loggedIn: false,
  registeringAccounts: [] as IAccountInfo[]
})

export type MeState = ReturnType<typeof state>

export const mutations: MutationTree<MeState> = {
  [keys.setInviter]: (state, inviter: string) => {
    state.inviter = inviter
  },
  [keys.setChannel]: (state, channel: string) => {
    state.channel = channel
  },
  [keys.setConnectedAccount]: (state, connectedAccount: IConnectedAccount) => {
    state.connectedAccount = connectedAccount
    state.loggedIn = true
  },
  [keys.setLoggedIn]: (state, status: boolean) => {
    state.loggedIn = status
  },
  [keys.setRegisteringAccounts]: (state, accounts: IAccountInfo[]) => {
    state.registeringAccounts = accounts
  }
}

export const actions: ActionTree<MeState, MeState> = {
  async [keys.fetchRegisteringAccounts] ({ commit, state, getters }) {
    if (!state.connectedAccount.address) {
      return
    }
    try {
      const res = await this.$services.account.registeringAccounts({
        chain_type: getters[keys.computedChainId],
        address: state.connectedAccount.address
      })
      commit(keys.setRegisteringAccounts, res && res.registering_accounts)
    }
    catch (err) {
      console.error(err)
      throw err
    }
  }
}

export const getters: GetterTree<MeState, MeState> = {
  [keys.computedChainId] (state): number {
    const chainId = state.connectedAccount.chain?.chainId
    if ([BSC.chainId, Polygon.chainId].includes(chainId)) {
      return ETH.chainId
    }
    return chainId
  },
  [keys.computedEvmChainId] (): number {
    const { ethereum } = window
    if (typeof ethereum !== 'undefined' && (ethereum.networkVersion || ethereum.chainId)) {
      return chainIdHexToNumber(ethereum.networkVersion || ethereum.chainId)
    }
    else {
      return 0
    }
  }
}

export const ME_KEYS = augmentKeys(keys, keys.namespace)
