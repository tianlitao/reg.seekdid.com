<template>
  <div>
    <Dialog
      class="set-das-reverse-dialog"
      :showing="showing"
      :title="$tt('Set reverse record')"
      closeButton
      @close="onClose"
    >
      <label class="set-das-reverse-dialog__label">.bit</label>
      <SelectDas
        v-model="account"
        :placeholder="$tt('Select or enter the DAS account')"
        :errorMessages="selectDasErrors"
      />
      <div class="set-das-reverse-dialog__tips">
        <span>*</span>
        <span>{{ $tt('Setting the reverse record needs storage space on the chain, and it will freeze {freezeCKB} CKB.', { freezeCKB: thousandSplit(freezeCKB) }) }}</span>
      </div>
      <template #action>
        <Button
          shape="round"
          block
          status="success"
          :loading="confirmLoading"
          :disabled="!account"
          @click="onConfirm"
        >
          {{ $tt('Save') }}
        </Button>
      </template>
    </Dialog>
    <Dialog
      :showing="insufficientBalanceDialogShowing"
      :title="'💰 ' + $tt('Insufficient balance')"
      closeButton
      @close="closeInsufficientBalanceDialog"
    >
      <div class="set-das-reverse-dialog__insufficient-balance__tips">
        {{ $tt('To set the reverse record, please make sure your DAS balance is greater than 350 CKB. 201 CKB needs to be frozen as storage space on the chain. Also, the remaining amount must not be less than 116 CKB. Otherwise, the transaction can not be sent.') }}
      </div>
      <template #action>
        <Button
          shape="round"
          block
          status="success"
          @click="onManageBalance"
        >
          {{ $tt('Manage Balance') }}
        </Button>
      </template>
    </Dialog>
    <Dialog
      :showing="notEnoughChangeDialogShowing"
      :title="$tt('Tips')"
      closeButton
      @close="closeNotEnoughChangeDialog"
    >
      <div class="set-das-reverse-dialog__insufficient-balance__tips">
        {{ $tt('DAS is a smart contract that runs on the Nervos. Due to the underlying logic of the contract, the remaining amount is too low (less than 116 CKB) to send a transaction.') }}
      </div>
      <template #action>
        <Button
          shape="round"
          block
          status="success"
          @click="onManageBalance"
        >
          {{ $tt('Manage Balance') }}
        </Button>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Dialog from '~/components/Dialog.vue'
import SelectDas from '~/pages/alias/-/SelectDas.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { IReverseLatestRes } from '~/services/DasReverse'
import { fromSatoshi, isMobile, mmJsonHashAndChainIdHex, sleep, thousandSplit } from '~/modules/tools'
import { REVERSE_KEYS } from '~/store/reverse'
import Button from '~/components/Button.vue'
import config from '~~/config'
import { NEW_LOCK_SCRIPT_TYPE } from '~/constant/chain'
import errno from '~/constant/errno'
import { ACCOUNT_STATUS, ORDER_ACTION_TYPE } from '~/constant'
import { COMMON_KEYS } from '~/store/common'

export default Vue.extend({
  name: 'SetDasReverseDialog',
  components: {
    Dialog,
    SelectDas,
    Button
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      insufficientBalanceDialogShowing: false,
      notEnoughChangeDialogShowing: false,
      confirmLoading: false,
      account: '',
      selectDasErrors: [] as string[]
    }
  },
  computed: {
    isMobile,
    ...mapState({
      me: ME_KEYS.namespace,
      reverse: REVERSE_KEYS.namespace,
      common: COMMON_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType,
      computedChainId: ME_KEYS.computedChainId
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    freezeCKB (): string {
      return fromSatoshi(this.common.config.reverse_record_capacity)
    },
    dasReverse (): IReverseLatestRes {
      return this.reverse.dasReverse
    }
  },
  watch: {
    account () {
      this.selectDasErrors = []
    }
  },
  methods: {
    thousandSplit,
    onClose () {
      this.account = ''
      this.$emit('close', false)
    },
    closeInsufficientBalanceDialog () {
      this.insufficientBalanceDialogShowing = false
      this.onClose()
    },
    closeNotEnoughChangeDialog () {
      this.notEnoughChangeDialogShowing = false
      this.onClose()
    },
    onManageBalance () {
      if (this.isMobile) {
        window.location.href = config.dasBalance
      }
      else {
        window.open(config.dasBalance)
      }
    },
    async onConfirm () {
      this.confirmLoading = true

      try {
        const accountInfo = await this.$services.account.accountInfo(this.account)

        if (accountInfo) {
          if ([ACCOUNT_STATUS.notOpenRegister, ACCOUNT_STATUS.unavailableAccount, ACCOUNT_STATUS.reservedAccount].includes(accountInfo.status)) {
            this.selectDasErrors = [(this.$tt('The account is not registered and does not support the reverse record') as string)]
            return
          }
        }

        const res = await this.$services.dasReverse.setDasReverse({
          evm_chain_id: this.computedChainId,
          chain_type: this.computedChainType,
          address: this.connectedAccount.address,
          account: this.account
        })

        if (!res) {
          return
        }

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

        await this.$services.account.sendTrx(res)

        this.$emit('trxSubmitted', ORDER_ACTION_TYPE.setDasReverse)
        this.onClose()
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.rpcApiErrAccountFrequencyLimit) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The operation is too frequent. Please try again after {timeInterval} minutes', { timeInterval: 3 })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.rpcApiErrAccountIsExpired) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The account has expired. If you need to continue using it, please renew it.')
            })
          }
          else if (err.code === errno.apiErrorCodeInsufficientBalance) {
            this.insufficientBalanceDialogShowing = true
          }
          else if (err.code === errno.apiErrorCodeNotEnoughChange) {
            this.notEnoughChangeDialogShowing = true
          }
          else if (err.code === errno.rpcApiErrAccountNotExist) {
            this.selectDasErrors = [(this.$tt('The account is not registered and does not support the reverse record') as string)]
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
        this.confirmLoading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.set-das-reverse-dialog {

}

.set-das-reverse-dialog__label {
  margin-top: 24px;
  margin-bottom: 8px;
  display: block;
  font-size: $font-size-14;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 16px;
}

.set-das-reverse-dialog__tips {
  margin-top: 70px;
  padding: 8px;
  display: inline-grid;
  grid-auto-flow: column;
  grid-column-gap: 2px;
  grid-template-columns: 7px auto;
  border-radius: 8px;
  border: 1px solid #EFF2F5;
  font-size: $font-size-14;
  color: $assist-font-color;
  line-height: 17px;
  word-break: break-word;
  hyphens: auto;
}

.set-das-reverse-dialog__insufficient-balance__tips {
  font-size: $font-size-16;
  font-weight: 400;
  color: $primary-font-color;
  line-height: 24px;
}
</style>
