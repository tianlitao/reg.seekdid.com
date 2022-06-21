<template>
  <div class="select-das" @click.stop.prevent>
    <div class="select-das__input__container">
      <input
        ref="input"
        v-bind="$attrs"
        :value="value"
        class="select-das__input"
        :class="{
          'select-das__input_error': !!errorMessages[0]
        }"
        type="text"
        v-on="listeners"
      >
      <Iconfont
        class="select-das__input__arrow-down"
        name="arrow-down"
        color="#11142D"
        @click="onFocus"
      />
    </div>
    <div
      v-if="errorMessages[0]"
      class="select-das__input__error-messages"
    >
      {{ errorMessages[0] }}
    </div>
    <ul
      v-if="optionsShowing && accountList.length > 0"
      class="select-das__options"
    >
      <li
        v-for="(option, index) in accountList"
        :key="index"
        class="select-das__options__item"
        @click="onSelect(option)"
      >
        <IconImage
          class="select-das__options__avatar"
          :url="`${IDENTICON_SERVE}${option.text}`"
          :alt="option.text"
          :size="22"
          rounded
        />
        {{ toHashedStyle(option.text) }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { IDENTICON_SERVE } from '~/constant'
import { REVERSE_KEYS } from '~/store/reverse'
import { IAccountListRes } from '~/services/DasReverse'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { toHashedStyle } from '~/modules/tools'

interface IOption {
  text: string
  value: any
}

export default Vue.extend({
  name: 'SelectDas',
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
      type: String,
      default: ''
    },
    errorMessages: {
      type: Array as PropType<string[]>,
      default: () => ([])
    }
  },
  data () {
    return {
      IDENTICON_SERVE,
      optionsShowing: false,
      selectOption: {} as IOption
    }
  },
  computed: {
    ...mapState({
      reverse: REVERSE_KEYS.namespace
    }),
    listeners (): object {
      const _vm = this
      return {
        ...this.$listeners,
        input (event: Event) {
          _vm.$emit('input', (event.target as HTMLInputElement).value)
        },
        focus () {
          _vm.optionsShowing = true
        }
      }
    },
    accountList (): IOption[] {
      const _list: IOption[] = []
      if (this.value) {
        this.reverse.accountList.forEach((item: IAccountListRes) => {
          if (item.account.includes(this.value) || toHashedStyle(item.account).includes(this.value)) {
            _list.push({
              text: item.account,
              value: item.account
            })
          }
        })
      }
      else {
        this.reverse.accountList.forEach((item: IAccountListRes) => {
          _list.push({
            text: item.account,
            value: item.account
          })
        })
      }
      return _list
    }
  },
  watch: {
    value (newVal) {
      if (newVal === '') {
        this.selectOption = ({} as IOption)
      }
    }
  },
  mounted () {
    document.addEventListener('click', () => {
      this.optionsShowing = false
    })
    if (this.value) {
      const _option = this.accountList.find((option: IOption) => {
        return this.value === option.value
      })
      if (_option) {
        this.selectOption = _option
      }
    }
  },
  methods: {
    toHashedStyle,
    onSelect (option: IOption) {
      this.selectOption = option
      this.$emit('input', option.value)
      this.$emit('blur')
      this.optionsShowing = false
    },
    onFocus () {
      this.optionsShowing = true
      ;(this.$refs.input as HTMLInputElement).focus()
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.select-das {
  position: relative;
}

.select-das__input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.select-das__input {
  display: inline-block;
  width: 100%;
  height: 34px;
  padding: 11px 48px 11px 24px;
  border-radius: 12px;
  border: 1px solid $input-color;
  background: $input-color;
  color: $primary-font-color;
  caret-color: $focus-color;
  outline: none;
  font-size: 14px;
  -webkit-appearance: none;
  cursor: pointer;

  &:hover,
  &:focus {
    border: 1px solid $focus-color;
    background: $white;
    box-shadow: inset 0 0 0 4px rgba(45, 100, 246, 0.1);
  }

  &::placeholder {
    color: $assist-font-color;
    font-weight: 400;
  }
}

.select-das__input__arrow-down {
  position: absolute;
  right: 16px;
}

.select-das__input_error {
  border: 1px solid $error-color;
  background: $white;
  box-shadow: inset 0 0 0 4px rgba(223, 75, 70, 0.1);
}

.select-das__input__error-messages {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: $error-font-color;
  line-height: 14px;
}

.select-das__options {
  position: absolute;
  top: 55px;
  left: 0;
  right: 0;
  display: block;
  margin: 8px auto 0 auto;
  padding: 10px 8px;
  max-height: 200px;
  background: $white;
  box-shadow: $container-outer-box-shadow;
  border-radius: 16px;
  border: $container-border;
  z-index: 2;
  overflow: scroll;
}

.select-das__options__item {
  padding: 9px 8px;
  display: flex;
  align-items: center;
  height: 30px;
  border-radius: 8px;
  line-height: 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  .select-das__options__avatar {
    margin-right: 12px;
  }

  .select-das__options__highlight {
    color: #5374FB;
  }

  &:hover {
    background: #667FFF;
    color: #ffffff;

    .select-das__options__highlight {
      color: #ffffff;
    }
  }
}
</style>
