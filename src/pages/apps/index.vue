<template>
  <div class="apps">
    <div
      v-for="(group, index) in appList"
      :key="index"
    >
      <h3 class="apps_group-title">{{ group.title }}</h3>
      <a
        v-for="item in group.list"
        :key="item.title"
        class="apps_group_item"
        :href="item.href"
        :target="isMobile ? '_self' : '_blank'"
      >
        <span class="apps_group_item_info">
          <img
            class="apps_group_item_info_icon"
            :src="item.icon"
            :alt="item.title"
          />
          <span>
            <h3>{{ item.title }}</h3>
            <span class="apps_group_item_info_desc">{{ item.desc }}</span>
          </span>
        </span>
        <Iconfont
          name="arrow-right"
          color="#121314"
          size="18"
        />
      </a>
    </div>
    <a
      class="apps_more"
      href="https://www.did.id/ecosystems"
      :target="isMobile ? '_self' : '_blank'"
    >{{ $tt('See More') }}</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { isMobile } from '~/modules/tools'
import Iconfont from '~/components/icon/Iconfont.vue'

export default Vue.extend({
  name: 'Apps',
  components: {
    Iconfont
  },
  layout: 'apps',
  data () {
    return {
      appList: {
        marketplaces: {
          title: this.$tt('Marketplaces'),
          list: [{
            icon: '/images/apps/opensea.svg',
            href: 'https://opensea.io/collection/dotbit',
            title: 'OpenSea',
            desc: this.$tt('Discover, collect, and sell your .bit NFTs on Ethereum.')
          }, {
            icon: '/images/apps/didtop.svg',
            href: 'https://did.top/',
            title: 'DIDTop',
            desc: this.$tt('The decentralized marketplace for .bit. (Trade with $CKB)')
          }]
        },
        tools: {
          title: this.$tt('Data Providers & Tools'),
          list: [{
            icon: '/images/apps/dasla.svg',
            href: 'https://das.la/',
            title: 'DAS.LA',
            desc: this.$tt('A useful tool to quickly find your favorite .bit. Provides a .bit data dashboard.')
          }, {
            icon: '/images/apps/link3.svg',
            href: 'https://link3.io',
            title: 'Link3',
            desc: this.$tt('Link your .bit to Web3.0 World.')
          }, {
            icon: '/images/apps/about3.svg',
            href: 'https://about3.me',
            title: 'About³.me',
            desc: this.$tt('Your Web3.0 profile.')
          }]
        },
        registrars: {
          title: this.$tt('Registrars'),
          list: [{
            icon: '/images/apps/dename.svg',
            href: 'https://app.dename.com/',
            title: 'DeName',
            desc: this.$tt('Supports bulk registration and payments in USDT, BNB, TRX, CKB.')
          }, {
            icon: '/images/apps/gogodas.svg',
            href: 'https://app.gogodas.com/',
            title: 'GoGoDAS',
            desc: this.$tt('Supports payments in ETH, TRX, CKB, BNB, MATIC.')
          }]
        }
      }
    }
  },
  computed: {
    isMobile
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.apps {
  flex: 1;
  padding: 0 20px;
  background: #F7F8F9;

  .apps_group-title {
    font-size: $font-size-14;
    font-weight: bold;
    color: $primary-font-color;
    line-height: 16px;
    text-align: center;
    margin: 24px 0 16px 0;
  }

  .apps_group_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    margin-bottom: 16px;
    height: 108px;
    background: $white;
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 4%);
    border-radius: 24px 24px 24px 24px;
    border: 1px solid rgba(182, 196, 217, 0.4);
    cursor: pointer;
    font-size: $font-size-16;
    font-weight: bold;
    color: $primary-font-color;
    line-height: 19px;

    &:hover {
      background: #F7F9FA;
    }
  }

  .apps_group_item_info {
    display: flex;
    align-items: center;
  }

  .apps_group_item_info_icon {
    margin-right: 12px;
    border: 1px solid rgba(182, 196, 217, 0.4);
    border-radius: 16px;
    width: 58px;
  }

  .apps_group_item_info_desc {
    display: inline-block;
    font-size: $font-size-14;
    font-weight: 400;
    color: $assist-font-color;
    line-height: 16px;
    margin-top: 6px;
  }

  .apps_more {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px 0;
    height: 33px;
    background: rgba(36, 113, 254, 0.1);
    border-radius: 8px;
    font-size: $font-size-14;
    font-weight: 500;
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color;
    }
  }
}

</style>
