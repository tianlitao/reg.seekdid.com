<template>
  <div class="eth-marketplace">
    <Button
      block
      shape="round"
      status="success"
      @click="showList"
    >
      {{ $tt('Check on marketplace') }}
    </Button>
    <Dialog
      v-model="dialogShowing"
      :title="$tt('Check on marketplace')"
      closeButton
    >
      <div
        v-for="item in list"
        :key="item.name"
        class="eth-marketplace__item"
        :style="{ background: item.background }"
        @click="goMarketplace(item.url)"
      >
        <span class="eth-marketplace__item__info">
          <Iconfont
            :name="item.icon"
            size="28"
          />
          {{ item.name }}
        </span>
        <Iconfont
          class="eth-marketplace__arrow-right"
          name="arrow-right"
          size="14"
          color="#121314"
        />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { CrossEthContract } from '~/constant'
import { isMobile, nftTokenId } from '~/modules/tools'
import Button from '~/components/Button.vue'
import Dialog from '~/components/Dialog.vue'

export default Vue.extend({
  name: 'EthMarketplace',
  components: {
    Iconfont,
    Button,
    Dialog
  },
  computed: {
    isMobile
  },
  props: {
    account: {
      type: String,
      default: ''
    }
  },
  data () {
    const list = [{
      name: 'OpenSea',
      icon: 'opensea',
      url: `https://opensea.io/assets/ethereum/${CrossEthContract}/`,
      background: '#D2E6F9'
    }, {
      name: 'Element',
      icon: 'element',
      url: `https://www.element.market/assets/${CrossEthContract}/`,
      background: '#BFF5E9'
    }, {
      name: 'Rarible',
      icon: 'rarible',
      url: `https://rarible.com/token/${CrossEthContract}:`,
      background: '#FFEDD3'
    }, {
      name: 'LooksRare',
      icon: 'looksrare',
      url: `https://looksrare.org/collections/${CrossEthContract}/`,
      background: '#CDF9CC'
    }, {
      name: 'X2Y2',
      icon: 'x2y2',
      url: `https://x2y2.io/eth/${CrossEthContract}/`,
      background: '#D5DCFF'
    }]

    return {
      dialogShowing: false,
      list
    }
  },
  methods: {
    showList () {
      this.dialogShowing = true
    },
    goMarketplace (url: string) {
      const tokenId = nftTokenId(this.account)
      url = url + tokenId
      if (this.isMobile) {
        window.location.href = url
      }
      else {
        window.open(url)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.eth-marketplace {

}

.eth-marketplace__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid $normal-color;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}

.eth-marketplace__item__info {
  display: inline-grid;
  align-items: center;
  grid-auto-flow: column;
  grid-column-gap: 12px;
  font-size: 16px;
  font-weight: bold;
  color: $primary-font-color;
}
</style>
