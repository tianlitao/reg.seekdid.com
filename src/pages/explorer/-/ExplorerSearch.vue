<template>
  <form
    class="explorer-search"
    action=""
    autocomplete="off"
    @submit.prevent="onSearch">
    <Iconfont
      name="search-big"
      color="#11142D"/>
    <input
      v-bind="$attrs"
      :value="value"
      class="explorer-search__input"
      :class="{ 'explorer-search__input_impure': value }"
      type="search"
      v-on="listeners"/>
    <Button
      v-show="value"
      class="explorer-search__button"
      primary
      type="submit">
      {{ $t('Search') }}
    </Button>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import Button from '~/components/Button.vue'

export default Vue.extend({
  name: 'ExplorerSearch',
  components: {
    Iconfont,
    Button
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
    }
  },
  computed: {
    listeners (): object {
      const _vm = this
      return {
        ...this.$listeners,
        input (event: Event) {
          _vm.$emit('input', (event.target as HTMLInputElement).value)
        },
        search (event: Event) {
          const _value = (event.target as HTMLInputElement).value
          if (!_value) {
            return
          }
          ;(event.target as HTMLInputElement).blur()
          _vm.$emit('search', _value)
        }
      }
    }
  },
  methods: {
    onSearch (event: Event) {
      if (!this.value) {
        return
      }
      ;(event.target as HTMLInputElement).blur()
      this.$emit('search', this.value)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.explorer-search {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 19px;
  max-height: 70px;
  height: 70px;
  border-radius: 16px;
  border: 1px solid $normal-color;
  background: $normal-color;

  &:hover {
    border: 1px solid $focus-color;
    box-shadow: inset 0 0 0 4px rgba(45, 100, 246, 0.1);
  }
}

.explorer-search__input {
  margin: 0 16px;
  width: 100%;
  height: 28px;
  font-size: 18px;
  font-weight: 600;
  color: $primary-font-color;
  caret-color: $focus-color;
  outline: none;
  border: none;
  background: $normal-color;
  line-height: 28px;

  &::placeholder {
    color: $assist-font-color;
    font-weight: 400;
  }
}

.explorer-search__input_impure {
  width: calc(100% - 144px);
}

.explorer-search__button {
  position: absolute;
  right: 8px;
  width: 98px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
}
</style>
