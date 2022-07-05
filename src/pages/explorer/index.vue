<template>
  <div
    class="explorer"
    :class="{
      'explorer_mobile': isMobile
    }"
  >
    <PublicBetaTips v-if="!config.isProdData" />
    <div class="explorer__lang-switcher">
      <LangSwitcher
        v-if="isMobile"
      />
    </div>
    <img class="explorer__logo" src="/images/explorer/das-logo.png" alt="logo">
    <div class="explorer__full-name">
      {{ $tt('slogan') }}
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
      @input="onInput"
      @search="onSearch"
    />
    <div
      v-if="showIncorrectAccountFormat"
      class="explorer__error-tip"
    >
      {{ $tt('Account names can only contain lowercase letters, numbers, partial Emoji and "-"') }}
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
      {{ registrableDate ? $tt('To be released at on-chain time: {date}.', { date: registrableDate }) : $tt('Try another one. This account is not open for registration yet.') }}
    </div>
    <div class="explorer__search_result">
      <ul
        v-if="searchResult.account"
        class="explorer__search_result__list"
      >
        <AccountStatus
          :account="searchResult"
          :loading="loading"
        />
      </ul>
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
<!--          <i18n-->
<!--            tag="span"-->
<!--            path="开放注册通知"-->
<!--            :i18nkey="$tt('开放注册通知')"-->
<!--          >-->
<!--            <span-->
<!--              slot="percentage"-->
<!--              class="explorer__open-registration-rules__item__high-brightness"-->
<!--            >60%</span>-->
<!--            <span-->
<!--              slot="date"-->
<!--              class="explorer__open-registration-rules__item__high-brightness"-->
<!--            >-->
<!--              {{ $tt('12:00 PM (UTC+0) on April 18th') }}-->
<!--            </span>-->
<!--          </i18n>-->
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
    <a
      v-if="!searchWord"
      class="explorer__faq"
      href="https://did.id"
      :target="isMobile ? '_self' : '_blank'"
    >
      {{ $tt('What is DAS?') }}
    </a>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { Buffer } from 'buffer'
import Vue from 'vue'
import debounce from 'lodash.debounce'
import { mapState, mapGetters } from 'vuex'
// @ts-ignore
import blake2b from 'blake2b'
import uts46 from 'idna-uts46-hx'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import LangSwitcher from '~/components/LangSwitcher.vue'
import ExplorerSearch from '~/pages/explorer/-/ExplorerSearch.vue'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX, CHAR_TYPE, DEBOUNCE_WAIT_TIME } from '~/constant'
import { ISearchAccount } from '~/services/Explorer'
import AccountStatus from '~/pages/explorer/-/AccountStatus.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { isMobile, splitAccount, toDottedStyle } from '~/modules/tools'
import { COMMON_KEYS } from '~/store/common'
import { IConfig } from '~/services/Common'
import PublicBetaTips from '~/components/PublicBetaTips.vue'
import config from '~~/config'
import errno from '~/constant/errno'
import { LANGUAGE } from '~/constant/language'

dayjs.extend(utc)

export default Vue.extend({
  name: 'Explorer',
  components: {
    LangSwitcher,
    ExplorerSearch,
    AccountStatus,
    PublicBetaTips
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
      fetchConfigTimer: 0
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
      this.searchWord = (_searchWord as string)
      this.onInput()
      this.onSearch(this.searchWord)
    }
  },
  beforeDestroy () {
    clearInterval(this.fetchConfigTimer)
  },
  methods: {
    checkSearchWord (value: string, isSubAccount?: boolean) {
      try {
        value = uts46.toAscii(value, { useStd3ASCII: true, transitional: false, verifyDnsLength: false })
        value = uts46.toUnicode(value, { useStd3ASCII: true })
      }
      catch (err) {
        this.showIncorrectAccountFormat = true
      }

      const splitArr = splitAccount(value)
      const nonComplianceChar = splitArr.find((item: { char_set_name: number, char: string }) => {
        return item.char_set_name === CHAR_TYPE.notKnown
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
      try {
        let _searchWord = this.searchWord.toLowerCase()
        _searchWord = uts46.toAscii(_searchWord, { useStd3ASCII: true, transitional: false, verifyDnsLength: false })
        this.searchWord = uts46.toUnicode(_searchWord, { useStd3ASCII: true })
      }
      catch (err) {
        this.searchWord = this.searchWord.toLowerCase()
      }
    },
    onSearch: debounce(async function (this: any, value: string) {
      value = value.replace(/\s+/g, '')
      value = value.toLowerCase()
      this.searchWord = value
      value = value.replace(/\.bit$/, '')
      value = value + ACCOUNT_SUFFIX
      value = toDottedStyle(value)
      value = value.replace(/\.bit$/, '')

      this.searchResult = {}
      this.showIllegalStringLength = false
      this.showIncorrectAccountFormat = false
      this.notOpenForRegistrationShowing = false
      this.registrableDate = ''

      if (!value) {
        return
      }

      this.$gtag('event', 'click', {
        event_category: 'explorer',
        event_label: 'search account',
        value: 1
      })

      const accountList = value.split('.')

      if (accountList[0]) {
        this.checkSearchWord(accountList[0], accountList.length === 2)
      }
      if (accountList[1]) {
        this.checkSearchWord(accountList[1])
      }

      if (this.showIncorrectAccountFormat || this.showIllegalStringLength) {
        return
      }

      this.loading = true
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
            const buf = Buffer.from(value + ACCOUNT_SUFFIX)
            const personal = Buffer.from('2021-07-22 12:00')
            const hasher = blake2b(32, null, null, personal)
            hasher.update(buf)
            const hash = hasher.digest('binary') as Uint8Array
            const first4Bytes = Buffer.from(hash.slice(0, 4)) as Buffer
            const luckyNum = first4Bytes.readUInt32BE(0)

            if (luckyNum <= 1717986918) {
              this.registrableDate = '2022–03–21 12:00PM (UTC+0)'
            }
            else if (luckyNum <= 1932735282) {
              this.registrableDate = '2022–03–28 12:00PM (UTC+0)'
            }
            else if (luckyNum <= 2147483647) {
              this.registrableDate = '2022–04–04 12:00PM (UTC+0)'
            }
            else if (luckyNum <= 2362232012) {
              this.registrableDate = '2022–04–11 12:00PM (UTC+0)'
            }
            else if (luckyNum <= 2576980377) {
              this.registrableDate = '2022–04–18 12:00PM (UTC+0)'
            }
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
    }, DEBOUNCE_WAIT_TIME)
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
  display: flex;
  justify-content: flex-end;
  min-height: 32px;
  text-align: right;
}

.explorer__logo {
  width: 116px;
  min-height: 44px;
  margin-top: 24px;
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
  font-size: 12px;
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
}

.explorer__search_result__list {
  position: absolute;
  width: 100%;
  margin-top: 12px;
  margin-bottom: 20px;
}

.explorer__faq {
  position: absolute;
  bottom: 5%;
  transform: translateX(-50%);
  color: $assist-font-color;

  &:hover {
    color: $link-font-color
  }
}

.explorer__current-on-chain-time {
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: #10152D;
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
  font-size: 14px;
  font-weight: 400;
  color: #10152D;
  line-height: 17px;
  background: rgba(217, 248, 228, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(143, 225, 166, 0.2);
}

.explorer__open-registration-rules__title {
  margin-bottom: 10px;
  font-size: 14px;
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
  color: #636D85;
}

.explorer__open-registration-rules__item__high-brightness {
  color: #22C493;
  font-weight: 600;
}

.explorer_mobile {
  padding: 16px 16px 0 16px;
}
</style>
