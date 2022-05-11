<template>
  <div
    v-if="showTip"
    class="das-tips"
  >
    <div class="das-tips__title">
      💡{{ $tt('Do you know') }}
    </div>
    <div>{{ showTip }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { COMMON_KEYS } from '~/store/common'

export default Vue.extend({
  name: 'DasTips',
  data () {
    return {
      showTip: '',
      showTipTimerId: 0,
      currentTipIndex: 0
    }
  },
  computed: {
    ...mapState({
      common: COMMON_KEYS.namespace
    }),
    rewardFactor (): number {
      const rate = this.common?.config?.profit_rate_of_inviter
      return (rate || 0) * 100
    },
    tips (): any[] {
      return [
        this.$tt('You can sign up for a .bit account in multiple languages around the world and even Emoji.'),
        this.$tt("Invite others to sign up and you'll get a {rewardFactor}% bonus on the registration fee.", { rewardFactor: this.rewardFactor }),
        this.$tt('When you own alice.bit, you will automatically own alice.bit.cc as your decentralized profile page.'),
        this.$tt('All modules of DAS are open source and are maintained by developers worldwide.'),
        this.$tt('Each DAS account avatar is unique.')
      ]
    }
  },
  mounted () {
    window.setTimeout(() => {
      this.currentTipIndex = this.getRandomIntInclusive(0, 4)
      this.showTip = this.tips[this.currentTipIndex]
      this.loopTips()
    }, 5000)
  },
  beforeDestroy () {
    window.clearInterval(this.showTipTimerId)
  },
  methods: {
    loopTips () {
      this.showTipTimerId = window.setInterval(() => {
        if (this.currentTipIndex < 4) {
          this.currentTipIndex += 1
        }
        else {
          this.currentTipIndex = 0
        }
        this.showTip = this.tips[this.currentTipIndex]
      }, 10000)
    },
    getRandomIntInclusive (min: number, max: number): number {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.das-tips {
  padding: 24px 16px;
  margin-bottom: 24px;
  border-radius: 12px;
  border: $container-border;
  line-height: 20px;
}

.das-tips__title {
  color: $assist-font-color;
  margin-bottom: 6px;
}
</style>
