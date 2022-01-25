<template>
  <div class="register-status">
    <Breadcrumb class="register-status__breadcrumb" :items="breadcrumbItems" />
    <div class="register-status__container">
      <template v-if="tipStatus === TIPS.registeringPaymentConfirm">
        <StatusTip
          class="register-status__tip"
          icon="⏳"
          iconSize="72"
          :tip="$t('Payment Confirmation')"
          tipFontSize="24"
        />
        <div class="register-status__explain">
          {{ $t('The payment status of the order registered with {accountName} is not detected, please confirm whether you have paid?', { accountName: accountName }) }}
        </div>
        <Button
          class="register-status__button"
          block
          success
          @click="onPaid"
        >
          {{ $t('I have already paid') }}
        </Button>
        <Button
          class="register-status__button"
          block
          normal
          @click="onRegisterAgain"
        >
          {{ $t('Not paid, continue to pay') }}
        </Button>
      </template>
      <template v-else-if="tipStatus === TIPS.registering">
        <img
          class="register-status__registering-image"
          src="/images/account/register-status-registering.png"
          alt="register-status-registering"
        >
        <h2 class="register-status__registering-title">
          {{ $t('I am registering {accountName}', { accountName: accountName }) }}
        </h2>
        <i18n
          class="register-status__explain register-status__margin-bottom-24"
          path="It takes about five minutes, so please be patient. You can also go to the「{mePage}」page to see the accounts being registered."
          tag="div"
        >
          <span
            slot="mePage"
            class="register-status__go-me-page"
            @click="goMe"
          >
            {{ $t('My') }}
          </span>
        </i18n>
        <ConfirmList :accountInfo="accountInfo" />
        <Button
          class="register-status__button register-status__margin-bottom-24"
          block
          normal
          @click="onRegisterAnother"
        >
          {{ $t('Register another') }}
        </Button>
        <DasTips />
      </template>
      <template v-else-if="tipStatus === TIPS.registered">
        <img
          class="register-status__registered-image"
          src="/images/account/register-status-registered.png"
          alt="register-status-registered"
        >
        <h2 class="register-status__registered-title">
          {{ $t(`Congratulations, you have {accountName}`, { accountName: accountName }) }}
        </h2>
        <div class="register-status__explain">
          {{ $t('You can go to the administration page to add a resolution record, renew, etc.') }}
        </div>
        <div class="register-status__registered-actions">
          <Button
            class="register-status__registered-button__left"
            primary
            @click="goInvitationLink"
          >
            <IconImage
              class="register-status__registered-button__icon"
              url="/images/me/reward-logo.png"
              alt="reward"
              :size="25"
            />
            {{ $t('Reward') }}
          </Button>
          <Button
            class="register-status__registered-button__right"
            success
            @click="goManage"
          >
            {{ $t('View Account') }}
          </Button>
        </div>
        <ConfirmList :accountInfo="accountInfo" />
      </template>
      <template v-else-if="tipStatus === TIPS.registerFailed">
        <StatusTip
          class="register-status__tip"
          icon="😢"
          iconSize="72"
          :tip="$t('Oops! Registration failed')"
          tipFontSize="24"
        />
        <div class="register-status__explain">
          {{ $t('Registration of {accountName} failed! If you have already paid the relevant fees, you will be refunded to your payment address within 24 hours (except for transaction fees).', { accountName: accountName }) }}
        </div>
        <Button
          class="register-status__button"
          block
          normal
          @click="goHome"
        >
          {{ $t('Back to home page') }}
        </Button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import ConfirmList from './-/ConfirmList.vue'
import {
  ACCOUNT_STATUS,
  CYCLE_CALL_FUNCTION_TIME
} from '~/constant'
import Button from '~/components/Button.vue'
import StatusTip from '~/components/StatusTip.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { ISearchAccount } from '~/services/Explorer'
import { COMMON_KEYS } from '~/store/common'
import DasTips from '~/components/DasTips.vue'
import Breadcrumb from '~/components/Breadcrumb.vue'
import IconImage from '~/components/icon/IconImage.vue'

const TIPS = {
  registeringPaymentConfirm: 'registeringPaymentConfirm',
  registering: 'registering',
  registered: 'registered',
  registerFailed: 'registerFailed'
}

export default Vue.extend({
  name: 'RegisterStatus',
  components: {
    ConfirmList,
    Button,
    StatusTip,
    DasTips,
    Breadcrumb,
    IconImage
  },
  layout: 'noBottomNav',
  data () {
    return {
      TIPS,
      ACCOUNT_STATUS,
      accountName: this.$route.params.account,
      accountInfo: {} as ISearchAccount,
      paid: !!this.$route.query.paid,
      tipStatus: TIPS.registering,
      checking: false,
      checkAccountStatusTimerId: 0
    }
  },
  head (): { [key: string]: string } {
    return {
      title: (this.$t('Register') as string)
    }
  },
  computed: {
    ...mapState({
      common: COMMON_KEYS.namespace,
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainId: ME_KEYS.computedChainId
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    breadcrumbItems (): any {
      const from = this.$route.query.from
      if (from && from === 'registering-accounts') {
        return [{
          text: this.$t('My'),
          href: '/me'
        }, {
          text: this.$t('Registering accounts'),
          href: '/me/registering-accounts'
        }, {
          text: this.$t('Registering')
        }]
      }
      return [{
        text: this.$t('Explorer'),
        href: '/explorer'
      }, {
        text: this.$t('Register'),
        href: `/account/register/${this.accountName}`
      }, {
        text: this.$t('Registering')
      }]
    }
  },
  async mounted () {
    await this.$store.dispatch(COMMON_KEYS.fetchTokens)
    this.$store.dispatch(COMMON_KEYS.fetchConfig)
    this.checkAccountStatus()
    this.checkAccountStatusLoop()
  },
  beforeDestroy () {
    this.clearCheckAccountStatus()
  },
  methods: {
    checkAccountStatusLoop () {
      this.checkAccountStatusTimerId = window.setInterval(() => {
        this.checkAccountStatus()
      }, CYCLE_CALL_FUNCTION_TIME * 2)
    },
    async checkAccountStatus () {
      if (this.checking || !this.connectedAccount.chain) {
        return
      }
      this.checking = true

      try {
        const res = await this.$services.explorer.searchAccount({
          account: this.accountName,
          chain_type: this.computedChainId,
          address: this.connectedAccount.address
        })

        if (res) {
          this.accountInfo = res
        }

        // determine if the current user is in the registration process
        if (res && res.is_self) {
          if (res.status === ACCOUNT_STATUS.registerable) {
            this.tipStatus = TIPS.registerFailed
            this.clearCheckAccountStatus()
          }
          else if (res.status === ACCOUNT_STATUS.registeringPaymentConfirm) {
            if (this.paid || (res.register_tx_map && res.register_tx_map['1'])) {
              this.tipStatus = TIPS.registering
            }
            else {
              this.tipStatus = TIPS.registeringPaymentConfirm
            }
          }
          else if ([ACCOUNT_STATUS.registeringLockedAccount, ACCOUNT_STATUS.registering, ACCOUNT_STATUS.registeringIncludeProposal, ACCOUNT_STATUS.registeringConfirmProposal].includes(res.status)) {
            this.tipStatus = TIPS.registering
          }
          else if (res.status === ACCOUNT_STATUS.registered) {
            this.tipStatus = TIPS.registered
            this.clearCheckAccountStatus()
          }
        }
        else if ([ACCOUNT_STATUS.registerable, ACCOUNT_STATUS.registeringPaymentConfirm].includes(res.status)) {
          this.tipStatus = TIPS.registerFailed
          this.clearCheckAccountStatus()
        }
        else if ([ACCOUNT_STATUS.registeringLockedAccount, ACCOUNT_STATUS.registering, ACCOUNT_STATUS.registeringIncludeProposal, ACCOUNT_STATUS.registeringConfirmProposal].includes(res.status)) {
          this.$alert({
            title: this.$t('Error'),
            message: this.$t('Someone else is registering {accountName}, it is currently unavailable, please try again later', { accountName: this.accountName })
          })
          this.tipStatus = TIPS.registerFailed
          this.clearCheckAccountStatus()
        }
        else if (res.status === ACCOUNT_STATUS.registered) {
          this.$alert({
            title: this.$t('Error'),
            message: this.$t('{accountName} has been registered by someone else and can no longer be registered', { accountName: this.accountName })
          })
          this.tipStatus = TIPS.registerFailed
          this.clearCheckAccountStatus()
        }
      }
      catch (err) {
        console.error(err)
      }
      finally {
        this.checking = false
      }
    },
    goHome () {
      this.$router.push('/explorer')
    },
    goManage () {
      this.$router.push(`/me/account/${this.accountName}`)
    },
    goMe () {
      this.$router.push('/me')
    },
    goInvitationLink () {
      this.$router.push(`/me/invitation-link/${this.accountName}?from=registering`)
    },
    onRegisterAgain () {
      this.$router.push(`/account/register/${this.accountName}`)
    },
    onRegisterAnother () {
      this.$router.push('/explorer')
    },
    onPaid () {
      this.paid = true
      this.tipStatus = TIPS.registering
      if (this.checkAccountStatusTimerId === 0) {
        this.checkAccountStatusLoop()
      }
    },
    clearCheckAccountStatus () {
      window.clearInterval(this.checkAccountStatusTimerId)
      this.checking = false
      this.checkAccountStatusTimerId = 0
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.register-status {
  position: relative;
  flex: 1;
  padding: 0 12px;
}

.register-status__container {
  padding: 24px 20px 0 20px;
  text-align: center;
}

.register-status__registered-image,
.register-status__registering-image {
  width: 125px;
}

.register-status__registered-title,
.register-status__registering-title {
  font-size: 24px;
  line-height: 33px;
  margin: 0 0 14px 0;
  word-break: break-all;
}

.register-status__tip {
  padding: 16px 0;
}

.register-status__explain {
  margin-bottom: 24px;
  color: $assist-font-color;
  line-height: 20px;
  text-align: center;
  word-break: break-word;
}

.register-status__go-me-page {
  display: inline-block;
  color: $link-font-color;
  cursor: pointer;
}

.register-status__button {
  margin-bottom: 12px;

  &.button_normal {
    background: $normal-color;
  }
}

.register-status__registered-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.register-status__registered-button__left {
  flex: 1;
  margin: 0 4px 0 12px;
}

.register-status__registered-button__right {
  flex: 1;
  margin: 0 12px 0 4px;
}

.register-status__registered-button__icon {
  margin-right: 8px;
}

.register-status__margin-bottom-24 {
  margin-bottom: 24px;
}

.register-status__breadcrumb {
  padding: 16px 0;
}
</style>
