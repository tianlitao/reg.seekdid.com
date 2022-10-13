<template>
  <div class="account-register">
    <Breadcrumb class="account-register__breadcrumb" :items="breadcrumbItems" />
    <AccountStatusSimpleCard :accountInfo="accountInfo" />
    <div class="account-register__container">
      <div class="account-register__item">
        <span>
          {{ $tt('Registration year') }}
        </span>
        <InputCounter
          v-model="registrationPeriod"
          :unit="registrationPeriod > 1 ? $tt('years') : $tt('year')"
        />
      </div>
      <div class="account-register__inviter">
        <span class="account-register__inviter__label">
          <span>
            {{ $tt('Inviter') }}
          </span>
          <br>
          <span class="account-register__inviter-discount__tips">*{{ $tt('Save {inviterDiscount}% on fees', { inviterDiscount: inviterDiscount }) }}</span>
        </span>
        <span>
          <span class="account-register__input">
            <input
              v-model.trim="inviter"
              class="account-register__input__input"
              :class="{ 'account-register__input__input_error': inviterErrorTipShowing || inviterOnCross }"
              :placeholder="$tt('Optional')"
              @input="onInputInviter"
              @blur="onBlurInviter"
            >
            <span class="account-register__input__suffix">.bit</span>
          </span>
          <span
            v-if="inviterErrorTipShowing"
            class="account-register__input__input__error-messages"
          >
            {{ $tt('The account does not exist') }}
          </span>
          <span
            v-if="inviterOnCross"
            class="account-register__input__input__error-messages"
          >
            {{ $tt('This account is in a special status. Please try another one.') }}
          </span>
        </span>
      </div>
      <div class="account-register__split-line" />
      <div class="account-register__item">
        <span>
          {{ $tt('Annual fee') }}
          <span class="account-register__annual-fee__registration-period">{{ `${registrationPeriod} ${registrationPeriod > 1 ? $tt('years') : $tt('year')}` }}</span>
        </span>
        <span class="account-register__value">${{ thousandSplit(originalTotalAccountPrice || 0, FIAT_DECIMAL_PLACES) }}</span>
      </div>
      <div class="account-register__item">
        <span>
          <span>
            {{ $tt('Storage deposit') }}
            <a
              :href="$i18n.locale === LANGUAGE.zhCN ? 'https://docs.did.id/zh/faq#%E4%BB%80%E4%B9%88%E6%98%AF%E5%AD%98%E5%82%A8%E6%8A%BC%E9%87%91' : 'https://docs.did.id/faq#what-is-the-storage-deposit'"
              target="_blank"
            >
              <Iconfont
                class="account-register__item__info-icon"
                name="info"
                color="#A0A1AB"
                size="14"
              />
            </a>
          </span>
          <br>
          <span class="account-register__label-tip">*{{ $tt('Full refund when account expires for recycling') }}</span>
        </span>
        <span class="account-register__value">
          {{ `$${thousandSplit(accountInfo.base_amount || 0, FIAT_DECIMAL_PLACES)}` }}
        </span>
      </div>
      <div class="account-register__item">
        <span>
          {{ $tt('Discount') }}
        </span>
        <span
          class="account-register__value"
          :class="discountAmount.eq(0) ? 'account-register__no-inviter-discount' : 'account-register__inviter-discount'"
        >
          -${{ thousandSplit(discountAmount || 0, FIAT_DECIMAL_PLACES) }}
        </span>
      </div>
      <div class="account-register__split-line" />
      <div class="account-register__registration-fee">
        <span>{{ $tt('Total cost') }}</span>
        <span class="account-register__registration-fee__value">
          {{ `$${thousandSplit(paidAmount, FIAT_DECIMAL_PLACES)}` }}
          <span
            v-if="originalPrice.gt(paidAmount)"
            class="account-register__original-price"
          >
            {{ `${$tt('Original price')}: $${thousandSplit(originalPrice, FIAT_DECIMAL_PLACES)}` }}
          </span>
        </span>
      </div>
      <Button
        shape="round"
        :loading="onRegisterLoading"
        block
        status="success"
        @click="onRegister"
      >
        {{ $tt('Register') }}
      </Button>
    </div>
    <BottomSheet
      v-model="confirmRegisterShowing"
      :title="$tt('Select payment')"
    >
      <PaymentTokenSelect
        v-model="paymentToken"
        class="account-register__payment-token-select"
        :currentChain="chainType"
        :options="paymentTokens"
      />
      <template v-if="!mintNft">
        <a
          class="account-register__deposit-ckb"
          :href="dotbitBalanceUrl"
          :target="isMobile ? '_self' : '_blank'"
        >
          <span>{{ $tt('Deposit CKB to DAS Balance') }}</span>
          <Iconfont name="arrow-right" color="#C4D0CD" size="16" />
        </a>
        <a
          class="account-register__register-with-ckb"
          :href="$i18n.locale === LANGUAGE.zhCN ? 'https://talk.did.id/t/ckb-das-das-0-gas-ckb/284' : 'https://talk.did.id/t/how-do-i-register-das-account-with-ckb-0-gas-no-ckb-wallet-needed/285'"
          target="_blank"
        >
          <span>
            <Iconfont
              name="info"
              color="#3D66B3"
              size="14"
            />
          </span>
          <span>{{ $tt('How to register with CKB (DAS Balance)?') }}</span>
        </a>
      </template>
      <div class="account-register__confirm-register__paid-amount__value">
        {{ `${thousandSplit(paidTokenAmount)} ${paymentToken.symbol}` }}
      </div>
      <WalletConnectTips />
      <div
        v-if="paymentToken.token_id === CKB.tokenId && (isTokenPocket || isCoinbaseWallet)"
        class="account-register__payment-error"
      >
        {{ $tt('The wallet environment does not support {token} payments', { token: CKB.symbol }) }}
      </div>
      <div
        v-if="paymentToken.chain_type === ChainType.tron && (isSafePalWallet || isViaWallet)"
        class="account-register__payment-error"
      >
        {{ $tt('The wallet environment does not support {token} payments', { token: TRON.symbol }) }}
      </div>
      <Button
        shape="round"
        class="account-register__confirm-register__button"
        :loading="confirmRegisterLoading"
        :disabled="(paymentToken.token_id === CKB.tokenId && (isTokenPocket || isCoinbaseWallet)) || (paymentToken.chain_type === ChainType.tron && (isSafePalWallet || isViaWallet))"
        block
        status="success"
        @click="onConfirm"
      >
        {{ $tt('Pay') }}
      </Button>
    </BottomSheet>
    <DasBalanceInsufficientDialog
      v-model="dasBalanceInsufficientDialogShowing"
      :registrationFees="paidTokenAmount"
    />
    <PwBalanceInsufficientDialog
      v-model="pwBalanceInsufficientDialogShowing"
    />
    <SignatureErrorDialog
      v-model="signatureErrorDialogShowing"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Decimal from 'decimal.js'
import DasBalanceInsufficientDialog from './-/DasBalanceInsufficientDialog.vue'
import PwBalanceInsufficientDialog from './-/PwBalanceInsufficientDialog.vue'
import SignatureErrorDialog from './-/SignatureErrorDialog.vue'
import AccountStatusSimpleCard from '~/components/cards/AccountStatusSimpleCard.vue'
import Button from '~/components/Button.vue'
import { COMMON_KEYS } from '~/store/common'
import { IToken } from '~/services/Common'
import {
  isCoinbaseWallet,
  isSafePalWallet,
  isViaWallet,
  isTokenPocket,
  mmJsonHashAndChainIdHex,
  sleep,
  thousandSplit, isMobile, toHashedStyle, toDottedStyle, digitalEmojiHandle
} from '~/modules/tools'
import {
  ACCOUNT_STATUS,
  ACCOUNT_SUFFIX,
  FIAT_DECIMAL_PLACES,
  ORDER_ACTION_TYPE,
  TOKEN_DECIMAL_PLACES
} from '~/constant'
import WalletConnectTips from '~/components/WalletConnectTips.vue'
import BottomSheet from '~/components/BottomSheet.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import InputCounter from '~/components/form/InputCounter.vue'
import { ISearchAccount } from '~/services/Explorer'
import errno from '~/constant/errno'
import PaymentTokenSelect from '~/components/PaymentTokenSelect.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import {
  ChainType,
  CKB,
  CoinType,
  CoinTypeToChainTypeMap,
  DASBalanceTokenId, ETH,
  EvmCoinTypes,
  NEW_LOCK_SCRIPT_TYPE,
  TRON
} from '~/constant/chain'
import Breadcrumb from '~/components/Breadcrumb.vue'
import config from '~~/config'
import { IOrderDetailRes } from '~/services/Account'
import { LANGUAGE } from '~/constant/language'

export default Vue.extend({
  name: 'AccountRegister',
  components: {
    AccountStatusSimpleCard,
    Button,
    BottomSheet,
    InputCounter,
    PaymentTokenSelect,
    Iconfont,
    Breadcrumb,
    WalletConnectTips,
    DasBalanceInsufficientDialog,
    PwBalanceInsufficientDialog,
    SignatureErrorDialog
  },
  layout: 'noBottomNav',
  data () {
    return {
      LANGUAGE,
      config,
      TRON,
      CKB,
      ChainType,
      FIAT_DECIMAL_PLACES,
      accountName: this.$route.params.account,
      accountInfo: {
        account: this.$route.params.account
      } as ISearchAccount,
      registrationPeriod: 1,
      inviter: '',
      inviterErrorTipShowing: false,
      inviterOnCross: false,
      confirmRegisterShowing: false,
      confirmRegisterLoading: false,
      paymentToken: {} as IToken,
      orderInfo: {} as IOrderDetailRes,
      storageFeeTipsShowing: false,
      dasBalanceInsufficientDialogShowing: false,
      pwBalanceInsufficientDialogShowing: false,
      signatureErrorDialogShowing: false,
      onRegisterLoading: false
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
      computedChainType: ME_KEYS.computedChainType,
      computedChainId: ME_KEYS.computedChainId
    }),
    isTokenPocket,
    isCoinbaseWallet,
    isSafePalWallet,
    isViaWallet,
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    originalTotalAccountPrice (): Decimal {
      return new Decimal(this.registrationPeriod || 0)
        .times(this.accountInfo.account_price || 0)
    },
    originalPrice (): Decimal {
      const _amount = this.originalTotalAccountPrice
        .add(this.accountInfo.base_amount || 0)
      return _amount
    },
    premium (): number {
      if (this.common.config?.premium) {
        return 1 + Number(this.common.config?.premium)
      }
      else {
        return 1
      }
    },
    discountAmount (): Decimal {
      if (!this.inviter) {
        return new Decimal(0)
      }
      return this.originalTotalAccountPrice
        .times(this.common.config.inviter_discount || 0)
    },
    inviterDiscount (): Number {
      return new Decimal(this.common.config.inviter_discount || 0)
        .times(100)
        .toNumber()
    },
    totalAccountPrice (): Decimal {
      let _amount = this.originalTotalAccountPrice
      if (this.inviter) {
        _amount = _amount.sub(this.discountAmount || 0)
      }
      return _amount.lt(0) ? new Decimal(0) : _amount
    },
    paidAmount (): Decimal {
      const _amount = this.totalAccountPrice
        .add(this.accountInfo.base_amount || 0)
      return _amount.lt(0) ? new Decimal(0) : _amount
    },
    paidTokenAmount (): string {
      return new Decimal(this.paidAmount)
        .div(this.paymentToken.price || 1)
        .times(this.premium)
        .toFixed(TOKEN_DECIMAL_PLACES)
    },
    breadcrumbItems (): any {
      return [{
        text: this.$tt('Explorer'),
        href: '/explorer'
      }, {
        text: this.$tt('Register')
      }]
    },
    chainType (): ChainType {
      let _chainType = ChainType.ckb
      const _coinType = this.connectedAccount.chain?.coinType
      if (_coinType && CoinTypeToChainTypeMap[_coinType]) {
        _chainType = CoinTypeToChainTypeMap[_coinType]
      }
      return _chainType
    },
    mintNft (): boolean {
      return this.$route.query.action === 'mintNft'
    },
    loggedIn (): boolean {
      return !!this.me.connectedAccount.address
    },
    paymentTokens (): IToken[] {
      if (this.mintNft) {
        return this.common.tokens.filter((token: IToken) => {
          return token.token_id === ETH.tokenId
        })
      }
      else {
        return this.common.tokens
      }
    },
    dotbitBalanceUrl (): string {
      const address = this.connectedAccount?.address
      const chainName = this.connectedAccount?.chain?.name
      return `${config.dasBalance}?originAddress=${address}&originChainName=${chainName}`
    }
  },
  watch: {
    confirmRegisterShowing (newVal) {
      if (newVal === false) {
        this.confirmRegisterLoading = false
      }
    }
  },
  async mounted () {
    this.$store.dispatch(COMMON_KEYS.fetchTokens)
    this.$store.dispatch(COMMON_KEYS.fetchConfig)
    this.getInviter()
    await this.checkAccountStatus()
    if (this.accountInfo.is_self && this.accountInfo.status === ACCOUNT_STATUS.registeringPaymentConfirm) {
      await this.getOrderInfo()
      this.registrationPeriod = this.orderInfo.register_years
      if (this.orderInfo.inviter_account) {
        this.inviter = toHashedStyle(this.orderInfo.inviter_account)
        this.inviter = this.inviter.replace(/\.bit$/, '')
      }
      if (this.orderInfo.channel_account && !this.me.channel) {
        console.log(this.orderInfo.channel_account);
        console.log(this.me.channel);
        this.$store.commit(ME_KEYS.setChannel, this.orderInfo.channel_account)
      }
      const _token = this.paymentTokens.find((token: IToken) => {
        return this.orderInfo.pay_token_id === token.token_id
      })
      if (_token) {
        this.paymentToken = _token
      }
    }
  },
  methods: {
    thousandSplit,
    async checkAccountStatus (): Promise<boolean> {
      let _result = true
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
          if ([ACCOUNT_STATUS.registeringLockedAccount, ACCOUNT_STATUS.registering, ACCOUNT_STATUS.registeringIncludeProposal, ACCOUNT_STATUS.registeringConfirmProposal].includes(res.status)) {
            this.$router.push(`/account/register/status/${this.accountName}`)
            _result = false
          }
          else if ([ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onCross].includes(res.status)) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('You already have {accountName}, no need to register again', { accountName: this.accountName })
            })
            _result = false
          }
        }
        else if ([ACCOUNT_STATUS.registering, ACCOUNT_STATUS.registeringIncludeProposal, ACCOUNT_STATUS.registeringConfirmProposal].includes(res.status)) {
          this.$alert({
            title: this.$tt('Tips'),
            message: this.$tt('Someone else is registering {accountName}, it is currently unavailable, please try again later', { accountName: this.accountName })
          })
          _result = false
        }
        else if ([ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onCross].includes(res.status)) {
          this.$alert({
            title: this.$tt('Tips'),
            message: this.$tt('{accountName} has been registered by someone else and can no longer be registered', { accountName: this.accountName })
          })
          _result = false
        }
        else if (res.status === ACCOUNT_STATUS.reservedAccount) {
          this.$router.push(`/explorer/account/${this.accountName}`)
          _result = false
        }
        else if (res.status === ACCOUNT_STATUS.notOpenRegister) {
          this.$alert({
            title: this.$tt('Tips'),
            message: this.$tt('This account name is not yet open for registration')
          })
          _result = false
        }
        else if (res.status === ACCOUNT_STATUS.unavailableAccount) {
          this.$alert({
            title: this.$tt('Tips'),
            message: this.$tt('Unavailable Account')
          })
          _result = false
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.rpcApiErrNotOpenForRegistration) {
          this.$alert({
            title: this.$tt('Error'),
            message: this.$tt('{accountName} is not open for registration', { accountName: this.accountName })
          })
        }
        else {
          this.$alert({
            title: this.$tt('Error'),
            message: `${err.code}: ${err.message}`
          })
        }
        _result = false
      }
      return _result
    },
    async getOrderInfo () {
      try {
        const res = await this.$services.account.orderDetail({
          account: this.accountName,
          chain_type: this.computedChainType,
          address: this.connectedAccount.address,
          action: ORDER_ACTION_TYPE.applyRegister
        })

        if (res) {
          this.orderInfo = res
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    async changeOrder () {
      try {
        await this.$services.account.changeOrder({
          chain_type: this.computedChainType,
          address: this.connectedAccount.address,
          account: this.accountName,
          pay_chain_type: this.paymentToken.chain_type,
          pay_token_id: this.paymentToken.token_id,
          pay_address: this.connectedAccount.address,
          pay_type: '',
          register_years: this.registrationPeriod,
          coin_type: this.connectedAccount.chain.coinType,
          inviter_account: this.inviter ? toDottedStyle(this.inviter + ACCOUNT_SUFFIX) : 'seekdid.bit',
          channel_account: 'seekdid.bit',//this.me.channel,
          cross_coin_type: this.mintNft ? CoinType.eth : ''
        })
      }
      catch (err) {
        console.error(err)
        throw err
      }
    },
    async onRegister () {
      if (this.onRegisterLoading) {
        return
      }
      this.onRegisterLoading = true
      if (this.loggedIn) {
        if (this.mintNft && this.connectedAccount.chain.coinType !== ETH.coinType) {
          this.$walletSdk.walletsConnect(true)
          this.onRegisterLoading = false
          return
        }
        else {
          await this.$walletSdk.onConnect(true)
        }
      }
      else {
        await this.$walletSdk.walletsConnect(this.mintNft)
        this.onRegisterLoading = false
        return
      }
      if (this.isSafePalWallet && EvmCoinTypes.includes(this.connectedAccount.chain?.coinType)) {
        this.$alert({
          title: this.$tt('Tips'),
          message: this.$tt('The wallet does not support EIP-712 signature algorithm. Please use another wallet App and try again.')
        })
        this.onRegisterLoading = false
        return
      }
      await this.checkInviter()
      if (this.inviterErrorTipShowing) {
        this.onRegisterLoading = false
        return
      }
      if (this.inviterOnCross) {
        this.onRegisterLoading = false
        return
      }
      if (this.inviter) {
        this.$store.commit(ME_KEYS.setInviter, toDottedStyle(this.inviter + ACCOUNT_SUFFIX))
      }
      this.onRegisterLoading = false
      this.confirmRegisterShowing = true
      this.$gtag('event', 'click', {
        event_category: 'account',
        event_label: 'register',
        value: 1
      })
    },
    async onConfirm () {
      // todo split this function
      this.confirmRegisterLoading = true
      await this.$walletSdk.onConnect(true)

      const checkAccountStatusRes = await this.checkAccountStatus()
      if (!checkAccountStatusRes) {
        this.confirmRegisterLoading = false
        return
      }

      this.$gtag('event', 'click', {
        event_category: 'account',
        event_label: 'confirm register',
        value: 1
      })

      try {
        await this.getOrderInfo()
        if (this.orderInfo.order_id) {
          if (this.orderInfo.register_years !== this.registrationPeriod || this.orderInfo.inviter_account !== (this.inviter ? toDottedStyle(this.inviter + ACCOUNT_SUFFIX) : this.inviter) || this.orderInfo.channel_account !== this.me.channel || this.orderInfo.pay_token_id !== this.paymentToken.token_id || this.orderInfo.coin_type !== this.connectedAccount.chain.coinType || this.mintNft !== !!this.orderInfo.cross_coin_type) {
            await this.changeOrder()
            await this.getOrderInfo()
          }
          if (this.paymentToken.token_id === DASBalanceTokenId) {
            const res = await this.$services.account.dasBalancePay({
              evm_chain_id: this.computedChainId,
              chain_type: this.computedChainType,
              address: this.connectedAccount.address,
              order_id: this.orderInfo.order_id
            })

            if (res && res.sign_list) {
              for (const item of res.sign_list) {
                if (item.sign_msg) {
                  if (item.sign_type === NEW_LOCK_SCRIPT_TYPE.eip712) {
                    const mmJson = JSON.parse(JSON.stringify(res.mm_json))
                    mmJson.message.digest = item.sign_msg
                    const signDataRes = await this.$walletSdk.signData(mmJson, true)
                    item.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
                  }
                  else {
                    const signDataRes = await this.$walletSdk.signData(item.sign_msg)
                    item.sign_msg = (signDataRes as string)
                  }
                  // sometimes metamask need a duration to receive next signing request
                  await sleep(1000)
                }
              }

              const { hash } = await this.$services.account.sendTrx(res)
              if (hash) {
                await this.$services.account.returnRegisteredPaymentTrxId({
                  chain_type: this.computedChainType,
                  address: this.connectedAccount.address,
                  account: this.accountName,
                  order_id: this.orderInfo.order_id,
                  pay_hash: hash
                })

                this.confirmRegisterShowing = false

                this.$router.push({
                  path: `/account/register/status/${this.accountName}`,
                  query: {
                    paid: '1',
                    action: this.mintNft ? 'mintNft' : ''
                  }
                })
              }
            }
          }
          else {
            const trxId = await this.$walletSdk.sendTrx({
              to: this.orderInfo.receipt_address,
              value: this.orderInfo.pay_amount,
              data: this.orderInfo.order_id
            }, this.orderInfo.pay_token_id === CKB.tokenId)

            if (trxId && typeof trxId === 'string') {
              await this.$services.account.returnRegisteredPaymentTrxId({
                chain_type: this.computedChainType,
                address: this.connectedAccount.address,
                account: this.accountName,
                order_id: this.orderInfo.order_id,
                pay_hash: trxId
              })

              this.confirmRegisterShowing = false

              this.$router.push({
                path: `/account/register/status/${this.accountName}`,
                query: {
                  paid: '1',
                  action: this.mintNft ? 'mintNft' : ''
                }
              })
            }
          }
        }
        else {
          const applyRegisterRes = await this.$services.account.submitRegisterOrder({
            chain_type: this.computedChainType,
            address: this.connectedAccount.address,
            account: this.accountName,
            pay_chain_type: this.paymentToken.chain_type,
            pay_token_id: this.paymentToken.token_id,
            pay_address: this.connectedAccount.address,
            pay_type: '',
            register_years: this.registrationPeriod,
            coin_type: this.connectedAccount.chain.coinType,
            inviter_account: this.inviter ? toDottedStyle(this.inviter + ACCOUNT_SUFFIX) : 'seekdid.bit',
            channel_account: 'seekdid.bit',//this.me.channel,
            cross_coin_type: this.mintNft ? CoinType.eth : ''
          })

          if (!applyRegisterRes) {
            return
          }

          if (this.inviter) {
            this.$store.commit(ME_KEYS.setInviter, toDottedStyle(this.inviter + ACCOUNT_SUFFIX))
          }

          if (this.paymentToken.token_id === DASBalanceTokenId) {
            const res = await this.$services.account.dasBalancePay({
              evm_chain_id: this.computedChainId,
              chain_type: this.computedChainType,
              address: this.connectedAccount.address,
              order_id: applyRegisterRes.order_id
            })

            if (res && res.sign_list) {
              for (const item of res.sign_list) {
                if (item.sign_msg) {
                  if (item.sign_type === NEW_LOCK_SCRIPT_TYPE.eip712) {
                    const mmJson = JSON.parse(JSON.stringify(res.mm_json))
                    mmJson.message.digest = item.sign_msg
                    const signDataRes = await this.$walletSdk.signData(mmJson, true)
                    item.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
                  }
                  else {
                    const signDataRes = await this.$walletSdk.signData(item.sign_msg)
                    item.sign_msg = (signDataRes as string)
                  }
                  // sometimes metamask need a duration to receive next signing request
                  await sleep(1000)
                }
              }

              const { hash } = await this.$services.account.sendTrx(res)
              if (hash) {
                await this.$services.account.returnRegisteredPaymentTrxId({
                  chain_type: this.computedChainType,
                  address: this.connectedAccount.address,
                  account: this.accountName,
                  order_id: applyRegisterRes.order_id,
                  pay_hash: hash
                })

                this.confirmRegisterShowing = false

                this.$router.push({
                  path: `/account/register/status/${this.accountName}`,
                  query: {
                    paid: '1',
                    action: this.mintNft ? 'mintNft' : ''
                  }
                })
              }
            }
          }
          else {
            const trxId = await this.$walletSdk.sendTrx({
              to: applyRegisterRes.receipt_address,
              value: applyRegisterRes.amount,
              data: applyRegisterRes.order_id
            }, this.paymentToken.token_id === CKB.tokenId)

            if (trxId && typeof trxId === 'string') {
              await this.$services.account.returnRegisteredPaymentTrxId({
                chain_type: this.computedChainType,
                address: this.connectedAccount.address,
                account: this.accountName,
                order_id: applyRegisterRes.order_id,
                pay_hash: trxId
              })

              this.confirmRegisterShowing = false

              this.$router.push({
                path: `/account/register/status/${this.accountName}`,
                query: {
                  paid: '1',
                  action: this.mintNft ? 'mintNft' : ''
                }
              })
            }
          }
        }
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
          else if (err === errno.tronLinkInsufficientBalance || (err.message && err.message.includes(errno.walletConnectInsufficientFundsForTransfer))) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Insufficient balance')
            })
          }
          else if (err.message && err.message.startsWith(errno.portalWalletInsufficientBalance)) {
            this.pwBalanceInsufficientDialogShowing = true
          }
          else if (err.message && err.message.includes(errno.tronLinkTypeErrorAddUpdateDataNotFunction)) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The current wallet environment does not support payments using TRX, please upgrade your wallet version or register with another wallet.')
            })
          }
          else if (err.message && err.message.includes(errno.portalWalletValidationFailure)) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The wallet environment does not support {token} payments', { token: CKB.symbol })
            })
          }
          else if (err.code === errno.apiErrorCodeInsufficientBalance) {
            this.dasBalanceInsufficientDialogShowing = true
          }
          else if (err.code === errno.apiErrorCodeNotEnoughChange) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('DAS is a smart contract that runs on the Nervos. Due to the underlying logic of the contract, the remaining amount is too low (less than 116 CKB) to send a transaction.')
            })
          }
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.rpcApiErrSignatureError) {
            this.signatureErrorDialogShowing = true
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
        this.confirmRegisterLoading = false
      }
    },
    getInviter () {
      const _inviter = this.me.inviter
      if (_inviter) {
        this.inviter = toHashedStyle(_inviter).replace(/\.bit$/, '')
      }
    },
    async checkInviter () {
      if (!this.inviter) {
        this.inviterErrorTipShowing = false
        this.inviterOnCross = false
        return
      }

      try {
        const res = await this.$services.account.accountInfo(toDottedStyle(this.inviter + ACCOUNT_SUFFIX))
        if ([ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onePriceSell, ACCOUNT_STATUS.auctionSell, ACCOUNT_STATUS.onCross].includes(res.status)) {
          this.inviterErrorTipShowing = false
          if (res.status === ACCOUNT_STATUS.onCross) {
            this.inviterOnCross = true
          }
          else {
            this.inviterOnCross = false
          }
        }
        else {
          this.inviterErrorTipShowing = true
        }
      }
      catch (err) {
        console.error(err)
        this.inviterErrorTipShowing = true
      }
    },
    onInputInviter () {
      this.inviter = digitalEmojiHandle(this.inviter)
      this.inviterErrorTipShowing = false
      this.inviterOnCross = false
    },
    onBlurInviter () {
      this.inviter = this.inviter.replace(/\s+/g, '')
      this.inviter = this.inviter.toLowerCase()
      this.inviter = this.inviter.replace(/\.bit$/, '')
      this.inviter = this.inviter + ACCOUNT_SUFFIX
      this.inviter = toHashedStyle(this.inviter)
      this.inviter = this.inviter.replace(/\.bit$/, '')
      this.inviterErrorTipShowing = false
      this.inviterOnCross = false
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-register {
  flex: 1;
  padding: 12px;
}

.account-register__container {
  margin-top: 16px;
  padding: 16px;
  background: $white;
  box-shadow: $container-outer-box-shadow;
  border-radius: 16px;
  border: $container-border;
}

.account-register__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.account-register__item__info-icon {
  margin-bottom: 1px;
}

.account-register__label-tip {
  font-size: $font-size-12;
  color: $assist-font-color;
}

.account-register__value {
  font-size: 20px;
  font-family: $barlow-medium;
  font-weight: 600;
  line-height: 24px;
}

.account-register__inviter-discount {
  color: $warn-font-color;
}

.account-register__inviter-discount__tips {
  font-size: $font-size-12;
  font-weight: 400;
  color: $warn-font-color;
}

.account-register__no-inviter-discount {
  color: $third-font-color;
}

.account-register__split-line {
  margin-bottom: 28px;
  border-bottom: $split-line;
}

.account-register__registration-fee {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  color: $primary-font-color;
}

.account-register__registration-fee__value {
  text-align: right;
  font-size: 32px;
  font-family: $barlow-medium;
  font-weight: 600;
}

.account-register__original-price {
  display: block;
  font-size: $font-size-14;
  font-weight: 400;
  color: #808191;
  text-align: right;
  text-decoration: line-through;
  margin-top: 4px;
}

.account-register__inviter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.account-register__inviter__label {
  margin-top: 6px;
}

.account-register__annual-fee__registration-period {
  padding: 0 4px;
  border-radius: 5px;
  border: $container-border;
  font-size: $font-size-12;
  font-weight: 400;
  background: rgba(216, 216, 216, 0.14);
  color: $assist-font-color;
}

.account-register__input {
  position: relative;
  display: flex;
}

.account-register__input__suffix {
  position: absolute;
  right: 12px;
  top: 12px;
  font-weight: 600;
}

.account-register__input__input {
  width: 106px;
  height: 16px;
  padding: 12px 40px 12px 12px;
  border-radius: 8px;
  border: 1px solid $input-border-color;
  background: $input-bg-color;
  color: $primary-font-color;
  caret-color: $input-focus-border-color;
  outline: none;
  font-size: $font-size-14;
  font-weight: 600;
  line-height: 20px;
  -webkit-appearance: none;

  &:hover {
    border: 1px solid $input-focus-border-color;
  }

  &:focus {
    border: 1px solid $input-focus-border-color;
    background: $input-focus-bg-color;
  }

  &::placeholder {
    font-weight: 500;
    color: $third-font-color;
  }
}

.account-register__input__input_error {
  border: 1px solid $error-color;
  background: $white;
  box-shadow: inset 0 0 0 4px rgba(223, 75, 70, 0.1);

  &:hover {
    border: 1px solid $error-color;
    box-shadow: inset 0 0 0 4px rgba(223, 75, 70, 0.1);
  }
}

.account-register__input__input__error-messages {
  display: inline-block;
  width: 154px;
  margin-top: 4px;
  font-size: $font-size-12;
  font-weight: 600;
  color: $error-font-color;
  line-height: 14px;
  text-align: left;
  word-break: break-word;
  hyphens: auto;
}

.account-register__confirm-register__paid-amount__value {
  margin: 24px 0;
  text-align: center;
  font-size: 32px;
  font-family: $barlow-medium;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 38px;
}

.account-register__confirm-register__button {
  margin-bottom: 34px;
}

.account-register__breadcrumb {
  padding: 4px 0 16px 0;
}

.account-register__payment-token-select {
  margin-top: 16px;
}

.account-register__payment-error {
  font-size: $font-size-14;
  font-weight: 600;
  color: $error-font-color;
  text-align: center;
  padding: 10px 0;
}

.account-register__deposit-ckb {
  margin: 10px 0;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  background: #F2FFF5;
  border-radius: 12px;
  border: 1px solid #DCF6E2;
  font-size: $font-size-14;
  font-weight: 400;
  color: $primary-font-color;
}

.account-register__register-with-ckb {
  margin: 10px 0;
  padding: 0 12px;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 4px;
  align-items: center;
  justify-content: flex-start;
  height: 22px;
  font-size: $font-size-14;
  font-weight: 400;
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color
  }
}
</style>
