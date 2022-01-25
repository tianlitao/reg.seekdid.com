<template>
  <div>
    <BottomSheet
      :showing="firstStepShowing"
      :title="$t('Renew {accountName}', { accountName: accountInfo.account })"
      @close="onClose"
    >
      <div class="renewal-bottom-sheet__label">
        {{ $t('Renewal time (years)') }}
      </div>
      <input
        v-model="renewalPeriod"
        class="renewal-bottom-sheet__renewal-period"
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        :min="MIN_VALUE"
        :max="MAX_VALUE"
        @change="checkRenewalPeriod"
      >
      <div class="renewal-bottom-sheet__renewal-fee">
        {{ $t('Cost: ${renewalAmount}', { renewalAmount: thousandSplit(renewalAmount, FIAT_DECIMAL_PLACES) }) }}
      </div>
      <i18n
        class="renewal-bottom-sheet__renewal-label"
        path="{accountName} will be renewed until {renewalToDate}"
        tag="div"
      >
        <span slot="accountName">
          {{ accountInfo.account }}
        </span>
        <span
          slot="renewalToDate"
          class="renewal-bottom-sheet__renewal-to"
        >
          {{ renewalToDate }}
        </span>
      </i18n>
      <Button
        class="renewal-bottom-sheet__button"
        block
        success
        @click="onNext"
      >
        {{ $t('Next') }}
      </Button>
    </BottomSheet>
    <BottomSheet
      :showing="secondStepShowing"
      :title="$t('Select payment')"
      @close="onClose"
    >
      <PaymentTokenSelect
        v-model="paymentToken"
        class="renewal-bottom-sheet__confirm-renewal__payment-token-select"
        :currentChain="connectedAccount.chain ? connectedAccount.chain.chainId : 0"
        :options="common.tokens"
      />
      <div class="renewal-bottom-sheet__confirm-renewal__paid-amount">
        {{ `${thousandSplit(paidTokenAmount)} ${paymentToken.symbol}` }}
      </div>
      <WalletConnectTips />
      <div
        v-if="paymentToken.token_id === CKB.tokenId && (isTokenPocket || isCoinbaseWallet)"
        class="renewal-bottom-sheet__payment-error"
      >{{ $t('The wallet environment does not support {token} payments', { token: CKB.symbol }) }}</div>
      <div
        v-if="paymentToken.chain_type === CHAIN_ID.tron && (isSafePalWallet || isViaWallet)"
        class="renewal-bottom-sheet__payment-error"
      >{{ $t('The wallet environment does not support {token} payments', { token: TRON.symbol }) }}</div>
      <Button
        class="renewal-bottom-sheet__button"
        :loading="confirmLoading"
        :disabled="(paymentToken.token_id === CKB.tokenId && (isTokenPocket || isCoinbaseWallet)) || (paymentToken.chain_type === CHAIN_ID.tron && (isSafePalWallet || isViaWallet))"
        block
        success
        @click="onConfirm"
      >
        {{ $t('Renew Now') }}
      </Button>
    </BottomSheet>
    <DasBalanceInsufficientDialog
      v-model="dasBalanceInsufficientDialogShowing"
      :registrationFees="paidTokenAmount"
    />
    <PwBalanceInsufficientDialog
      v-model="pwBalanceInsufficientDialogShowing"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Decimal from 'decimal.js'
import dayjs from 'dayjs'
import { mapState, mapGetters } from 'vuex'
import WalletConnectTips from '~/components/WalletConnectTips.vue'
import BottomSheet from '~/components/BottomSheet.vue'
import DasBalanceInsufficientDialog from '~/pages/account/register/-/DasBalanceInsufficientDialog.vue'
import PwBalanceInsufficientDialog from '~/pages/account/register/-/PwBalanceInsufficientDialog.vue'
import { IAccountInfo } from '~/services/Account'
import {
  formatDateTime,
  thousandSplit,
  isCoinbaseWallet,
  isSafePalWallet,
  isViaWallet,
  isTokenPocket,
  mmJsonHashAndChainIdHex,
  sleep
} from '~/modules/tools'
import {
  FIAT_DECIMAL_PLACES,
  TIME_FORMAT,
  TOKEN_DECIMAL_PLACES
} from '~/constant'
import { IToken } from '~/services/Common'
import { CHAIN_ID, CKB, DASBalanceTokenId, ETH, NEW_LOCK_SCRIPT_TYPE, TRON } from '~/constant/chain'
import { COMMON_KEYS } from '~/store/common'
import Button from '~/components/Button.vue'
import errno from '~/constant/errno'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import PaymentTokenSelect from '~/components/PaymentTokenSelect.vue'
import config from '~~/config'

const MIN_VALUE = 1
const MAX_VALUE = 20

export default Vue.extend({
  name: 'RenewalBottomSheet',
  components: {
    BottomSheet,
    Button,
    PaymentTokenSelect,
    WalletConnectTips,
    DasBalanceInsufficientDialog,
    PwBalanceInsufficientDialog
  },
  model: {
    prop: 'firstStepShowing',
    event: 'close'
  },
  props: {
    firstStepShowing: {
      type: Boolean,
      required: false
    },
    accountInfo: {
      type: Object as PropType<IAccountInfo>,
      required: true
    }
  },
  data () {
    return {
      config,
      TRON,
      CKB,
      ETH,
      CHAIN_ID,
      FIAT_DECIMAL_PLACES,
      MIN_VALUE,
      MAX_VALUE,
      renewalPeriod: MIN_VALUE,
      secondStepShowing: false,
      confirmLoading: false,
      paymentToken: {} as IToken,
      dasBalanceInsufficientDialogShowing: false,
      pwBalanceInsufficientDialogShowing: false
    }
  },
  computed: {
    ...mapState({
      common: COMMON_KEYS.namespace,
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainId: ME_KEYS.computedChainId,
      computedEvmChainId: ME_KEYS.computedEvmChainId
    }),
    isTokenPocket,
    isCoinbaseWallet,
    isSafePalWallet,
    isViaWallet,
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    premium (): number {
      return 1 + Number(this.common.config?.premium || 0.1)
    },
    renewalAmount (): string {
      const _fee = new Decimal(this.renewalPeriod || 0).times(this.accountInfo.account_price || 0)
      return _fee.toFixed(FIAT_DECIMAL_PLACES)
    },
    renewalToDate (): string {
      const _date = dayjs(this.accountInfo.expired_at).add(this.renewalPeriod, 'year')
      return formatDateTime(_date, TIME_FORMAT.fullDate)
    },
    paidTokenAmount (): string {
      return new Decimal(this.renewalAmount)
        .div(this.paymentToken.price || 1)
        .times(this.premium)
        .toFixed(TOKEN_DECIMAL_PLACES)
    }
  },
  watch: {
    secondStepShowing (newVal) {
      if (newVal === false) {
        this.confirmLoading = false
      }
    }
  },
  async mounted () {
    if (this.$route.query.paid) {
      this.$alert({
        title: this.$t('Tips'),
        message: (this.$t('The renewal order has been submitted and will take effect in 5 minutes. If the renewal does not take effect, your payment will be refunded to your payment address within 24 hours (except for transaction fees).') as string)
      })
      this.$router.push({
        query: {}
      })
    }
    await this.$store.dispatch(COMMON_KEYS.fetchTokens)
  },
  methods: {
    thousandSplit,
    onClose (value: boolean) {
      this.$emit('close', value)
      this.secondStepShowing = false
    },
    onNext () {
      this.$emit('close', false)
      this.secondStepShowing = true
    },
    async onConfirm () {
      this.confirmLoading = true

      try {
        const renewOrderRes = await this.$services.account.submitRenewOrder({
          chain_type: this.computedChainId,
          address: this.connectedAccount.address,
          account: this.accountInfo.account,
          pay_chain_type: this.paymentToken.chain_type,
          pay_token_id: this.paymentToken.token_id,
          pay_type: '',
          pay_address: this.connectedAccount.address,
          renew_years: Number(this.renewalPeriod)
        })

        if (!renewOrderRes) {
          return
        }

        if (this.paymentToken.token_id === DASBalanceTokenId) {
          const res = await this.$services.account.dasBalancePay({
            evm_chain_id: this.computedEvmChainId,
            chain_type: this.computedChainId,
            address: this.connectedAccount.address,
            order_id: renewOrderRes.order_id
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
              this.onClose(false)
              this.$alert({
                title: this.$t('Tips'),
                message: (this.$t('The renewal order has been submitted and will take effect in 5 minutes. If the renewal does not take effect, your payment will be refunded to your payment address within 24 hours (except for transaction fees).') as string)
              })
            }
          }
        }
        else {
          await this.$walletSdk.sendTrx({
            to: renewOrderRes.receipt_address,
            value: renewOrderRes.amount,
            data: renewOrderRes.order_id
          }, this.paymentToken.token_id === CKB.tokenId)

          this.onClose(false)
          this.$alert({
            title: this.$t('Tips'),
            message: (this.$t('The renewal order has been submitted and will take effect in 5 minutes. If the renewal does not take effect, your payment will be refunded to your payment address within 24 hours (except for transaction fees).') as string)
          })
        }
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.rpcApiErrAccountFrequencyLimit) {
            this.$alert({
              title: this.$t('Error'),
              message: this.$t('If the operation is too frequent, please try again after {timeInterval} minutes', { timeInterval: 5 })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err === errno.tronLinkInsufficientBalance || (err.message && err.message.includes(errno.walletConnectInsufficientFundsForTransfer))) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('Insufficient balance')
            })
          }
          else if (err.message && err.message.startsWith(errno.portalWalletInsufficientBalance)) {
            this.pwBalanceInsufficientDialogShowing = true
          }
          else if (err.message && err.message.includes(errno.tronLinkTypeErrorAddUpdateDataNotFunction)) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('The current wallet environment does not support payments using TRX, please upgrade your wallet version or register with another wallet.')
            })
          }
          else if (err.message && err.message.includes(errno.portalWalletValidationFailure)) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('The wallet environment does not support {token} payments', { token: CKB.symbol })
            })
          }
          else if (err.code === errno.apiErrorCodeInsufficientBalance) {
            this.dasBalanceInsufficientDialogShowing = true
          }
          else if (err.code === errno.apiErrorCodeNotEnoughChange) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('DAS is a smart contract that runs on the Nervos. Due to the underlying logic of the contract, the remaining amount is too low (less than 116 CKB) to send a transaction.')
            })
          }
          else {
            this.$alert({
              title: this.$t('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
      finally {
        this.confirmLoading = false
      }
    },
    checkRenewalPeriod (event: Event) {
      let _value = parseInt((event.target as HTMLInputElement).value)
      if (isNaN(_value) || _value < MIN_VALUE) {
        _value = MIN_VALUE
      }
      else if (_value > MAX_VALUE) {
        _value = MAX_VALUE
      }
      ;(event.target as HTMLInputElement).value = _value + ''
      this.renewalPeriod = _value
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.renewal-bottom-sheet__label {
  margin-top: 80px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: $assist-font-color;
  line-height: 17px;
}

.renewal-bottom-sheet__renewal-period {
  display: block;
  margin: 0 auto 4px auto;
  padding-bottom: 8px;
  width: 207px;
  border: 0;
  border-bottom: $container-border;
  border-radius: 0;
  text-align: center;
  font-size: 72px;
  font-family: $barlow-medium;
  line-height: 86px;
  outline: none;
}

.renewal-bottom-sheet__renewal-fee {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: $assist-font-color;
  line-height: 17px;
  margin-bottom: 80px;
}

.renewal-bottom-sheet__renewal-label {
  margin-bottom: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: $third-font-color;
  line-height: 17px;
  word-break: break-all;
}

.renewal-bottom-sheet__renewal-to {
  color: $primary-font-color;
}

.renewal-bottom-sheet__button {
  margin-bottom: 34px;
}

.renewal-bottom-sheet__confirm-renewal__payment-token-select {
  margin-top: 16px;
}

.renewal-bottom-sheet__confirm-renewal__paid-amount {
  margin: 24px 0;
  text-align: center;
  font-size: 32px;
  font-family: $barlow-medium;
  font-weight: 600;
  color: #11142D;
  line-height: 38px;
}

.renewal-bottom-sheet__payment-error {
  font-size: 14px;
  font-weight: 600;
  color: $error-font-color;
  text-align: center;
  padding: 10px 0;
}
</style>
