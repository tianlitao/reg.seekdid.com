import { Context } from '@nuxt/types'
import Common from './Common'
import Explorer from './Explorer'
import Account from './Account'
import DasReverse from './DasReverse'
import CrossEth from './CrossEth'

export class Services {
  common: Common
  explorer: Explorer
  account: Account
  dasReverse: DasReverse
  crossEth: CrossEth

  constructor (context: Context) {
    this.common = new Common(context)
    this.explorer = new Explorer(context)
    this.account = new Account(context)
    this.dasReverse = new DasReverse(context)
    this.crossEth = new CrossEth(context)
  }
}
