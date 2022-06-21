<template>
  <div class="explorer-search">
    <form
      class="explorer-search__form"
      action=""
      autocomplete="off"
      @submit.prevent="onSearch"
    >
      <span>
        <Iconfont
          name="tab-explorer"
          size="22"
          color="#22c493"
        />
      </span>
      <input
        v-bind="$attrs"
        :value="value"
        class="explorer-search__input"
        :class="{ 'explorer-search__input_impure': value }"
        type="search"
        v-on="listeners"
      >
      <Button
        v-show="value"
        class="explorer-search__button"
        status="primary"
        type="submit"
      >
        {{ $tt('Search') }}
      </Button>
    </form>
  </div>
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
  background: linear-gradient(90deg, #00DF9B 0%, #0E7DFF 50%);
  height: 66px;
  padding: 2px;
  border-radius: 18px;
}

.explorer-search__form {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 19px;
  max-height: 70px;
  height: 66px;
  border-radius: 16px;
  background: $white;
}

.explorer-search__input {
  margin: 0 16px;
  width: 100%;
  height: 28px;
  font-size: 18px;
  font-weight: 600;
  color: $primary-font-color;
  caret-color: #0DBA85;
  outline: none;
  border: none;
  background: $white;
  line-height: 28px;

  &::placeholder {
    color: rgba(62, 82, 102, 0.4);
    font-weight: 500;
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
