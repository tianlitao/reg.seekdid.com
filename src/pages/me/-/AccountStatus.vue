<template>
  <li class="account-status">
    <div class="account-status__account-info">
      <IconImage
        class="account-status__logo"
        :url="`${IDENTICON_SERVE}${accountInfo.account}`"
        :alt="accountInfo.account"
        :size="44"
        rounded
      />
      <span class="account-status__account-name">
        {{ toHashedStyle(accountInfo.account) }}
        <div>
          <template v-if="accountInfo.status">
            <span
              v-if="countdownToExpiredDays > 0"
              class="account-status__status-text account-status__status-text_warn"
            >
              <Iconfont
                name="warning"
                size="16"
                color="#FF6B6B"
              />
              {{ $tt('Expires in {days} days', { days: countdownToExpiredDays }) }}
            </span>
            <span
              v-else-if="accountInfo.status === ACCOUNT_STATUS.expired"
              class="account-status__status-text account-status__status-text_warn"
            >
              <Iconfont
                name="warning"
                size="16"
                color="#FF6B6B"
              />
              {{ $tt('账号回收提示', { days: countdownToRecoveryDays }) }}
            </span>
            <span
              v-else-if="accountInfo.status === ACCOUNT_STATUS.onePriceSell"
              class="account-status__status-text account-status__status-text__fixed-price-sell"
            >
              {{ $tt('On sale on DIDTop') }}
            </span>
          </template>
        </div>
      </span>
    </div>
    <Iconfont class="account-status__arrow-right" name="arrow-right" color="#11142D" />
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Decimal from 'decimal.js'
import { mapState } from 'vuex'
import IconImage from '~/components/icon/IconImage.vue'
import { IAccountInfo } from '~/services/Account'
import { ACCOUNT_STATUS, IDENTICON_SERVE } from '~/constant'
import Iconfont from '~/components/icon/Iconfont.vue'
import { COMMON_KEYS } from '~/store/common'
import { toHashedStyle } from '~/modules/tools'

export default Vue.extend({
  name: 'AccountStatus',
  components: {
    IconImage,
    Iconfont
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
      IDENTICON_SERVE,
      oneDayMillisecond: 24 * 60 * 60 * 1000
    }
  },
  computed: {
    ...mapState({
      common: COMMON_KEYS.namespace
    }),
    gracePeriod (): number {
      if (this.common.config.account_expiration_grace_period) {
        return this.common.config.account_expiration_grace_period * 1000
      }
      return 0
    },
    countdownToExpiredDays (): number | string {
      const currentTimestamp = new Date().getTime()
      const { expired_at: expiredAt } = this.accountInfo
      if (currentTimestamp > expiredAt - (this.oneDayMillisecond * 30) && currentTimestamp < expiredAt) {
        return new Decimal(expiredAt)
          .sub(currentTimestamp)
          .div(this.oneDayMillisecond)
          .toFixed(0, Decimal.ROUND_UP)
      }
      return 0
    },
    countdownToRecoveryDays (): number | string {
      const currentTimestamp = new Date().getTime()
      const { expired_at: expiredAt } = this.accountInfo
      if (currentTimestamp > expiredAt && currentTimestamp < expiredAt + this.gracePeriod) {
        return new Decimal(expiredAt)
          .add(this.gracePeriod)
          .sub(currentTimestamp)
          .div(this.oneDayMillisecond)
          .toFixed(0, Decimal.ROUND_UP)
      }
      return 0
    }
  },
  methods: {
    toHashedStyle
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 8px;
  height: 90px;
  background: #F6FFFD;
  box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 3%);
  border-radius: 16px;
  border: 1px solid rgba(182, 196, 217, 0.4);
  cursor: pointer;

  &:hover {
    background: rgba(246, 255, 253, 0.7);
  }
}

.account-status__account-info {
  display: flex;
  align-items: center;
}

.account-status__logo {
  margin-right: 12px;
}

.account-status__account-name {
  font-size: 18px;
  font-weight: 600;
  color: $primary-font-color;
  word-break: break-word;
  hyphens: auto;
}

.account-status__arrow-right {
  min-width: 24px;
}

.account-status__status-text {
  display: inline-flex;
  margin-top: 4px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.account-status__status-text__fixed-price-sell {
  color: #2471FE;
  background: rgba(192, 203, 246, 0.57);
}

.account-status__status-text_warn {
  align-items: center;
  color: #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
}
</style>
