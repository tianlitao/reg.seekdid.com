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
    <template v-if="root">
      <template v-if="accountInfo && accountInfo.status === ACCOUNT_STATUS.registered">
        <div class="account-status-card__status">
          <span
            v-if="isExpired"
            class="account-status-card__status-text account-status-card__status-text_warn"
          >
            {{ $t('Recalls after {countdownToRecoveryDays} days, renews immediately', { countdownToRecoveryDays: countdownToRecoveryDays }) }}
          </span>
          <span
            v-else-if="!isExpired && countdownToExpiredDays"
            class="account-status-card__status-text account-status-card__status-text_warn"
          >
            {{ $t('Expires in {countdownToExpiredDays} days, renew immediately', { countdownToExpiredDays: countdownToExpiredDays }) }}
          </span>
          <span
            v-else
            class="account-status-card__status-text account-status-card__status-text_success"
          >
            {{ $t('In normal use') }}
          </span>
        </div>
        <div class="account-status-card__split-line" />
        <div class="account-status-card__action">
          <Button
            class="account-status-card__action-button account-status-card__action-button__flex"
            normal
            @click="onRenewal"
          >
            {{ $t('Renew') }}
          </Button>
          <Button
            class="account-status-card__action-button account-status-card__action-button__flex"
            normal
            @click="gotoCc"
          >
            {{ $t('Go to .cc') }}
          </Button>
        </div>
      </template>
      <template v-if="accountInfo && accountInfo.status === ACCOUNT_STATUS.onePriceSell">
        <div class="account-status-card__status">
          <span
            v-if="isExpired"
            class="account-status-card__status-text account-status-card__status-text_warn"
          >
            {{ $t('Recalls after {countdownToRecoveryDays} days, renews immediately', { countdownToRecoveryDays: countdownToRecoveryDays }) }}
          </span>
          <span
            v-else-if="!isExpired && countdownToExpiredDays"
            class="account-status-card__status-text account-status-card__status-text_warn"
          >
            {{ $t('Expires in {countdownToExpiredDays} days, renew immediately', { countdownToExpiredDays: countdownToExpiredDays }) }}
          </span>
          <span v-else class="account-status-card__status-text account-status-card__status-text_success">
            {{ $t('On sale') }}
          </span>
        </div>
        <div class="account-status-card__split-line" />
        <div class="account-status-card__action">
          <Button
            class="account-status-card__action-button account-status-card__action-button__flex"
            success
            @click="onSale"
          >
            {{ $t('On sale') }}
          </Button>
          <Button
            class="account-status-card__action-button account-status-card__action-button__flex"
            normal
            @click="gotoCc"
          >
            {{ $t('Go to .cc') }}
          </Button>
        </div>
      </template>
    </template>
    <template v-else>
      <template v-if="accountInfo && accountInfo.status === ACCOUNT_STATUS.reservedAccount">
        <div class="account-status-card__status">
          <span class="account-status-card__status-text account-status-card__status-text_success account-status-card__reserved-account">
            <Iconfont name="reserve" color="#22C493" />
            {{ $t(ACCOUNT_STATUS_LIST[accountInfo.status].statusText) }}
          </span>
        </div>
        <div class="account-status-card__split-line" />
        <div class="account-status-card__status-desc">
          {{ $t('This account is a reserved account and can only be claimed for free by the corresponding organization/individual. The free application process will be made public at a later date.') }}
        </div>
        <Button
          class="account-status-card__action-button"
          normal
          @click="gotoReservedDasList"
        >
          {{ $t('About Reserved Account') }}
        </Button>
      </template>
      <template v-if="accountInfo && accountInfo.status === ACCOUNT_STATUS.unavailableAccount">
        <div class="account-status-card__status">
          <span class="account-status-card__status-text account-status-card__status-text_success account-status-card__reserved-account">
            <Iconfont name="reserve" color="#22C493" />
            {{ $t(ACCOUNT_STATUS_LIST[accountInfo.status].statusText) }}
          </span>
        </div>
      </template>
      <template v-if="accountInfo && accountInfo.status === ACCOUNT_STATUS.registered">
        <div class="account-status-card__status">
          <span v-if="isExpired" class="account-status-card__status-text account-status-card__status-text_warn">
            {{ $t('Recalls in {countdownToRecoveryDays} days', { countdownToRecoveryDays: countdownToRecoveryDays }) }}
          </span>
          <span
            v-if="!isExpired && countdownToExpiredDays"
            class="account-status-card__status-text account-status-card__status-text_warn"
          >
            {{ $t('Expires in {countdownToExpiredDays} days', { countdownToExpiredDays: countdownToExpiredDays }) }}
          </span>
          <span
            v-else
            class="account-status-card__status-text account-status-card__status-text_success"
          >
            {{ $t('Already registered by others') }}
          </span>
        </div>
        <template v-if="isExpired">
          <div class="account-status-card__split-line" />
          <div class="account-status-card__status-desc">
            {{ $t('After the recall, this account will be recalled and registration will be reopened.') }}
          </div>
        </template>
      </template>
      <template v-if="accountInfo && accountInfo.status === ACCOUNT_STATUS.onePriceSell">
        <div class="account-status-card__status">
          <span v-if="isExpired" class="account-status-card__status-text account-status-card__status-text_warn">
            {{ $t('Recalls in {countdownToRecoveryDays} days', { countdownToRecoveryDays: countdownToRecoveryDays }) }}
          </span>
          <span
            v-if="!isExpired && countdownToExpiredDays"
            class="account-status-card__status-text account-status-card__status-text_warn"
          >
            {{ $t('Expires in {countdownToExpiredDays} days', { countdownToExpiredDays: countdownToExpiredDays }) }}
          </span>
          <span
            v-else
            class="account-status-card__status-text account-status-card__status-text_success"
          >
            {{ $t('On sale') }}
          </span>
        </div>
        <div class="account-status-card__split-line" />
        <div class="account-status-card__action">
          <Button
            class="account-status-card__action-button"
            success
            @click="onSale"
          >
            {{ $t('On sale') }}
          </Button>
        </div>
      </template>
      <template v-if="accountInfo && !accountInfo.status">
        <div class="account-status-card__status">
          <span class="account-status-card__status-text account-status-card__status-text_success">
            {{ $t(ACCOUNT_STATUS_LIST[0].statusText) }}
          </span>
        </div>
        <div class="account-status-card__split-line" />
        <Button
          class="account-status-card__action-button account-status-card__margin-top-24"
          normal
          @click="gotoRegistration"
        >
          {{ $t('Register Now') }}
        </Button>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import Decimal from 'decimal.js'
import { ACCOUNT_STATUS, ACCOUNT_STATUS_LIST, IDENTICON_SERVE } from '~/constant'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { IAccountInfo } from '~/services/Account'
import Button from '~/components/Button.vue'
import { COMMON_KEYS } from '~/store/common'
import config from '~~/config'

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
    },
    root: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ACCOUNT_STATUS,
      IDENTICON_SERVE,
      ACCOUNT_STATUS_LIST,
      oneDayMillisecond: 24 * 60 * 60 * 1000
    }
  },
  computed: {
    ...mapState({
      common: COMMON_KEYS.namespace
    }),
    isExpired (): boolean {
      if (this.accountInfo.expired_at) {
        return new Date().getTime() >= this.accountInfo.expired_at
      }
      return false
    },
    gracePeriod (): number {
      if (this.common.config.account_expiration_grace_period) {
        return this.common.config.account_expiration_grace_period * 1000
      }
      return 0
    },
    countdownToExpiredDays (): number | string {
      const currentTimestamp = new Date().getTime()
      const { expired_at: expiredAt } = this.accountInfo
      if (currentTimestamp > expiredAt - this.gracePeriod && currentTimestamp < expiredAt) {
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
        return new Decimal(expiredAt + this.gracePeriod)
          .sub(currentTimestamp)
          .div(this.oneDayMillisecond)
          .toFixed(0, Decimal.ROUND_UP)
      }
      return 0
    }
  },
  methods: {
    onRenewal () {
      this.$emit('renewal')
    },
    onSale () {
      window.open(`${config.didtop}/account/${this.accountInfo.account}`)
    },
    gotoCc () {
      if (this.$i18n.locale === 'zh') {
        window.open(`https://${this.accountInfo.account}.host`)
      }
      else {
        window.open(`https://${this.accountInfo.account}.cc`)
      }
    },
    gotoReservedDasList () {
      window.open('https://github.com/dotbitHQ/cell-data-generator/blob/master/data/reserved_accounts.txt')
    },
    gotoRegistration () {
      this.$router.push(`/account/register/${this.accountInfo.account}`)
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

.account-status-card__status-text_warn {
  color: $error-font-color;
  background: rgba(223, 74, 70, 0.1);
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

.account-status-card__margin-top-24 {
  margin-top: 24px;
}

.account-status-card__action-button__flex {
  flex: 1;
  margin: 0 8px;
  max-width: 160px;
}
</style>
