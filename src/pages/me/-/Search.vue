<template>
  <div
    v-click-outside="onClickOutside"
    :class="[
      'search',
      { '_active': active || !!query }
    ]"
    @click="onClickInput"
  >
    <div class="search_container">
      <Iconfont
        class="search_icon"
        name="search-small"
        size="24"
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
      <Iconfont
        v-if="query"
        class="search_clean"
        name="close"
        size="24"
        color="#A0A1AB"
        @click="onClean"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import debounce from 'lodash.debounce'
// @ts-ignore
import vClickOutside from 'v-click-outside'
import { toDottedStyle } from '~/modules/tools'
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
      this.$emit('focus', this.active)
    },
    onClickInput () {
      if (!this.active) {
        this.active = true
      }
      window.setTimeout(() => {
        ;(this.$refs.input as HTMLInputElement).focus()
      })
      this.$emit('focus', this.active)
    },
    onSearch: debounce(function (this: any) {
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
    onClean () {
      this.query = ''
      this.$emit('search', '')
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.search {
  display: inline-block;

  .search_container {
    position: relative;
    padding: 3px 12px 3px 8px;
    display: inline-flex;
    align-items: center;
    height: 24px;
    color: #5F6570;
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
    caret-color: #0DBA85;

    &::placeholder {
      color: #5F6570;
      font-weight: 400;
    }
  }

  &._active {
    flex: 1;

    .search_container {
      padding: 3px 28px 3px 8px;
      display: flex;
    }
  }

  .search_clean {
    position: absolute;
    right: 12px;
    cursor: pointer;
    border-radius: 24px;

    &:hover {
      background: #d2d6d9;
    }
  }
}
</style>
