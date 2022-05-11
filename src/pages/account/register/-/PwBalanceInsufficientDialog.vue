<template>
  <Dialog
    :showing="showing"
    :title="$tt('Insufficient balance')"
    closeButton
    @close="onClose"
  >
    <div>{{ $tt('Insufficient balance. Please make sure the balance in your Portal Wallet is "≥ 61 CKB" after payment.') }}</div>
    <template #action>
      <Button
        block
        success
        @click="onManageBalance"
      >
        {{ $tt('Manage Balance') }}
      </Button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { isMobile, thousandSplit } from '~/modules/tools'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'

export default Vue.extend({
  name: 'PwBalanceInsufficientDialog',
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
  data () {
    return {
    }
  },
  computed: {
    isMobile
  },
  methods: {
    thousandSplit,
    onClose () {
      this.$emit('close', false)
    },
    onManageBalance () {
      const pwUrl = 'https://ckb.pw'
      if (this.isMobile) {
        window.location.href = pwUrl
      }
      else {
        window.open(pwUrl)
      }
      this.onClose()
    }
  }
})
</script>
