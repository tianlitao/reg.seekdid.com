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
      <div class="registering-accounts__tips">{{ $tt('Automatically closed after 24 hours.') }}</div>
      <ul class="registering-accounts__list">
        <li
          v-for="account in registeringAccounts"
          :key="account.account"
          class="registering-accounts__list__item"
          @click="seeDetails(account.account)"
        >
          <div class="account-status__list__container">
            <div class="registering-accounts__list__info">
              <IconImage
                class="registering-accounts__list__logo"
                :url="`${IDENTICON_SERVE}${account.account}`"
                :alt="account.account"
                :size="28"
                rounded
              />
              <span>
                {{ account.account }}
              </span>
            </div>
            <Iconfont name="arrow-right" color="#E4E4E4" />
          </div>
          <div class="registering-accounts__list__status">
            <span class="registering-accounts__list__status-text">
              {{ $tt('Registering') }}
            </span>
          </div>
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

export default Vue.extend({
  name: 'RegisteringAccounts',
  components: {
    StatusTip,
    IconImage,
    Iconfont,
    Breadcrumb
  },
  layout: 'noBottomNav',
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
  margin-bottom: 12px;
  padding: 16px 16px 20px 16px;
  border: $container-border;
  border-radius: 16px;
  background: $white;
  box-shadow: 0px -1px 0px 0px $normal-color;
  cursor: pointer;

  &:hover {
    background: #F6F7F9;
  }
}

.account-status__list__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.registering-accounts__list__info {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: $primary-font-color;
  word-break: break-all;
}

.registering-accounts__list__logo {
  margin-right: 12px;
}

.registering-accounts__list__status {
  min-height: 17px;
}

.registering-accounts__list__status-text {
  margin-left: 38px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  color: $success-font-color;
  background: rgba(0, 223, 155, 0.1);
}

.registering-accounts__no-more {
  color: $assist-font-color;
  padding: 24px 0;
  text-align: center;
}

.registering-accounts__breadcrumb {
  padding: 16px 12px 4px 12px;
}

.registering-accounts__tips {
  display: flex;
  margin: 12px 12px 0 12px;
  padding: 10px 16px;
  background: #FCECEC;
  border-radius: 9px;
  line-height: 20px;
  color: #DE4A46;
}
</style>
