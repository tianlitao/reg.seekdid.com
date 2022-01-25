<template>
  <div class="reverse">
    <Breadcrumb class="reverse__breadcrumb" :items="breadcrumbItems" />
    <LoginStatusCard
      class="reverse__login-status-card"
      :hideReverseRecordSetting="true"
    />
    <div
      class="reverse__container"
      :class="{ 'reverse__container__ineffective': isIneffective }"
    >
      <img
        class="reverse__container__background-image"
        :src="isIneffective ? '/images/reverse/das-reverse-container-ineffective-bg.png' : '/images/reverse/das-reverse-container-bg.svg'"
      >
      <div
        class="reverse__container__content"
        :class="{ 'reverse__container__ineffective-content': isIneffective }"
      >
        <Iconfont v-if="isIneffective" name="warning" size="44" color="#F15151" />
        <div
          v-if="dasReverse.account"
          class="reverse__container__text-opacity"
        >
          {{ $t('The reverse record of your address') }}
        </div>
        <div
          v-else
          class="reverse__container__text-opacity"
        >
          {{ $t('Your address') }}
        </div>
        <div
          class="reverse__container__address"
          :class="{ 'reverse__container__address__ineffective': isIneffective }"
        >
          {{ connectedAccount.address }}
        </div>
        <div
          v-if="dasReverse.account"
          class="reverse__container__text-opacity"
        >
          {{ $t('is') }}
        </div>
        <div
          v-else
          class="reverse__container__text-opacity"
        >
          {{ $t("doesn't have any reverse record") }}
        </div>
        <div
          v-if="dasReverse.account"
          class="reverse__container__account"
          :class="{ 'reverse__container__account__ineffective': isIneffective }"
          :style="{
            'font-size': `${accountFontSize}px`
          }"
        >
          {{ dasReverse.account }}
        </div>
        <div
          v-if="isIneffective"
          class="reverse__container__ineffective__faq"
        >
          {{ $t('Invalid now.') }}
          <span
            class="reverse__container__ineffective__faq-link"
            @click="openIneffectiveFaqDialog"
          >{{ $t('Check reasons and reset') }}</span>
        </div>
      </div>
      <div class="reverse__action">
        <span
          v-if="trxPending"
          class="reverse__action__button reverse__action__button__pending"
        >
          <span class="reverse__action__button__pending__icon">
            <Iconfont name="loading" color="#11142D" />
          </span>
        </span>
        <div v-else-if="dasReverse.account">
          <div>
            <span
              class="reverse__action__button"
              @click="editDasReverse"
            >
              {{ $t('Edit') }}
            </span>
          </div>
          <div>
            <span
              class="reverse__action__button__delete"
              @click="deleteDasReverse"
            >
              {{ $t('Delete') }}
            </span>
          </div>
        </div>
        <span
          v-else
          class="reverse__action__button"
          @click="setDasReverse"
        >
          {{ $t('Set Now') }}
        </span>
      </div>
    </div>
    <a
      class="reverse__action__faq"
      :href="$i18n.locale === 'zh' ? 'https://talk.da.systems/t/topic/229/4' : 'https://talk.da.systems/t/reverse-resolution-comes/232'"
    >
      <span class="reverse__action__faq__text">
        <span class="reverse__action__faq__icon">📖</span>
        {{ $t('About reverse resolution & FAQ') }}
      </span>
      <Iconfont
        :size="24"
        name="arrow-right"
        color="#D0D0D5"
      />
    </a>
    <div class="reverse__tips">
      <h2 class="reverse__tips__title">
        {{ $t('Benefits of setting the reverse record') }}
      </h2>
      <img
        class="reverse__tips__image"
        src="/images/reverse/das-reverse-tips.png"
      >
      <div class="reverse__tips__text">
        {{ $t("Once it's set, your Apps will display DAS account name wherever it currently displays addresses. For example, when you log in the DApp, it will show your DAS account name as if it is your username.") }}
        <a
          class="reverse__tips__link"
          href="https://da.systems/reverse-record"
        >
          {{ $t('Learn more') }}
        </a>
      </div>
    </div>
    <Dialog
      :showing="ineffectiveFaqDialogShowing"
      :title="$t('Tips')"
      closeButton
      @close="closeIneffectiveFaqDialog"
    >
      <div>{{ $t('The reverse record is valid only if any of the following conditions is met.') }}</div>
      <div class="reverse__ineffective-faq__rule">
        <span>1.</span>
        <span>{{ $t('Your address is the Owner/Manager of {account};', { account: dasReverse.account }) }}</span>
      </div>
      <div class="reverse__ineffective-faq__rule">
        <span>2.</span>
        <span>{{ $t('Your address is in the record of {account}.', { account: dasReverse.account }) }}</span>
      </div>
      <a
        class="reverse__ineffective-faq__link"
        :href="$i18n.locale === 'zh' ? 'https://talk.da.systems/t/topic/229#h-8' : 'https://talk.da.systems/t/reverse-resolution-comes/232#reasons-for-failure-8'"
      >
        {{ $t('Learn more') }}
      </a>
      <span slot="action" />
    </Dialog>
    <TxPendingDialog v-model="trxPendingDialogShowing" />
    <SetDasReverseDialog
      v-model="setDasReverseDialogShowing"
      @trxSubmitted="onTrxSubmitted"
    />
    <EditDasReverseDialog
      v-model="editDasReverseDialogShowing"
      @trxSubmitted="onTrxSubmitted"
    />
    <DeleteDasReverseDialog
      v-model="deleteDasReverseDialogShowing"
      @trxSubmitted="onTrxSubmitted"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { IReverseLatestRes } from '~/services/DasReverse'
import Iconfont from '~/components/icon/Iconfont.vue'
import Dialog from '~/components/Dialog.vue'
import TxPendingDialog from '~/pages/reverse/-/TxPendingDialog.vue'
import { REVERSE_KEYS } from '~/store/reverse'
import SetDasReverseDialog from '~/pages/reverse/-/SetDasReverseDialog.vue'
import EditDasReverseDialog from '~/pages/reverse/-/EditDasReverseDialog.vue'
import DeleteDasReverseDialog from '~/pages/reverse/-/DeleteDasReverseDialog.vue'
import LoginStatusCard from '~/components/cards/LoginStatusCard.vue'
import { CYCLE_CALL_FUNCTION_TIME, ORDER_ACTION_TYPE, TRX_STATUS } from '~/constant'
import errno from '~/constant/errno'
import { COMMON_KEYS } from '~/store/common'

export default Vue.extend({
  name: 'Reverse',
  components: {
    Iconfont,
    Breadcrumb,
    Dialog,
    TxPendingDialog,
    SetDasReverseDialog,
    EditDasReverseDialog,
    DeleteDasReverseDialog,
    LoginStatusCard
  },
  layout: 'noBottomNav',
  data () {
    return {
      searchWord: '',
      trxPending: false,
      ineffectiveFaqDialogShowing: false,
      trxPendingDialogShowing: false,
      setDasReverseDialogShowing: false,
      editDasReverseDialogShowing: false,
      deleteDasReverseDialogShowing: false,
      checkOrderStatusTimer: 0
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace,
      reverse: REVERSE_KEYS.namespace
    }),
    ...mapGetters({
      computedChainId: ME_KEYS.computedChainId,
      computedEvmChainId: ME_KEYS.computedEvmChainId
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    dasReverse (): IReverseLatestRes {
      return this.reverse.dasReverse
    },
    accountFontSize (): number {
      const _account = this.dasReverse.account
      if (!_account) {
        return 55
      }
      else if (_account.length > 36) {
        return 22
      }
      else if (_account.length > 22) {
        return 28
      }
      else if (_account.length > 12) {
        return 33
      }
      else {
        return 55
      }
    },
    isIneffective (): boolean {
      return !!this.dasReverse.account && !this.dasReverse.is_valid
    },
    breadcrumbItems (): any {
      return [{
        text: this.$t('My'),
        href: '/me'
      }, {
        text: this.$t('Reverse record')
      }]
    }
  },
  mounted () {
    this.$store.dispatch(REVERSE_KEYS.fetchDasReverse)
    this.$store.dispatch(REVERSE_KEYS.fetchAccountList)
    this.$store.dispatch(COMMON_KEYS.fetchConfig)
    this.trxPending = true
    this.checkOrderStatus()
  },
  beforeDestroy () {
    clearTimeout(this.checkOrderStatusTimer)
  },
  methods: {
    openIneffectiveFaqDialog () {
      this.ineffectiveFaqDialogShowing = true
    },
    closeIneffectiveFaqDialog () {
      this.ineffectiveFaqDialogShowing = false
    },
    setDasReverse () {
      this.setDasReverseDialogShowing = true
    },
    editDasReverse () {
      this.editDasReverseDialogShowing = true
    },
    deleteDasReverse () {
      this.deleteDasReverseDialogShowing = true
    },
    onTrxSubmitted (action: string | number) {
      this.trxPendingDialogShowing = true
      this.trxPending = true
      this.checkOrderStatus(action)
    },
    async checkOrderStatus (action?: string | number) {
      try {
        const res = await this.$services.account.trxStatus({
          evm_chain_id: this.computedEvmChainId,
          chain_type: this.computedChainId,
          address: this.connectedAccount.address,
          actions: action ? [action] : [ORDER_ACTION_TYPE.setDasReverse, ORDER_ACTION_TYPE.editDasReverse]
        })
        if (res && res.status === TRX_STATUS.pending) {
          this.checkOrderStatusTimer = window.setTimeout(() => {
            this.checkOrderStatus(action)
          }, CYCLE_CALL_FUNCTION_TIME * 2)
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.apiErrorCodeNotExitsTrx) {
          this.trxPending = false
          if (action) {
            this.$store.dispatch(REVERSE_KEYS.fetchDasReverse)
            this.$toast('👌 ' + this.$t('Succeeded'))
          }
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.reverse {
  flex: 1;
  padding: 12px 12px 48px 12px;
  background: $white;
}

.reverse__breadcrumb {
  padding: 4px 0 16px 0;
}

.reverse__container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 462px;
  overflow: hidden;
  background: #94E1C0;
  border-radius: 16px;
  border: 1px solid rgba(53, 199, 144, 0.2);
  text-align: center;
  font-size: 16px;
  color: #167B58;
}

.reverse__container__ineffective {
  color: #F15151;
  background: rgba(242, 198, 198, 0.58);
  border-radius: 16px;
  border: 1px solid rgba(255, 105, 105, 0.07);
}

.reverse__container__address {
  padding: 16px 80px 18px 80px;
  word-break: break-all;
  font-size: 16px;
  font-weight: bold;
  color: #167B58;
  line-height: 16px;
  font-family: $monospace-font-family;
}

.reverse__container__address__ineffective {
  color: #F15151;
}

.reverse__container__background-image {
  width: 100%;
  position: absolute;
  top: 0;
}

.reverse__container__content {
  margin-top: 140px;
  z-index: 1;
}

.reverse__container__ineffective-content {
  margin-top: 90px;
}

.reverse__action {
  margin-bottom: 22px;
}

.reverse__action__button {
  display: inline-block;
  margin-bottom: 8px;
  padding: 10px 30px;
  width: 150px;
  background: $white;
  border-radius: 23px;
  font-size: 18px;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 25px;
  cursor: pointer;
}

.reverse__action__button__delete {
  display: inline-block;
  padding: 10px 30px;
  border-radius: 23px;
  font-size: 18px;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 25px;
  cursor: pointer;
}

.reverse__action__button__pending {
  opacity: 0.5;
  cursor: no-drop;
}

.reverse__action__button__pending__icon {
  svg {
    animation: rotate360DegAnimation 0.9s linear infinite;
  }
}

.reverse__tips {
  padding: 16px 16px 20px 16px;
  border-radius: 16px;
  border: $container-border;
}

.reverse__tips__title {
  margin-bottom: 18px;
  font-size: 18px;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 21px;
}

.reverse__tips__image {
  width: 100%;
}

.reverse__tips__text {
  margin-top: 18px;
  font-size: 14px;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 20px;
}

.reverse__tips__link {
  color: $link-font-color;
}

.reverse__container__account {
  margin: 16px 16px 38px 16px;
  font-weight: 700;
  color: #167B58;
  word-break: break-all;
}

.reverse__container__account__ineffective {
  color: #F15151;
}

.reverse__container__text-opacity {
  opacity: 0.7;
}

.reverse__container__ineffective__faq {
  margin-bottom: 34px;
}

.reverse__container__ineffective__faq-link {
  font-size: 16px;
  font-weight: 600;
  color: #F15151;
  line-height: 19px;
  text-decoration: underline;
  cursor: pointer;
}

.reverse__ineffective-faq__link {
  display: block;
  margin-top: 10px;
  font-weight: 600;
  line-height: 20px;
  color: $link-font-color;
}

.reverse__ineffective-faq__rule {
  margin-top: 8px;
  display: inline-grid;
  grid-auto-flow: column;
  grid-column-gap: 2px;
  grid-template-columns: 14px auto;
  font-weight: 600;
  word-break: break-word;
}

.reverse__login-status-card {
  margin-bottom: 20px;
}

.reverse__action__faq {
  padding: 0 16px;
  margin: 30px 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65px;
  background: $white;
  font-weight: 600;
  border-radius: 16px;
  border: $container-border;
  font-size: 18px;
  color: $primary-font-color;
}

.reverse__action__faq__text {
  display: flex;
  align-items: center;
}

.reverse__action__faq__icon {
  margin-top: 2px;
  margin-right: 8px;
  font-family: AppleColorEmoji;
  font-size: 22px;
}
</style>
