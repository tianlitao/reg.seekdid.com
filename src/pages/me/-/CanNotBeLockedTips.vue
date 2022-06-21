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
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import { homepage } from '~~/config'

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
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    onRenew () {
      window.location.href = `${homepage}/${this.account}`
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
