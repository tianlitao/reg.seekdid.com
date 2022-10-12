<template>
  <div class="confirm-list">
    <ul
      class="confirm-list__container"
      :class="{ 'confirm-list__container__mini': mini }"
    >
      <li
        id="1"
        class="confirm-list__confirm-item confirm-list__margin-bottom-12"
        :class="{ 'confirm-list__confirm-item_succeed': accountInfo.status >= ACCOUNT_STATUS.registeringLockedAccount }"
      >
        <div class="confirm-list__confirm-item__label">
          <div>1. {{ $tt('Confirm payment') }}</div>
          <template v-if="accountInfo.register_tx_map && accountInfo.register_tx_map['1']">
            <a
              class="confirm-list__confirm-item__link"
              :href="`${TOKEN_ID_TO_CHAIN[accountInfo.register_tx_map['1'].token_id].explorerTrx}${accountInfo.register_tx_map['1'].hash}`"
              target="_blank"
            >
              <span>{{ collapseString(accountInfo.register_tx_map['1'].hash, 8, 8) }}</span>
              <Iconfont name="arrow-right" color="#57596B" size="12" />
            </a>
          </template>
        </div>
        <span class="confirm-list__margin-top-3">
          <Iconfont
            v-if="accountInfo.status >= ACCOUNT_STATUS.registeringLockedAccount"
            name="check-strong"
            color="#22C493"
          />
          <span
            v-else
            class="confirm-list__loading-icon"
          >
            <Iconfont name="loading" color="#D5D5D5" size="18" />
          </span>
        </span>
      </li>
      <li
        id="2"
        class="confirm-list__confirm-item confirm-list__margin-bottom-12"
        :class="{ 'confirm-list__confirm-item_succeed': accountInfo.status >= ACCOUNT_STATUS.registering }"
      >
        <div class="confirm-list__confirm-item__label">
          <div>2. {{ $tt('Apply for registration in private') }}</div>
          <a
            v-if="accountInfo.register_tx_map && accountInfo.register_tx_map['2']"
            class="confirm-list__confirm-item__link"
            :href="`${CKB.explorerTrx}${accountInfo.register_tx_map['2'].hash}`"
            target="_blank"
          >
            <span>{{ collapseString(accountInfo.register_tx_map['2'].hash, 8, 8) }}</span>
            <Iconfont name="arrow-right" color="#57596B" size="12" />
          </a>
        </div>
        <span
          v-if="accountInfo.status > ACCOUNT_STATUS.registeringPaymentConfirm"
          class="confirm-list__margin-top-3"
        >
          <Iconfont
            v-if="accountInfo.status >= ACCOUNT_STATUS.registering"
            name="check-strong"
            color="#22C493"
          />
          <span
            v-else
            class="confirm-list__loading-icon"
          >
            <Iconfont name="loading" color="#D5D5D5" size="18" />
          </span>
        </span>
      </li>
      <li
        id="3"
        class="confirm-list__confirm-item confirm-list__margin-bottom-12"
        :class="{ 'confirm-list__confirm-item_succeed': accountInfo.status >= ACCOUNT_STATUS.registeringIncludeProposal }"
      >
        <div class="confirm-list__confirm-item__label">
          <div>3. {{ $tt('Reveal the account name on the chain') }}</div>
          <a
            v-if="accountInfo.register_tx_map && accountInfo.register_tx_map['3']"
            class="confirm-list__confirm-item__link"
            :href="`${CKB.explorerTrx}${accountInfo.register_tx_map['3'].hash}`"
            target="_blank"
          >
            <span>{{ collapseString(accountInfo.register_tx_map['3'].hash, 8, 8) }}</span>
            <Iconfont name="arrow-right" color="#57596B" size="12" />
          </a>
        </div>
        <span
          v-if="accountInfo.status > ACCOUNT_STATUS.registeringLockedAccount"
          class="confirm-list__margin-top-3"
        >
          <Iconfont
            v-if="accountInfo.status >= ACCOUNT_STATUS.registeringIncludeProposal"
            name="check-strong"
            color="#22C493"
          />
          <span
            v-else
            class="confirm-list__loading-icon"
          >
            <Iconfont name="loading" color="#D5D5D5" size="18" />
          </span>
        </span>
      </li>
      <li
        id="4"
        class="confirm-list__confirm-item confirm-list__margin-bottom-12"
        :class="{ 'confirm-list__confirm-item_succeed': accountInfo.status >= ACCOUNT_STATUS.registeringConfirmProposal }"
      >
        <div class="confirm-list__confirm-item__label">
          <div>4. {{ $tt('Submit a proposal') }}</div>
          <a
            v-if="accountInfo.register_tx_map && accountInfo.register_tx_map['4']"
            class="confirm-list__confirm-item__link"
            :href="`${CKB.explorerTrx}${accountInfo.register_tx_map['4'].hash}`"
            target="_blank"
          >
            <span>{{ collapseString(accountInfo.register_tx_map['4'].hash, 8, 8) }}</span>
            <Iconfont name="arrow-right" color="#57596B" size="12" />
          </a>
        </div>
        <span
          v-if="accountInfo.status > ACCOUNT_STATUS.registering"
          class="confirm-list__margin-top-3"
        >
          <Iconfont
            v-if="accountInfo.status >= ACCOUNT_STATUS.registeringConfirmProposal"
            name="check-strong"
            color="#22C493"
          />
          <span
            v-else
            class="confirm-list__loading-icon"
          >
            <Iconfont name="loading" color="#D5D5D5" size="18" />
          </span>
        </span>
      </li>
      <li
        id="5"
        class="confirm-list__confirm-item"
        :class="{ 'confirm-list__confirm-item_succeed': accountInfo.status === ACCOUNT_STATUS.registered || currentStep === MintEthNftStep.two }"
      >
        <div class="confirm-list__confirm-item__label">
          <div>5. {{ $tt('Proposal approved') }}</div>
          <a
            v-if="accountInfo.register_tx_map && accountInfo.register_tx_map['5']"
            class="confirm-list__confirm-item__link"
            :href="`${CKB.explorerTrx}${accountInfo.register_tx_map['5'].hash}`"
            target="_blank"
          >
            <span>{{ collapseString(accountInfo.register_tx_map['5'].hash, 8, 8) }}</span>
            <Iconfont name="arrow-right" color="#57596B" size="12" />
          </a>
        </div>
        <span
          v-if="accountInfo.status >= ACCOUNT_STATUS.registeringConfirmProposal"
          class="confirm-list__margin-top-3"
        >
          <Iconfont
            v-if="accountInfo.status === ACCOUNT_STATUS.registered || currentStep === MintEthNftStep.two"
            name="check-strong"
            color="#22C493"
          />
          <span
            v-else
            class="confirm-list__loading-icon"
          >
            <Iconfont name="loading" color="#D5D5D5" size="18" />
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { ISearchAccount } from '~/services/Explorer'
import { ACCOUNT_STATUS, MintEthNftStep } from '~/constant'
import { ChainTypeToChain, BSC, Polygon, CKB, TOKEN_ID_TO_CHAIN } from '~/constant/chain'
import { collapseString, sleep } from '~/modules/tools'

export default Vue.extend({
  name: 'ConfirmList',
  components: {
    Iconfont
  },
  props: {
    accountInfo: {
      type: Object as PropType<ISearchAccount>,
      required: true
    },
    currentStep: Number,
    mini: Boolean
  },
  computed: {
    confirmPaymentExplorerTrx (): string {
      if (this.accountInfo && this.accountInfo.register_tx_map && this.accountInfo.register_tx_map['1']) {
        if (this.accountInfo.register_tx_map['1'].token_id === BSC.tokenId) {
          return `${BSC.explorerTrx}${this.accountInfo.register_tx_map['1'].hash}`
        }
        else if (this.accountInfo.register_tx_map['1'].token_id === Polygon.tokenId) {
          return `${Polygon.explorerTrx}${this.accountInfo.register_tx_map['1'].hash}`
        }
        return `${ChainTypeToChain[this.accountInfo.register_tx_map['1'].chain_id].explorerTrx}${this.accountInfo.register_tx_map['1'].hash}`
      }
      return ''
    }
  },
  watch: {
    accountInfo () {
      this.scrollIntoView()
    }
  },
  mounted () {
    this.scrollIntoView()
  },
  data () {
    return {
      MintEthNftStep,
      CKB,
      ACCOUNT_STATUS,
      ChainTypeToChain,
      TOKEN_ID_TO_CHAIN
    }
  },
  methods: {
    collapseString,
    async scrollIntoView () {
      let id = '1'
      const status = this.accountInfo.status
      if (status >= ACCOUNT_STATUS.registeringLockedAccount) {
        id = '1'
      }
      if (status >= ACCOUNT_STATUS.registering) {
        id = '2'
      }
      if (status >= ACCOUNT_STATUS.registeringIncludeProposal) {
        id = '3'
      }
      if (status >= ACCOUNT_STATUS.registeringConfirmProposal) {
        id = '4'
      }
      if (status === ACCOUNT_STATUS.registered || status === ACCOUNT_STATUS.onCross) {
        id = '5'
      }
      await sleep(500)
      const rollDom = document.getElementById(id)
      rollDom?.scrollIntoView({
        block: 'start'
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.confirm-list {
  margin-bottom: 8px;
  padding: 14px 2px 12px 16px;
  background: $normal-color;
  border-radius: 12px;
}

.confirm-list__container {
  padding-right: 10px;
}

.confirm-list__container__mini {
  overflow-y: scroll;
  height: 104px;
}

.confirm-list__confirm-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  line-height: 28px;

  .iconfont {
    display: flex;
  }
}

.confirm-list__confirm-item__label {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.confirm-list__confirm-item__link {
  display: flex;
  align-items: center;
  font-size: $font-size-12;
  font-weight: 400;
  color: $assist-font-color;
  line-height: 17px;
}

.confirm-list__confirm-item_succeed {
  font-weight: 600;
  color: $success-font-color;
}

.confirm-list__loading-icon {
  svg {
    animation: rotate360DegAnimation 0.9s linear infinite;
  }
}

.confirm-list__margin-bottom-12 {
  margin-bottom: 12px;
}

.confirm-list__margin-top-3 {
  margin-top: 3px;
}
</style>
