<template>
  <div>
    <Dialog
      class="set-das-reverse-dialog"
      :showing="showing"
      :title="$t('Set reverse record')"
      closeButton
      @close="onClose"
    >
      <label class="set-das-reverse-dialog__label">.bit</label>
      <SelectDas
        v-model="account"
        :placeholder="$t('Select or enter the DAS account')"
        :errorMessages="selectDasErrors"
      />
      <div class="set-das-reverse-dialog__tips">
        <span>*</span>
        <span>{{ $t('Setting the reverse record needs storage space on the chain, and it will freeze {freezeCKB} CKB.', { freezeCKB: thousandSplit(freezeCKB) }) }}</span>
      </div>
      <template v-slot:action>
        <Button
          block
          success
          :loading="confirmLoading"
          :disabled="!account"
          @click="onConfirm"
        >
          {{ $t('Save') }}
        </Button>
      </template>
    </Dialog>
    <Dialog
      :showing="insufficientBalanceDialogShowing"
      :title="'💰 ' + $t('Insufficient balance')"
      closeButton
      @close="closeInsufficientBalanceDialog"
    >
      <div class="set-das-reverse-dialog__insufficient-balance__tips">
        {{ $t('To set the reverse record, please make sure your DAS balance is greater than 350 CKB. 201 CKB needs to be frozen as storage space on the chain. Also, the remaining amount must not be less than 116 CKB. Otherwise, the transaction can not be sent.') }}
      </div>
      <template v-slot:action>
        <Button
          block
          success
          @click="onManageBalance"
        >
          {{ $t('Manage Balance') }}
        </Button>
      </template>
    </Dialog>
    <Dialog
      :showing="notEnoughChangeDialogShowing"
      :title="$t('Tips')"
      closeButton
      @close="closeNotEnoughChangeDialog"
    >
      <div class="set-das-reverse-dialog__insufficient-balance__tips">
        {{ $t('DAS is a smart contract that runs on the Nervos. Due to the underlying logic of the contract, the remaining amount is too low (less than 116 CKB) to send a transaction.') }}
      </div>
      <template v-slot:action>
        <Button
          block
          success
          @click="onManageBalance"
        >
          {{ $t('Manage Balance') }}
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
import { LOCK_SCRIPT_TYPE, NEW_LOCK_SCRIPT_TYPE } from '~/constant/chain'
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
      computedChainId: ME_KEYS.computedChainId,
      computedEvmChainId: ME_KEYS.computedEvmChainId
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
            this.selectDasErrors = [(this.$t('The account is not registered and does not support the reverse record') as string)]
            return
          }
        }

        const res = await this.$services.dasReverse.setDasReverse({
          evm_chain_id: this.computedEvmChainId,
          chain_type: this.computedChainId,
          address: this.connectedAccount.address,
          account: this.account
        })

        if (!res) {
          return
        }

        for (const item of res.sign_list) {
          if (item.sign_msg) {
            if (LOCK_SCRIPT_TYPE.eth && item.sign_type === NEW_LOCK_SCRIPT_TYPE.eip712) {
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
              title: this.$t('Tips'),
              message: this.$t('If the operation is too frequent, please try again after {timeInterval} minutes', { timeInterval: 3 })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.apiErrorCodeInsufficientBalance) {
            this.insufficientBalanceDialogShowing = true
          }
          else if (err.code === errno.apiErrorCodeNotEnoughChange) {
            this.notEnoughChangeDialogShowing = true
          }
          else if (err.code === errno.rpcApiErrAccountNotExist) {
            this.selectDasErrors = [(this.$t('The account is not registered and does not support the reverse record') as string)]
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
  font-size: 14px;
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
  font-size: 14px;
  color: #636D85;
  line-height: 17px;
  word-break: break-word;
}

.set-das-reverse-dialog__insufficient-balance__tips {
  font-size: 16px;
  font-weight: 400;
  color: $primary-font-color;
  line-height: 24px;
}
</style>
