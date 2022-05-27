import { BasicService } from '~/services/BasicService'

export interface IToken {
  chain_type: number
  contract: string
  symbol: string
  name: string
  price: string
  decimals: number
  logo: string
  token_id: string
  tag?: string
}

export interface IConfig {
  reverse_record_capacity: number;
  min_change_capacity: number;
  sale_cell_capacity: number;
  min_sell_price: number;
  account_expiration_grace_period: number;
  min_ttl: number;
  profit_rate_of_inviter: string;
  inviter_discount: string;
  min_account_len: number;
  max_account_len: number;
  edit_records_throttle: number;
  edit_manager_throttle: number;
  transfer_throttle: number;
  income_cell_min_transfer_value: number;
  premium: string;
  timestamp_on_chain: number;
}

export default class Common extends BasicService {
  /**
   * get token list
   */
  tokens (): Promise<{ token_list: IToken[] }> {
    return this.axios.post('/token/list')
  }

  /**
   * get config info
   */
  config (): Promise<IConfig> {
    return this.axios.post('/config/info')
  }
}
