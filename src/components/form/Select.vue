<template>
  <div class="select" @click.stop.prevent>
    <div class="select__input__container">
      <input
        ref="input"
        v-bind="$attrs"
        :value="selectOption.text"
        class="select__input"
        :class="{ 'select__input_error': !!errorMessages[0] }"
        type="text"
        readonly="readonly"
        v-on="$listeners"
        @focus="onFocus"
        @blur="onBlur"
      >
      <Iconfont
        class="select__input__arrow-down"
        name="arrow-down"
        color="#11142D"
        @click="onFocus"
      />
    </div>
    <div
      v-if="errorMessages[0]"
      class="select__input__error-messages"
    >
      {{ errorMessages[0] }}
    </div>
    <ul
      v-if="optionsShowing"
      class="select__options"
    >
      <li
        v-for="(option, index) in options"
        :key="index"
        class="select__options__item"
        @click="onSelect(option)"
      >
        {{ option.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'

interface IOption {
  text: string
  value: any
}

export default Vue.extend({
  name: 'Select',
  components: {
    Iconfont
  },
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array as PropType<IOption[]>,
      default: () => ([]),
      required: true
    },
    errorMessages: {
      type: Array as PropType<string[]>,
      default: () => ([])
    }
  },
  data () {
    return {
      optionsShowing: false,
      selectOption: {} as IOption
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
      const _option = this.options.find((option: IOption) => {
        return this.value === option.value
      })
      if (_option) {
        this.selectOption = _option
      }
    }
  },
  methods: {
    onSelect (option: IOption) {
      this.selectOption = option
      this.$emit('input', option.value)
      this.$emit('blur')
      this.optionsShowing = false
    },
    onFocus () {
      this.optionsShowing = true
      ;(this.$refs.input as HTMLInputElement).focus()
    },
    onBlur () {
      window.setTimeout(() => {
        this.optionsShowing = false
      }, 300)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.select {
  position: relative;
}

.select__input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.select__input {
  display: inline-block;
  width: 100%;
  height: 34px;
  padding: 11px 48px 11px 24px;
  border-radius: 12px;
  border: 1px solid $normal-color;
  background: $normal-color;
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

.select__input_error {
  border: 1px solid $error-color;
  background: $white;
  box-shadow: inset 0 0 0 4px rgba(223, 75, 70, 0.1);
}

.select__input__arrow-down {
  position: absolute;
  right: 16px;
}

.select__input__error-messages {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: $error-font-color;
  line-height: 14px;
}

.select__options {
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

.select__options__item {
  padding: 9px 8px;
  height: 30px;
  border-radius: 8px;
  line-height: 30px;
  cursor: pointer;

  &:hover {
    background: #667FFF;
    color: #ffffff;
  }
}
</style>
