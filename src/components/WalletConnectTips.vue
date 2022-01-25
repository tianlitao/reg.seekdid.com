<template>
  <div
    v-if="connectedAccount.walletName === WALLETS.walletConnect"
    class="wallet-connect-tips"
  >
    {{ $t('Working with WalletConnect') }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { WALLETS } from '~/constant'

export default Vue.extend({
  name: 'DasTips',
  data () {
    return {
      WALLETS
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.wallet-connect-tips {
  font-size: 12px;
  font-weight: 600;
  color: $third-font-color;
  text-align: center;
  padding: 10px 0;
}
</style>
