<template>
  <Dialog
    :showing="showing"
    :title="$tt('Tips')"
    closeButton
    @close="onClose"
  >
    <div>
      {{ $tt("Please switch the network to Ethereum in your wallet.") }}
    </div>
    <template #action>
      <div class="no-ethereum-tips_buttons">
        <Button
          shape="round"
          @click="onClose"
        >
          {{ $tt('Cancel') }}
        </Button>
        <Button
          shape="round"
          status="success"
          @click="onConnectWallet"
        >
          {{ $tt('Switch wallet') }}
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'

export default Vue.extend({
  name: 'NoEthereumTips',
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
    }
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    onConnectWallet () {
      this.$walletSdk.walletsConnect()
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.no-ethereum-tips_buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  grid-column-gap: 24px;
}
</style>
