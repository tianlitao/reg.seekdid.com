import config from '~~/config'
import { ParsingRecordDwebKey, ParsingRecordProfileKey } from '~/services/Account'
import { BSC, ETH, Polygon, TRON } from '~/constant/chain'

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
  unavailableAccount
}

export const ACCOUNT_STATUS_LIST: { [key: string]: { statusText: string, href: string, actionText: string } } = {
  [ACCOUNT_STATUS.notOpenRegister]: {
    statusText: 'Not open for registration',
    href: '',
    actionText: ''
  },
  [ACCOUNT_STATUS.registerable]: {
    statusText: 'Available',
    href: '/account/register/',
    actionText: 'Register'
  },
  [ACCOUNT_STATUS.registeringPaymentConfirm]: {
    statusText: 'Registering',
    href: '/account/register/status/',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.registeringLockedAccount]: {
    statusText: 'Registering',
    href: '/account/register/status/',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.registering]: {
    statusText: 'Registering',
    href: '/account/register/status/',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.registeringIncludeProposal]: {
    statusText: 'Registering',
    href: '/account/register/status/',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.registeringConfirmProposal]: {
    statusText: 'Registering',
    href: '/account/register/status/',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.registered]: {
    statusText: 'Already registered',
    href: '/explorer/account/',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.reservedAccount]: {
    statusText: 'Reserved account',
    href: '/explorer/account/',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.onePriceSell]: {
    statusText: 'On sale',
    href: '-',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.auctionSell]: {
    statusText: 'Bid for sale',
    href: '',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.candidateAccount]: {
    statusText: 'Candidate account',
    href: '',
    actionText: 'View'
  },
  [ACCOUNT_STATUS.othersRegistering]: {
    statusText: 'Others are registering',
    href: '',
    actionText: ''
  },
  [ACCOUNT_STATUS.unavailableAccount]: {
    statusText: 'Unavailable Account',
    href: '',
    actionText: ''
  }
}

export enum TRX_STATUS {
  failed = -1,
  pending,
  success,
  unpackaged,
  unknown
}

export const WALLETS = {
  abcWallet: 'ABC Wallet',
  metaMask: 'MetaMask',
  bscWallet: 'bscWallet',
  polygonWallet: 'polygonWallet',
  walletConnect: 'WalletConnect',
  coinbaseWallet: 'Coinbase Wallet',
  tronLink: 'TronLink'
}

export const WalletNameToChain = {
  [WALLETS.metaMask]: ETH,
  [WALLETS.bscWallet]: BSC,
  [WALLETS.polygonWallet]: Polygon,
  [WALLETS.walletConnect]: ETH,
  [WALLETS.coinbaseWallet]: ETH,
  [WALLETS.tronLink]: TRON
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

export const PROFILE_KEY_OPTIONS = [{
  text: 'Twitter',
  value: ParsingRecordProfileKey.twitter
}, {
  text: 'Facebook',
  value: ParsingRecordProfileKey.facebook
}, {
  text: 'Reddit',
  value: ParsingRecordProfileKey.reddit
}, {
  text: 'Linkedin',
  value: ParsingRecordProfileKey.linkedin
}, {
  text: 'Github',
  value: ParsingRecordProfileKey.github
}, {
  text: 'Telegram',
  value: ParsingRecordProfileKey.telegram
}, {
  text: 'Description',
  value: ParsingRecordProfileKey.description
}, {
  text: 'Avatar',
  value: ParsingRecordProfileKey.avatar
}, {
  text: 'Instagram',
  value: ParsingRecordProfileKey.instagram
}, {
  text: 'Weibo',
  value: ParsingRecordProfileKey.weibo
}, {
  text: 'Discord',
  value: ParsingRecordProfileKey.discord
}, {
  text: 'Website',
  value: ParsingRecordProfileKey.website
}, {
  text: 'Youtube',
  value: ParsingRecordProfileKey.youtube
}, {
  text: 'Bilibili',
  value: ParsingRecordProfileKey.bilibili
}, {
  text: 'Tiktok',
  value: ParsingRecordProfileKey.tiktok
}, {
  text: 'Jike',
  value: ParsingRecordProfileKey.jike
}]

export const DWEB_KEY_OPTIONS = [{
  text: 'IPFS',
  value: ParsingRecordDwebKey.ipfs
}, {
  text: 'IPNS',
  value: ParsingRecordDwebKey.ipns
}, {
  text: 'Resilio',
  value: ParsingRecordDwebKey.resilio
}]
