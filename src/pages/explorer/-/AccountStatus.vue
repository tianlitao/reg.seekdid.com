<template>
  <li class="account-status">
    <div class="account-status__info">
      <span
        class="account-status__status-text"
        :class="{
          'account-status__registered': account.status === ACCOUNT_STATUS.registered,
          'account-status__registerable': [ACCOUNT_STATUS.registerable, ACCOUNT_STATUS.onePriceSell, ACCOUNT_STATUS.auctionSell].includes(account.status)
        }"
      >
        <Iconfont
          v-if="account.status === ACCOUNT_STATUS.registerable"
          class="account-status__registerable__icon"
          name="check-strong"
          color="#22C493"
          size="20"
        />
        {{ ACCOUNT_STATUS_LIST[account.status] ? $t(ACCOUNT_STATUS_LIST[account.status].statusText) : '-' }}
      </span>
      <span
        class="account-status__account-name"
        :class="{ 'account-status__account-name_small': account.account.length > 9 }"
      >
        {{ account.account }}
      </span>
    </div>
    <Button
      v-if="ACCOUNT_STATUS_LIST[account.status] && ACCOUNT_STATUS_LIST[account.status].href && ACCOUNT_STATUS_LIST[account.status].actionText"
      class="account-status__button"
      success
      @click="goPage(account)"
    >
      {{ $t(ACCOUNT_STATUS_LIST[account.status].actionText) }}
    </Button>
    <Button
      v-else-if="loading"
      :loading="loading"
      class="account-status__button"
      success
    />
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ACCOUNT_STATUS, ACCOUNT_STATUS_LIST } from '~/constant'
import { ISearchAccount } from '~/services/Explorer'
import Button from '~/components/Button.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import config from '~~/config'

export default Vue.extend({
  name: 'AccountStatus',
  components: {
    Iconfont,
    Button
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
      required: true
    },
    account: {
      type: Object as PropType<ISearchAccount>,
      required: true
    }
  },
  data () {
    return {
      ACCOUNT_STATUS,
      ACCOUNT_STATUS_LIST
    }
  },
  methods: {
    goPage (account: ISearchAccount) {
      if (account.status === ACCOUNT_STATUS.registered) {
        if (account.is_self) {
          this.$router.push(`/me/account/${account.account}`)
        }
        else {
          if (this.$i18n.locale === 'zh') {
            window.location.href = `https://${account.account}.host`
          }
          else {
            window.location.href = `https://${account.account}.cc`
          }
        }
      }
      else if (account.status === ACCOUNT_STATUS.onePriceSell) {
        window.location.href = `${config.didtop}/account/${account.account}`
      }
      else {
        this.$router.push(`${ACCOUNT_STATUS_LIST[account.status].href}${account.account}`)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-status {
  display: flex;
  justify-content: space-between;
  padding: 16px 8px 16px 16px;
  background: $assist-color;
  box-shadow: $container-outer-box-shadow;
  border-radius: 16px;
}

.account-status__info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.account-status__status-text {
  display: flex;
  align-items: center;
  height: 18px;
  font-size: 12px;
  font-weight: 600;
  color: $assist-font-color;
  line-height: 18px;
}

.account-status__registered {
  color: $warn-font-color;
}

.account-status__registerable {
  color: $success-font-color;
}

.account-status__registerable__icon {
  margin-right: 4px;
}

.account-status__account-name {
  height: 38px;
  font-size: 32px;
  font-weight: 600;
  color: $white;
  line-height: 38px;
  width: 218px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}

.account-status__account-name_small {
  font-size: 24px;
}

.account-status__button {
  padding: 0;
  width: 98px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
}
</style>
