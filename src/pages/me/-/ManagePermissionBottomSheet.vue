<template>
  <div>
    <BottomSheet
      :showing="selectModificationShowing"
      :title="$t('Modify Permissions')"
      @close="onClose"
    >
      <div class="manage-permission-bottom-sheet__warn">
        {{ $t('A change of permission means transferring ownership or management of this account to another person. Please proceed with caution!') }}
      </div>
      <ul class="manage-permission-bottom-sheet__permissions">
        <li
          class="manage-permission-bottom-sheet__permissions__item manage-permission-bottom-sheet__owner"
          @click="modifyOwner"
        >
          <span class="manage-permission-bottom-sheet__permissions__item-header">
            <span class="manage-permission-bottom-sheet__permissions__logo">👨🏻‍💻</span>
            <span>
              <h2 class="manage-permission-bottom-sheet__permissions__title">{{ $t('Modify Owner') }}</h2>
              <span class="manage-permission-bottom-sheet__permissions__desc">{{ $t('You will lose control of your account permanently') }}</span>
            </span>
          </span>
          <span>
            <Iconfont name="arrow-right" color="#FFFFFF" />
          </span>
        </li>
        <li
          class="manage-permission-bottom-sheet__permissions__item manage-permission-bottom-sheet__manager"
          @click="modifyManager"
        >
          <span class="manage-permission-bottom-sheet__permissions__item-header">
            <span class="manage-permission-bottom-sheet__permissions__logo">🤵🏻</span>
            <span>
              <h2 class="manage-permission-bottom-sheet__permissions__title">{{ $t('Modify Manager') }}</h2>
              <span class="manage-permission-bottom-sheet__permissions__desc">{{ $t('Management rights will be transferred to someone else (you will still have Owner rights)') }}</span>
            </span>
          </span>
          <span>
            <Iconfont name="arrow-right" color="#FFFFFF" />
          </span>
        </li>
      </ul>
    </BottomSheet>
    <!--  Modify Owner  -->
    <BottomSheet
      :showing="modifyOwnerShowing"
      :title="$t('Modify Owner')"
      @close="onClose"
    >
      <ValidationObserver
        ref="modifyOwnerNextForm"
        tag="form"
        @submit.prevent="modifyOwnerNext"
      >
        <div class="manage-permission-bottom-sheet__warn">
          {{ $t('You are modifying the Owner rights of {accountName}, after that you will lose control of this account permanently. Please proceed with caution!', { accountName: accountInfo.account }) }}
        </div>
        <div class="manage-permission-bottom-sheet__tips">
          <span>*</span>
          <span>
            {{ $t('It is not recommended to use hardware wallets. You may not be able to use DAS normally.') }}
            <a
              class="manage-permission-bottom-sheet__tips__link"
              :href="$i18n.locale === 'zh' ? 'https://talk.da.systems/t/bestdas-com/115#heading-30' : 'https://talk.da.systems/t/faq-bestdas-com/116#why-is-it-not-recommended-to-use-a-hardware-wallet-30'"
              target="_self"
            >
              {{ $t('Why?') }}
            </a>
          </span>
        </div>
        <div class="manage-permission-bottom-sheet__modify">
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $t('From {chain} address', { chain: accountInfo.owner_chain_type && CHAINID_TO_CHAIN[accountInfo.owner_chain_type].symbol }) }}
          </label>
          <a
            v-if="accountInfo.owner_chain_type"
            class="manage-permission-bottom-sheet__link"
            :href="`${CHAINID_TO_CHAIN[accountInfo.owner_chain_type].explorerAddress}${accountInfo.owner}`"
            target="_blank"
          >
            {{ accountInfo.owner }}
          </a>
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $t('Change to') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Main Chain')"
            rules="selectRequired"
          >
            <Select
              v-model="newOwner.chain"
              :options="chainOptions"
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $t('Address') }}
          </label>
          <AccountInput
            :chain="CHAINID_TO_CHAIN[newOwner.chain]"
            :name="$t('Address')"
            :placeholder="$t('DAS account or {symbol} address', { symbol: CHAINID_TO_CHAIN[newOwner.chain].symbol })"
            top
            @input="onInputNewOwnerAddress"
          />
        </div>
        <Button
          class="manage-permission-bottom-sheet__button"
          type="submit"
          block
          success
        >
          {{ $t('Next') }}
        </Button>
      </ValidationObserver>
    </BottomSheet>
    <BottomSheet
      :showing="modifyOwnerConfirmShowing"
      :title="$t('Confirm the change?')"
      @close="onClose"
    >
      <div class="manage-permission-bottom-sheet__warn">
        {{ $t('After the modification, the ownership of {account} is completely transferred to someone else and you will lose control of {account} permanently.', { account: accountInfo.account }) }}
      </div>
      <div class="manage-permission-bottom-sheet__confirm">
        <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-16">
          {{ $t('From {chain} address', { chain: accountInfo.owner_chain_type && CHAINID_TO_CHAIN[accountInfo.owner_chain_type].symbol }) }}
        </label>
        <a
          v-if="accountInfo.owner_chain_type"
          class="manage-permission-bottom-sheet__link manage-permission-bottom-sheet__margin-bottom-16"
          :href="`${CHAINID_TO_CHAIN[accountInfo.owner_chain_type].explorerAddress}${accountInfo.owner}`"
          target="_blank"
        >
          {{ accountInfo.owner }}
        </a>
        <label class="manage-permission-bottom-sheet__label">
          {{ $t('Change to {chain} address', { chain: CHAINID_TO_CHAIN[newOwner.chain].symbol }) }}
        </label>
        <a
          v-if="newOwner.chain"
          class="manage-permission-bottom-sheet__link manage-permission-bottom-sheet__warn"
          :href="`${CHAINID_TO_CHAIN[newOwner.chain].explorerAddress}${newOwner.address}`"
          target="_blank"
        >
          {{ newOwner.address }}
        </a>
      </div>
      <div class="manage-permission-bottom-sheet__second-confirmation">
        <Checkbox
          v-model="modifyOwnerSecondConfirmation"
        >
          {{ $t("I'm aware of the risks") }}
        </Checkbox>
      </div>
      <WalletConnectTips />
      <Button
        class="manage-permission-bottom-sheet__button"
        :loading="modifyOwnerConfirmLoading"
        :disabled="!modifyOwnerSecondConfirmation"
        block
        success
        @click="modifyOwnerConfirm"
      >
        {{ $t('Confirmation') }}
      </Button>
    </BottomSheet>
    <!--  Modify Manager  -->
    <BottomSheet
      :showing="modifyManagerShowing"
      :title="$t('Modify Manager')"
      @close="onClose"
    >
      <ValidationObserver
        ref="modifyManagerNextForm"
        tag="form"
        @submit.prevent="modifyManagerNext"
      >
        <div class="manage-permission-bottom-sheet__modify">
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $t('From {chain} address', { chain: accountInfo.manager_chain_type && CHAINID_TO_CHAIN[accountInfo.manager_chain_type].symbol }) }}
          </label>
          <a
            v-if="accountInfo.manager_chain_type"
            class="manage-permission-bottom-sheet__link"
            :href="`${CHAINID_TO_CHAIN[accountInfo.manager_chain_type].explorerAddress}${accountInfo.manager}`"
            target="_blank"
          >
            {{ accountInfo.manager }}
          </a>
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $t('Change to') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Main Chain')"
            rules="selectRequired"
          >
            <Select
              v-model="newManager.chain"
              :options="chainOptions"
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $t('Address') }}
          </label>
          <AccountInput
            :chain="CHAINID_TO_CHAIN[newManager.chain]"
            :name="$t('Address')"
            :placeholder="$t('DAS account or {symbol} address', { symbol: CHAINID_TO_CHAIN[newManager.chain].symbol })"
            @input="onInputNewManagerAddress"
          />
        </div>
        <Button
          class="manage-permission-bottom-sheet__button"
          type="submit"
          block
          success
        >
          {{ $t('Next') }}
        </Button>
      </ValidationObserver>
    </BottomSheet>
    <BottomSheet
      :showing="modifyManagerConfirmShowing"
      :title="$t('Confirm the change?')"
      @close="onClose"
    >
      <div class="manage-permission-bottom-sheet__warn">
        {{ $t('After the change, the management of this account will be transferred to someone else. You will still have Owner rights.') }}
      </div>
      <div class="manage-permission-bottom-sheet__confirm">
        <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-16">
          {{ $t('From {chain} address', { chain: accountInfo.manager_chain_type && CHAINID_TO_CHAIN[accountInfo.manager_chain_type].symbol }) }}
        </label>
        <a
          v-if="accountInfo.manager_chain_type"
          class="manage-permission-bottom-sheet__link manage-permission-bottom-sheet__margin-bottom-16"
          :href="`${CHAINID_TO_CHAIN[accountInfo.manager_chain_type].explorerAddress}${accountInfo.manager}`"
          target="_blank"
        >
          {{ accountInfo.manager }}
        </a>
        <label class="manage-permission-bottom-sheet__label">
          {{ $t('Change to {chain} address', { chain: CHAINID_TO_CHAIN[newManager.chain].symbol }) }}
        </label>
        <a
          v-if="newManager.chain"
          class="manage-permission-bottom-sheet__link manage-permission-bottom-sheet__warn"
          :href="`${CHAINID_TO_CHAIN[newManager.chain].explorerAddress}${newManager.address}`"
          target="_blank"
        >
          {{ newManager.address }}
        </a>
      </div>
      <div class="manage-permission-bottom-sheet__second-confirmation">
        <Checkbox
          v-model="modifyManagerSecondConfirmation"
        >
          {{ $t("I'm aware of the risks") }}
        </Checkbox>
      </div>
      <WalletConnectTips />
      <Button
        class="manage-permission-bottom-sheet__button"
        :loading="modifyManagerConfirmLoading"
        :disabled="!modifyManagerSecondConfirmation"
        block
        success
        @click="modifyManagerConfirm"
      >
        {{ $t('Confirmation') }}
      </Button>
    </BottomSheet>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { validate, ValidationObserver, ValidationProvider } from 'vee-validate'
import { IAccountInfo } from '~/services/Account'
import {
  BSC,
  CHAINID_TO_CHAIN,
  ETH,
  LOCK_SCRIPT_TYPE, NEW_LOCK_SCRIPT_TYPE,
  Polygon,
  TRON
} from '~/constant/chain'
import AccountInput from '~/components/form/AccountInput.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import WalletConnectTips from '~/components/WalletConnectTips.vue'
import Button from '~/components/Button.vue'
import Select from '~/components/form/Select.vue'
import Checkbox from '~/components/form/Checkbox.vue'
import BottomSheet from '~/components/BottomSheet.vue'
import errno from '~/constant/errno'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { COMMON_KEYS } from '~/store/common'
import { mmJsonHashAndChainIdHex, sleep } from '~/modules/tools'

export default Vue.extend({
  name: 'ManagePermissionBottomSheet',
  components: {
    ValidationProvider,
    ValidationObserver,
    BottomSheet,
    Iconfont,
    Checkbox,
    Select,
    Button,
    WalletConnectTips,
    AccountInput
  },
  model: {
    prop: 'selectModificationShowing',
    event: 'close'
  },
  props: {
    selectModificationShowing: {
      type: Boolean,
      required: false
    },
    accountInfo: {
      type: Object as PropType<IAccountInfo>,
      required: true
    }
  },
  data () {
    return {
      CHAINID_TO_CHAIN,
      modifyOwnerShowing: false,
      modifyOwnerConfirmShowing: false,
      modifyOwnerConfirmLoading: false,
      modifyOwnerSecondConfirmation: false,
      modifyManagerShowing: false,
      modifyManagerConfirmShowing: false,
      modifyManagerConfirmLoading: false,
      modifyManagerSecondConfirmation: false,
      newOwner: {
        chain: ETH.chainId,
        address: ''
      },
      newManager: {
        chain: ETH.chainId,
        address: ''
      },
      chainOptions: [{
        text: ETH.name,
        value: ETH.chainId
      }, {
        text: BSC.name,
        value: BSC.chainId
      }, {
        text: TRON.name,
        value: TRON.chainId
      }, {
        text: Polygon.name,
        value: Polygon.chainId
      }]
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace,
      common: COMMON_KEYS.namespace
    }),
    ...mapGetters({
      computedChainId: ME_KEYS.computedChainId,
      computedEvmChainId: ME_KEYS.computedEvmChainId
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    editOwnerThrottle (): number {
      const value = this.common.config.transfer_throttle
      if (value) {
        return parseInt(String(value / 60))
      }
      return 5
    },
    editManagerThrottle (): number {
      const value = this.common.config.edit_manager_throttle
      if (value) {
        return parseInt(String(value / 60))
      }
      return 5
    }
  },
  methods: {
    onClose (value: boolean) {
      this.$emit('close', value)
      this.modifyOwnerShowing = false
      this.modifyOwnerConfirmShowing = false
      this.modifyManagerShowing = false
      this.modifyManagerConfirmShowing = false
      this.modifyOwnerSecondConfirmation = false
      this.modifyManagerSecondConfirmation = false
      this.newOwner.address = ''
      this.newManager.address = ''
      ;(this.$refs.modifyOwnerNextForm as HTMLFormElement).reset()
      ;(this.$refs.modifyManagerNextForm as HTMLFormElement).reset()
    },
    modifyOwner () {
      this.$emit('close', false)
      this.modifyOwnerShowing = true
    },
    async modifyOwnerNext () {
      const verified = await (this.$refs.modifyOwnerNextForm as HTMLFormElement).validate()
      if (!verified) {
        return
      }

      const addressVerified = await validate(this.newOwner.address, `required|address:${CHAINID_TO_CHAIN[this.newOwner.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyOwnerShowing = false
      this.modifyOwnerConfirmShowing = true
    },
    async modifyOwnerConfirm () {
      const addressVerified = await validate(this.newOwner.address, `required|address:${CHAINID_TO_CHAIN[this.newOwner.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyOwnerConfirmLoading = true

      try {
        const res = await this.$services.account.editOwner({
          chain_type: this.computedChainId,
          evm_chain_id: this.computedEvmChainId,
          address: this.connectedAccount.address,
          account: this.accountInfo.account,
          raw_param: {
            receiver_chain_type: [BSC.chainId, Polygon.chainId].includes(this.newOwner.chain) ? ETH.chainId : this.newOwner.chain,
            receiver_address: this.newOwner.address
          }
        })

        if (!res) {
          return
        }

        for (const item of res.sign_list) {
          if (item.sign_msg) {
            if (LOCK_SCRIPT_TYPE.eth && item.sign_type === NEW_LOCK_SCRIPT_TYPE.eip712) {
              const mmJson = JSON.parse(JSON.stringify(res.mm_json))
              mmJson.message.digest = item.sign_msg
              const signDataRes = await this.$walletSdk.signData(mmJson, true)
              item.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
            }
            else {
              const signDataRes = await this.$walletSdk.signData(item.sign_msg)
              item.sign_msg = (signDataRes as string)
            }
            // sometimes metamask need a duration to receive next signing request
            await sleep(1000)
          }
        }

        await this.$services.account.sendTrx(res)

        this.modifyOwnerConfirmShowing = false
        this.modifyOwnerSecondConfirmation = false
        this.newOwner.address = ''
        this.$alert({
          title: this.$t('Tips'),
          message: (this.$t('Modification has been submitted, it will take about 5 minutes to take effect, please check back later') as string)
        })
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.rpcApiErrAccountFrequencyLimit) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('If the operation is too frequent, please try again after {timeInterval} minutes', { timeInterval: this.editOwnerThrottle })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.code === errno.rpcApiErrTransferAccountSameAddress) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('No need to transfer. You can view all DAS accounts under the current address.')
            })
          }
          else {
            this.$alert({
              title: this.$t('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
      finally {
        this.modifyOwnerConfirmLoading = false
      }
    },
    modifyManager () {
      this.$emit('close', false)
      this.modifyManagerShowing = true
    },
    async modifyManagerNext () {
      const verified = await (this.$refs.modifyManagerNextForm as HTMLFormElement).validate()
      if (!verified) {
        return
      }

      const addressVerified = await validate(this.newManager.address, `required|address:${CHAINID_TO_CHAIN[this.newManager.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyManagerShowing = false
      this.modifyManagerConfirmShowing = true
    },
    async modifyManagerConfirm () {
      const addressVerified = await validate(this.newManager.address, `required|address:${CHAINID_TO_CHAIN[this.newManager.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyManagerConfirmLoading = true

      try {
        const res = await this.$services.account.editManager({
          evm_chain_id: this.computedEvmChainId,
          chain_type: this.computedChainId,
          address: this.connectedAccount.address,
          account: this.accountInfo.account,
          raw_param: {
            manager_chain_type: [BSC.chainId, Polygon.chainId].includes(this.newManager.chain) ? ETH.chainId : this.newManager.chain,
            manager_address: this.newManager.address
          }
        })

        if (!res) {
          return
        }

        for (const item of res.sign_list) {
          if (item.sign_msg) {
            if (LOCK_SCRIPT_TYPE.eth && item.sign_type === NEW_LOCK_SCRIPT_TYPE.eip712) {
              const mmJson = JSON.parse(JSON.stringify(res.mm_json))
              mmJson.message.digest = item.sign_msg
              const signDataRes = await this.$walletSdk.signData(mmJson, true)
              item.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
            }
            else {
              const signDataRes = await this.$walletSdk.signData(item.sign_msg)
              item.sign_msg = (signDataRes as string)
            }
            // sometimes metamask need a duration to receive next signing request
            await sleep(1000)
          }
        }

        await this.$services.account.sendTrx(res)

        this.modifyManagerConfirmShowing = false
        this.modifyManagerSecondConfirmation = false
        this.newManager.address = ''
        this.$alert({
          title: this.$t('Tips'),
          message: (this.$t('Modification has been submitted, it will take about 5 minutes to take effect, please check back later') as string)
        })
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.rpcApiErrAccountFrequencyLimit) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('If the operation is too frequent, please try again after {timeInterval} minutes', { timeInterval: this.editManagerThrottle })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.code === errno.rpcApiErrTransferAccountSameAddress) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('No need to transfer. You can view all DAS accounts under the current address.')
            })
          }
          else {
            this.$alert({
              title: this.$t('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
      finally {
        this.modifyManagerConfirmLoading = false
      }
    },
    onInputNewOwnerAddress (value: string) {
      if (value) {
        this.newOwner.address = value
      }
    },
    onInputNewManagerAddress (value: string) {
      if (value) {
        this.newManager.address = value
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.manage-permission-bottom-sheet__warn {
  font-weight: 600;
  color: $error-font-color !important;
  line-height: 17px;
  word-break: break-all;
}

.manage-permission-bottom-sheet__permissions {
  margin: 32px 0 120px 0;
}

.manage-permission-bottom-sheet__permissions__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 18px 16px;
  border-radius: 16px;
  cursor: pointer;
}

.manage-permission-bottom-sheet__owner {
  background: $success-color;
}

.manage-permission-bottom-sheet__manager {
  background: $primary-color;
}

.manage-permission-bottom-sheet__permissions__item-header {
  display: flex;
}

.manage-permission-bottom-sheet__permissions__logo {
  font-size: 44px;
  margin-right: 16px;
}

.manage-permission-bottom-sheet__permissions__title {
  font-size: 18px;
  font-weight: 600;
  color: $normal-color;
  line-height: 26px;
}

.manage-permission-bottom-sheet__permissions__desc {
  margin-right: 8px;
  min-height: 34px;
  font-size: 12px;
  font-weight: 600;
  color: $normal-color;
  line-height: 17px;
}

.manage-permission-bottom-sheet__button {
  margin-bottom: 34px;
}

.manage-permission-bottom-sheet__modify {
  margin-bottom: 40px;
}

.manage-permission-bottom-sheet__label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  line-height: 17px;
}

.manage-permission-bottom-sheet__link {
  display: inline-block;
  word-break: break-all;
  line-height: 17px;
  color: $link-font-color;
  font-family: $monospace-font-family;
}

.manage-permission-bottom-sheet__margin-top-32 {
  margin-top: 32px;
}

.manage-permission-bottom-sheet__margin-bottom-16 {
  margin-bottom: 16px;
}

.manage-permission-bottom-sheet__confirm {
  margin: 24px 0;
  padding: 24px 16px;
  border-radius: 12px;
  background: $normal-color;
  border: $container-border;
}

.manage-permission-bottom-sheet__second-confirmation {
  margin-bottom: 60px;
}

.manage-permission-bottom-sheet__tips {
  margin-top: 6px;
  display: inline-grid;
  grid-auto-flow: column;
  grid-column-gap: 2px;
  grid-template-columns: 7px auto;
  font-size: 14px;
  font-weight: 400;
  color: $assist-font-color;
  line-height: 17px;
  word-break: break-word;
}

.manage-permission-bottom-sheet__tips__link {
  color: $link-font-color;
}
</style>
