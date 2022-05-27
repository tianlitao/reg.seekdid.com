<template>
  <Dialog
    :showing="showing"
    :title="$tt('Insufficient balance')"
    closeButton
    @close="onClose"
  >
    <div>{{ $tt('Before payment, please ensure that your DAS balance is greater than {recommendedDepositAmount} CKB. After payment, the remaining amount must not be less than 116 CKB. Otherwise, the transaction can not be sent.', { recommendedDepositAmount: recommendedDepositAmount }) }}</div>
    <template v-slot:action>
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
import { mapState } from 'vuex'
import Decimal from 'decimal.js'
import { isMobile, thousandSplit } from '~/modules/tools'
import { COMMON_KEYS } from '~/store/common'
import config from '~~/config'
import Dialog from '~/components/Dialog.vue'
import { TOKEN_DECIMAL_PLACES } from '~/constant'
import Button from '~/components/Button.vue'

export default Vue.extend({
  name: 'DasBalanceInsufficientDialog',
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
    registrationFees: {
      type: String,
      required: false,
      default: '0'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isMobile,
    ...mapState({
      common: COMMON_KEYS.namespace
    }),
    recommendedDepositAmount (): string {
      return thousandSplit(new Decimal(this.registrationFees).add(200), TOKEN_DECIMAL_PLACES)
    }
  },
  methods: {
    thousandSplit,
    onClose () {
      this.$emit('close', false)
    },
    onManageBalance () {
      if (this.isMobile) {
        window.location.href = config.dasBalance
      }
      else {
        window.open(config.dasBalance)
      }
      this.onClose()
    }
  }
})
</script>
