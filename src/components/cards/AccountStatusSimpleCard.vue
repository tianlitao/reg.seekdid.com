<template>
  <div class="account-status-simple-card">
    <IconImage
      class="account-status-simple-card__logo"
      :url="`${IDENTICON_SERVE}${accountInfo.account}`"
      :alt="accountInfo.account"
      :size="60"
      rounded
    />
    <div class="account-status-simple-card__info">
      <span
        class="account-status-simple-card__status-text"
      >
        {{ accountInfo.status !== undefined ? ACCOUNT_STATUS_LIST[accountInfo.status] : '' }}
      </span>
      <span
        class="account-status-simple-card__account-name"
        :class="{ 'account-status-simple-card__account-name_small': accountInfo.account && accountInfo.account.length > 14 }"
      >
        {{ accountInfo.account }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ACCOUNT_STATUS, IDENTICON_SERVE } from '~/constant'
import IconImage from '~/components/icon/IconImage.vue'
import { IAccountInfo } from '~/services/Account'

export default Vue.extend({
  name: 'AccountStatusSimpleCard',
  components: {
    IconImage
  },
  props: {
    accountInfo: {
      type: Object as PropType<IAccountInfo>,
      required: true
    }
  },
  data () {
    return {
      IDENTICON_SERVE,
      ACCOUNT_STATUS_LIST: {
        [ACCOUNT_STATUS.notOpenRegister]: this.$tt('Not open for registration'),
        [ACCOUNT_STATUS.registerable]: this.$tt('Available'),
        [ACCOUNT_STATUS.registeringPaymentConfirm]: this.$tt('Registering'),
        [ACCOUNT_STATUS.registeringLockedAccount]: this.$tt('Registering'),
        [ACCOUNT_STATUS.registering]: this.$tt('Registering'),
        [ACCOUNT_STATUS.registeringIncludeProposal]: this.$tt('Registering'),
        [ACCOUNT_STATUS.registeringConfirmProposal]: this.$tt('Registering'),
        [ACCOUNT_STATUS.registered]: this.$tt('Already registered'),
        [ACCOUNT_STATUS.reservedAccount]: this.$tt('Reserved account'),
        [ACCOUNT_STATUS.onePriceSell]: this.$tt('On sale'),
        [ACCOUNT_STATUS.auctionSell]: this.$tt('Bid for sale'),
        [ACCOUNT_STATUS.candidateAccount]: this.$tt('Candidate account'),
        [ACCOUNT_STATUS.othersRegistering]: this.$tt('Others are registering'),
        [ACCOUNT_STATUS.unavailableAccount]: this.$tt('Unavailable Account'),
        [ACCOUNT_STATUS.notCreated]: this.$tt('Not minted')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-status-simple-card {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: $assist-color;
  box-shadow: $container-outer-box-shadow;
  border-radius: 16px;
}

.account-status-simple-card__logo {
  margin-right: 16px;
}

.account-status-simple-card__info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.account-status-simple-card__status-text {
  height: 18px;
  font-size: 12px;
  font-weight: 600;
  color: $assist-font-color;
  line-height: 18px;
}

.account-status-simple-card__account-name {
  font-size: 32px;
  font-weight: 600;
  color: $white;
  word-break: break-all;
}

.account-status-simple-card__account-name_small {
  font-size: 24px;
}
</style>
