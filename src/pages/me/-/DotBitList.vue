<template>
  <div class="dot-bit-list">
    <div class="dot-bit-list__manual">
      <span class="dot-bit-list__actions">
        <AccountStatusFilter
          v-model="filter"
          class="dot-bit-list__account-status-filter"
          :options="filterOptions"
          @input="onFilter"
        />
        <Search @search="onSearch" />
      </span>
      <a
        class="dot-bit-list__manual__link"
        :href="$i18n.locale === LANGUAGE.zhCN ? 'https://talk.did.id/t/bit/424' : 'https://talk.did.id/t/getting-started-with-bit/426'"
        target="_blank"
      >
        {{ $tt('Guide2') }}
        <Iconfont
          name="help"
          size="15"
          color="#5F6570"
        />
      </a>
    </div>
    <div v-if="fetchDataLoading" class="dot-bit-list__loading">
      <StatusTip
        class="dot-bit-list__loading__tip"
        icon="⏳"
        iconSize="72"
        :tip="$tt('Loading')"
        tipFontSize="14"
      />
    </div>
    <div
      v-else-if="myAccounts.length === 0 && searchWord === '' && filter === Filters.all"
      class="dot-bit-list__no-account"
    >
      <StatusTip
        class="dot-bit-list__no-account__tip"
        icon="📂"
        iconSize="55"
        :tip="$tt('You do not have a .bit account yet')"
        tipFontSize="14"
      />
      <Button
        class="dot-bit-list__no-account__go-home"
        shape="round"
        status="primary"
        @click="goRegister"
      >
        {{ $tt('Register one') }}
      </Button>
    </div>
    <div
      v-if="myAccounts.length > 0 && !config.isProdData"
      class="dot-bit-list__testnet-tips"
    >
      <span class="dot-bit-list__testnet-tips__icon">💡</span>
      {{ $tt('The following is the test network account, you need to re-register after the official launch.') }}
    </div>
    <ul class="dot-bit-list__account-list">
      <AccountStatus
        v-for="(account, index) in myAccounts"
        :key="index"
        :accountInfo="account"
        @click.native="onClickAccount(account)"
      />
      <li
        v-if="loadMoreShowing"
        class="dot-bit-list__account-list__action dot-bit-list__account-list__link"
        @click="getMyAccounts"
      >
        {{ $tt('Load more') }}
      </li>
      <li
        v-else-if="loadingShowing"
        class="dot-bit-list__account-list__action"
      >
        {{ $tt('Loading') }}
      </li>
      <li
        v-else-if="noMoreShowing"
        class="dot-bit-list__account-list__action"
      >
        {{ $tt('No more') }}
      </li>
    </ul>
    <ManageBitAccount
      v-model="manageBitAccountDialogShowing"
      :accountInfo="selectAccount"
      @convertToEth="convertToEth"
    />
    <MintNft
      v-model="mintNftDialogShowing"
      :account="selectAccount.account"
      @updateDirectionList="updateDirectionList"
      @completed="mintCompleted"
    />
    <MintCompleted
      v-model="mintCompletedDialogShowing"
      :account="selectAccount.account"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Button from '~/components/Button.vue'
import StatusTip from '~/components/StatusTip.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import ManageBitAccount from '~/pages/me/-/ManageBitAccount.vue'
import MintCompleted from '~/pages/me/-/MintCompleted.vue'
import MintNft from '~/pages/me/-/MintNft.vue'
import Search from '~/pages/me/-/Search.vue'
import AccountStatus from '~/pages/me/-/AccountStatus.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { IAccountInfo } from '~/services/Account'
import config from '~~/config'
import { DEFAULT_PAGE_SIZE } from '~/constant'
import { LANGUAGE } from '~/constant/language'
import AccountStatusFilter from '~/pages/me/-/AccountStatusFilter.vue'

enum Filters {
  all = 0,
  mainAccount = 1,
  subAccount = 2,
  onSale = 3,
  expireSoon = 4,
  toBeRecycled = 5
}

export default Vue.extend({
  name: 'DotBitList',
  components: {
    Iconfont,
    StatusTip,
    Button,
    AccountStatus,
    Search,
    ManageBitAccount,
    MintCompleted,
    MintNft,
    AccountStatusFilter
  },
  data () {
    return {
      LANGUAGE,
      Filters,
      config,
      fetchDataLoading: false,
      myAccounts: [] as IAccountInfo[],
      page: 0,
      loadMoreShowing: false,
      loadingShowing: false,
      noMoreShowing: false,
      searchWord: '',
      selectAccount: {
        account: ''
      } as IAccountInfo,
      manageBitAccountDialogShowing: false,
      mintCompletedDialogShowing: false,
      mintNftDialogShowing: false,
      filter: Filters.all
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
    },
    filterOptions (): { text: string, value: number }[] {
      return [{
        text: this.$tt('All'),
        value: Filters.all
      }, {
        text: this.$tt('Main accounts'),
        value: Filters.mainAccount
      }, {
        text: this.$tt('Sub-accounts'),
        value: Filters.subAccount
      }, {
        text: this.$tt('On sale on DIDTop'),
        value: Filters.onSale
      }, {
        text: this.$tt('Expire soon'),
        value: Filters.expireSoon
      }, {
        text: this.$tt('To be recycled'),
        value: Filters.toBeRecycled
      }]
    }
  },
  mounted () {
    this.getMyAccounts()
  },
  methods: {
    onSearch (value: string) {
      this.page = 0
      this.searchWord = value
      this.getMyAccounts()
    },
    update () {
      this.page = 0
      this.searchWord = ''
      this.getMyAccounts()
    },
    onFilter () {
      this.page = 0
      this.getMyAccounts()
    },
    async getMyAccounts () {
      if (!this.connectedAccount.address) {
        return
      }
      if (this.myAccounts.length === 0) {
        this.fetchDataLoading = true
      }
      this.noMoreShowing = false
      if (this.page > 0) {
        this.loadMoreShowing = false
        this.loadingShowing = true
      }

      try {
        this.page = this.page + 1
        const res = await this.$services.account.myAccounts({
          chain_type: this.computedChainType,
          address: this.connectedAccount.address,
          category: this.filter,
          page: this.page,
          keyword: this.searchWord
        })
        this.loadingShowing = false
        if (res && res.list) {
          if (this.page === 1) {
            this.myAccounts = res.list
          }
          else {
            this.myAccounts.push(...res.list)
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
    goRegister () {
      this.$router.push('/explorer')
    },
    onClickAccount (account: IAccountInfo) {
      this.selectAccount = account
      this.manageBitAccountDialogShowing = true
    },
    mintCompleted () {
      this.mintCompletedDialogShowing = true
      this.deleteItem()
      this.$emit('updateDirectionList')
      this.$emit('updateEthNftList')
    },
    convertToEth () {
      this.mintNftDialogShowing = true
    },
    updateDirectionList () {
      this.$emit('updateDirectionList')
    },
    deleteItem () {
      const index = this.myAccounts.findIndex((item) => {
        return item.account === this.selectAccount.account
      })
      this.myAccounts.splice(index, 1)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.dot-bit-list {
  .dot-bit-list__loading {
    margin-top: 80px;
  }

  .dot-bit-list__actions {
    display: inline-flex;
    flex: 1;
  }

  .dot-bit-list__account-status-filter {
    margin-right: 12px;
    width: 100px;
  }

  .dot-bit-list__no-account {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 12px;
    height: calc(100vh - 400px);
    background: $white;
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 3%);
    border-radius: 16px 16px 16px 16px;
    border: 1px solid rgba(0, 0, 0, 0.11);
  }

  .dot-bit-list__loading__tip,
  .dot-bit-list__no-account__tip {
    font-weight: 600;
  }

  .dot-bit-list__no-account__go-home {
    height: 38px;
    margin: 16px auto;
    border-radius: 8px;
  }

  .dot-bit-list__account-list {
    margin-top: 12px;
  }

  .dot-bit-list__account-list__action {
    margin: 26px;
    text-align: center;
    line-height: 20px;
    color: $assist-font-color;
  }

  .dot-bit-list__account-list__link {
    cursor: pointer;
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color
    }
  }

  .dot-bit-list__testnet-tips {
    display: flex;
    margin-top: 12px;
    padding: 10px 16px;
    background: #FCECEC;
    border-radius: 9px;
    line-height: 20px;
    color: $error-font-color;
  }

  .dot-bit-list__testnet-tips__icon {
    margin-right: 4px;
  }

  .dot-bit-list__manual {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }

  .dot-bit-list__manual__link {
    margin-left: 12px;
    height: 16px;
    font-size: $font-size-14;
    font-weight: 500;
    color: $assist-font-color;
    white-space: nowrap;
  }
}
</style>
