import { BasicService } from '~/services/BasicService'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX } from '~/constant'
import { ChainType } from '~/constant/chain'
import { splitAccount } from '~/modules/tools'

export interface IRegisterTxMap {
  chain_id: number
  hash: string
  token_id: string
}

export interface ISearchAccount {
  status: ACCOUNT_STATUS
  account: string
  is_self: boolean
  account_price: string
  base_amount: string
  register_tx_map: { [key: string]: IRegisterTxMap }
}

export default class Explorer extends BasicService {
  /**
   * search account
   * @param account
   * @param chain_type
   * @param address
   */
  searchAccount ({
    account,
    chain_type,
    address
  }: {
    account: string,
    chain_type: ChainType,
    address: string
  }): Promise<ISearchAccount> {
    account = account.replace(/\.bit$/, '')
    return this.axios.post('/account/search', {
      account: account + ACCOUNT_SUFFIX,
      chain_type,
      address,
      account_char_str: splitAccount(account, true)
    })
  }
}
