<template>
  <div
    class="explorer"
    :class="{
      'explorer_mobile': isMobile
    }"
  >
    <img class="explorer__logo" src="/images/explorer/das-logo.png" alt="logo">
    <div class="explorer__full-name">
      {{ $tt('Cross-chain Web3 identities for you and your community') }}
      <span
        v-if="!config.isProdData"
        class="explorer__full-name__beta"
      >
        {{ $tt('(Public Beta)') }}
      </span>
    </div>
    <ExplorerSearch
      v-model.trim="searchWord"
      :placeholder="$tt('Find your perfect DAS account')"
      :loading="loading"
      @input="onInput"
      @search="onSearch"
    />
    <div
      v-if="showIncorrectAccountFormat"
      class="explorer__error-tip"
    >
      {{ incorrectAccountFormatText }}
      <a
        class="explorer__rules-details"
        :href="$i18n.locale === LANGUAGE.zhCN ? 'https://docs.did.id/zh/register-das/charsets' : 'https://docs.did.id/register-das/charsets'"
        target="_blank"
      >
        [{{ $tt('Rules Details') }}]
      </a>
    </div>
    <div
      v-else-if="showIllegalStringLength"
      class="explorer__error-tip"
    >
      {{ $tt('Account name length must be {min} to {max} characters', { min: commonConfig.min_account_len, max: commonConfig.max_account_len }) }}
    </div>
    <div
      v-else-if="notOpenForRegistrationShowing"
      class="explorer__error-tip"
    >
      <template v-if="registrableDate">
        {{ $tt('To be released at on-chain time: {date}.', { date: registrableDate }) }}
        <span
          class="explorer__add-to-calendar"
          @click="addToCalendar"
        >{{ $tt('Add to calendar') }}
        </span>
      </template>
      <i18n
        v-else
        tag="span"
        path="注册提示"
        :i18nkey="$tt('注册提示')"
      >
        <a
          slot="twitter"
          class="explorer__twitter"
          href="https://twitter.com/dotbitHQ"
          target="_blank">@dotbitHQ</a>
      </i18n>
    </div>
    <div class="explorer__search_result">
      <div
        v-if="searchResult.account && !loading"
        class="explorer__search_result__list"
      >
        <AccountStatus :account="searchResult"/>
      </div>
    </div>
    <div
      class="explorer__goto-seekdid-tips"
    >
      {{$tt('引导去查靓号')}}
      <a
        target="_blank" 
        href="https://seekdid.com"
      >
        <img class="explorer__seekdid-logo" src="/images/explorer/seekdid-logo.svg" alt="seekdid-logo"/>
      </a>
    </div>
    <div
      class="explorer__open-registration-rules"
    >
      <div class="explorer__open-registration-rules__title">
        {{ $tt('Updates for the release:') }}
      </div>
      <div class="explorer__open-registration-rules__item">
        <span class="explorer__open-registration-rules__item__dot">•</span>
        {{ $tt('10 characters and above: All released.') }}
      </div>
      <div class="explorer__open-registration-rules__item">
        <span class="explorer__open-registration-rules__item__dot">•</span>
        <span>
          {{ $tt('4~9 characters: Randomly release 60%.') }}
          <i18n
            tag="span"
            path="开放注册通知"
            :i18nkey="$tt('开放注册通知')"
          >
            <span
              slot="percentage"
              class="explorer__open-registration-rules__item__high-brightness"
            >100%</span>
            <span
              slot="date"
              class="explorer__open-registration-rules__item__high-brightness"
            >
              {{ $tt('12:00 PM (UTC+0) on October 18th') }}
            </span>
          </i18n>
          <a
            class="explorer__rules-details"
            :href="$i18n.locale === LANGUAGE.zhCN ? 'https://docs.did.id/zh/register-das/open-registration-rules' : 'https://docs.did.id/register-das/open-registration-rules'"
            target="_blank"
          >
            {{ $tt('Releasing plan.') }}
          </a>
        </span>
      </div>
      <div class="explorer__open-registration-rules__item">
        <span class="explorer__open-registration-rules__item__dot">•</span>
        <span>{{ $tt('1~3 characters: Not released yet.') }}</span>
      </div>
    </div>
    <div class="explorer__current-on-chain-time">
      {{ $tt('Current on-chain time: {date} (UTC+0)', { date: dateOnChain }) }}
    </div>
    <div
      v-if="isMobile"
      class="explorer__lang-switcher"
    >
      <LangSwitcher block />
      <a
        class="explorer__faq__mobile"
        href="https://did.id"
        target="_self"
      >
        <Iconfont
          name="logo"
          size="16"
        />
        {{ $tt('What is DAS?') }}
      </a>
    </div>
    <a
      v-if="!isMobile"
      class="explorer__faq"
      href="https://did.id"
      target="_blank"
    >
      {{ $tt('What is DAS?') }}
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import debounce from 'lodash.debounce'
import { mapState, mapGetters } from 'vuex'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { atcb_action } from 'add-to-calendar-button'
import LangSwitcher from '~/components/LangSwitcher.vue'
import ExplorerSearch from '~/pages/explorer/-/ExplorerSearch.vue'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX, CHAR_TYPE, DEBOUNCE_WAIT_TIME } from '~/constant'
import { ISearchAccount } from '~/services/Explorer'
import AccountStatus from '~/pages/explorer/-/AccountStatus.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { accountChars, digitalEmojiHandle, isMobile, splitAccount, toDottedStyle } from '~/modules/tools'
import { COMMON_KEYS } from '~/store/common'
import { IConfig } from '~/services/Common'
import config from '~~/config'
import errno from '~/constant/errno'
import { LANGUAGE } from '~/constant/language'
import Iconfont from '~/components/icon/Iconfont.vue'

dayjs.extend(utc)

export default Vue.extend({
  name: 'Explorer',
  layout: 'explorer',
  components: {
    LangSwitcher,
    ExplorerSearch,
    AccountStatus,
    Iconfont
  },
  data () {
    return {
      LANGUAGE,
      config,
      searchWord: '',
      searchResult: {} as ISearchAccount,
      loading: false,
      showIncorrectAccountFormat: false,
      showIllegalStringLength: false,
      notOpenForRegistrationShowing: false,
      registrableDate: '',
      fetchConfigTimer: 0,
      incorrectAccountFormatText: ''
    }
  },
  computed: {
    isMobile,
    ...mapState({
      me: ME_KEYS.namespace,
      common: COMMON_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType
    }),
    dateOnChain (): string {
      const timestamp = this.common.config.timestamp_on_chain
      if (timestamp) {
        return dayjs(timestamp * 1000).utc().format('YYYY-MM-DD hh:mm:ssA')
      }
      else {
        return dayjs().utc().format('YYYY-MM-DD hh:mm:ssA')
      }
    },
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    commonConfig (): IConfig {
      return this.common.config
    }
  },
  async mounted () {
    await this.$store.dispatch(COMMON_KEYS.fetchConfig)
    this.fetchConfigTimer = window.setInterval(() => {
      this.$store.dispatch(COMMON_KEYS.fetchConfig)
    }, 5000)
    const _searchWord = this.$route.query.searchWord
    if (_searchWord) {
      this.searchWord = digitalEmojiHandle(_searchWord as string)
      this.onInput()
      this.onSearch(this.searchWord)
    }
  },
  beforeDestroy () {
    clearInterval(this.fetchConfigTimer)
  },
  methods: {
    incorrectAccountFormat (account: string) {
      const linker = this.$i18n.locale === LANGUAGE.zhCN ? '、' : ', '
      this.incorrectAccountFormatText = ''
      const list = accountChars(account)
      // Characters x, y, z are not included
      let notIncluded: string[] = []
      list.forEach((item) => {
        if (item.char_set_name === CHAR_TYPE.unknown) {
          notIncluded.push(item.char)
        }
      })
      if (notIncluded.length > 0) {
        notIncluded = [...new Set(notIncluded)]
        this.incorrectAccountFormatText = this.$tt('Characters {list} are not included.', { list: notIncluded.join(linker) })
      }
      else {
        // For safety, character x and y cannot be used in combination
        let charTypes: CHAR_TYPE[] = []
        list.forEach((item) => {
          charTypes.push(item.char_set_name)
        })
        const charTypesSet = new Set(charTypes)
        charTypesSet.delete(CHAR_TYPE.emoji)
        charTypesSet.delete(CHAR_TYPE.number)
        charTypesSet.delete(CHAR_TYPE.unknown)
        const language: { [key: string]: string } = {
          [CHAR_TYPE.english]: this.$tt('English'),
          [CHAR_TYPE.simplifiedChinese]: this.$tt('Simplified chinese'),
          [CHAR_TYPE.traditionalChinese]: this.$tt('Traditional chinese'),
          [CHAR_TYPE.japanese]: this.$tt('Japanese'),
          [CHAR_TYPE.korean]: this.$tt('Korean'),
          [CHAR_TYPE.russian]: this.$tt('Russian'),
          [CHAR_TYPE.turkish]: this.$tt('Turkish'),
          [CHAR_TYPE.thai]: this.$tt('Thai'),
          [CHAR_TYPE.vietnamese]: this.$tt('Vietnamese')
        }
        charTypes = [...charTypesSet]
        const languageList = charTypes.map((item) => {
          return language[item]
        })
        if (languageList.length > 1) {
          this.incorrectAccountFormatText = this.$tt('For safety, {list} cannot be used in combination.', { list: languageList.join(linker) })
        }
      }
    },
    checkSearchWord (value: string, isSubAccount?: boolean) {
      const splitArr = splitAccount(value)
      const nonComplianceChar = splitArr.find((item: { char_set_name: number, char: string }) => {
        return item.char_set_name === CHAR_TYPE.unknown
      })
      const accountLength = splitArr.length

      if (!isSubAccount && (accountLength < this.commonConfig.min_account_len || accountLength > this.commonConfig.max_account_len)) {
        this.showIllegalStringLength = true
      }
      this.showIncorrectAccountFormat = !!nonComplianceChar
    },
    onInput () {
      this.searchResult = {} as ISearchAccount
      this.showIncorrectAccountFormat = false
      this.showIllegalStringLength = false
      this.notOpenForRegistrationShowing = false
      this.registrableDate = ''
      this.searchWord = this.searchWord.toLowerCase()
    },
    onSearch: debounce(async function (this: any, value: string) {
      this.loading = true
      value = digitalEmojiHandle(value)
      value = value.replace(/\s+/g, '')
      value = value.toLowerCase()
      this.searchWord = value
      value = value.replace(/\.bit$/, '')
      value = value + ACCOUNT_SUFFIX
      value = toDottedStyle(value)

      this.searchResult = {
        account: value
      }
      try {
        const res = await this.$services.account.accountInfo(value)
        if (res) {
          this.searchResult = {
            account: value,
            ...res
          }
        }
        this.loading = false
        return
      }
      catch (err: any) {
        console.error(err)
      }

      value = value.replace(/\.bit$/, '')

      this.searchResult = {}
      this.showIllegalStringLength = false
      this.showIncorrectAccountFormat = false
      this.notOpenForRegistrationShowing = false
      this.registrableDate = ''

      if (!value) {
        this.loading = false
        return
      }

      this.$gtag('event', 'click', {
        event_category: 'explorer',
        event_label: 'search account',
        value: 1
      })

      const accountList = value.split('.')
      if (accountList[0]) {
        this.incorrectAccountFormat(accountList[0])
        this.checkSearchWord(accountList[0], accountList.length === 2)
      }
      if (accountList[1]) {
        this.incorrectAccountFormat(accountList[1])
        this.checkSearchWord(accountList[1])
      }

      if (this.showIncorrectAccountFormat || this.showIllegalStringLength) {
        this.loading = false
        return
      }

      this.searchResult = {
        account: value + ACCOUNT_SUFFIX
      }

      try {
        const res = await this.$services.explorer.searchAccount({
          account: value,
          chain_type: this.computedChainType,
          address: this.connectedAccount.address
        })

        if (!res.is_self && [ACCOUNT_STATUS.registeringPaymentConfirm].includes(res.status)) {
          this.searchResult = {
            account: value + ACCOUNT_SUFFIX,
            ...res,
            status: ACCOUNT_STATUS.registerable
          }
        }
        else if (!res.is_self && [ACCOUNT_STATUS.registeringLockedAccount, ACCOUNT_STATUS.registering, ACCOUNT_STATUS.registeringIncludeProposal, ACCOUNT_STATUS.registeringConfirmProposal].includes(res.status)) {
          this.searchResult = {
            account: value + ACCOUNT_SUFFIX,
            ...res,
            status: ACCOUNT_STATUS.othersRegistering
          }
        }
        else if (res) {
          if (res.status === ACCOUNT_STATUS.notOpenRegister) {
            this.searchResult = {}
            this.notOpenForRegistrationShowing = true
            this.registrableDate = '2022–10–18 12:00PM (UTC+0)'
          }
          else {
            this.searchResult = {
              account: value + ACCOUNT_SUFFIX,
              ...res
            }
          }
        }
      }
      catch (err: any) {
        console.error(err)
        this.searchResult = {}
        if (err.code === errno.rpcApiErrAccountCharsErr) {
          this.showIncorrectAccountFormat = true
        }
        else {
          this.$alert({
            title: this.$tt('Error'),
            message: `${err.code}: ${err.message}`
          })
        }
      }
      finally {
        this.loading = false
      }
    }, DEBOUNCE_WAIT_TIME),
    addToCalendar () {
      const account = /\.bit$/.test(this.searchWord) ? this.searchWord : this.searchWord + ACCOUNT_SUFFIX
      const config = {
        name: 'All 4~9 digits .bit accounts will release to 100% at 12:00 PM(UTC+0), October 18th.',
        description: `${account} registration link: [url]https://app.did.id/explorer?searchWord=${account}[/url]`,
        startDate: '2022-10-18',
        options: ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com', 'MicrosoftTeams', 'Yahoo'],
        trigger: 'click',
        iCalFileName: 'dotbit-reminder-event'
      }
      // @ts-ignore
      atcb_action(config)
      const list = document.getElementsByClassName('atcb-list-item')
      for (let i = 0; i < list.length; i++) {
        let eventLabel: any = list[i]?.childNodes[1]
        eventLabel = (eventLabel as HTMLElement).innerText
        list[i].addEventListener('click', () => {
          this.$gtag('event', 'click', {
            event_category: 'add to calendar',
            event_label: eventLabel,
            value: 1
          })
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.explorer {
  position: relative;
  flex: 1;
  padding: 16px 48px 0 48px;
  text-align: center;
}

.explorer__lang-switcher {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  grid-column-gap: 8px;
  margin-top: 20px;
}

.explorer__logo {
  width: 116px;
  min-height: 44px;
  margin-top: 24px;
}


.explorer__seekdid-logo
{
  margin-left: 12px;
  height: 16px;
}

.explorer__full-name {
  margin: 10px 0 44px 0;
  color: $primary-font-color;
}

.explorer__full-name__beta {
  color: $error-font-color;
}

.explorer__error-tip {
  margin-top: 4px;
  margin-left: 4px;
  font-size: $font-size-12;
  font-weight: 600;
  color: $error-font-color;
  line-height: 14px;
  text-align: left;
}

.explorer__rules-details {
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color
  }
}

.explorer__search_result {
  position: relative;
  z-index: 2;
}

.explorer__search_result__list {
  position: absolute;
  width: 100%;
  margin-top: 16px;
  box-shadow: $option-outer-box-shadow;
}

.explorer__faq {
  position: relative;
  top: 12%;
  transform: translateX(-50%);
  color: $assist-font-color;

  &:hover {
    color: $link-font-color
  }
}

.explorer__faq__mobile {
  height: 39px;
  padding: 0 10px;
  background: $normal-color;
  border-radius: 8px;
  display: inline-grid;
  align-items: center;
  justify-content: flex-start;
  grid-auto-flow: column;
  grid-column-gap: 5px;
  font-size: $font-size-14;
  font-weight: 600;
  color: $primary-font-color;

  &:hover {
    background: $normal-hover-color;
  }
}

.explorer__current-on-chain-time {
  padding: 16px;
  text-align: left;
  font-size: $font-size-14;
  font-weight: 400;
  color: $primary-font-color;
  line-height: 17px;
  background: rgba(217, 248, 228, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(143, 225, 166, 0.2);
}

.explorer__goto-seekdid-tips {
  margin-top: 12px;
  padding: 16px;
  text-align: left;
  font-size: $font-size-14;
  font-weight: 400;
  color: $primary-font-color;
  display: flex;
  align-items: center;
  line-height: 17px;
  background: rgba(217, 248, 228, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(143, 225, 166, 0.2);
}

.explorer__open-registration-rules {
  margin-top: 16px;
  margin-bottom: 8px;
  padding: 16px 16px 8px 16px;
  text-align: left;
  font-size: $font-size-14;
  font-weight: 400;
  color: $primary-font-color;
  line-height: 17px;
  background: rgba(217, 248, 228, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(143, 225, 166, 0.2);
}

.explorer__open-registration-rules__title {
  margin-bottom: 10px;
  font-size: $font-size-14;
  font-weight: 700;
  color: $primary-font-color;
  line-height: 17px;
}

.explorer__open-registration-rules__item {
  display: flex;
  margin-bottom: 8px;
}

.explorer__open-registration-rules__item__dot {
  width: 8px;
  margin-right: 8px;
  color: $assist-font-color;
}

.explorer__open-registration-rules__item__high-brightness {
  color: $success-font-color;
  font-weight: 600;
}

.explorer_mobile {
  padding: 16px 16px 0 16px;
}

.explorer__add-to-calendar,
.explorer__twitter {
  color: $link-font-color;
  cursor: pointer;

  &:hover {
    color: $link-hover-font-color
  }
}
</style>
