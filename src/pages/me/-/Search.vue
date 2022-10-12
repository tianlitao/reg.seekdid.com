<template>
  <div
    v-click-outside="onClickOutside"
    class="search"
    @click="onClickInput"
  >
    <div class="search_container">
      <Iconfont
        class="search_icon"
        name="search"
        size="14"
        color="#5F6570"
      />
      <input
        ref="input"
        v-model="query"
        :placeholder="$tt('Search')"
        class="search_input"
        type="text"
        @keydown="onKeydown"
        @input="onSearch"
      >
      <span
        v-if="active"
        class="search_cancel"
        @click.stop="onCancel"
      >{{ $tt('Cancel') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import debounce from 'lodash.debounce'
// @ts-ignore
import vClickOutside from 'v-click-outside'
import { digitalEmojiHandle, toDottedStyle } from '~/modules/tools'
import Iconfont from '~/components/icon/Iconfont.vue'
import { ACCOUNT_SUFFIX, DEBOUNCE_WAIT_TIME } from '~/constant'

export default Vue.extend({
  name: 'Search',
  components: {
    Iconfont
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data () {
    return {
      active: false,
      query: ''
    }
  },
  methods: {
    onClickOutside () {
      this.active = false
    },
    onClickInput () {
      if (!this.active) {
        this.active = true
      }
      window.setTimeout(() => {
        ;(this.$refs.input as HTMLInputElement).focus()
      })
    },
    onSearch () {
      this.query = digitalEmojiHandle(this.query)
      this.onDebounceSearch()
    },
    onDebounceSearch: debounce(function (this: any) {
      let account = this.query
      account = account.replace(/\s+/g, '')
      account = account.toLowerCase()
      if (!/\.bit$/.test(account) || account.includes('#')) {
        account = account.replace(/\.bit$/, '')
        account = account + ACCOUNT_SUFFIX
        account = toDottedStyle(account)
        account = account.replace(/\.bit$/, '')
      }
      this.$emit('search', account)
    }, DEBOUNCE_WAIT_TIME),
    onKeydown (event: KeyboardEvent) {
      const keyCode = event.keyCode || event.which
      if (keyCode === 13) {
        this.onSearch()
      }
    },
    onCancel () {
      this.query = ''
      this.$emit('search', '')
      this.active = false
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.search {
  flex: 1;
  display: inline-block;

  .search_container {
    position: relative;
    display: flex;
    padding: 3px 6px 3px 12px;
    align-items: center;
    height: 24px;
    color: $assist-font-color;
    background: $normal-color;
    border-radius: 15px;
  }

  .search_icon {
    margin-right: 4px;
  }

  .search_input {
    flex: 1;
    width: 48px;
    border: 0;
    background: unset;
    outline: 0;
    caret-color: $input-focus-border-color;

    &::placeholder {
      color: $assist-font-color;
      font-weight: 400;
    }
  }

  .search_cancel {
    margin-left: 10px;
    padding: 4px 7px;
    font-size: $font-size-12;
    background: #EFF2F5;
    cursor: pointer;
    border-radius: 12px;
    color: $assist-font-color;
    font-weight: 500;
  }
}
</style>
