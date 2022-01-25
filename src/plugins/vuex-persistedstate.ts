import { Context } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'
import { VUEX_PERSISTEDSTATE_KEY } from '~/constant'
import { COMMON_KEYS } from '~/store/common'

export default ({ store }: Context) => {
  createPersistedState({
    key: VUEX_PERSISTEDSTATE_KEY,
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
