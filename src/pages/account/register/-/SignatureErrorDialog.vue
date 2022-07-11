<template>
  <Dialog
    :showing="showing"
    :title="$tt('Failed')"
    closeButton
    enableCloseAction
    @close="onClose"
  >
    <div class="signature-error-dialog">
      {{ $tt('Please try another payment method or wallet App. There may be compatibility issues. For more support, please join our community:') }}
      <a
        class="signature-error-dialog__discord-link"
        href="http://discord.gg/did"
        target="_blank"
      >https://discord.gg/did</a>
    </div>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { isMobile } from '~/modules/tools'
import Dialog from '~/components/Dialog.vue'

export default Vue.extend({
  name: 'SignatureErrorDialog',
  components: {
    Dialog
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
    onClose () {
      this.$emit('close', false)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.signature-error-dialog {

  .signature-error-dialog__discord-link {
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color
    }
  }
}
</style>
