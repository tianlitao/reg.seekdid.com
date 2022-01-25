<template>
  <div class="registration-info">
    <h3 class="registration-info__titile">
      <span>{{ $t('Registration Info') }}</span>
      <span
        v-if="root"
        class="registration-info__titile__action-button"
        @click="onRenewal"
      >{{ $t('Renew') }}</span>
    </h3>
    <ul>
      <li class="registration-info__item">
        <span>{{ $t('Registration time') }}</span>
        <span>{{ accountInfo.registered_at ? formatDateTime(accountInfo.registered_at) : '-' }}</span>
      </li>
      <li class="registration-info__item">
        <span>{{ $t('Expiry date') }}</span>
        <span>
          <span
            v-if="isExpired"
            class="registration-info__item__tag"
          >
            {{ $t('Expired') }}
          </span>
          <span>{{ accountInfo.expired_at ? formatDateTime(accountInfo.expired_at) : '-' }}</span>
        </span>
      </li>
      <li
        v-if="isExpired"
        class="registration-info__item registration-info__item_warn"
      >
        <span>{{ $t('Grace period to') }}</span>
        <span>{{ accountInfo.expired_at ? formatDateTime(accountInfo.expired_at + gracePeriod) : '-' }}</span>
      </li>
      <li class="registration-info__item">
        <span>{{ $t('Tx ID') }}</span>
        <span>
          <a
            class="registration-info__item__link"
            :href="`${CKB.explorerTrx}${accountInfo.confirm_proposal_hash}`"
            target="_blank"
          >
            {{ collapseString(accountInfo.confirm_proposal_hash, 4, 4) }}
          </a>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { IAccountInfo } from '~/services/Account'
import { collapseString, formatDateTime } from '~/modules/tools'
import { COMMON_KEYS } from '~/store/common'
import { CKB } from '~/constant/chain'

export default Vue.extend({
  name: 'RegistrationInfo',
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
      common: COMMON_KEYS.namespace
    }),
    gracePeriod (): number {
      if (this.common.config.account_expiration_grace_period) {
        return this.common.config.account_expiration_grace_period * 1000
      }
      return 0
    },
    isExpired (): boolean {
      if (this.accountInfo.expired_at) {
        return new Date().getTime() >= this.accountInfo.expired_at
      }
      return false
    }
  },
  data () {
    return {
      CKB
    }
  },
  methods: {
    formatDateTime,
    collapseString,
    onRenewal () {
      this.$emit('renewal')
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.registration-info {
  padding: 0 16px 14px 16px;
  border-radius: 16px;
  background: #FFFFFF;
}

.registration-info__titile {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 0;
  box-shadow: 0 1px 0 0 $container-border-color;
}

.registration-info__titile__action-button {
  font-size: 14px;
  font-weight: 400;
  color: $link-font-color;
  cursor: pointer;
}

.registration-info__item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.registration-info__item_warn {
  color: $error-font-color;
}

.registration-info__item__tag {
  margin-right: 6px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(223, 74, 70, 0.1);
  font-size: 12px;
  color: $error-font-color;
}

.registration-info__item__link {
  color: $link-font-color;
}
</style>
