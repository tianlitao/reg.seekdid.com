<template>
  <div class="my-das">
    <Processing
      v-if="registeringAccounts > 0"
      class="my-das__registering-accounts"
      :title="$tt('Registering')"
      :number="registeringAccounts"
      to="/me/registering-accounts"
    />
    <Processing
      v-if="processingNfts > 0"
      :title="$tt('Converting')"
      :number="processingNfts"
      to="/me/conversion-processing"
    />
    <Tabs
      v-model="currentTab"
      :class="{
        'my-das__tabs': processingNfts > 0 || registeringAccounts > 0
      }"
      :items="tabs"
    />
    <DotBitList
      v-show="currentTab === ACCOUNT_TABS.bit"
      ref="dotBitList"
      @updateDirectionList="updateDirectionList"
      @updateEthNftList="updateEthNftList"
    />
    <EthNftList
      v-show="currentTab === ACCOUNT_TABS.nfts"
      ref="ethNftList"
      @updateDirectionList="updateDirectionList"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Tabs from '~/components/Tabs.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { IAccountInfo } from '~/services/Account'
import Processing from '~/pages/me/-/Processing.vue'
import { LANGUAGE } from '~/constant/language'
import DotBitList from '~/pages/me/-/DotBitList.vue'
import EthNftList from '~/pages/me/-/EthNftList.vue'
import { ACCOUNT_TABS } from '~/constant'

export default Vue.extend({
  name: 'MyDas',
  components: {
    Processing,
    DotBitList,
    EthNftList,
    Tabs
  },
  data () {
    return {
      LANGUAGE,
      ACCOUNT_TABS,
      tabs: [
        {
          text: this.$tt('dotbit'),
          value: ACCOUNT_TABS.bit
        },
        {
          text: this.$tt('dotbit on Ethereum'),
          value: ACCOUNT_TABS.nfts
        }
      ],
      currentTab: this.$route.query.subTab || ACCOUNT_TABS.bit,
      processingNfts: 0
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
  watch: {
    currentTab (newVal) {
      if (newVal) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            subTab: newVal
          }
        })
      }
    }
  },
  mounted () {
    this.$store.dispatch(ME_KEYS.fetchRegisteringAccounts)
    this.getDirectionList()
  },
  methods: {
    async getDirectionList () {
      if (!this.connectedAccount.address) {
        return
      }
      try {
        const res = await this.$services.crossEth.directionList({
          key_info: {
            coin_type: String(this.connectedAccount.chain.coinType),
            key: this.connectedAccount.address
          }
        })
        if (res) {
          this.processingNfts = res.total
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    updateDirectionList () {
      this.getDirectionList()
    },
    updateEthNftList () {
      ;(this.$refs.ethNftList as any).update()
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.my-das {
  .my-das__registering-accounts {
    margin-bottom: 4px;
  }

  .my-das__tabs {
    margin-top: 16px;
  }
}
</style>
