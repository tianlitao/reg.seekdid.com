<template>
  <div class="eth-nft-list">
    <div
      v-if="nfts.length > 0 || searchWord"
      class="eth-nft-list__manual"
    >
      <Search
        @search="onSearch"
        @focus="hideManual"
      />
      <a
        v-if="!isHide"
        class="eth-nft-list__manual__link"
        :href="$i18n.locale === LANGUAGE.zhCN ? 'https://talk.did.id/t/bit/424' : 'https://talk.did.id/t/getting-started-with-bit/426'"
        target="_blank"
      >
        {{ $tt('Guide2') }}
        <Iconfont
          name="help"
          size="16"
          color="#636D85"
        />
      </a>
    </div>
    <div v-if="fetchDataLoading" class="eth-nft-list__loading">
      <StatusTip
        class="eth-nft-list__loading__tip"
        icon="⏳"
        iconSize="72"
        :tip="$tt('Loading')"
        tipFontSize="14"
      />
    </div>
    <div v-else-if="nfts.length === 0 && searchWord === ''" class="eth-nft-list__no-account">
      <StatusTip
        class="eth-nft-list__no-account__tip"
        icon="📂"
        iconSize="55"
        :tip="$tt('You do not have .bit NFTs on Ethereum ')"
        tipFontSize="14"
      />
      <a
        class="eth-nft-list__no-account__tip__manual__link"
        :href="$i18n.locale === LANGUAGE.zhCN ? 'https://talk.did.id/t/bit-ethereum-nft/482' : 'https://talk.did.id/t/convert-your-bit-to-nft-on-ethereum-now/481'"
        target="_blank"
      >
        {{ $tt('How to mint .bit NFTs on Ethereum?') }}
      </a>
      <a
        class="eth-nft-list__no-account__manual__link"
        :href="$i18n.locale === LANGUAGE.zhCN ? 'https://talk.did.id/t/bit/424' : 'https://talk.did.id/t/getting-started-with-bit/426'"
        target="_blank"
      >
        {{ $tt('Guide2') }}
        <Iconfont
          name="help"
          size="16"
          color="#636D85"
        />
      </a>
    </div>
    <ul class="eth-nft-list__account-list">
      <li
        v-for="(item, index) in nfts"
        :key="index"
        class="eth-nft-list__account-list__account-status"
        @click="onClickAccount(item)"
      >
        <div class="eth-nft-list__account-list__account-info">
          <IconImage
            class="eth-nft-list__account-list__logo"
            :url="`${IDENTICON_SERVE}${item.account}`"
            :alt="item.account"
            :size="44"
            rounded
          />
          <span class="eth-nft-list__account-list__account-name">{{ toHashedStyle(item.account) }}</span>
        </div>
        <Iconfont class="eth-nft-list__account-list__arrow-right" name="arrow-right" color="#11142D" />
      </li>
      <li
        v-if="loadMoreShowing"
        class="eth-nft-list__account-list__action eth-nft-list__account-list__link"
        @click="getDidNftList"
      >
        {{ $tt('Load more') }}
      </li>
      <li
        v-else-if="loadingShowing"
        class="eth-nft-list__account-list__action"
      >
        {{ $tt('Loading') }}
      </li>
      <li
        v-else-if="noMoreShowing"
        class="eth-nft-list__account-list__action"
      >
        {{ $tt('No more') }}
      </li>
    </ul>
    <ManageEthAccount
      v-model="manageEthAccountDialogShowing"
      :account="selectAccount.account"
      @convertToCKB="convertToCKB"
      @manageData="manageData"
    />
    <ConvertToCkbDialog
      v-model="convertToCkbDialogShowing"
      :accountInfo="selectAccount"
      :manageData="isManageData"
      @completed="onCompleted"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import StatusTip from '~/components/StatusTip.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { DEFAULT_PAGE_SIZE, IDENTICON_SERVE } from '~/constant'
import Search from '~/pages/me/-/Search.vue'
import { LANGUAGE } from '~/constant/language'
import Iconfont from '~/components/icon/Iconfont.vue'
import { IDidNftList } from '~/services/CrossEth'
import IconImage from '~/components/icon/IconImage.vue'
import { toHashedStyle } from '~/modules/tools'
import ManageEthAccount from '~/pages/me/-/ManageEthAccount.vue'
import ConvertToCkbDialog from '~/pages/me/-/ConvertToCkbDialog.vue'

export default Vue.extend({
  name: 'EthNftList',
  components: {
    Iconfont,
    StatusTip,
    Search,
    IconImage,
    ManageEthAccount,
    ConvertToCkbDialog
  },
  data () {
    return {
      IDENTICON_SERVE,
      LANGUAGE,
      fetchDataLoading: false,
      nfts: [] as IDidNftList[],
      page: 0,
      loadMoreShowing: false,
      loadingShowing: false,
      noMoreShowing: false,
      searchWord: '',
      isHide: false,
      selectAccount: {
        account: ''
      } as IDidNftList,
      manageEthAccountDialogShowing: false,
      convertToCkbDialogShowing: false,
      isManageData: false
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  mounted () {
    this.getDidNftList()
  },
  methods: {
    toHashedStyle,
    onSearch (value: string) {
      this.page = 0
      this.searchWord = value
      this.getDidNftList()
    },
    update () {
      this.page = 0
      this.searchWord = ''
      this.getDidNftList()
    },
    async getDidNftList () {
      if (!this.connectedAccount.address) {
        return
      }
      if (this.nfts.length === 0) {
        this.fetchDataLoading = true
      }
      this.noMoreShowing = false
      if (this.page > 0) {
        this.loadMoreShowing = false
        this.loadingShowing = true
      }

      try {
        this.page = this.page + 1
        const res = await this.$services.crossEth.didNftList({
          key_info: {
            coin_type: String(this.connectedAccount.chain.coinType),
            key: this.connectedAccount.address
          },
          page: this.page,
          keyword: this.searchWord
        })
        this.loadingShowing = false
        if (res && res.list) {
          if (this.page === 1) {
            this.nfts = res.list
          }
          else {
            this.nfts.push(...res.list)
          }

          const length = res.list.length
          if (length < DEFAULT_PAGE_SIZE) {
            this.loadMoreShowing = false
            if (length > 0) {
              this.noMoreShowing = true
            }
          }
          else {
            this.loadMoreShowing = true
          }
        }
      }
      catch (err) {
        console.error(err)
      }
      finally {
        this.fetchDataLoading = false
      }
    },
    hideManual (value: boolean) {
      this.isHide = value
    },
    onClickAccount (account: IDidNftList) {
      this.selectAccount = account
      this.manageEthAccountDialogShowing = true
    },
    convertToCKB () {
      this.isManageData = false
      this.convertToCkbDialogShowing = true
    },
    manageData () {
      this.isManageData = true
      this.convertToCkbDialogShowing = true
    },
    onCompleted () {
      this.$emit('updateDirectionList')
      this.deleteItem()
    },
    deleteItem () {
      const index = this.nfts.findIndex((item) => {
        return item.account === this.selectAccount.account
      })
      this.nfts.splice(index, 1)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.eth-nft-list {
  .eth-nft-list__loading {
    margin-top: 80px;
  }

  .eth-nft-list__no-account {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 12px;
    height: calc(100vh - 360px);
    background: #FFFFFF;
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 3%);
    border-radius: 16px 16px 16px 16px;
    border: 1px solid rgba(0, 0, 0, 0.11);
  }

  .eth-nft-list__loading__tip,
  .eth-nft-list__no-account__tip {
    font-weight: 600;
  }

  .eth-nft-list__account-list {
    margin-top: 12px;
  }

  .eth-nft-list__account-list__action {
    margin: 26px;
    text-align: center;
    line-height: 20px;
    color: $assist-font-color;
  }

  .eth-nft-list__account-list__link {
    cursor: pointer;
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color
    }
  }

  .eth-nft-list__manual {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }

  .eth-nft-list__no-account__manual__link {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #636D85;
    font-size: 14px;
    font-weight: 500;

    .iconfont {
      margin-left: 6px;
    }
  }

  .eth-nft-list__manual__link {
    margin-left: 24px;
    height: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #636D85;
  }

  .eth-nft-list__no-account__tip__manual__link {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    color: $link-font-color;
    line-height: 16px;
    text-align: center;

    &:hover {
      color: $link-hover-font-color
    }
  }

  .eth-nft-list__account-list__account-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 8px;
    height: 90px;
    border-radius: 16px;
    background: #ECF6FF;
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 3%);
    border: 1px solid rgba(182, 196, 217, 0.4);
    cursor: pointer;

    &:hover {
      background: rgba(236, 246, 255, 0.7);
    }
  }

  .eth-nft-list__account-list__account-info {
    display: flex;
    align-items: center;
  }

  .eth-nft-list__account-list__logo {
    margin-right: 12px;
  }

  .eth-nft-list__account-list__account-name {
    font-size: 18px;
    font-weight: 600;
    color: $primary-font-color;
    word-break: break-word;
    hyphens: auto;
  }

  .eth-nft-list__account-list__arrow-right {
    min-width: 24px;
  }
}
</style>
