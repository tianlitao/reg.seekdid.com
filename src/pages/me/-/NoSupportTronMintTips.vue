<template>
  <Dialog
    :showing="showing"
    :title="$tt('Coming soon')"
    closeButton
    @close="onClose"
  >
    <div>
      {{ $tt("The dotbit account belongs to a Tron address, which doesn't support converting a normal account to NFTs on Ethereum now. You can try again after transferring the ownership of the account to your ETH address.") }}
    </div>
    <template #action>
      <div class="no-support-tron-mint-tips__buttons">
        <Button
          shape="round"
          @click="onClose"
        >
          {{ $tt('I Know') }}
        </Button>
        <Button
          shape="round"
          status="success"
          @click="onManage"
        >
          {{ $tt('Modify Permission') }}
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import { homepage } from '~~/config'

export default Vue.extend({
  name: 'NoSupportTronMintTips',
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
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    onManage () {
      window.location.href = `${homepage}/${this.account}`
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.no-support-tron-mint-tips__buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  grid-column-gap: 24px;
}
</style>
