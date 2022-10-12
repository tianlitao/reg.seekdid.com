<template>
  <div class="register-status">
    <Breadcrumb class="register-status__breadcrumb" :items="breadcrumbItems"/>
    <div class="register-status__container">
      <template v-if="tipStatus === TIPS.registeringPaymentConfirm">
        <StatusTip
          class="register-status__tip"
          icon="⏳"
          iconSize="72"
          :tip="$tt('Payment Confirmation')"
          tipFontSize="24"
        />
        <div class="register-status__explain">
          {{ $tt('The payment status of the order registered with {accountName} is not detected, please confirm whether you have paid?', { accountName: accountName }) }}
        </div>
        <Button
          shape="round"
          class="register-status__button"
          block
          status="success"
          @click="onPaid"
        >
          {{ $tt('I have already paid') }}
        </Button>
        <Button
          shape="round"
          class="register-status__button"
          block
          @click="onRegisterAgain"
        >
          {{ $tt('Not paid, continue to pay') }}
        </Button>
      </template>
      <template v-else-if="tipStatus === TIPS.registering">
        <template v-if="mintNft">
          <span class="register-status__setp__title">{{ $tt('Step 1 (About 5 mins)') }}</span>
          <h2 class="register-status__registering-title">
            {{ $tt('Register {accountName}', { accountName: accountName }) }}
          </h2>
          <i18n
            tag="div"
            class="register-status__explain"
            path="铸造过程说明"
            :i18nkey="$tt('铸造过程说明')"
          >
            <span
              slot="mePage"
              class="register-status__go-me-page"
              @click="goMe"
            >
              {{ $tt('My') }}
            </span>
          </i18n>
        </template>
        <template v-else>
          <img
            class="register-status__registering-image"
            src="/images/account/register-status-registering.png"
            alt="register-status-registering"
          >
          <h2 class="register-status__registering-title">
            {{ $tt('Register {accountName}', { accountName: accountName }) }}
          </h2>
          <i18n
            tag="div"
            class="register-status__explain"
            path="注册过程说明"
            :i18nkey="$tt('注册过程说明')"
          >
            <span
              slot="mePage"
              class="register-status__go-me-page"
              @click="goMe"
            >
              {{ $tt('My') }}
            </span>
            <a
              slot="registionProcess"
              class="register-status__registration-process-docs"
              :href="$i18n.locale === LANGUAGE.zhCN ? 'https://docs.did.id/zh/faq#%E4%BB%80%E4%B9%88%E6%98%AF%E9%98%B2%E6%8A%A2%E6%B3%A8-%E9%98%B2%E6%8A%A2%E6%B3%A8%E7%9A%84%E5%8E%9F%E7%90%86%E6%98%AF%E4%BB%80%E4%B9%88' : 'https://docs.did.id/faq#what-is-anti-squatting-what-is-the-principle-of-anti-squatting'"
              target="_blank"
            >{{ $tt('registion process') }}</a>
          </i18n>
        </template>
        <ConfirmList
          :mini="mintNft"
          :accountInfo="accountInfo"
          :currentStep="currentStep"
        />
        <template v-if="mintNft">
          <span class="register-status__setp__title">{{ $tt('Step 2') }}</span>
          <h2 class="register-status__registering-title">
            {{ $tt('Mint to Ethereum') }}
          </h2>
          <div class="register-status__explain">
            {{ $tt('Click Mint to complete the registration.') }}
          </div>
          <template v-if="!minting">
            <Button
              block
              :disabled="currentStep === MintEthNftStep.one"
              :loading="mintLoading"
              shape="round"
              status="primary"
              @click="onMintNft"
            >
              {{ $tt('Mint') }}
            </Button>
          </template>
          <div
            v-else
            class="register-status__setp__processing"
          >
            <span class="register-status__setp__processing__icon">
              <Iconfont
                name="loading"
                color="#22C493"
                size="38"
              />
            </span>
            <span class="register-status__setp__processing__title">{{ $tt('Processing') }}</span>
          </div>
          <div
            v-if="mintHash"
            class="register-status__try-again"
          >
            <span @click="mintNft">{{ $tt('Exceed 24 hours? Try again') }}</span>
          </div>
          <div
            v-if="mintHash"
            class="register-status__setp__trx-hash"
          >
            <a
              class="register-status__setp__trx-id"
              :href="`${ETH.explorerTrx}${mintHash}`"
              target="_blank"
            >
              {{ collapseString(mintHash, 5, 5) }}
              <Iconfont
                class="register-status__setp__trx-id__icon"
                name="arrow-right"
                color="#B0B8BF"
                size="14"
              />
            </a>
          </div>
        </template>
        <template v-else>
          <div class="register-status__register-another__tips">
            *{{ $tt('You can register multiple accounts at the same time.') }}
          </div>
          <Button
            shape="round"
            class="register-status__button register-status__margin-bottom-24"
            block
            status="success"
            @click="onRegisterAnother"
          >
            {{ $tt('Register another') }}
          </Button>
          <DasTips/>
        </template>
      </template>
      <template v-else-if="tipStatus === TIPS.registered">
        <img
          class="register-status__registered-image"
          src="/images/account/register-status-registered.png"
          alt="register-status-registered"
        >
        <h2 class="register-status__registered-title">
          {{ $tt(`Congratulations, you have {accountName}`, { accountName: accountName }) }}
        </h2>
        <template v-if="mintNft">
          <EthMarketplace
            class="register-status__eth-marketplace"
            :account="accountName"
          />
        </template>
        <template v-else>
          <div class="register-status__explain">
            {{ $tt('What is next') }}
          </div>
          <RegisterGuideCard
            :title="$tt('Manage')"
            :description="$tt('Manage data, mint sub-accounts, renew, change permissions, etc.')"
            iconName="manage"
            backgroundColor="#CDF9CC"
            @click.native="goManage"
          />
          <RegisterGuideCard
            :title="$tt('Convert it to NFT on Ethereum')"
            :description="$tt('Trade on Ethereum NFT marketplaces.')"
            iconName="ethereum"
            backgroundColor="#DFE5FB"
            @click.native="goMintNFT"
          />
          <RegisterGuideCard
            :title="$tt('Set dotbit alias')"
            :description="$tt('Set dotbit name as your unified username in different DApps.')"
            iconName="alias"
            backgroundColor="#BFF5E9"
            @click.native="goAlias"
          />
        </template>
        <span
          class="register-status__back"
          @click="goHome"
        >{{ $tt('Back to Home') }}</span>
      </template>
      <template v-else-if="tipStatus === TIPS.registerFailed">
        <StatusTip
          class="register-status__tip"
          icon="😢"
          iconSize="72"
          :tip="$tt('Oops! Registration failed')"
          tipFontSize="24"
        />
        <div class="register-status__explain">
          {{
            $tt(
              'Registration of {accountName} failed! If you have already paid the relevant fees, you will be refunded to your payment address within 1 hour (except for transaction fees).',
              { accountName: accountName }
            )
          }}
        </div>
        <Button
          shape="round"
          class="register-status__button"
          block
          @click="goHome"
        >
          {{ $tt('Back to home page') }}
        </Button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import ConfirmList from './-/ConfirmList.vue'
import RegisterGuideCard from './-/RegisterGuideCard.vue'
import EthMarketplace from './-/EthMarketplace.vue'
import { ACCOUNT_STATUS, CrossDirection, CYCLE_CALL_FUNCTION_TIME, MintEthNftStatus, MintEthNftStep } from '~/constant'
import Button from '~/components/Button.vue'
import StatusTip from '~/components/StatusTip.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { ISearchAccount } from '~/services/Explorer'
import { COMMON_KEYS } from '~/store/common'
import DasTips from '~/components/DasTips.vue'
import Breadcrumb from '~/components/Breadcrumb.vue'
import config from '~~/config'
import { LANGUAGE } from '~/constant/language'
import { collapseString, isMobile } from '~/modules/tools'
import Iconfont from '~/components/icon/Iconfont.vue'
import errno from '~/constant/errno'
import { ETH } from '~/constant/chain'

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
    RegisterGuideCard,
    Iconfont,
    EthMarketplace
  },
  layout: 'noBottomNav',
  data () {
    return {
      LANGUAGE,
      TIPS,
      ETH,
      MintEthNftStep,
      ACCOUNT_STATUS,
      accountName: this.$route.params.account,
      accountInfo: {} as ISearchAccount,
      paid: !!this.$route.query.paid,
      tipStatus: TIPS.registering,
      checking: false,
      checkAccountStatusTimerId: 0,
      domain: config.domain,
      minting: false,
      currentStep: MintEthNftStep.one,
      mintLoading: false,
      mintHash: '',
      checkMintStatusTimer: 0
    }
  },
  head (): { [key: string]: string } {
    return {
      title: (this.$tt('Register') as string)
    }
  },
  computed: {
    isMobile,
    ...mapState({
      common: COMMON_KEYS.namespace,
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    breadcrumbItems (): any {
      const from = this.$route.query.from
      if (from && from === 'registering-accounts') {
        return [{
          text: this.$tt('My'),
          href: '/me'
        }, {
          text: this.$tt('Registering accounts'),
          href: '/me/registering-accounts'
        }, {
          text: this.$tt('Registering')
        }]
      }
      return [{
        text: this.$tt('Explorer'),
        href: '/explorer'
      }, {
        text: this.$tt('Register'),
        href: `/account/register/${this.accountName}`
      }, {
        text: this.$tt('Registering')
      }]
    },
    mintNft (): boolean {
      return this.$route.query.action === 'mintNft'
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
    clearTimeout(this.checkMintStatusTimer)
  },
  methods: {
    collapseString,
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
          chain_type: this.computedChainType,
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
            if (
              this.paid ||
              (res.register_tx_map && res.register_tx_map['1'])
            ) {
              this.tipStatus = TIPS.registering
            }
            else {
              this.tipStatus = TIPS.registeringPaymentConfirm
            }
          }
          else if (
            [
              ACCOUNT_STATUS.registeringLockedAccount,
              ACCOUNT_STATUS.registering,
              ACCOUNT_STATUS.registeringIncludeProposal,
              ACCOUNT_STATUS.registeringConfirmProposal
            ].includes(res.status)
          ) {
            this.tipStatus = TIPS.registering
          }
          else if ([ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onCross].includes(res.status)) {
            if (this.mintNft) {
              this.checkMintStatus()
            }
            else {
              this.tipStatus = TIPS.registered
            }
            this.clearCheckAccountStatus()
          }
        }
        else if (
          [
            ACCOUNT_STATUS.registerable,
            ACCOUNT_STATUS.registeringPaymentConfirm
          ].includes(res.status)
        ) {
          this.tipStatus = TIPS.registerFailed
          this.clearCheckAccountStatus()
        }
        else if (
          [
            ACCOUNT_STATUS.registeringLockedAccount,
            ACCOUNT_STATUS.registering,
            ACCOUNT_STATUS.registeringIncludeProposal,
            ACCOUNT_STATUS.registeringConfirmProposal
          ].includes(res.status)
        ) {
          this.$alert({
            title: this.$tt('Error'),
            message: this.$tt(
              'Someone else is registering {accountName}, it is currently unavailable, please try again later',
              { accountName: this.accountName }
            )
          })
          this.tipStatus = TIPS.registerFailed
          this.clearCheckAccountStatus()
        }
        else if (
          [ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onCross].includes(
            res.status
          )
        ) {
          this.$alert({
            title: this.$tt('Error'),
            message: this.$tt(
              '{accountName} has been registered by someone else and can no longer be registered',
              { accountName: this.accountName }
            )
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
    goMintNFT () {
      this.$router.push(`/me?mintNft=${this.accountName}`)
    },
    goManage () {
      const address = this.connectedAccount?.address
      const chainName = this.connectedAccount?.chain?.name
      const link = `${config.homepage}/${this.accountName}?originAddress=${address}&originChainName=${chainName}`
      if (this.isMobile) {
        window.location.href = link
      }
      else {
        window.open(link)
      }
    },
    goAlias () {
      this.$router.push('/alias')
    },
    goMe () {
      this.$router.push('/me')
    },
    onRegisterAgain () {
      this.$router.push({
        path: `/account/register/${this.accountName}`,
        query: {
          action: this.$route.query.action
        }
      })
    },
    onRegisterAnother () {
      this.$gtag('event', 'click', {
        event_category: 'register status',
        event_label: 'register another',
        value: 1
      })
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
    },
    async checkMintStatus () {
      try {
        const res = await this.$services.crossEth.lockMintStatus({
          key_info: {
            coin_type: String(this.connectedAccount.chain.coinType),
            key: this.connectedAccount.address
          },
          account: this.accountName
        })

        this.checkMintStatusTimer = window.setTimeout(() => {
          this.checkMintStatus()
        }, CYCLE_CALL_FUNCTION_TIME * 2)

        if (res) {
          if (res.mint_hash) {
            this.mintHash = res.mint_hash
          }
          switch (res.status) {
            case MintEthNftStatus.lockPending:
              this.currentStep = MintEthNftStep.one
              break
            case MintEthNftStatus.lockConfirm:
              this.currentStep = MintEthNftStep.one
              break
            case MintEthNftStatus.lockRejected:
              this.currentStep = MintEthNftStep.one
              clearTimeout(this.checkMintStatusTimer)
              break
            case MintEthNftStatus.mintSign:
              this.currentStep = MintEthNftStep.two
              this.$emit('updateDirectionList')
              clearTimeout(this.checkMintStatusTimer)
              break
            case MintEthNftStatus.mintPending:
              this.currentStep = MintEthNftStep.two
              this.minting = true
              break
            case MintEthNftStatus.mintConfirm:
              this.currentStep = MintEthNftStep.succeed
              this.minting = false
              this.tipStatus = TIPS.registered
              clearTimeout(this.checkMintStatusTimer)
              break
            case MintEthNftStatus.mintFailed:
              this.currentStep = MintEthNftStep.two
              this.minting = false
              clearTimeout(this.checkMintStatusTimer)
              break
          }
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code !== errno.rpcApiErrLockAccountNotExist) {
          this.checkMintStatusTimer = window.setTimeout(() => {
            this.checkMintStatus()
          }, CYCLE_CALL_FUNCTION_TIME * 2)
        }
      }
    },
    async onMintNft () {
      this.mintLoading = true
      await this.$walletSdk.onConnect(true)
      try {
        const mintSignInfo = await this.$services.crossEth.mintSignInfo({
          key_info: {
            coin_type: String(this.connectedAccount.chain.coinType),
            key: this.connectedAccount.address
          },
          account: this.accountName
        })
        const trxId = await this.$walletSdk.mintEthNft(this.accountName, mintSignInfo.data, mintSignInfo.gnosis_signatures)
        if (trxId) {
          const res = await this.$services.crossEth.pendingHash({
            key_info: {
              coin_type: String(this.connectedAccount.chain.coinType),
              key: this.connectedAccount.address
            },
            account: this.accountName,
            hash: trxId,
            direction: CrossDirection.fromCKB
          })
          this.mintHash = trxId
        }
        this.minting = true
        setTimeout(() => {
          this.checkMintStatus()
        }, CYCLE_CALL_FUNCTION_TIME * 10)
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.message.includes('execution reverted: GS026')) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The transaction is still processing. Please try again after 24 hours.')
            })
          }
          else {
            this.$alert({
              title: this.$tt('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
      finally {
        this.mintLoading = false
      }
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
  padding: 0 20px;
  text-align: center;
}

.register-status__registered-image,
.register-status__registering-image {
  width: 125px;
}

.register-status__registered-title,
.register-status__registering-title {
  font-size: $font-size-24;
  line-height: 33px;
  margin: 0 0 12px 0;
  word-break: break-word;
  hyphens: auto;
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
  hyphens: auto;
}

.register-status__go-me-page {
  display: inline-block;
  color: $link-font-color;
  cursor: pointer;

  &:hover {
    color: $link-hover-font-color;
  }
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

.register-status__registration-process-docs {
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color;
  }
}

.register-status__back {
  color: $link-font-color;
  display: inline-block;
  padding: 24px 0;
  cursor: pointer;

  &:hover {
    color: $link-hover-font-color;
  }
}

.register-status__register-another__tips {
  margin-top: 24px;
  margin-bottom: 12px;
  color: $assist-font-color;
}

.register-status__setp__title {
  display: inline-block;
  margin-bottom: 12px;
  margin-top: 44px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 2px 12px;
  font-size: $font-size-14;
  font-weight: 600;
  color: $assist-font-color;
}

.register-status__setp__processing {
  display: flex;
  align-items: center;
  background: #D6EFE7;
  border-radius: 60px;
  padding: 8px 12px;
  color: $success-font-color;
  font-size: $font-size-12;
}

.register-status__setp__processing__icon {
  margin-right: 4px;

  svg {
    animation: rotate360DegAnimation 0.9s linear infinite;
  }
}

.register-status__setp__processing__title {
  font-size: $font-size-14;
  font-weight: 600;
  color: $success-font-color;
  line-height: 16px;
}

.register-status__try-again {
  text-align: center;
  margin-top: 12px;

  span {
    color: $link-font-color;
    cursor: pointer;

    &:hover {
      color: $link-hover-font-color;
    }
  }
}

.register-status__setp__trx-hash {
  display: flex;
  justify-content: center;
  padding-bottom: 24px;
}

.register-status__setp__trx-id {
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: $font-size-12;
  font-weight: 400;
  color: $third-font-color;
  line-height: 14px;
  margin-top: 18px;
}

.register-status__setp__trx-id__icon {
  margin-left: -2px;
}

.register-status__eth-marketplace {
  margin-top: 36px;
}
</style>
