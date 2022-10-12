<template>
  <div class="account-info">
    <AccountStatusCard :accountInfo="accountInfo" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { IAccountInfo } from '~/services/Account'
import errno from '~/constant/errno'
import { COMMON_KEYS } from '~/store/common'
import { ACCOUNT_STATUS } from '~/constant'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import config from '~~/config'
import AccountStatusCard from '~/components/cards/AccountStatusCard.vue'

export default Vue.extend({
  name: 'AccountInfo',
  components: {
    AccountStatusCard
  },
  props: {
    accountName: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainId: ME_KEYS.computedChainId
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  data () {
    return {
      ACCOUNT_STATUS,
      accountInfo: {
        account: this.accountName
      } as IAccountInfo
    }
  },
  head (): { [key: string]: string } {
    return {
      title: this.accountName
    }
  },
  mounted () {
    this.$store.dispatch(COMMON_KEYS.fetchConfig)
    this.getAccountInfo()
  },
  methods: {
    async getAccountInfo () {
      try {
        this.accountInfo = await this.$services.account.accountInfo(this.accountName)
        if (this.accountInfo.owner_chain_type === this.computedChainId && this.accountInfo.owner.toUpperCase() === this.connectedAccount.address.toUpperCase()) {
          const address = this.connectedAccount?.address
          const chainName = this.connectedAccount?.chain?.name
          const link = `${config.homepage}/${this.accountInfo.account}?originAddress=${address}&originChainName=${chainName}`
          window.location.href = link
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.rpcApiErrAccountNotExist) {
          this.$alert({
            title: this.$tt('Tips'),
            message: (this.$tt("Account doesn't exist") as string)
          })
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-info {
  flex: 1;
  padding: 12px 12px 48px 12px;
  background: #F7F8F9;
}
</style>
