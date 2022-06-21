<template>
  <div>
    <Dialog
      :showing="showing"
      :title="$tt('You want to')"
      closeButton
      @close="onClose"
    >
      <ul>
        <li
          class="manage-eth-account__item manage-eth-account__opensea"
          @click="goOpenSea"
        >
          <span class="manage-eth-account__info">
            <Iconfont
              class="manage-eth-account__info__icon"
              name="opensea"
              size="32"
            />
            <h2 class="manage-eth-account__title">{{ $tt('Sell it on OpenSea') }}</h2>
          </span>
          <span>
            <Iconfont name="arrow-right" color="#11142D" size="24" />
          </span>
        </li>
        <li
          class="manage-eth-account__item manage-eth-account__manage"
          @click="manageData"
        >
          <span class="manage-eth-account__info">
            <Iconfont
              class="manage-eth-account__info__icon"
              name="manage-data"
              size="32"
            />
            <h2 class="manage-eth-account__title">{{ $tt('Manage Data') }}</h2>
          </span>
          <span>
            <Iconfont name="arrow-right" color="#11142D" size="24" />
          </span>
        </li>
        <li
          class="manage-eth-account__item manage-eth-account__convert"
          @click="convertToCKB"
        >
          <span class="manage-eth-account__info">
            <Iconfont
              class="manage-eth-account__info__icon"
              name="convert-back"
              size="32"
            />
            <h2 class="manage-eth-account__title">{{ $tt('Convert it to a normal .bit') }}</h2>
          </span>
          <span>
            <Iconfont name="arrow-right" color="#11142D" size="24" />
          </span>
        </li>
      </ul>
      <span slot="action" />
    </Dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import Dialog from '~/components/Dialog.vue'
import { isMobile, nftTokenId } from '~/modules/tools'
import { CrossEthContract } from '~/constant'

export default Vue.extend({
  name: 'ManageEthAccount',
  components: {
    Dialog,
    Iconfont
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  computed: {
    isMobile
  },
  props: {
    showing: {
      type: Boolean,
      required: false
    },
    account: {
      type: String,
      required: true
    }
  },
  methods: {
    onClose (value: boolean) {
      this.$emit('close', value)
    },
    convertToCKB () {
      this.$emit('convertToCKB')
      this.onClose(false)
    },
    manageData () {
      this.$emit('manageData')
      this.onClose(false)
    },
    goOpenSea () {
      const tokenId = nftTokenId(this.account)
      const link = `https://opensea.io/assets/ethereum/${CrossEthContract}/${tokenId}`
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

<style lang="scss">
@import "src/assets/variables";

.manage-eth-account__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }
}

.manage-eth-account__opensea {
  background: #D2E6F9;
  border: 1px solid rgba(98, 126, 234, 0.1);

  &:hover {
    background: rgba(210, 230, 249, 0.5)
  }
}

.manage-eth-account__convert {
  background: #BFF5E9;
  border: 1px solid rgba(98, 126, 234, 0.1);

  &:hover {
    background: rgba(191, 245, 233, 0.5)
  }
}

.manage-eth-account__manage {
  background: #CDF9CC;
  border: 1px solid rgba(98, 126, 234, 0.1);

  &:hover {
    background: rgba(205, 249, 204, 0.5)
  }
}

.manage-eth-account__title {
  font-size: 16px;
  font-weight: bold;
  color: $primary-font-color;
  line-height: 19px;
}

.manage-eth-account__desc {
  font-size: 14px;
  font-weight: 400;
  color: #5C6063;
  line-height: 16px;
  margin-top: 4px;
  display: inline-block;
}

.manage-eth-account__info {
  display: flex;
  align-items: center;
}

.manage-eth-account__info__icon {
  margin-right: 12px;
}
</style>
