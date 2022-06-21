<template>
  <div class="registering-accounts">
    <Breadcrumb class="registering-accounts__breadcrumb" :items="breadcrumbItems" />
    <div v-if="fetchDataLoading" class="registering-accounts__loading">
      <StatusTip
        class="registering-accounts__loading__tip"
        icon="⏳"
        iconSize="72"
        :tip="$tt('Loading')"
        tipFontSize="14"
      />
    </div>
    <template v-else>
      <div class="registering-accounts__tips">
        <Iconfont
          class="registering-accounts__tips__icon"
          name="tips"
          size="16"
          color="#DE4A46"
        />
        {{ $tt('Automatically closed after 24 hours.') }}
      </div>
      <ul class="registering-accounts__list">
        <li
          v-for="account in registeringAccounts"
          :key="account.account"
          class="registering-accounts__list__item"
          @click="seeDetails(account.account)"
        >
          <div class="account-status__list__container">
            <IconImage
              class="registering-accounts__list__logo"
              :url="`${IDENTICON_SERVE}${account.account}`"
              :alt="account.account"
              :size="44"
              rounded
            />
            <div class="registering-accounts__list__info">
              <span>{{ toHashedStyle(account.account) }}</span>
              <div>
                <span class="registering-accounts__list__status-text">
                  <Iconfont
                    name="loading"
                    size="16"
                    color="#2EB67D"
                  />
                  {{ $tt('Registering') }}
                </span>
              </div>
            </div>
          </div>
          <Iconfont name="arrow-right" color="#11142D" />
        </li>
      </ul>
      <div class="registering-accounts__no-more">
        {{ $tt('No more') }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'
import { mapState } from 'vuex'
import StatusTip from '~/components/StatusTip.vue'
import { IAccountInfo } from '~/services/Account'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { IDENTICON_SERVE } from '~/constant'
import { ME_KEYS } from '~/store/me'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { toHashedStyle } from '~/modules/tools'

export default Vue.extend({
  name: 'RegisteringAccounts',
  components: {
    StatusTip,
    IconImage,
    Iconfont,
    Breadcrumb
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    registeringAccounts (): IAccountInfo[] {
      return this.me.registeringAccounts
    },
    breadcrumbItems (): any {
      return [{
        text: this.$tt('My'),
        href: '/me'
      }, {
        text: this.$tt('Registering accounts')
      }]
    }
  },
  data () {
    return {
      IDENTICON_SERVE,
      fetchDataLoading: false
    }
  },
  head (): { [key: string]: string | TranslateResult } {
    return {
      title: this.$tt('Registering accounts')
    }
  },
  mounted () {
    this.getRegisteringAccounts()
  },
  methods: {
    toHashedStyle,
    async getRegisteringAccounts () {
      if (this.registeringAccounts.length === 0) {
        this.fetchDataLoading = true
      }
      try {
        await this.$store.dispatch(ME_KEYS.fetchRegisteringAccounts)
      }
      catch (err) {
        console.error(err)
      }
      finally {
        this.fetchDataLoading = false
      }
    },
    seeDetails (accountName: string) {
      this.$router.push(`/account/register/status/${accountName}?from=registering-accounts`)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.registering-accounts {
  flex: 1;
}

.registering-accounts__loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.registering-accounts__loading__tip {
  font-weight: 600;
}

.registering-accounts__list {
  padding: 12px 12px 0 12px;
}

.registering-accounts__list__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 8px;
  height: 90px;
  background: #FFFFFF;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(182, 196, 217, 0.4);
  cursor: pointer;

  &:hover {
    background: #F7F9FA;
  }
}

.account-status__list__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: $primary-font-color;
  word-break: break-word;
  hyphens: auto;
  line-height: 21px;
}

.registering-accounts__list__info {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: 600;
  color: #11142D;
  word-break: break-word;
  hyphens: auto;
}

.registering-accounts__list__logo {
  margin-right: 12px;
}

.registering-accounts__list__status-text {
  display: inline-flex;
  align-items: center;
  margin-top: 4px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  color: $success-font-color;
  background: rgba(0, 223, 155, 0.1);

  svg {
    animation: rotate360DegAnimation 0.9s linear infinite;
  }
}

.registering-accounts__no-more {
  padding: 16px 0;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #636D85;
}

.registering-accounts__breadcrumb {
  padding: 16px 12px 4px 12px;
}

.registering-accounts__tips {
  margin: 12px 12px 0 12px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  height: 40px;
  background: #FCECEC;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #DE4A46;
}

.registering-accounts__tips__icon {
  margin-right: 6px;
}
</style>
