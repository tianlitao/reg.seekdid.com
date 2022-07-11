<template>
  <div>
    <Dialog
      :showing="showing"
      :title="manageData ? $tt('Reminder') : $tt('Convert to a normal .bit')"
      closeButton
      @close="onClose"
    >
      <div>
        {{ manageData ? $tt('You can manage data after converting it to a normal .bit.') : $tt('You can manage data and trade on DIDTop marketplace after converting it to a normal .bit. ') }}
        <a
          v-if="manageData"
          class="convert-to-ckb-dialog__faq"
          :href="$i18n.locale === LANGUAGE.zhCN ? 'https://talk.did.id/t/bit-ethereum-nft/482#ethereum-bit-nft-bit-8' : 'https://talk.did.id/t/convert-your-bit-to-nft-on-ethereum-now/481#can-i-manage-the-data-in-bit-and-renew-it-after-converting-to-bit-nft-on-ethereum-8'"
          target="_blank"
        >{{ $tt('Learn more') }}</a>
        <a
          v-else
          class="convert-to-ckb-dialog__faq"
          :href="$i18n.locale === LANGUAGE.zhCN ? 'https://talk.did.id/t/bit-ethereum-nft/482#ethereum-bit-nft-bit-3' : 'https://talk.did.id/t/convert-your-bit-to-nft-on-ethereum-now/481#iii-how-to-convert-your-bit-nft-on-ethereum-to-a-normal-bit-3'"
          target="_blank"
        >{{ $tt('Learn more') }}</a>
      </div>
      <template #action>
        <div class="convert-to-ckb-dialog__buttons">
          <Button
            :disabled="convertLoading"
            shape="round"
            block
            @click="onClose"
          >
            {{ $tt('Cancel') }}
          </Button>
          <Button
            :loading="convertLoading"
            shape="round"
            block
            status="success"
            @click="onConvert"
          >
            {{ $tt('Convert') }}
          </Button>
        </div>
      </template>
    </Dialog>
    <NoEthereumTips v-model="noEthereumTipsShowing" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import { LANGUAGE } from '~/constant/language'
import errno from '~/constant/errno'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { CrossDirection } from '~/constant'
import { IDidNftList } from '~/services/CrossEth'
import { ETH } from '~/constant/chain'
import { collapseString } from '~/modules/tools'
import NoEthereumTips from '~/pages/me/-/NoEthereumTips.vue'

export default Vue.extend({
  name: 'ConvertToCkbDialog',
  components: {
    Dialog,
    Button,
    NoEthereumTips
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: true
    },
    manageData: {
      type: Boolean,
      default: false
    },
    accountInfo: {
      type: Object as PropType<IDidNftList>,
      required: true
    }
  },
  data () {
    return {
      LANGUAGE,
      ETH,
      convertLoading: false,
      noEthereumTipsShowing: false
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  methods: {
    collapseString,
    onClose () {
      this.$emit('close', false)
    },
    async onConvert () {
      if (this.connectedAccount.chain.coinType !== ETH.coinType) {
        this.noEthereumTipsShowing = true
        return
      }
      this.convertLoading = true
      await this.$walletSdk.onConnect(true)
      try {
        const trxId = await this.$walletSdk.mintDotBit(this.accountInfo.uuid)
        if (trxId) {
          const res = await this.$services.crossEth.pendingHash({
            key_info: {
              coin_type: String(this.connectedAccount.chain.coinType),
              key: this.connectedAccount.address
            },
            account: this.accountInfo.account,
            hash: trxId,
            direction: CrossDirection.toCKB
          })
        }
        this.onClose()
        this.$alert({
          title: this.$tt('Submitted'),
          message: this.$tt('Approximately {number} minutes.', { number: 10 }),
          txHash: trxId,
          txHashLink: `${ETH.explorerTrx}${trxId}`
        })
        this.$emit('completed')
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
          else {
            this.$alert({
              title: this.$tt('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
      finally {
        this.convertLoading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.convert-to-ckb-dialog__faq {
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color
  }
}

.convert-to-ckb-dialog__buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  grid-column-gap: 24px;
}
</style>
