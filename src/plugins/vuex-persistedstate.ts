import { Context } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'
import config from '~~/config'
import { COMMON_KEYS } from '~/store/common'

export default ({ store }: Context) => {
  createPersistedState({
    key: config.appNmae,
    paths: [
      COMMON_KEYS.namespace,
      'reverse.config',
      'reverse.dasReverse',
      'me.connectedAccount',
      'me.inviter',
      'me.channel',
      'me.loggedIn'
    ]
  })(store)
}
