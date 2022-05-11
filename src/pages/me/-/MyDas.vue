<template>
  <div class="my-das">
    <div class="my-das__manual">
      <Search
        @search="onSearch"
        @focus="hideManual"
      />
      <a
        v-if="!isHide"
        class="my-das__manual__link"
        :href="$i18n.locale === 'zh-CN' ? 'https://talk.did.id/t/bit/424' : 'https://talk.did.id/t/getting-started-with-bit/426'"
        target="_blank"
      >
        📚 {{ $tt('Getting started with .bit') }}
      </a>
    </div>
    <div
      v-if="registeringAccounts > 0"
      class="my-das__registering-accounts"
      @click="goRegisteringAccounts"
    >
      <span>{{
        $tt('{registeringAccounts} accounts are being registered', { registeringAccounts: registeringAccounts })
      }}</span>
      <Iconfont name="arrow-right" color="#FFFFFF" />
    </div>
    <div v-if="fetchDataLoading" class="my-das__loading">
      <StatusTip
        class="my-das__loading__tip"
        icon="⏳"
        iconSize="72"
        :tip="$tt('Loading')"
        tipFontSize="14"
      />
    </div>
    <div v-else-if="myAccounts.length === 0 && searchWord === ''" class="my-das__no-account">
      <StatusTip
        class="my-das__no-account__tip"
        icon="📂"
        iconSize="55"
        :tip="$tt('You do not have a .bit account yet')"
        tipFontSize="14"
      />
      <Button
        class="my-das__no-account__go-home"
        primary
        @click="goRegister"
      >
        {{ $tt('Register one') }}
      </Button>
    </div>
    <div
      v-if="myAccounts.length > 0 && !config.isProdData"
      class="my-das__testnet-tips"
    >
      <span class="my-das__testnet-tips__icon">💡</span>
      {{ $tt('The following is the test network account, you need to re-register after the official launch.') }}
    </div>
    <ul class="my-das__account-list">
      <AccountStatus
        v-for="(account, index) in myAccounts"
        :key="index"
        :accountInfo="account"
      />
      <li
        v-if="loadMoreShowing"
        class="my-das__account-list__action my-das__account-list__link"
        @click="getMyAccounts"
      >
        {{ $tt('Load more') }}
      </li>
      <li
        v-else-if="loadingShowing"
        class="my-das__account-list__action"
      >
        {{ $tt('Loading') }}
      </li>
      <li
        v-else-if="noMoreShowing"
        class="my-das__account-list__action"
      >
        {{ $tt('No more') }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import StatusTip from '~/components/StatusTip.vue'
import Button from '~/components/Button.vue'
import AccountStatus from '~/pages/me/-/AccountStatus.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { IAccountInfo } from '~/services/Account'
import Iconfont from '~/components/icon/Iconfont.vue'
import config from '~~/config'
import { DEFAULT_PAGE_SIZE } from '~/constant'
import Search from '~/pages/me/-/Search.vue'

export default Vue.extend({
  name: 'MyDas',
  components: {
    StatusTip,
    Button,
    AccountStatus,
    Iconfont,
    Search
  },
  props: {},
  data () {
    return {
      config,
      fetchDataLoading: false,
      myAccounts: [] as IAccountInfo[],
      page: 0,
      loadMoreShowing: false,
      loadingShowing: false,
      noMoreShowing: false,
      searchWord: '',
      isHide: false
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType
    }),
    registeringAccounts (): IAccountInfo[] {
      return this.me.registeringAccounts.length
    },
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  mounted () {
    this.$store.dispatch(ME_KEYS.fetchRegisteringAccounts)
    this.getMyAccounts()
  },
  methods: {
    goRegisteringAccounts () {
      this.$router.push('/me/registering-accounts')
    },
    onSearch (value: string) {
      this.page = 0
      this.searchWord = value
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
    hideManual (value: boolean) {
      this.isHide = value
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.my-das {
  min-height: calc(100vh - 339px);
}

.my-das__loading,
.my-das__no-account {
  margin-top: 80px;
}

.my-das__loading__tip,
.my-das__no-account__tip {
  font-weight: 600;
}

.my-das__no-account__go-home {
  height: 38px;
  margin: 16px auto;
  border-radius: 8px;
}

.my-das__account-list {
  margin-top: 12px;
}

.my-das__account-list__action {
  margin: 26px;
  text-align: center;
  line-height: 20px;
  color: $assist-font-color;
}

.my-das__account-list__link {
  cursor: pointer;
  color: $link-font-color;
}

.my-das__registering-accounts {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 10px 16px;
  background: $warn-font-color;
  border-radius: 9px;
  line-height: 20px;
  color: $white;
  cursor: pointer;
}

.my-das__testnet-tips {
  display: flex;
  margin-top: 12px;
  padding: 10px 16px;
  background: #FCECEC;
  border-radius: 9px;
  line-height: 20px;
  color: #DE4A46;
}

.my-das__testnet-tips__icon {
  margin-right: 4px;
}

.my-das__manual {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.my-das__manual__link {
  margin-left: 24px;
  color: #22C493;
}
</style>
