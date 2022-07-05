import Axios from 'axios'
import { Context } from '@nuxt/types'
import { BasicService } from '~/services/BasicService'
import { crossEthApi } from '~~/config'
import { onFulfilled, onRejected } from '~/services/interceptors'
import { CrossDirection, DEFAULT_PAGE_SIZE } from '~/constant'

export interface IKeyInfo {
  coin_type: string,
  chain_id?: string,
  key: string,
}

export interface IWaitSignMsgList {
  sign_type: number,
  sign_msg: string,
}

export interface ILockAccountParmas {
  type?: string,
  key_info: IKeyInfo,
  account: string
}

export interface ILockMintStatusParmas extends ILockAccountParmas {}

export interface IMintOrderPayInfoParmas extends ILockAccountParmas {}

export interface ILockAccountRes {
  sign_key: string,
  sign_list: IWaitSignMsgList[],
  mm_json: string,
}

export interface ITrxSendParmas {
  sign_key: string,
  sign_list: IWaitSignMsgList[],
}

export interface IMintSignInfoParmas extends ILockAccountParmas {}

export interface IMintSignInfoRes {
  account: string,
  data: string,
  gnosis_signatures: any[]
}

export interface IPendingHashParmas {
  type?: string,
  key_info: IKeyInfo,
  account: string,
  hash: string,
  direction: number
}

export interface IDirectionListParmas {
  type?: string,
  key_info: IKeyInfo,
  page?: number,
  size?: number,
}

export interface IDirectionList {
  account: string,
  cross_direction: CrossDirection,
  recycle_hash: string
}

export interface IDirectionListRes {
  total: number,
  list: IDirectionList[],
}

export interface IDidNftListParmas extends IDirectionListParmas {
  keyword?: string
}

export interface IDidNftList {
  coin_type: string,
  account: string,
  uuid: string,
  expire_at: number
}

export interface IDidNftListRes {
  total: number,
  list: IDidNftList[]
}

export interface ILockMintStatusRes {
  account: string,
  lock_hash: string,
  mint_hash: string,
  status: number,
}

export interface IMintOrderPayInfoRes {
  account: string,
  amount: string,
  order_id: string,
  receipt_address: string,
}

export interface IMintOrderPayHashParmas {
  type?: string,
  key_info: IKeyInfo,
  order_id: string,
  pay_hash: string,
}

export default class CrossEth extends BasicService {
  constructor (context: Context) {
    super(context)
    this.axios = Axios.create({
      baseURL: crossEthApi,
      withCredentials: true
    })
    this.axios.interceptors.response.use(onFulfilled(context), onRejected)
  }

  /**
   * get processing Nfts
   * @param type
   * @param key_info
   * @param account
   */
  lockAccount ({
    type = 'blockchain',
    key_info,
    account
  }: ILockAccountParmas): Promise<ILockAccountRes> {
    return this.axios.post('/lock/account', {
      type,
      key_info,
      account
    })
  }

  /**
   * transaction send
   * @param sign_key
   * @param sign_list
   */
  trxSend ({
    sign_key,
    sign_list
  }: ITrxSendParmas): Promise<{ hash: string }> {
    return this.axios.post('/transaction/send', {
      sign_key,
      sign_list
    })
  }

  /**
   * mint sign info
   * @param type
   * @param key_info
   * @param account
   */
  mintSignInfo ({
    type = 'blockchain',
    key_info,
    account
  }: IMintSignInfoParmas): Promise<IMintSignInfoRes> {
    return this.axios.post('/mint/sign/info', {
      type,
      key_info,
      account
    })
  }

  /**
   * pending hash
   * @param type
   * @param key_info
   * @param account
   * @param hash
   * @param direction
   */
  pendingHash ({
    type = 'blockchain',
    key_info,
    account,
    hash,
    direction
  }: IPendingHashParmas): Promise<void> {
    return this.axios.post('/pending/hash', {
      type,
      key_info,
      account,
      hash,
      direction
    })
  }

  /**
   * direction list
   * @param type
   * @param key_info
   * @param page
   * @param size
   */
  directionList ({
    type = 'blockchain',
    key_info,
    page = 1,
    size = DEFAULT_PAGE_SIZE
  }: IDirectionListParmas): Promise<IDirectionListRes> {
    return this.axios.post('/direction/list', {
      type,
      key_info,
      page,
      size
    })
  }

  /**
   * did nft list
   * @param type
   * @param key_info
   * @param keyword
   * @param page
   * @param size
   */
  didNftList ({
    type = 'blockchain',
    key_info,
    keyword,
    page = 1,
    size = DEFAULT_PAGE_SIZE
  }: IDidNftListParmas): Promise<IDidNftListRes> {
    return this.axios.post('/did/nft/list', {
      type,
      key_info,
      keyword,
      page,
      size
    })
  }

  /**
   * lock mint status
   * @param type
   * @param key_info
   * @param account
   */
  lockMintStatus ({
    type = 'blockchain',
    key_info,
    account
  }: ILockMintStatusParmas): Promise<ILockMintStatusRes> {
    return this.axios.post('/lock/mint/status', {
      type,
      key_info,
      account
    })
  }

  /**
   * mint order pay info
   * @param type
   * @param key_info
   * @param account
   */
  mintOrderPayInfo ({
    type = 'blockchain',
    key_info,
    account
  }: IMintOrderPayInfoParmas): Promise<IMintOrderPayInfoRes> {
    return this.axios.post('/mint/order/pay/info', {
      type,
      key_info,
      account
    })
  }

  /**
   * mint order pay hash
   * @param type
   * @param key_info
   * @param account
   */
  mintOrderPayHash ({
    type = 'blockchain',
    key_info,
    order_id,
    pay_hash
  }: IMintOrderPayHashParmas): Promise<void> {
    return this.axios.post('/mint/order/pay/hash', {
      type,
      key_info,
      order_id,
      pay_hash
    })
  }
}
