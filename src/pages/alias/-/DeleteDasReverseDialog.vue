<template>
  <Dialog
    class="delete-das-reverse-dialog"
    :showing="showing"
    :title="$t('Confirm to delete?')"
    closeButton
    @close="onClose"
  >
    <div>{{ $t('After deleting the reverse record, the frozen {freezeCKB} CKB will be returned to your balance automatically.', { freezeCKB: thousandSplit(freezeCKB) }) }}</div>
    <template v-slot:action>
      <div class="delete-das-reverse-dialog__buttons">
        <Button
          block
          :disabled="disabledButtons"
          @click="onClose"
        >
          {{ $t('Cancel') }}
        </Button>
        <Button
          :loading="disabledButtons"
          error
          block
          @click="onDelete"
        >
          {{ $t('Delete') }}
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Dialog from '~/components/Dialog.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { fromSatoshi, mmJsonHashAndChainIdHex, sleep, thousandSplit } from '~/modules/tools'
import { REVERSE_KEYS } from '~/store/reverse'
import Button from '~/components/Button.vue'
import { NEW_LOCK_SCRIPT_TYPE } from '~/constant/chain'
import errno from '~/constant/errno'
import { ORDER_ACTION_TYPE } from '~/constant'
import { COMMON_KEYS } from '~/store/common'

export default Vue.extend({
  name: 'DeleteDasReverseDialog',
  components: {
    Dialog,
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
      disabledButtons: false
    }
  },
  computed: {
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
    }
  },
  methods: {
    thousandSplit,
    onClose () {
      this.$emit('close', false)
    },
    async onDelete () {
      this.disabledButtons = true

      try {
        const res = await this.$services.dasReverse.deleteDasReverse({
          evm_chain_id: this.computedEvmChainId,
          chain_type: this.computedChainId,
          address: this.connectedAccount.address
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

        this.$emit('trxSubmitted', ORDER_ACTION_TYPE.deleteDasReverse)
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
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('Other requests for the wallet are not processed, please try again after processing')
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
        this.disabledButtons = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.delete-das-reverse-dialog__buttons {
  margin-top: 24px;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 24px;
}
</style>
