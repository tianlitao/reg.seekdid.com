<template>
  <div class="account-status">
    <div class="account-status__info">
      <span
        class="account-status__status-text"
        :class="{
          'account-status__registered': [ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onCross].includes(account.status),
          'account-status__registerable': [ACCOUNT_STATUS.registerable, ACCOUNT_STATUS.onePriceSell, ACCOUNT_STATUS.auctionSell].includes(account.status) || notRegistering
        }"
      >
        <Iconfont
          v-if="account.status === ACCOUNT_STATUS.registerable || notRegistering"
          class="account-status__registerable__icon"
          name="check-strong"
          color="#22C493"
          size="20"
        />
        {{ ACCOUNT_STATUS_LIST[account.status] ? ACCOUNT_STATUS_LIST[account.status].statusText : '-' }}
      </span>
      <span
        class="account-status__account-name"
        :class="{ 'account-status__account-name_small': account.account.length > 19 }"
      >
        {{ account.account }}
      </span>
    </div>
    <div class="account-status__actions">
      <Button
        v-if="account.status === ACCOUNT_STATUS.registerable || notRegistering"
        class="account-status__button"
        block
        shape="round"
        status="primary"
        @click="registerAndMintNft(account)"
      >
        {{ $tt('Register as an Ethereum NFT') }}
      </Button>
      <ul
        v-if="account.status === ACCOUNT_STATUS.registerable || notRegistering"
        class="account-status__tips"
      >
        <li>{{ $tt('Trade on Ethereum NFT marketplaces') }}</li>
        <li>{{ $tt('Account management features disabled') }}</li>
      </ul>
      <Button
        v-if="ACCOUNT_STATUS_LIST[account.status] && ACCOUNT_STATUS_LIST[account.status].href && ACCOUNT_STATUS_LIST[account.status].actionText"
        class="account-status__button"
        block
        shape="round"
        status="success"
        @click="goPage(account)"
      >
        {{ ACCOUNT_STATUS_LIST[account.status].actionText }}
      </Button>
      <template v-if="account.status === ACCOUNT_STATUS.registerable || notRegistering">
        <ul class="account-status__tips">
          <li>{{ $tt('Account management features available') }}</li>
          <li>{{ $tt('Support Ethereum, BNB Chain, Polygon and Tron') }}</li>
        </ul>
        <div class="account-status__more-info">
          *{{ $tt('A normal .bit and .bit Ethereum NFT can be converted to each other at any time.') }}
          <a
            class="account-status__more-info__link"
            :href="$i18n.locale === LANGUAGE.zhCN ? 'https://talk.did.id/t/bit-ethereum-nft/482#ethereum-bit-nft-bit-5' : 'https://talk.did.id/t/convert-your-bit-to-nft-on-ethereum-now/481#what-is-the-difference-between-bit-nfts-on-ethereum-and-a-normal-bit-5'"
            :target="isMobile ? '_self' : '_blank'"
          >
            {{ $tt('Learn more') }}
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { ACCOUNT_STATUS } from '~/constant'
import { ISearchAccount } from '~/services/Explorer'
import Button from '~/components/Button.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import config from '~~/config'
import { LANGUAGE } from '~/constant/language'
import { SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'
import { isMobile } from '~/modules/tools'
import { IConnectedAccount, ME_KEYS } from '~/store/me'

export default Vue.extend({
  name: 'AccountStatus',
  components: {
    Iconfont,
    Button
  },
  props: {
    account: {
      type: Object as PropType<ISearchAccount>,
      required: true
    }
  },
  computed: {
    isMobile,
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    isSubAccount (): boolean {
      return SUB_ACCOUNT_REG_EXP.test(this.account.account)
    },
    notRegistering (): boolean {
      return this.account.status === ACCOUNT_STATUS.registeringPaymentConfirm && !this.account.register_tx_map['1']
    },
    ACCOUNT_STATUS_LIST (): any {
      return {
        [ACCOUNT_STATUS.notOpenRegister]: {
          statusText: this.$tt('Not open for registration'),
          href: '',
          actionText: ''
        },
        [ACCOUNT_STATUS.registerable]: {
          statusText: this.$tt('Available'),
          href: '/account/register/',
          actionText: this.$tt('Register as a normal .bit')
        },
        [ACCOUNT_STATUS.registeringPaymentConfirm]: {
          statusText: this.notRegistering ? this.$tt('Available') : this.$tt('Registering'),
          href: this.notRegistering ? '/account/register/' : '/account/register/status/',
          actionText: this.notRegistering ? this.$tt('Register as a normal .bit') : this.$tt('View')
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
  data () {
    return {
      LANGUAGE,
      ACCOUNT_STATUS
    }
  },
  methods: {
    goPage (account: ISearchAccount) {
      if (account.status === ACCOUNT_STATUS.registered) {
        if (account.is_self) {
          const address = this.connectedAccount?.address
          const chainName = this.connectedAccount?.chain?.name
          const link = `${config.homepage}/${account.account}?originAddress=${address}&originChainName=${chainName}`
          window.location.href = link
        }
        else {
          if (this.isSubAccount) {
            if (this.$i18n.locale === LANGUAGE.zhCN) {
              window.location.href = `https://bit.host/${account.account}`
            }
            else {
              window.location.href = `https://bit.cc/${account.account}`
            }
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
      }
      else if (account.status === ACCOUNT_STATUS.onCross) {
        if (account.is_self) {
          const address = this.connectedAccount?.address
          const chainName = this.connectedAccount?.chain?.name
          const link = `${config.homepage}/${account.account}?originAddress=${address}&originChainName=${chainName}`
          window.location.href = link
        }
        else {
          window.location.href = `${config.homepage}/${account.account}`
        }
      }
      else if (account.status === ACCOUNT_STATUS.onePriceSell) {
        window.location.href = `${config.didtop}/account/${account.account}`
      }
      else {
        if (this.ACCOUNT_STATUS_LIST[account.status].href === '/account/register/') {
          this.$gtag('event', 'click', {
            event_category: 'explorer',
            event_label: 'register a .bit',
            value: 1
          })
        }
        this.$router.push(`${this.ACCOUNT_STATUS_LIST[account.status].href}${account.account}`)
      }
    },
    registerAndMintNft (account: ISearchAccount) {
      this.$gtag('event', 'click', {
        event_category: 'explorer',
        event_label: 'register a NFT',
        value: 1
      })
      this.$router.push({
        path: `/account/register/${account.account}`,
        query: {
          action: 'mintNft'
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-status {
  display: flex;
  flex-direction: column;
  padding: 20px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  font-size: $font-size-14;
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
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  hyphens: auto;
  white-space: nowrap;
  font-family: $barlow-medium;
  text-align: center;
}

.account-status__account-name_small {
  font-size: $font-size-24;
}

.account-status__button {
  margin-top: 16px;
  padding: 0;
}

.account-status__tips {
  font-size: 14px;
  font-weight: 400;
  color: #7D7F8D;
  line-height: 16px;
  text-align: left;
  list-style-type: disc;
  margin: 8px 24px 0 24px;
}

.account-status__more-info {
  margin-top: 16px;
  padding: 8px;
  background: $normal-hover-color;
  border-radius: 8px;
  border: 1px solid $normal-color;
  font-size: $font-size-14;
  font-weight: 400;
  color: $white;
  line-height: 16px;
  text-align: left;
}

.account-status__more-info__link {
  color: #2471FE;

  &:hover {
    color: $link-hover-font-color;
  }
}
</style>
