import { TypedMessage } from '@metamask/eth-sig-util'
import { BasicService } from '~/services/BasicService'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX, DEFAULT_PAGE_SIZE, TRX_STATUS } from '~/constant'
import { splitAccount } from '~/modules/tools'
import { CHAIN_ID } from '~/constant/chain'
import { IMsgToBeSignedRes, IWaitSignMsgList } from '~/services/DasReverse'

export interface IAccountInfo {
  account: string
  owner: string
  manager: string
  registered_at: number
  expired_at: number
  status: ACCOUNT_STATUS
  account_price: string
  base_amount: string
  owner_chain_type: CHAIN_ID
  manager_chain_type: CHAIN_ID
  confirm_proposal_hash: string
}

export interface ITrxStatusParam {
  evm_chain_id: number,
  chain_type: number,
  address: string,
  actions: (string | number)[]
}

export interface ISendTrxParams {
  sign_key: string,
  sign_list: IWaitSignMsgList[],
}

export enum ParsingRecordType {
  address = 'address',
  profile = 'profile',
  dweb = 'dweb',
  customKey = 'custom_key'
}

export enum ParsingRecordProfileKey {
  twitter = 'twitter',
  facebook = 'facebook',
  reddit = 'reddit',
  linkedin = 'linkedin',
  github = 'github',
  telegram = 'telegram',
  description = 'description',
  avatar = 'avatar',
  instagram = 'instagram',
  weibo = 'weibo',
  discord = 'discord',
  website = 'website',
  youtube = 'youtube',
  bilibili = 'bilibili',
  tiktok = 'tiktok',
  jike = 'jike',
}

export enum ParsingRecordProfileLink {
  twitter = 'https://twitter.com/'
}

export enum ParsingRecordDwebKey {
  ipfs = 'ipfs',
  ipns = 'ipns',
  resilio = 'resilio',
}

export enum ParsingRecordAction {
  delete = 'delete',
  change = 'change',
  add = 'add'
}

export interface IAccountParsingRecord {
  type: ParsingRecordType | string
  key: ParsingRecordProfileKey | string
  label: string
  value: string
  ttl: string
  action?: ParsingRecordAction | string
}

export interface IAccountParsingRecords {
  records: IAccountParsingRecord[]
}

interface IEditRecordsParams {
  evm_chain_id: number
  chain_type: number
  address: string
  account: string
  raw_param: {
    records: IAccountParsingRecord[]
  }
}

interface ISearchPayOrder {
  chain_type: number
  address: string
  order_id: string
}

interface ISearchPayOrderRes {
  transaction_id: string
  out_trade_no: string,
  trade_state: string
}

interface IOrderDetailParams {
  account: string
  chain_type: number
  address: string
  action: string
}

export interface IOrderDetailRes {
  order_id: string
  account: number
  action: string
  status: string
  timestamp: number
  pay_token_id: string
  pay_amount: string
  inviter_account: string
  register_years: number
  receipt_address: string
  code_url: string
  pay_type: string
  channel_account: string
}

export interface ITrxStatusRes {
  block_number: number,
  hash: string,
  status: TRX_STATUS
}

export interface IMyRewardsResInviteList {
  invitee: string
  reward: string
}

interface IMyRewardsRes {
  total: number
  list: IMyRewardsResInviteList[]
}

export interface ITransferOutRecordsResList {
  hash: string
  block_number: number
  receiver_chain_type: number
  receiver_address: string
  amount: string
}

interface ITransferOutRecordsRes {
  count: number
  total: number
  list: ITransferOutRecordsResList[]
}

interface ISubmitRegisterOrderParams {
  chain_type: number
  address: string
  account: string
  pay_chain_type: number
  pay_token_id: string
  pay_address: string
  pay_type: string
  register_years: number
  inviter_account: string
  channel_account: string
}

interface ISubmitRegisterOrderRes {
  order_id: string
  chain_type?: number
  receipt_address: string
  amount: string
  code_url: string
  token_id: string
  pay_type?: string
}

interface IChangeOrderParams extends ISubmitRegisterOrderParams {}

interface IChangeOrderRes extends ISubmitRegisterOrderRes {}

interface ISubmitRenewOrderParams {
  chain_type: number
  address: string
  account: string
  pay_chain_type: number
  pay_token_id: string
  pay_address: string
  pay_type: string
  renew_years: number
}

interface ISubmitRenewOrderRes extends ISubmitRegisterOrderRes {}

interface IEditOwnerParams {
  evm_chain_id: number
  chain_type: number
  address: string
  account: string
  raw_param: {
    receiver_chain_type: number
    receiver_address: string
  }
}

interface IEditManagerParams {
  evm_chain_id: number
  chain_type: number
  address: string
  account: string
  raw_param: {
    manager_chain_type: number
    manager_address: string
  }
}

interface IReturnRegisteredPaymentTrxIdParams {
  chain_type: number
  address: string
  account: string
  order_id: string
  pay_hash: string
}

interface IDasBalancePayParams {
  evm_chain_id: number,
  chain_type: number,
  address: string,
  order_id: string
}

export default class Account extends BasicService {
  /**
   * Get account information
   * @param accountName
   */
  accountInfo (accountName: string): Promise<IAccountInfo> {
    return this.axios.post('/account/detail', {
      account: accountName
    })
  }

  /**
   * submit register order
   * @param chain_type
   * @param address
   * @param account
   * @param pay_chain_type
   * @param pay_token_id
   * @param pay_address
   * @param pay_type
   * @param register_years
   * @param inviter_account
   * @param channel_account
   */
  submitRegisterOrder ({
    chain_type,
    address,
    account,
    pay_chain_type,
    pay_token_id,
    pay_address,
    pay_type,
    register_years,
    inviter_account = '',
    channel_account = ''
  }: ISubmitRegisterOrderParams): Promise<ISubmitRegisterOrderRes> {
    account = account.replace(/\.bit$/, '')
    return this.axios.post('/account/order/register', {
      chain_type,
      address,
      account: account + ACCOUNT_SUFFIX,
      pay_chain_type,
      pay_token_id,
      pay_address,
      pay_type,
      register_years,
      inviter_account,
      channel_account,
      account_char_str: splitAccount(account, true)
    })
  }

  /**
   * order detail
   * @param chain_type
   * @param address
   * @param account
   * @param action
   */
  orderDetail ({
    chain_type,
    address,
    account,
    action
  }: IOrderDetailParams): Promise<IOrderDetailRes> {
    return this.axios.post('/account/order/detail', {
      chain_type,
      address,
      account,
      action
    })
  }

  /**
   * change order
   * @param chain_type
   * @param address
   * @param account
   * @param pay_chain_type
   * @param pay_token_id
   * @param pay_address
   * @param pay_type
   * @param register_years
   * @param inviter_account
   * @param channel_account
   */
  changeOrder ({
    chain_type,
    address,
    account,
    pay_chain_type,
    pay_token_id,
    pay_address,
    pay_type,
    register_years,
    inviter_account = '',
    channel_account = ''
  }: IChangeOrderParams): Promise<IChangeOrderRes> {
    return this.axios.post('/account/order/change', {
      chain_type,
      address,
      account,
      pay_chain_type,
      pay_token_id,
      pay_address,
      pay_type,
      register_years,
      inviter_account,
      channel_account
    })
  }

  /**
   * transaction status
   * @param evm_chain_id
   * @param chain_type
   * @param address
   * @param actions
   */
  trxStatus ({
    evm_chain_id,
    chain_type,
    address,
    actions
  }: ITrxStatusParam): Promise<ITrxStatusRes> {
    return this.axios.post('/transaction/status', {
      evm_chain_id,
      chain_type,
      address,
      actions
    })
  }

  /**
   * get my accounts
   * @param chain_type
   * @param address
   * @param page
   * @param size
   */
  myAccounts ({
    chain_type,
    address,
    page = 1,
    size = DEFAULT_PAGE_SIZE
  }: { chain_type: number, address: string, page?: number, size?: number }): Promise<{ list: IAccountInfo[] }> {
    return this.axios.post('/account/mine', {
      chain_type,
      address,
      page,
      size
    })
  }

  /**
   * get registering accounts
   * @param chain_type
   * @param address
   */
  registeringAccounts ({
    chain_type,
    address
  }: { chain_type: number, address: string }): Promise<{ registering_accounts: IAccountInfo[] }> {
    return this.axios.post('/account/registering/list', {
      chain_type,
      address
    })
  }

  /**
   * get my rewards
   * @param address
   * @param chainType
   * @param page
   * @param size
   */
  myRewards ({
    address,
    chainType,
    page = 1,
    size = DEFAULT_PAGE_SIZE
  }: { address: string, chainType: number, page?: number, size?: number }): Promise<IMyRewardsRes> {
    return this.axios.post('/rewards/mine', {
      chain_type: chainType,
      address,
      page,
      size
    })
  }

  /**
   * get transfer out records
   * @param address
   * @param chainType
   * @param page
   * @param size
   */
  transferOutRecords ({
    address,
    chainType,
    page = 1,
    size = DEFAULT_PAGE_SIZE
  }: { address: string, chainType: number, page?: number, size?: number }): Promise<ITransferOutRecordsRes> {
    return this.axios.post('/withdraw/list', {
      chain_type: chainType,
      address,
      page,
      size
    })
  }

  /**
   * edit parsing records
   * @param evm_chain_id
   * @param chain_type
   * @param address
   * @param account
   * @param records
   */
  editRecords ({
    evm_chain_id,
    chain_type,
    address,
    account,
    raw_param: {
      records
    }
  }: IEditRecordsParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/account/edit/records', {
      evm_chain_id,
      chain_type,
      address,
      account,
      raw_param: {
        records
      }
    })
  }

  /**
   * send transaction
   * @param sign_key
   * @param sign_list
   */
  sendTrx ({
    sign_key,
    sign_list
  }: ISendTrxParams): Promise<{ hash: string }> {
    return this.axios.post('/transaction/send', {
      sign_key,
      sign_list
    })
  }

  /**
   * Get account parsing records
   * @param accountName
   */
  accountParsingRecords (accountName: string): Promise<IAccountParsingRecords> {
    return this.axios.post('/account/records', {
      account: accountName
    })
  }

  /**
   * submit renew order
   * @param chain_type
   * @param address
   * @param account
   * @param pay_chain_type
   * @param pay_token_id
   * @param pay_type
   * @param pay_address
   * @param renew_years
   */
  submitRenewOrder ({
    chain_type,
    address,
    account,
    pay_chain_type,
    pay_token_id,
    pay_type,
    pay_address,
    renew_years
  }: ISubmitRenewOrderParams): Promise<ISubmitRenewOrderRes> {
    return this.axios.post('/account/order/renew', {
      chain_type,
      address,
      account,
      pay_chain_type,
      pay_token_id,
      pay_type,
      pay_address,
      renew_years
    })
  }

  /**
   * edit account owner
   * @param chain_type
   * @param evm_chain_id
   * @param address
   * @param pay_chain_type
   * @param account
   * @param receiver_chain_type
   * @param receiver_address
   */
  editOwner ({
    chain_type,
    evm_chain_id,
    address,
    account,
    raw_param: {
      receiver_chain_type,
      receiver_address
    }
  }: IEditOwnerParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/account/edit/owner', {
      chain_type,
      evm_chain_id,
      address,
      account,
      raw_param: {
        receiver_chain_type,
        receiver_address
      }
    })
  }

  /**
   * edit account manager
   * @param evm_chain_id
   * @param chain_type
   * @param address
   * @param pay_chain_type
   * @param account
   * @param manager_chain_type
   * @param manager_address
   */
  editManager ({
    evm_chain_id,
    chain_type,
    address,
    account,
    raw_param: {
      manager_chain_type,
      manager_address
    }
  }: IEditManagerParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/account/edit/manager', {
      evm_chain_id,
      chain_type,
      address,
      account,
      raw_param: {
        manager_chain_type,
        manager_address
      }
    })
  }

  /**
   * return registered payment transaction ID
   * @param chain_type
   * @param address
   * @param account
   * @param order_id
   * @param pay_hash
   */
  returnRegisteredPaymentTrxId ({
    chain_type,
    address,
    account,
    order_id,
    pay_hash
  }: IReturnRegisteredPaymentTrxIdParams): Promise<any> {
    return this.axios.post('/account/order/pay/hash', {
      chain_type,
      address,
      account,
      order_id,
      pay_hash
    })
  }

  /**
   * DAS Balance payment
   * @param evm_chain_id
   * @param chain_type
   * @param address
   * @param order_id
   */
  dasBalancePay ({
    evm_chain_id,
    chain_type,
    address,
    order_id
  }: IDasBalancePayParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/balance/pay', {
      evm_chain_id,
      chain_type,
      address,
      order_id
    })
  }
}
