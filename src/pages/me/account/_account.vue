<template>
  <div class="account-info">
    <Breadcrumb class="account-info__breadcrumb" :items="breadcrumbItems" />
    <AccountStatusCard
      :accountInfo="accountInfo"
      root
      @renewal="onRenewal"
    />
    <AccountPermission
      class="account-info__permission"
      :accountInfo="accountInfo"
      root
      @manage="onManagePermission"
    />
    <ParsingRecords
      class="account-info__parsing-records"
      root
      :accountInfo="accountInfo"
      @manage="onManageParsingRecords"
    />
    <RegistrationInfo
      class="account-info__registration-info"
      root
      :accountInfo="accountInfo"
      @renewal="onRenewal"
    />
    <RenewalBottomSheet
      v-model="renewalShowing"
      :accountInfo="accountInfo"
    />
    <ManagePermissionBottomSheet
      v-model="managePermissionShowing"
      :accountInfo="accountInfo"
    />
    <Dialog
      :showing="registrarShowing"
      :title="$t('Select a registrar')"
      closeButton
      @close="onCloseRegistrar"
    >
      <span
        class="account-info__registrar"
        @click="goRegistrar(`https://app.gogodas.com/me?account=${accountName}&action=renew`)"
      >
        <div class="account-info__registrar-info">
          <img class="account-info__registrar-info__logo" src="/images/me/gogodas-logo.svg">
          <div>
            <h1 class="account-info__registrar-info__title">GOGO DAS</h1>
            <div class="account-info__registrar-info__desc">{{ $t('Supports ETH, TRX, CKB, BNB, MATIC payments') }}</div>
          </div>
        </div>
        <Iconfont name="arrow-right" color="#11142D" />
      </span>
      <span
        class="account-info__registrar"
        @click="onOfficialChannels"
      >
        <div class="account-info__registrar-info">
          <img class="account-info__registrar-info__logo" src="/icon.png">
          <div>
            <h1 class="account-info__registrar-info__title">.bit</h1>
            <div class="account-info__registrar-info__desc">{{ $t('Supports ETH, TRX, CKB, BNB, MATIC payments') }}</div>
          </div>
        </div>
        <Iconfont name="arrow-right" color="#11142D" />
      </span>
      <div
        class="account-info__registrar__official-channels"
        @click="onOfficialChannels"
      >
        {{ $t('Alternative Registration Channels') }} →
      </div>
      <span slot="action" />
    </Dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import ManagePermissionBottomSheet from '~/pages/me/-/ManagePermissionBottomSheet.vue'
import Dialog from '~/components/Dialog.vue'
import AccountStatusCard from '~/components/cards/AccountStatusCard.vue'
import AccountPermission from '~/pages/explorer/-/AccountPermission.vue'
import ParsingRecords from '~/pages/explorer/-/ParsingRecords.vue'
import RegistrationInfo from '~/pages/explorer/-/RegistrationInfo.vue'
import RenewalBottomSheet from '~/pages/me/-/RenewalBottomSheet.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { COMMON_KEYS } from '~/store/common'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { IAccountInfo } from '~/services/Account'

export default Vue.extend({
  name: 'AccountInfo',
  components: {
    Iconfont,
    Dialog,
    AccountStatusCard,
    AccountPermission,
    ParsingRecords,
    RegistrationInfo,
    RenewalBottomSheet,
    ManagePermissionBottomSheet,
    Breadcrumb
  },
  layout: 'noBottomNav',
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    breadcrumbItems (): any {
      return [{
        text: this.$t('My'),
        href: '/me'
      }, {
        text: this.$t('Account details')
      }]
    }
  },
  data () {
    return {
      accountName: this.$route.params.account,
      accountInfo: {
        account: this.$route.params.account
      } as IAccountInfo,
      renewalShowing: false,
      registrarShowing: false,
      managePermissionShowing: false
    }
  },
  head (): { [key: string]: string } {
    return {
      title: this.accountName
    }
  },
  mounted () {
    this.$store.dispatch(COMMON_KEYS.fetchConfig)
    this.getAccountInfo()
  },
  methods: {
    async getAccountInfo () {
      try {
        this.accountInfo = await this.$services.account.accountInfo(this.accountName)
        if (this.accountInfo.owner.toUpperCase() !== this.connectedAccount.address.toUpperCase() && this.accountInfo.manager.toUpperCase() !== this.connectedAccount.address.toUpperCase()) {
          this.$router.replace(`/explorer/account/${this.accountName}`)
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    onRenewal () {
      // this.$alert({
      //   title: this.$t('Tips'),
      //   message: this.$t('Account management function under maintenance')
      // })
      this.registrarShowing = true
    },
    onOfficialChannels () {
      this.onCloseRegistrar()
      this.renewalShowing = true
    },
    onManagePermission () {
      // this.$alert({
      //   title: this.$t('Tips'),
      //   message: this.$t('Account management function under maintenance')
      // })
      this.managePermissionShowing = true
    },
    onManageParsingRecords () {
      // this.$alert({
      //   title: this.$t('Tips'),
      //   message: this.$t('Account management function under maintenance')
      // })
      this.$router.push(`/me/account/parsing-records/${this.accountName}`)
    },
    onCloseRegistrar () {
      this.registrarShowing = false
    },
    goRegistrar (href: string) {
      window.location.href = href
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-info {
  flex: 1;
  padding: 12px 12px 48px 12px;
  background: #F7F8F9;
}

.account-info__permission,
.account-info__parsing-records,
.account-info__registration-info {
  margin-top: 12px;
}

.account-info__registrar {
  margin: 20px 0;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90px;
  border: $container-border;
  border-radius: 16px;
  color: $primary-font-color;
  cursor: pointer;
}

.account-info__registrar-info {
  display: flex;
  align-items: center;
}

.account-info__registrar-info__logo {
  width: 38px;
  padding-right: 12px;
}

.account-info__registrar-info__title {
  margin: 0;
  font-size: 18px;
  line-height: 25px;
  font-weight: 600;
}

.account-info__registrar-info__desc {
  padding-top: 4px;
  color: $assist-font-color;
}

.account-info__registrar__official-channels {
  display: flex;
  justify-content: center;
  padding-top: 12px;
  color: $primary-font-color;
  cursor: pointer;
}

.account-info__breadcrumb {
  padding: 4px 0 16px 0;
}
</style>
