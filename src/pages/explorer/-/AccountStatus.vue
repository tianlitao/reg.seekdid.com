<template>
  <li class="account-status">
    <div class="account-status__info">
      <span
        class="account-status__status-text"
        :class="{
          'account-status__registered': [ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onCross].includes(account.status),
          'account-status__registerable': [ACCOUNT_STATUS.registerable, ACCOUNT_STATUS.onePriceSell, ACCOUNT_STATUS.auctionSell].includes(account.status)
        }"
      >
        <Iconfont
          v-if="account.status === ACCOUNT_STATUS.registerable"
          class="account-status__registerable__icon"
          name="check-strong"
          color="#22C493"
          size="20"
        />
        {{ ACCOUNT_STATUS_LIST[account.status] ? ACCOUNT_STATUS_LIST[account.status].statusText : '-' }}
      </span>
      <span
        class="account-status__account-name"
        :class="{ 'account-status__account-name_small': account.account.length > 9 }"
      >
        {{ toHashedStyle(account.account) }}
      </span>
    </div>
    <Button
      v-if="ACCOUNT_STATUS_LIST[account.status] && ACCOUNT_STATUS_LIST[account.status].href && ACCOUNT_STATUS_LIST[account.status].actionText"
      class="account-status__button"
      status="success"
      @click="goPage(account)"
    >
      {{ ACCOUNT_STATUS_LIST[account.status].actionText }}
    </Button>
    <Button
      v-else-if="loading"
      :loading="loading"
      class="account-status__button"
      status="success"
    />
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ACCOUNT_STATUS } from '~/constant'
import { ISearchAccount } from '~/services/Explorer'
import Button from '~/components/Button.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import config from '~~/config'
import { toHashedStyle } from '~/modules/tools'
import { LANGUAGE } from '~/constant/language'

export default Vue.extend({
  name: 'AccountStatus',
  components: {
    Iconfont,
    Button
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
      required: true
    },
    account: {
      type: Object as PropType<ISearchAccount>,
      required: true
    }
  },
  data () {
    return {
      ACCOUNT_STATUS,
      ACCOUNT_STATUS_LIST: {
        [ACCOUNT_STATUS.notOpenRegister]: {
          statusText: this.$tt('Not open for registration'),
          href: '',
          actionText: ''
        },
        [ACCOUNT_STATUS.registerable]: {
          statusText: this.$tt('Available'),
          href: '/account/register/',
          actionText: this.$tt('Register')
        },
        [ACCOUNT_STATUS.registeringPaymentConfirm]: {
          statusText: this.$tt('Registering'),
          href: '/account/register/status/',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.registeringLockedAccount]: {
          statusText: this.$tt('Registering'),
          href: '/account/register/status/',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.registering]: {
          statusText: this.$tt('Registering'),
          href: '/account/register/status/',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.registeringIncludeProposal]: {
          statusText: this.$tt('Registering'),
          href: '/account/register/status/',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.registeringConfirmProposal]: {
          statusText: this.$tt('Registering'),
          href: '/account/register/status/',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.registered]: {
          statusText: this.$tt('Already registered'),
          href: '-',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.reservedAccount]: {
          statusText: this.$tt('Reserved account'),
          href: '/explorer/account/',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.onePriceSell]: {
          statusText: this.$tt('On sale'),
          href: '-',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.auctionSell]: {
          statusText: this.$tt('Bid for sale'),
          href: '',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.candidateAccount]: {
          statusText: this.$tt('Candidate account'),
          href: '',
          actionText: this.$tt('View')
        },
        [ACCOUNT_STATUS.othersRegistering]: {
          statusText: this.$tt('Others are registering'),
          href: '',
          actionText: ''
        },
        [ACCOUNT_STATUS.unavailableAccount]: {
          statusText: this.$tt('Unavailable Account'),
          href: '',
          actionText: ''
        },
        [ACCOUNT_STATUS.subAccountNotCreated]: {
          statusText: this.$tt('Not minted'),
          href: '',
          actionText: ''
        },
        [ACCOUNT_STATUS.onCross]: {
          statusText: this.$tt('Already registered'),
          href: '-',
          actionText: this.$tt('View')
        }
      }
    }
  },
  methods: {
    toHashedStyle,
    goPage (account: ISearchAccount) {
      if (account.status === ACCOUNT_STATUS.registered) {
        if (account.is_self) {
          window.location.href = `${config.homepage}/${account.account}`
        }
        else {
          if (this.$i18n.locale === LANGUAGE.zhCN) {
            window.location.href = `https://${account.account}.host`
          }
          else {
            window.location.href = `https://${account.account}.cc`
          }
        }
      }
      else if (account.status === ACCOUNT_STATUS.onCross) {
        window.location.href = `${config.homepage}/${account.account}`
      }
      else if (account.status === ACCOUNT_STATUS.onePriceSell) {
        window.location.href = `${config.didtop}/account/${account.account}`
      }
      else {
        // @ts-ignore
        this.$router.push(`${this.ACCOUNT_STATUS_LIST[account.status].href}${account.account}`)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-status {
  display: flex;
  justify-content: space-between;
  padding: 16px 8px 16px 16px;
  background: $assist-color;
  box-shadow: $container-outer-box-shadow;
  border-radius: 16px;
}

.account-status__info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.account-status__status-text {
  display: inline-flex;
  align-items: center;
  height: 18px;
  font-size: 12px;
  font-weight: 600;
  color: $assist-font-color;
  line-height: 18px;
}

.account-status__registered {
  color: $warn-font-color;
}

.account-status__registerable {
  color: $success-font-color;
}

.account-status__registerable__icon {
  margin-right: 4px;
}

.account-status__account-name {
  height: 38px;
  font-size: 32px;
  font-weight: 600;
  color: $white;
  line-height: 38px;
  width: 218px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  hyphens: auto;
  white-space: nowrap;
}

.account-status__account-name_small {
  font-size: 24px;
}

.account-status__button {
  padding: 0;
  width: 98px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
}
</style>
