import { TypedMessage } from '@metamask/eth-sig-util'
import { BasicService } from '~/services/BasicService'
import { ACCOUNT_STATUS } from '~/constant'

export interface IReverseLatestParams {
  chainType: number,
  address: string
}

export interface IReverseLatestRes {
  account: string,
  is_valid: boolean
}

export interface IWaitSignMsgList {
  sign_type: number,
  sign_msg: string,
}

export interface ISetDasReverseParams {
  chain_type: number,
  evm_chain_id: number,
  address: string,
  account: string,
}

export interface IEditDasReverseParams extends ISetDasReverseParams {}

export interface IMsgToBeSignedRes {
  sign_key: string,
  sign_list: IWaitSignMsgList[],
  mm_json?: TypedMessage<any>,
}

export interface IAccountListParams extends IReverseLatestParams {}

export interface IAccountListRes {
  account: string,
  status: ACCOUNT_STATUS,
  expired_at: number
}

export default class DasReverse extends BasicService {
  /**
   * reverse latest
   * @param chainType
   * @param address
   */
  reverseLatest ({
    chainType,
    address
  }: IReverseLatestParams): Promise<IReverseLatestRes> {
    return this.axios.post('/reverse/latest', {
      chain_type: chainType,
      address
    })
  }

  /**
   * set das reverse
   * @param evm_chain_id
   * @param chain_type
   * @param address
   * @param account
   */
  setDasReverse ({
    evm_chain_id,
    chain_type,
    address,
    account
  }: ISetDasReverseParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/reverse/declare', {
      chain_type,
      evm_chain_id,
      address,
      account
    })
  }

  /**
   * edit das reverse
   * @param chain_type
   * @param evm_chain_id
   * @param address
   * @param account
   */
  editDasReverse ({
    chain_type,
    evm_chain_id,
    address,
    account
  }: IEditDasReverseParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/reverse/redeclare', {
      chain_type,
      evm_chain_id,
      address,
      account
    })
  }

  /**
   * delete reverse record
   * @param chain_type
   * @param evm_chain_id
   * @param address
   * @param account
   */
  deleteDasReverse ({
    chain_type,
    evm_chain_id,
    address
  }: {
    chain_type: number,
    address: string,
    evm_chain_id: number
  }): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/reverse/retract', {
      chain_type,
      evm_chain_id,
      address
    })
  }

  /**
   * list of accounts (not including accounts for sale)
   * @param chainType
   * @param address
   */
  accountList ({
    chainType,
    address
  }: IAccountListParams): Promise<{ list: IAccountListRes[] }> {
    return this.axios.post('/account/list', {
      chain_type: chainType,
      address
    })
  }
}
