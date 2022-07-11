<template>
  <div
    class="account-status-filter"
    v-click-outside="onClickOutside"
  >
    <div
      class="account-status-filter_input_container"
      @click="onClick"
    >
      <input
        ref="input"
        v-bind="$attrs"
        :value="selectOption.text"
        class="account-status-filter_input"
        type="text"
        readonly="readonly"
        v-on="$listeners"
      >
      <Iconfont
        class="account-status-filter_input_arrow-down"
        name="arrow-down"
        color="#5F6570"
        size="14"
      />
    </div>
    <transition name="account-status-filter-options">
      <ul
        v-if="optionsShowing"
        class="account-status-filter_options"
      >
        <li
          v-for="(option, index) in options"
          :key="index"
          class="account-status-filter_options_item"
          @click="onSelect(option)"
        >
          {{ option.text }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
// @ts-ignore
import vClickOutside from 'v-click-outside'
import Iconfont from '~/components/icon/Iconfont.vue'

interface IOption {
  text: string,
  value: any,
}

export default Vue.extend({
  name: 'AccountStatusFilter',
  components: {
    Iconfont
  },
  directives: {
    clickOutside: vClickOutside.directive
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
    const _option = this.options.find((option: IOption) => {
      return this.value === option.value
    })
    if (_option) {
      this.selectOption = _option
    }
  },
  methods: {
    onSelect (option: IOption) {
      this.selectOption = option
      this.$emit('input', option.value)
      this.$emit('blur')
      this.optionsShowing = false
    },
    onClick () {
      this.optionsShowing = !this.optionsShowing
    },
    onClickOutside () {
      this.optionsShowing = false
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.account-status-filter {
  position: relative;
}

.account-status-filter_input_container {
  position: relative;
  display: flex;
  align-items: center;
}

.account-status-filter_input {
  display: inline-block;
  width: 100%;
  height: 30px;
  padding: 0 32px 0 12px;
  border-radius: 32px;
  border: 0;
  background: $normal-color;
  color: $assist-font-color;
  outline: none;
  font-size: $font-size-14;
  -webkit-appearance: none;
  cursor: pointer;
}

.account-status-filter_input_arrow-down {
  position: absolute;
  right: 10px;
}

.account-status-filter_options {
  position: absolute;
  left: 0;
  top: 34px;
  z-index: 10;
  text-align: left;
  padding: 12px;
  font-size: $font-size-14;
  line-height: 17px;
  background: $white;
  box-shadow: $option-outer-box-shadow;
  border-radius: 12px;
  border: $container-border;
}

.account-status-filter_options_item {
  padding: 12px 24px 12px 12px;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  font-size: $font-size-16;
  font-weight: 500;
  color: $primary-font-color;

  &:hover {
    border-radius: 8px;
    background: $normal-color;
  }
}

.account-status-filter-options-enter-active {
  animation: fadeInUp 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
}

.account-status-filter-options-leave-active {
  animation: fadeOutDown 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
}
</style>
