<template>
  <div class="account-permission">
    <h3 class="account-permission__titile">
      <span>{{ $t('Permissions') }}</span>
      <span
        v-if="root && isOwner"
        class="account-permission__titile__action-button"
        :class="{ 'account-permission__titile__action-button__disabled': !canManage }"
        @click="onManage"
      >{{ $t('Manage') }}</span>
    </h3>
    <ul>
      <li class="account-permission__item">
        <span>{{ $t('Owner') }}</span>
        <span
          v-if="accountInfo.owner"
          class="account-permission__item__info"
        >
          <span
            v-if="isOwner"
            class="account-permission__item__label"
          >
            {{ $t('Me') }}
          </span>
          <span
            class="account-permission__item__link"
            @click="onCopyAddress(accountInfo.owner)"
          >
            {{ collapseString(accountInfo.owner, 5, 5) }}
            <Iconfont
              class="account-permission__item__icon"
              name="copy"
              size="14"
              color="#808191"
            />
          </span>
        </span>
        <span
          v-else
          class="account-permission__item__not-set"
        >
          {{ $t('No set up') }}
        </span>
      </li>
      <li class="account-permission__item">
        <span>{{ $t('Manager') }}</span>
        <span
          v-if="accountInfo.owner"
          class="account-permission__item__info"
        >
          <span
            v-if="isManager"
            class="account-permission__item__label"
          >
            {{ $t('Me') }}
          </span>
          <span
            class="account-permission__item__link"
            @click="onCopyAddress(accountInfo.manager)"
          >
            {{ collapseString(accountInfo.manager, 5, 5) }}
            <Iconfont
              class="account-permission__item__icon"
              name="copy"
              size="14"
              color="#808191"
            />
          </span>
        </span>
        <span
          v-else
          class="account-permission__item__not-set"
        >
          {{ $t('No set up') }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { IAccountInfo } from '~/services/Account'
import { collapseString, copyText } from '~/modules/tools'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import Iconfont from '~/components/icon/Iconfont.vue'
import { ACCOUNT_STATUS } from '~/constant'

export default Vue.extend({
  name: 'AccountPermission',
  components: {
    Iconfont
  },
  props: {
    accountInfo: {
      type: Object as PropType<IAccountInfo>,
      required: true
    },
    root: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    isOwner (): boolean {
      return !!this.accountInfo.owner && this.connectedAccount.address.toUpperCase() === this.accountInfo.owner.toUpperCase()
    },
    isManager (): boolean {
      return !!this.accountInfo.manager && this.connectedAccount.address.toUpperCase() === this.accountInfo.manager.toUpperCase()
    },
    canManage (): boolean {
      return ![ACCOUNT_STATUS.onePriceSell].includes(this.accountInfo.status)
    }
  },
  methods: {
    collapseString,
    onManage () {
      if (this.canManage) {
        this.$emit('manage')
      }
      else {
        this.$alert({
          title: this.$t('Tips'),
          message: this.$t('If a DAS account is on sale, it is in a special status and cannot be operated other than renewed and delisted.')
        })
      }
    },
    onCopyAddress (address: string) {
      copyText(address).then(() => {
        this.$toast('👌 ' + this.$t('Copied'))
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-permission {
  padding: 0 16px 14px 16px;
  border-radius: 16px;
  background: #FFFFFF;
}

.account-permission__titile {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 0;
  box-shadow: 0 1px 0 0 $container-border-color;
}

.account-permission__titile__action-button {
  font-size: 14px;
  font-weight: 400;
  color: $link-font-color;
  cursor: pointer;
}

.account-permission__titile__action-button__disabled {
  color: $third-font-color;
  cursor: default;
}

.account-permission__item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.account-permission__item__info {
  display: flex;
  align-items: center;
}

.account-permission__item__label {
  margin-right: 8px;
  padding: 1px 6px;
  border-radius: 4px;
  border: $container-border;
  font-size: 12px;
  font-weight: 600;
}

.account-permission__item__icon {
  margin-left: 2px;
}

.account-permission__item__link {
  display: flex;
}

.account-permission__item__not-set {
  color: $assist-font-color;
}
</style>
