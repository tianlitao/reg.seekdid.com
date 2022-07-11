<template>
  <Dialog
    class="edit-das-reverse-dialog"
    :showing="showing"
    :title="$tt('Edit reverse record')"
    closeButton
    @close="onClose"
  >
    <label class="edit-das-reverse-dialog__label">.bit</label>
    <SelectDas
      v-model="account"
      :placeholder="$tt('Select or enter the DAS account')"
      :errorMessages="selectDasErrors"
    />
    <template #action>
      <Button
        shape="round"
        class="edit-das-reverse-dialog__button"
        block
        status="success"
        :disabled="!account"
        :loading="confirmLoading"
        @click="onConfirm"
      >
        {{ $tt('Save') }}
      </Button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Dialog from '~/components/Dialog.vue'
import SelectDas from '~/pages/alias/-/SelectDas.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { IReverseLatestRes } from '~/services/DasReverse'
import { fromSatoshi, mmJsonHashAndChainIdHex, sleep, thousandSplit } from '~/modules/tools'
import { REVERSE_KEYS } from '~/store/reverse'
import Button from '~/components/Button.vue'
import { NEW_LOCK_SCRIPT_TYPE } from '~/constant/chain'
import errno from '~/constant/errno'
import { ACCOUNT_STATUS, ORDER_ACTION_TYPE } from '~/constant'
import { COMMON_KEYS } from '~/store/common'

export default Vue.extend({
  name: 'EditDasReverseDialog',
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
      confirmLoading: false,
      account: '',
      selectDasErrors: [] as string[]
    }
  },
  computed: {
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

        const res = await this.$services.dasReverse.editDasReverse({
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

        this.$emit('trxSubmitted', ORDER_ACTION_TYPE.editDasReverse)
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
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.apiErrorCodeReverseAlreadyExist) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('You have already set this account.')
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
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

.edit-das-reverse-dialog {

}

.edit-das-reverse-dialog__label {
  margin-top: 24px;
  margin-bottom: 8px;
  display: block;
  font-size: $font-size-14;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 16px;
}

.edit-das-reverse-dialog__insufficient-balance__tips {
  font-size: $font-size-16;
  font-weight: 400;
  color: $primary-font-color;
  line-height: 24px;
}

.edit-das-reverse-dialog__button {
  margin-top: 140px;
}
</style>
