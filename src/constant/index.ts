import config from '~~/config'

export const IDENTICON_SERVE = config.identiconServe

export const DEBOUNCE_WAIT_TIME = 600

export const CYCLE_CALL_FUNCTION_TIME = 5000

export const TOAST_DURATION_TIME = 1500

export const ACCOUNT_SUFFIX = '.bit'

// number of decimal places to keep for token amount
export const TOKEN_DECIMAL_PLACES = 8

// number of decimal places to retain the amount
export const FIAT_DECIMAL_PLACES = 2

export const TIME_FORMAT = {
  fullDateTime: 'YYYY-MM-DD HH:mm:ss',
  fullDate: 'YYYY-MM-DD',
  MMDDHHMM: 'MM-DD HH:mm'
}

export const DEFAULT_PAGE_SIZE = 100

export enum ACCOUNT_STATUS {
  notOpenRegister= -1,
  registerable,
  registeringPaymentConfirm,
  registeringLockedAccount,
  registering,
  registeringIncludeProposal,
  registeringConfirmProposal,
  registered,
  reservedAccount,
  onePriceSell,
  auctionSell,
  candidateAccount,
  expired,
  othersRegistering,
  unavailableAccount,
  notCreated
}

export enum TRX_STATUS {
  failed = -1,
  pending,
  success,
  unpackaged,
  unknown
}

export enum WalletProtocol {
  metaMask = 'metaMask',
  tronLink = 'tronLink',
  torus = 'torus',
  uniSign = 'uniSign',
  walletConnect = 'walletConnect'
}

export enum CHAR_TYPE {
  emoji = 0,
  number = 1,
  english = 2,
  simplifiedChinese = 3,
  russian = 4,
  notKnown = 99
}

export const ORDER_ACTION_TYPE = {
  applyRegister: 'apply_register',
  setDasReverse: 8,
  editDasReverse: 9,
  deleteDasReverse: 10,
  editRecords: 12
}
