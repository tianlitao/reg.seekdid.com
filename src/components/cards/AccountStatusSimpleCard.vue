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
        {{ accountInfo.status !== undefined ? $t(ACCOUNT_STATUS_LIST[accountInfo.status].statusText) : '' }}
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
import { ACCOUNT_STATUS_LIST, IDENTICON_SERVE } from '~/constant'
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
      ACCOUNT_STATUS_LIST
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
