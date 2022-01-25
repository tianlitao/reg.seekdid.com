<template>
  <li
    class="account-status"
    @click="onClick"
  >
    <div class="account-status__container">
      <div class="account-status__account-info">
        <IconImage
          class="account-status__logo"
          :url="`${IDENTICON_SERVE}${accountInfo.account}`"
          :alt="accountInfo.account"
          :size="28"
          rounded
        />
        <span class="account-status__account-name">
          {{ accountInfo.account }}
        </span>
      </div>
      <Iconfont class="account-status__arrow-right" name="arrow-right" color="#E4E4E4" />
    </div>
    <div class="account-status__status-text__container">
      <template v-if="accountInfo.status">
        <span
          v-if="accountStatus === ACCOUNT_STATUS.expired"
          class="account-status__status-text account-status__status-text_warn"
        >
          {{ $t('Recalls after {countdownToRecoveryDays} days, renews immediately', { countdownToRecoveryDays: calcExpiredDay(accountInfo.expired_at) }) }}
        </span>
        <span
          v-if="accountStatus === ACCOUNT_STATUS.registered"
          class="account-status__status-text account-status__status-text_success"
        >
          {{ $t('In normal use') }}
        </span>
        <span
          v-else-if="accountStatus === ACCOUNT_STATUS.onePriceSell"
          class="account-status__status-text account-status__status-text__fixed-price-sell"
        >
          {{ $t('On sale') }}
        </span>
      </template>
    </div>
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
      accountStatus: this.accountInfo.status
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
    }
  },
  watch: {
    accountInfo () {
      this.checkAccountStatus()
    }
  },
  mounted () {
    this.checkAccountStatus()
  },
  methods: {
    checkAccountStatus () {
      if (!this.accountInfo.account) {
        return
      }
      if (new Date().getTime() >= this.accountInfo.expired_at) {
        this.accountStatus = ACCOUNT_STATUS.expired
      }
      else {
        this.accountStatus = this.accountInfo.status
      }
    },
    calcExpiredDay (expiredAt: number): string {
      const oneDayMillisecond = 24 * 60 * 60 * 1000
      return new Decimal(expiredAt)
        .add(this.gracePeriod)
        .sub(new Date().getTime())
        .div(oneDayMillisecond)
        .toFixed(0, Decimal.ROUND_UP)
    },
    onClick () {
      this.$router.push(`/me/account/${this.accountInfo.account}`)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-status {
  margin-bottom: 12px;
  padding: 16px 16px 20px 16px;
  border-radius: 16px;
  background: $white;
  box-shadow: 0px -1px 0px 0px $normal-color;
  cursor: pointer;
}

.account-status__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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
  word-break: break-all;
}

.account-status__arrow-right {
  min-width: 24px;
}

.account-status__status-text__container {
  min-height: 17px;
}

.account-status__status-text {
  margin-left: 38px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
}

.account-status__status-text_success {
  color: $success-font-color;
  background: rgba(0, 223, 155, 0.1);
}

.account-status__status-text__fixed-price-sell {
  color: #416BDC;
  background: #EAEFFE;
}

.account-status__status-text_warn {
  color: $error-font-color;
  background: rgba(223, 74, 70, 0.1);
}
</style>
