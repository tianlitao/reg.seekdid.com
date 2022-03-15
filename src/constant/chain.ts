import { isProdData } from '~~/config'

export enum CHAIN_ID {
  ckb,
  eth,
  btc,
  tron,
  fiat,
  bsc = 56,
  polygon = 137
}

export const EthereumGoerliChainId = 5
export const BSCTestnetChainId = 97
export const PolygonTestnetChainId = 80001

export const DASBalanceTokenId = 'ckb_das'

export enum LOCK_SCRIPT_TYPE {
  ckb,
  none,
  eth,
  btc,
  tron = 6,
  eip712
}

export enum NEW_LOCK_SCRIPT_TYPE {
  ckb,
  none,
  eth= 3,
  tron,
  eip712,
  btc,
}

export interface IMainChain {
  name: string
  symbol: string
  chainId: CHAIN_ID
  decimals: number
  icon: string
  tokenId: string
  lockScriptType: number
  explorerAddress: string
  explorerTrx: string
  networkName?: string
  rpcUrl?: string
  blockExplorerUrl?: string
}

export const CKB: IMainChain = {
  name: 'Nervos Network',
  symbol: 'CKB',
  chainId: CHAIN_ID.ckb,
  decimals: 8,
  icon: 'nervos-network',
  tokenId: 'ckb_ckb',
  lockScriptType: LOCK_SCRIPT_TYPE.ckb,
  explorerAddress: isProdData ? 'https://explorer.nervos.org/address/' : 'https://explorer.nervos.org/aggron/address/',
  explorerTrx: isProdData ? 'https://explorer.nervos.org/transaction/' : 'https://explorer.nervos.org/aggron/transaction/'
}

export const ETH: IMainChain = {
  name: 'Ethereum',
  symbol: 'ETH',
  chainId: CHAIN_ID.eth,
  decimals: 18,
  icon: 'ethereum',
  tokenId: 'eth_eth',
  lockScriptType: LOCK_SCRIPT_TYPE.eth,
  explorerAddress: isProdData ? 'https://etherscan.io/address/' : 'https://goerli.etherscan.io/address/',
  explorerTrx: isProdData ? 'https://etherscan.io/tx/' : 'https://goerli.etherscan.io/tx/',
  networkName: isProdData ? 'Ethereum Mainnet' : 'Ethereum Goerli Testnet',
  rpcUrl: isProdData ? 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' : 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  blockExplorerUrl: isProdData ? 'https://etherscan.io' : 'https://goerli.etherscan.io'
}

export const TRON: IMainChain = {
  name: 'Tron',
  symbol: 'TRX',
  chainId: CHAIN_ID.tron,
  decimals: 6,
  icon: 'tron',
  tokenId: 'tron_trx',
  lockScriptType: LOCK_SCRIPT_TYPE.tron,
  explorerAddress: isProdData ? 'https://tronscan.org/#/address/' : 'https://nile.tronscan.org/#/address/',
  explorerTrx: isProdData ? 'https://tronscan.org/#/transaction/' : 'https://nile.tronscan.org/#/transaction/'
}

export const BSC: IMainChain = {
  name: 'Binance Smart Chain',
  symbol: 'BNB',
  chainId: CHAIN_ID.bsc,
  decimals: 18,
  icon: 'binance-smart-chain',
  tokenId: 'bsc_bnb',
  lockScriptType: LOCK_SCRIPT_TYPE.eth,
  explorerAddress: isProdData ? 'https://bscscan.com/address/' : 'https://testnet.bscscan.com/address/',
  explorerTrx: isProdData ? 'https://bscscan.com/tx/' : 'https://testnet.bscscan.com/tx/',
  networkName: isProdData ? 'Binance Smart Chain Mainnet' : 'Binance Smart Chain Testnet',
  rpcUrl: isProdData ? 'https://bsc-dataseed3.binance.org' : 'https://data-seed-prebsc-1-s2.binance.org:8545',
  blockExplorerUrl: isProdData ? 'https://bscscan.com' : 'https://testnet.bscscan.com'
}

export const Polygon: IMainChain = {
  name: 'Polygon',
  symbol: 'MATIC',
  chainId: CHAIN_ID.polygon,
  decimals: 18,
  icon: 'polygon',
  tokenId: 'polygon_matic',
  lockScriptType: LOCK_SCRIPT_TYPE.eth,
  explorerAddress: isProdData ? 'https://polygonscan.com/address/' : 'https://mumbai.polygonscan.com/address/',
  explorerTrx: isProdData ? 'https://polygonscan.com/tx/' : 'https://mumbai.polygonscan.com/tx/',
  networkName: isProdData ? 'Polygon Mainnet' : 'Polygon Testnet Mumbai',
  rpcUrl: isProdData ? 'https://matic-mainnet-full-rpc.bwarelabs.com' : 'https://matic-mumbai.chainstacklabs.com',
  blockExplorerUrl: isProdData ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com'
}

export const BTC: IMainChain = {
  name: 'Bitcoin',
  symbol: 'BTC',
  chainId: CHAIN_ID.btc,
  decimals: 8,
  icon: 'bitcoin',
  tokenId: 'btc_btc',
  lockScriptType: LOCK_SCRIPT_TYPE.btc,
  explorerAddress: 'https://explorer.btc.com/btc/address/',
  explorerTrx: 'https://explorer.btc.com/btc/address/'
}

export const CHAINID_TO_CHAIN: { [key: string]: IMainChain } = {
  [CHAIN_ID.eth]: ETH,
  [CHAIN_ID.ckb]: CKB,
  [CHAIN_ID.tron]: TRON,
  [CHAIN_ID.btc]: BTC,
  [CHAIN_ID.bsc]: BSC,
  [CHAIN_ID.polygon]: Polygon
}

export const CHAINNAME_TO_CHAIN = {
  eth: ETH,
  ckb: CKB,
  trx: TRON,
  btc: BTC,
  bsc: {
    ...BSC,
    symbol: 'BSC'
  },
  polygon: {
    ...Polygon,
    symbol: 'Polygon'
  },
  ada: {
    symbol: 'ADA',
    explorerAddress: 'https://cardanoscan.io/address/'
  },
  atom: {
    symbol: 'ATOM',
    explorerAddress: 'https://atomscan.com/accounts/'
  },
  avalanche: {
    symbol: 'Avalanche',
    explorerAddress: 'https://avascan.info/blockchain/x/address/'
  },
  bch: {
    symbol: 'BCH',
    explorerAddress: 'https://blockchair.com/bitcoin-cash/address/'
  },
  bsv: {
    symbol: 'BSV',
    explorerAddress: 'https://blockchair.com/bitcoin-sv/address/'
  },
  celo: {
    symbol: 'Celo',
    explorerAddress: 'https://thecelo.com/acountdetail/'
  },
  dash: {
    symbol: 'DASH',
    explorerAddress: 'https://explorer.dash.org/insight/address/'
  },
  dfinity: {
    symbol: 'Dfinity',
    explorerAddress: 'https://www.dfinityexplorer.org/#/acct/'
  },
  doge: {
    symbol: 'DOGE',
    explorerAddress: 'https://dogechain.info/address/'
  },
  dot: {
    symbol: 'DOT',
    explorerAddress: 'https://polkascan.io/polkadot/account/'
  },
  eos: {
    symbol: 'EOS',
    explorerAddress: 'https://eosflare.io/account/'
  },
  etc: {
    symbol: 'ETC',
    explorerAddress: 'https://blockscout.com/etc/mainnet/address/'
  },
  fil: {
    symbol: 'FIL',
    explorerAddress: 'https://filfox.info/en/address/'
  },
  flow: {
    symbol: 'FLOW',
    explorerAddress: 'https://flowscan.org/account/'
  },
  heco: {
    symbol: 'HECO',
    explorerAddress: 'https://hecoinfo.com/address/'
  },
  iost: {
    symbol: 'IOST',
    explorerAddress: 'https://www.iostabc.com/account/'
  },
  iota: {
    symbol: 'IOTA',
    explorerAddress: 'https://thetangle.org/address/'
  },
  ksm: {
    symbol: 'KSM',
    explorerAddress: 'https://polkascan.io/kusama/account/'
  },
  ltc: {
    symbol: 'LTC',
    explorerAddress: 'https://blockchair.com/litecoin/address/'
  },
  near: {
    symbol: 'NEAR',
    explorerAddress: 'https://explorer.near.org/accounts/'
  },
  sc: {
    symbol: 'SC',
    explorerAddress: 'https://siastats.info/navigator?search='
  },
  sol: {
    symbol: 'SOL',
    explorerAddress: 'https://explorer.solana.com/address/'
  },
  stacks: {
    symbol: 'Stacks',
    explorerAddress: 'https://explorer.stacks.co/address/SP342806PVW513Z0RJ7Q04TFGK702BNGT36HZDJWM'
  },
  terra: {
    symbol: 'Terra',
    explorerAddress: 'https://finder.terra.money/mainnet/account/'
  },
  vet: {
    symbol: 'VET',
    explorerAddress: 'https://explore.vechain.org/accounts/'
  },
  xem: {
    symbol: 'XEM',
    explorerAddress: 'https://explorer.nemtool.com/#/s_account?account='
  },
  xlm: {
    symbol: 'XLM',
    explorerAddress: 'https://blockchair.com/stellar/account/'
  },
  xmr: {
    symbol: 'XMR',
    explorerAddress: ''
  },
  xrp: {
    symbol: 'XRP',
    explorerAddress: 'https://xrpscan.com/account/'
  },
  xtz: {
    symbol: 'XTZ',
    explorerAddress: 'https://tezblock.io/account/'
  },
  zec: {
    symbol: 'ZEC',
    explorerAddress: 'https://explorer.zcha.in/accounts/'
  },
  zil: {
    symbol: 'ZIL',
    explorerAddress: 'https://viewblock.io/zilliqa/address/'
  }
}

export const PARSING_RECORD_SUPPORT_CHAINS = [{
  text: 'ADA',
  value: 'ada'
}, {
  text: 'ATOM',
  value: 'atom'
}, {
  text: 'Avalanche',
  value: 'avalanche'
}, {
  text: 'BCH',
  value: 'bch'
}, {
  text: 'BSC',
  value: 'bsc'
}, {
  text: 'BSV',
  value: 'bsv'
}, {
  text: BTC.symbol,
  value: BTC.symbol.toLowerCase()
}, {
  text: 'Celo',
  value: 'celo'
}, {
  text: CKB.symbol,
  value: CKB.symbol.toLowerCase()
}, {
  text: 'DASH',
  value: 'dash'
}, {
  text: 'Dfinity',
  value: 'dfinity'
}, {
  text: 'DOGE',
  value: 'doge'
}, {
  text: 'DOT',
  value: 'dot'
}, {
  text: 'EOS',
  value: 'eos'
}, {
  text: 'ETC',
  value: 'etc'
}, {
  text: ETH.symbol,
  value: ETH.symbol.toLowerCase()
}, {
  text: 'FIL',
  value: 'fil'
}, {
  text: 'FLOW',
  value: 'flow'
}, {
  text: 'HECO',
  value: 'heco'
}, {
  text: 'IOST',
  value: 'iost'
}, {
  text: 'IOTA',
  value: 'iota'
}, {
  text: 'KSM',
  value: 'ksm'
}, {
  text: 'LTC',
  value: 'ltc'
}, {
  text: 'NEAR',
  value: 'near'
}, {
  text: 'Polygon',
  value: 'polygon'
}, {
  text: 'SC',
  value: 'sc'
}, {
  text: 'SOL',
  value: 'sol'
}, {
  text: 'Stacks',
  value: 'stacks'
}, {
  text: 'Terra',
  value: 'terra'
}, {
  text: TRON.symbol,
  value: TRON.symbol.toLowerCase()
}, {
  text: 'VET',
  value: 'vet'
}, {
  text: 'XEM',
  value: 'xem'
}, {
  text: 'XLM',
  value: 'xlm'
}, {
  text: 'XMR',
  value: 'xmr'
}, {
  text: 'XRP',
  value: 'xrp'
}, {
  text: 'XTZ',
  value: 'xtz'
}, {
  text: 'ZEC',
  value: 'zec'
}, {
  text: 'ZIL',
  value: 'zil'
}]
