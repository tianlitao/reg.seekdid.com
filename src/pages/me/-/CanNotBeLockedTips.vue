<template>
  <Dialog
    :showing="showing"
    :title="$tt('Fail to convert')"
    closeButton
    @close="onClose"
  >
    <div>
      {{ $tt("This dotbit will expire in less than a month, so it cannot be converted to NFT on Ethereum. You can renew it and try again.") }}
    </div>
    <template #action>
      <div class="can-not-be-locked-tips__buttons">
        <Button
          shape="round"
          @click="onClose"
        >
          {{ $tt('OK') }}
        </Button>
        <Button
          shape="round"
          status="success"
          @click="onRenew"
        >
          {{ $tt('Renew') }}
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import { homepage } from '~~/config'
import { isMobile } from '~/modules/tools'
import { COMMON_KEYS } from '~/store/common'
import { IConnectedAccount, ME_KEYS } from '~/store/me'

export default Vue.extend({
  name: 'CanNotBeLockedTips',
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
      required: true
    },
    account: {
      type: String,
      default: ''
    }
  },
  computed: {
    isMobile,
    ...mapState({
      common: COMMON_KEYS.namespace,
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    onRenew () {
      const address = this.connectedAccount?.address
      const chainName = this.connectedAccount?.chain?.name
      const link = `${homepage}/${this.account}?originAddress=${address}&originChainName=${chainName}`
      if (this.isMobile) {
        window.location.href = link
      }
      else {
        window.open(link)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.can-not-be-locked-tips__buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  grid-column-gap: 24px;
}
</style>
