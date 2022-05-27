<template>
  <div class="account-status-card">
    <IconImage
      class="account-status-card__logo"
      :url="`${IDENTICON_SERVE}${accountInfo.account}`"
      :alt="accountInfo.account"
      :size="60"
      rounded
    />
    <div class="account-status-card__account-name">
      {{ accountInfo.account }}
    </div>
    <template v-if="accountInfo && accountInfo.status === ACCOUNT_STATUS.reservedAccount">
      <div class="account-status-card__status">
        <span class="account-status-card__status-text account-status-card__status-text_success account-status-card__reserved-account">
          <Iconfont name="reserve" color="#22C493" />
          {{ $tt('Reserved account') }}
        </span>
      </div>
      <div class="account-status-card__split-line" />
      <div class="account-status-card__status-desc">
        {{ $tt('This account is a reserved account and can only be claimed for free by the corresponding organization/individual. The free application process will be made public at a later date.') }}
      </div>
      <Button
        class="account-status-card__action-button"
        normal
        @click="gotoReservedDasList"
      >
        {{ $tt('About Reserved Account') }}
      </Button>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ACCOUNT_STATUS, IDENTICON_SERVE } from '~/constant'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { IAccountInfo } from '~/services/Account'
import Button from '~/components/Button.vue'

export default Vue.extend({
  name: 'AccountStatusCard',
  components: {
    IconImage,
    Iconfont,
    Button
  },
  props: {
    accountInfo: {
      type: Object as PropType<IAccountInfo>,
      required: true
    }
  },
  data () {
    return {
      ACCOUNT_STATUS,
      IDENTICON_SERVE
    }
  },
  methods: {
    gotoReservedDasList () {
      window.open('https://github.com/dotbitHQ/cell-data-generator/blob/master/data/reserved_accounts.txt')
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-status-card {
  position: relative;
  margin-top: 30px;
  padding: 30px 16px 25px 16px;
  background: $assist-color;
  border-radius: 12px;
}

.account-status-card__logo {
  position: absolute;
  margin: auto;
  top: -30px;
  left: 0;
  right: 0;
}

.account-status-card__account-name {
  margin: 8px 0;
  font-size: 32px;
  font-family: $barlow-medium;
  color: $white;
  line-height: 38px;
  text-align: center;
  word-break: break-all;
}

.account-status-card__status {
  text-align: center;
}

.account-status-card__status-text {
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
}

.account-status-card__status-text_success {
  color: $success-font-color;
  background: rgba(0, 223, 155, 0.1);
}

.account-status-card__reserved-account {
  display: inline-flex;
  align-items: center;
}

.account-status-card__split-line {
  margin: 12px 0 24px 0;
  height: 1px;
  background: $disabled-color;
  opacity: 0.1;
}

.account-status-card__status-desc {
  margin-bottom: 24px;
  font-size: 15px;
  font-weight: 600;
  color: $third-font-color;
  line-height: 19px;
  text-align: center;
}

.account-status-card__action {
  display: flex;
  justify-content: center;
}

.account-status-card__action-button {
  margin: 0 auto;
  padding: 0 36px;
  height: 38px;
  border-radius: 8px;
}
</style>
