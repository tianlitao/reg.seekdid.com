<template>
  <Dialog
    :showing="showing"
    :title="'🎉 ' + $tt('Completed')"
    closeButton
    @close="onClose"
  >
    <i18n
      tag="div"
      path="铸造成功说明"
      :i18nkey="$tt('铸造成功说明')"
    >
      <span
        class="mint-completed__account"
        slot="account"
      >
        {{ toHashedStyle(account) }}
      </span>
      <a
        class="mint-completed__link"
        :href="openseaUrl"
        :target="isMobile ? '_self' : '_blank'"
        slot="opensea"
      >OpenSea</a>
    </i18n>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { isMobile, nftTokenId, toHashedStyle } from '~/modules/tools'
import Dialog from '~/components/Dialog.vue'
import { CrossEthContract } from '~/constant'

export default Vue.extend({
  name: 'MintCompleted',
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
    },
    account: {
      type: String,
      required: true,
      default: ''
    }
  },
  computed: {
    isMobile,
    openseaUrl (): string {
      const tokenId = nftTokenId(this.account)
      return `https://opensea.io/assets/ethereum/${CrossEthContract}/${tokenId}`
    }
  },
  methods: {
    toHashedStyle,
    onClose () {
      this.$emit('close', false)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.mint-completed__link {
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color
  }
}

.mint-completed__account {
  color: #0DBA85;
}
</style>
