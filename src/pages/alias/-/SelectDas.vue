<template>
  <div
    class="select-das"
    v-click-outside="onClickOutside"
  >
    <div
      class="select-das__input__container"
      @click="onFocus"
    >
      <input
        v-bind="$attrs"
        v-model="select"
        class="select-das__input"
        :class="{
          'select-das__input_error': !!errorMessages[0]
        }"
        type="text"
        @input="onInput"
      >
      <Iconfont
        class="select-das__input__arrow-down"
        name="arrow-down"
        color="#121314"
        size="14"
      />
    </div>
    <div
      v-if="errorMessages[0]"
      class="select-das__input__error-messages"
    >
      {{ errorMessages[0] }}
    </div>
    <transition name="select-das-options">
      <ul
        v-show="optionsShowing && showOptios.length > 0"
        class="select-das__options"
      >
        <li
          v-for="(option, index) in showOptios"
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
          <template v-if="isSubAccount(option.text)">
            {{ option.text.split('.')[1] }}<span class="select-das__options__sub-account">#{{ option.text.split('.')[0] }}</span>.{{ option.text.split('.')[2] }}
          </template>
          <template v-else>
            {{ option.text }}
          </template>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
// @ts-ignore
import vClickOutside from 'v-click-outside'
import { IDENTICON_SERVE } from '~/constant'
import { REVERSE_KEYS } from '~/store/reverse'
import { IAccountListRes } from '~/services/DasReverse'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { toHashedStyle } from '~/modules/tools'
import { SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'

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
      showOptios: [] as IOption[],
      select: '' as String | Number
    }
  },
  computed: {
    ...mapState({
      reverse: REVERSE_KEYS.namespace
    }),
    accountList (): IOption[] {
      const _list: IOption[] = []
      this.reverse.accountList.forEach((item: IAccountListRes) => {
        _list.push({
          text: item.account,
          value: item.account
        })
      })
      return _list
    }
  },
  watch: {
    value (newVal) {
      if (newVal === '') {
        this.select = ''
      }
    }
  },
  mounted () {
    if (this.value) {
      const _option = this.accountList.find((option: IOption) => {
        return this.value === option.value
      })
      if (_option) {
        this.select = _option.text
      }
    }
    this.showOptios = this.accountList
  },
  methods: {
    toHashedStyle,
    isSubAccount (accont: string): boolean {
      return SUB_ACCOUNT_REG_EXP.test(accont)
    },
    onSelect (option: IOption) {
      this.$emit('input', option.value)
      this.select = toHashedStyle(option.text)
      this.onInput()
      this.$emit('blur')
      this.optionsShowing = false
    },
    onFocus () {
      this.optionsShowing = true
    },
    onInput () {
      let _value = event?.target?.value || ''
      let _list: IOption[] = []
      if (_value) {
        this.accountList.forEach((item: IOption) => {
          const _text = toHashedStyle(item.text)
          _value = _value.toLowerCase()
          console.log(_text + ' - ' + _value)
          if (_text.includes(_value)) {
            _list.push(item)
          }
        })
      }
      else {
        _list = this.accountList
      }
      this.showOptios = _list
    },
    onClickOutside () {
      this.optionsShowing = false
      this.select = toHashedStyle(this.value)
      this.onInput()
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
  border: 1px solid $input-border-color;
  background: $input-bg-color;
  color: $primary-font-color;
  caret-color: $input-focus-border-color;
  outline: none;
  font-size: $font-size-14;
  -webkit-appearance: none;
  cursor: pointer;

  &:hover {
    border: 1px solid $input-focus-border-color;
  }

  &:focus {
    border: 1px solid $input-focus-border-color;
    background: $input-focus-bg-color;
  }

  &::placeholder {
    font-weight: 500;
    color: $third-font-color;
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
  font-size: $font-size-12;
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
  box-shadow: $option-outer-box-shadow;
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
  font-size: $font-size-16;
  font-weight: bold;

  .select-das__options__avatar {
    margin-right: 12px;
  }

  .select-das__options__highlight {
    color: #5374FB;
  }

  &:hover {
    background: #667FFF;
    color: $white;

    .select-das__options__highlight {
      color: $white;
    }
  }
}

.select-das__options__sub-account {
  color: $warn-font-color;
}

.select-das-options-enter-active {
  animation: fadeInUp 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
}

.select-das-options-leave-active {
  animation: fadeOutDown 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
}
</style>
