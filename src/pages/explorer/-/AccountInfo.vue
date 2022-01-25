<template>
  <div class="account-info">
    <AccountStatusCard :accountInfo="accountInfo" />
    <AccountPermission
      v-if="![ACCOUNT_STATUS.reservedAccount, ACCOUNT_STATUS.unavailableAccount].includes(accountInfo.status)"
      class="account-info__permission"
      :accountInfo="accountInfo"/>
    <ParsingRecords
      v-if="![ACCOUNT_STATUS.reservedAccount, ACCOUNT_STATUS.unavailableAccount].includes(accountInfo.status)"
      :accountInfo="accountInfo"
      class="account-info__parsing-records" />
    <RegistrationInfo
      v-if="![ACCOUNT_STATUS.reservedAccount, ACCOUNT_STATUS.unavailableAccount].includes(accountInfo.status)"
      class="account-info__registration-info"
      :accountInfo="accountInfo"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { IAccountInfo } from '~/services/Account'
import AccountStatusCard from '~/components/cards/AccountStatusCard.vue'
import AccountPermission from '~/pages/explorer/-/AccountPermission.vue'
import ParsingRecords from '~/pages/explorer/-/ParsingRecords.vue'
import RegistrationInfo from '~/pages/explorer/-/RegistrationInfo.vue'
import errno from '~/constant/errno'
import { COMMON_KEYS } from '~/store/common'
import { ACCOUNT_STATUS } from '~/constant'
import { IConnectedAccount, ME_KEYS } from '~/store/me'

export default Vue.extend({
  name: 'AccountInfo',
  components: {
    AccountStatusCard,
    AccountPermission,
    ParsingRecords,
    RegistrationInfo
  },
  props: {
    accountName: {
      type: String,
      default: 'test',
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
          this.$router.push(`/me/account/${this.accountInfo.account}`)
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.rpcApiErrAccountNotExist) {
          this.$alert({
            title: this.$t('Tips'),
            message: (this.$t("Account doesn't exist") as string)
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

.account-info__permission,
.account-info__parsing-records,
.account-info__registration-info {
  margin-top: 12px;
}
</style>
