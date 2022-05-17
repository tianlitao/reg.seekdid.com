<template>
  <ul class="payment-token-select">
    <li
      v-for="(option, index) in [...showOptions, ...ckbWalletOptions, ...pwWalletOptions]"
      :key="index"
      class="payment-token-select__item"
      @click="onSelect(option)"
    >
      <span class="payment-token-select__item__container">
        <span class="payment-token-select__item__logo">
          <IconImage
            :url="option.logo"
            :alt="option.symbol"
            :size="20"
          />
        </span>
        <span class="payment-token-select__item__info">
          <span class="payment-token-select__item__symbol">
            {{ option.symbol + ' ' }}
            <span v-if="option.chain_type === ChainType.ckb" class="payment-token-select__no-gas">NO GAS</span>
          </span>
          <span class="payment-token-select__item__name">{{ option.name }}</span>
        </span>
      </span>
      <Iconfont
        v-if="selectOption.token_id === option.token_id"
        name="check-strong"
        color="#22C493"
        size="29"
      />
      <span
        v-else
        class="payment-token-select__item__unselect"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { IToken } from '~/services/Common'
import { BSC, ChainType, CKB, CoinType, DASBalanceTokenId, Polygon } from '~/constant/chain'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'

export default Vue.extend({
  name: 'PaymentTokenSelect',
  components: {
    IconImage,
    Iconfont
  },
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Object as PropType<IToken>,
      default: () => ({} as IToken),
      required: true
    },
    options: {
      type: Array as PropType<IToken[]>,
      default: () => ([]),
      required: true
    },
    currentChain: {
      type: Number as PropType<ChainType>,
      required: true
    }
  },
  data () {
    return {
      CKB,
      DASBalanceTokenId,
      ChainType,
      selectOption: {
        symbol: ''
      } as IToken
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    computedOptions (): IToken[] {
      return this.options.map((option: IToken) => {
        let _option: IToken
        if (option.token_id === BSC.tokenId) {
          _option = {
            ...option,
            chain_type: ChainType.bsc
          }
        }
        else if (option.token_id === Polygon.tokenId) {
          _option = {
            ...option,
            chain_type: ChainType.polygon
          }
        }
        else {
          _option = option
        }
        return _option
      })
    },
    showOptions (): IToken[] {
      const res = this.computedOptions.filter((option: IToken) => {
        return option.chain_type === this.currentChain && this.currentChain !== 0
      })
      return res
    },
    pwWalletOptions (): IToken[] {
      const options = this.options.filter((option: IToken) => {
        return option.token_id === CKB.tokenId
      })
      if (options && [CoinType.eth].includes(this.connectedAccount.chain?.coinType)) {
        return options
      }
      return []
    },
    ckbWalletOptions (): IToken[] {
      const options = this.options.filter((option: IToken) => {
        return option.token_id === DASBalanceTokenId
      })
      if (options) {
        return options
      }
      return []
    }
  },
  watch: {
    value (newVal, oldVal) {
      if (newVal.token_id && oldVal.token_id && newVal.token_id !== oldVal.token_id) {
        this.defaultSelect()
      }
    },
    showOptions () {
      this.defaultSelect()
    }
  },
  mounted () {
    this.defaultSelect()
  },
  methods: {
    onSelect (option: IToken) {
      this.selectOption = option
      const _option = JSON.parse(JSON.stringify(option))
      if ([BSC.tokenId, Polygon.tokenId].includes(_option.token_id)) {
        _option.chain_type = ChainType.eth
      }
      this.$emit('input', _option)
    },
    defaultSelect () {
      if (this.value.token_id) {
        const _showOption = this.showOptions.find((option: IToken) => {
          return this.value.token_id === option.token_id
        })

        const _ckbWalletOption = this.ckbWalletOptions.find((option: IToken) => {
          return this.value.token_id === option.token_id
        })

        const _pwWalletOption = this.pwWalletOptions.find((option: IToken) => {
          return this.value.token_id === option.token_id
        })

        if (_showOption) {
          this.selectOption = _showOption
        }
        else if (_ckbWalletOption) {
          this.selectOption = _ckbWalletOption
        }
        else if (_pwWalletOption) {
          this.selectOption = _pwWalletOption
        }
        else if (this.showOptions.length > 0) {
          this.selectOption = this.showOptions[0]
        }
      }
      else if (this.showOptions.length > 0) {
        this.selectOption = this.showOptions[0]
      }

      const _option = JSON.parse(JSON.stringify(this.selectOption))

      if ([BSC.tokenId, Polygon.tokenId].includes(_option.token_id)) {
        _option.chain_type = ChainType.eth
      }
      this.$emit('input', _option)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.payment-token-select {
  padding: 8px 12px 8px 8px;
  height: 224px;
  background: $normal-color;
  border-radius: 12px;
  border: $container-border;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0 !important;
  }
}

.payment-token-select__item__container {
  display: flex;
}

.payment-token-select__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 4px 9px 8px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 12px;
  }
}

.payment-token-select__item__logo {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.payment-token-select__item__info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.payment-token-select__item__symbol {
  display: flex;
  line-height: 17px;
  font-weight: 600;
}

.payment-token-select__no-gas {
  background: rgba(34, 196, 147, 0.25);
  border-radius: 3px;
  border: 1px solid rgba(34, 196, 147, 0.25);
  font-size: 12px;
  color: $success-font-color;
  line-height: 15px;
  margin-left: 6px;
  padding: 0 2px;
}

.payment-token-select__item__tag {
  color: #B2B3BD;
}

.payment-token-select__item__name {
  font-size: 12px;
  color: $third-font-color;
  line-height: 15px;
  font-weight: 600;
}

.payment-token-select__item__unselect {
  margin: 0 5px;
  display: inline-block;
  width: 16px;
  height: 16px;
  background: $white;
  border-radius: 100%;
  border: 2px solid #E1E1E1;
}
</style>
