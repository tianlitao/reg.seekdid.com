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
<!--        <template v-if="isSubAccount">-->
<!--          {{ accountInfo.account.split('.')[1] }}<span class="account-status__account-name__sub-account">#{{ accountInfo.account.split('.')[0] }}</span>.{{ accountInfo.account.split('.')[2] }}-->
<!--        </template>-->
<!--        <template v-else>-->
<!--          {{ accountInfo.account }}-->
<!--        </template>-->
        {{ accountInfo.account }}
        <div>
          <template v-if="accountInfo.status">
            <span
              v-if="countdownToExpiredDays > 0"
              class="account-status__status-text account-status__status-text_warn"
            >
              <Iconfont
                name="warning"
                size="12"
                color="#FF6B6B"
              />
              {{ $tt('Expires in {days} days', { days: countdownToExpiredDays }) }}
            </span>
            <span
              v-else-if="countdownToRecoveryDays > 0"
              class="account-status__status-text account-status__status-text_warn"
            >
              <Iconfont
                name="warning"
                size="12"
                color="#FF6B6B"
              />
              {{ $tt('账号回收提示', { days: countdownToRecoveryDays }) }}
              <a class="account-status__status-text__renew-link">{{ $tt('Renew now')}}</a>
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
    <Iconfont
      class="account-status__arrow-right"
      name="arrow-right"
      color="#121314"
      size="18"
    />
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
import { SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'

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
    },
    isSubAccount (): boolean {
      return SUB_ACCOUNT_REG_EXP.test(this.accountInfo.account)
    },
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
  font-size: $font-size-18;
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
  padding: 2px 6px;
  border-radius: 4px;
  font-size: $font-size-12;
  font-weight: 500;

  .iconfont {
    margin-right: 6px;
  }
}

.account-status__status-text__fixed-price-sell {
  color: $primary-color;
  background: rgba(192, 203, 246, 0.57);
}

.account-status__status-text_warn {
  align-items: center;
  color: $error-font-color;
  background: rgba(255, 107, 107, 0.1);
}

.account-status__account-name__sub-account {
  color: $warn-font-color;
}

.account-status__status-text__renew-link {
  color: $link-font-color;
  &:hover {
    color: $link-hover-font-color;
  }
}
</style>
