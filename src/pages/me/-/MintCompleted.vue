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
        slot="account"
        class="mint-completed__account"
      >
        <template v-if="isSubAccount">
          {{ account.split('.')[1] }}<span class="mint-completed__account__sub-account">#{{ account.split('.')[0] }}</span>.{{ account.split('.')[2] }}
        </template>
        <template v-else>
          {{ account }}
        </template>
      </span>
      <a
        slot="opensea"
        class="mint-completed__link"
        :href="openseaUrl"
        :target="isMobile ? '_self' : '_blank'"
      >OpenSea</a>
    </i18n>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { isMobile, nftTokenId, toHashedStyle } from '~/modules/tools'
import Dialog from '~/components/Dialog.vue'
import { CrossEthContract } from '~/constant'
import { SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'

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
    },
    isSubAccount (): boolean {
      return SUB_ACCOUNT_REG_EXP.test(this.account)
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

.mint-completed__account__sub-account {
  color: #E4B169;
}
</style>
