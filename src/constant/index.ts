import config from '~~/config'

export const IDENTICON_SERVE = config.identiconServe

export const DEBOUNCE_WAIT_TIME = 600

export const CYCLE_CALL_FUNCTION_TIME = 5000

export const TOAST_DURATION_TIME = 1000

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

export const DEFAULT_PAGE_SIZE = 50

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
  subAccountNotCreated,
  onCross
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
  traditionalChinese,
  japanese,
  korean,
  russian,
  turkish,
  thai,
  vietnamese,
  unknown = 99
}

export const ORDER_ACTION_TYPE = {
  applyRegister: 'apply_register',
  setDasReverse: 8,
  editDasReverse: 9,
  deleteDasReverse: 10,
  editRecords: 12
}

export enum CrossDirection {
  fromCKB,
  toCKB
}

export const ACCOUNT_TABS = {
  nfts: 'nfts',
  bit: 'bit'
}

export const CrossEthContract = config.isProdData ? '0x60eB332Bd4A0E2a9eEB3212cFdD6Ef03Ce4CB3b5' : '0x7eCBEE03609f353d041942FF50CdA2A120ABddd9'
export const CrossEthGnosisAddress = config.isProdData ? '0x513EF3F0d5259a0819370459A86930d047Bf8E9d' : '0xd51D9Bc5F462e825e59CCae110675E96519F36Aa'

export const ErrorAccountList = ['🇵oa🇵💙🇧i🇹coi🇳💙e🇹h.bit', '🇧ili🇧ili.bit', '🇨🇳🇯🇵🇰🇷.bit', '🇨cccc.bit', '🇲eta🇩ao.bit', '🇪thereum.bit', '🇭ello.bit', '🇰obe81.bit', '🇲etaverse.bit', '🇹ris🇹a🇳.bit', 'l🇴veyou.bit', '🇹esla.bit', 'ワンピース.bit', 'ドラえもん.bit', 'トークン.bit', 'ビットコイン.bit', 'とうきょう.bit', 'オークション.bit', '桜木フラワーロード.bit', 'クレヨンしんちゃん.bit', 'カレンシー.bit', 'アセット.bit', 'ブロックチェーン.bit', 'アカウント.bit', 'ハンターハンター.bit', 'ピカチュウ.bit', 'にんてんどう.bit', 'マイニング.bit', 'トヨタグループ.bit', 'オリジナル.bit', 'ネットワーク.bit', 'しんげきのきょじん.bit', 'アニメーション.bit', 'ゲーミング.bit', 'プロジェクト.bit', 'さようなら.bit', 'ちゅうごく.bit', 'ウェブ開発.bit', 'コミュニティ.bit', '2ちゃんねる.bit', '以太坊主人.bit', 'マーケット.bit', 'すみません.bit', 'ソニー株式会社.bit', 'かそうつうか.bit', '5ちゃんねる.bit', 'トヨタ自動車.bit', '金木水火土.bit', 'ウォレット.bit', 'サービス.bit', 'マーケティング.bit', '任天堂株式会社.bit', 'ランキング.bit', '我的元宇宙.bit', 'ドラゴンボール.bit', '中国台湾省.bit', '中国釣魚島.bit', 'しゅしょう.bit', 'ニンテンドー.bit', 'キャンペーン.bit', 'いちにさん.bit', '零零零零零.bit', '中国北京市.bit', 'じゅうがつ.bit', '九九九九九.bit', '六六六六六.bit', '一二三四五.bit', '零一二三四.bit', '中国上海市.bit', '中華人民共和国.bit', '我是中国人.bit', '世界の中心で愛を叫んだけもの.bit', '五四三二一.bit', '十十十十十.bit']
