<template>
  <div class="me">
    <div class="me__header">
      <LoginStatusCard />
      <Tabs
        v-model="currentTab"
        :items="tabs"
        class="me__tabs"
      />
    </div>
    <div class="me__container">
      <MyDas v-show="currentTab === ME_TABS.myDAS" />
      <Reward v-show="currentTab === ME_TABS.reward" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'
import { mapState } from 'vuex'
import Tabs from '~/components/Tabs.vue'
import LoginStatusCard from '~/components/cards/LoginStatusCard.vue'
import MyDas from '~/pages/me/-/MyDas.vue'
import Reward from '~/pages/me/-/Reward.vue'
import { COMMON_KEYS } from '~/store/common'
import { ME_KEYS } from '~/store/me'
import { REVERSE_KEYS } from '~/store/reverse'

const ME_TABS = {
  myDAS: 'myDAS',
  myAuction: 'myAuction',
  following: 'following',
  reward: 'reward',
  balance: 'balance'
}

export default Vue.extend({
  name: 'Me',
  components: {
    LoginStatusCard,
    Tabs,
    MyDas,
    Reward
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    })
  },
  data () {
    return {
      ME_TABS,
      tabs: [
        {
          text: this.$tt('My DAS'),
          value: ME_TABS.myDAS
        },
        {
          text: this.$tt('Rewards'),
          icon: 'reward',
          value: ME_TABS.reward
        },
        {
          text: this.$tt('Balance'),
          value: ME_TABS.balance,
          outlink: true
        }
      ],
      currentTab: this.$route.query.tab || ME_TABS.myDAS
    }
  },
  head (): { [key: string]: string | TranslateResult } {
    return {
      title: this.$tt('My')
    }
  },
  watch: {
    currentTab (newVal) {
      if (newVal) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            tab: newVal
          }
        })
      }
    }
  },
  async mounted () {
    await this.$walletSdk.onConnect(true)
    this.$store.dispatch(COMMON_KEYS.fetchConfig)
    this.$store.dispatch(REVERSE_KEYS.fetchDasReverse)
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.me {
  flex: 1;
  background: $background;
}

.me__header {
  padding: 8px 12px 12px 12px;
  background: $white;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%);
  border-radius: 0 0 22px 22px;
}

.me__tabs {
  margin-top: 16px;
}

.me__container {
  position: relative;
  padding: 16px 12px 0 12px;
}
</style>
