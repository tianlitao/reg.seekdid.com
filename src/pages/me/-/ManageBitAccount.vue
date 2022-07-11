<template>
  <div>
    <Dialog
      :showing="showing"
      :title="$tt('You want to')"
      closeButton
      @close="onClose"
    >
      <ul>
        <li
          class="manage-bit-account__item manage-bit-account__convert-to-eth"
          @click="convertToEth"
        >
          <span class="manage-bit-account__info">
            <Iconfont
              class="manage-bit-account__info__icon"
              name="ethereum"
              size="32"
            />
            <h2 class="manage-bit-account__title">{{ $tt('Convert it to NFT on Ethereum') }}</h2>
          </span>
          <span :class="{ 'manage-bit-account__info__icon__disabled': isSubAccount || !canManage }">
            <Iconfont name="arrow-right" color="#121314" size="18" />
          </span>
        </li>
        <li
          class="manage-bit-account__item manage-bit-account__manage"
          @click="manageData"
        >
          <span class="manage-bit-account__info">
            <span>
              <Iconfont
                class="manage-bit-account__info__icon"
                name="manage"
                size="32"
              />
            </span>
            <span>
              <h2 class="manage-bit-account__title">{{ $tt('Manage') }}</h2>
              <span class="manage-bit-account__info__desc">{{ $tt('Manage data, mint sub-accounts, renew, change permissions...') }}</span>
            </span>
          </span>
          <span>
            <Iconfont name="arrow-right" color="#121314" size="18" />
          </span>
        </li>
      </ul>
    </Dialog>
    <NoSupportTronMintTips
      v-model="noSupportTronDialogShowing"
      :account="accountInfo.account"
    />
    <CanNotBeLockedTips
      v-model="canNotBeLockedDialogShowing"
      :account="accountInfo.account"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import Decimal from 'decimal.js'
import { IAccountInfo } from '~/services/Account'
import Iconfont from '~/components/icon/Iconfont.vue'
import Dialog from '~/components/Dialog.vue'
import { SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'
import { homepage } from '~~/config'
import { ACCOUNT_STATUS } from '~/constant'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { TRON } from '~/constant/chain'
import NoSupportTronMintTips from '~/pages/me/-/NoSupportTronMintTips.vue'
import CanNotBeLockedTips from '~/pages/me/-/CanNotBeLockedTips.vue'
import { isMobile } from '~/modules/tools'

export default Vue.extend({
  name: 'ManageBitAccount',
  components: {
    Dialog,
    Iconfont,
    NoSupportTronMintTips,
    CanNotBeLockedTips
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
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
      noSupportTronDialogShowing: false,
      canNotBeLockedDialogShowing: false
    }
  },
  computed: {
    isMobile,
    ...mapState({
      me: ME_KEYS.namespace
    }),
    isSubAccount (): boolean {
      return SUB_ACCOUNT_REG_EXP.test(this.accountInfo.account)
    },
    canManage (): boolean {
      return ![ACCOUNT_STATUS.onePriceSell].includes(this.accountInfo.status)
    },
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    canNotBeLocked (): boolean {
      const expiredAt = this.accountInfo.expired_at
      if (expiredAt) {
        const oneMonthMillisecond = 30 * 24 * 60 * 60 * 1000
        return !(new Decimal(expiredAt).sub(new Date().getTime()).gt(oneMonthMillisecond))
      }
      else {
        return false
      }
    }
  },
  methods: {
    onClose (value: boolean) {
      this.$emit('close', value)
    },
    convertToEth () {
      if (this.isSubAccount) {
        this.$alert({
          title: this.$tt('Coming soon'),
          message: this.$tt('For now, only parent accounts can be converted to NFTs on Ethereum. '),
          actionButtonText: this.$tt('I Know')
        })
        return
      }
      if (!this.canManage) {
        this.$alert({
          title: this.$tt('Tips'),
          message: this.$tt('If a DAS account is on sale, it is in a special status and cannot be operated other than renewed and delisted.')
        })
        return
      }
      if (this.connectedAccount.chain.coinType === TRON.coinType) {
        this.noSupportTronDialogShowing = true
        return
      }
      if (this.canNotBeLocked) {
        this.canNotBeLockedDialogShowing = true
        return
      }
      this.$emit('convertToEth')
      this.onClose(false)
    },
    manageData () {
      const link = `${homepage}/${this.accountInfo.account}`
      if (this.isMobile) {
        window.location.href = link
      }
      else {
        window.open(link)
      }
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.manage-bit-account__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }
}

.manage-bit-account__convert-to-eth {
  background: #DFE5FB;
  border: 1px solid rgba(98, 126, 234, 0.1);

  &:hover {
    background: rgba(223, 229, 251, 0.5);
  }
}

.manage-bit-account__manage {
  background: #CDF9CC;
  border: 1px solid rgba(98, 126, 234, 0.1);

  &:hover {
    background: rgba(205, 249, 204, 0.5);
  }
}

.manage-bit-account__title {
  font-size: $font-size-16;
  font-weight: bold;
  color: $primary-font-color;
  line-height: 19px;
}

.manage-bit-account__info__desc {
  font-size: $font-size-12;
  font-weight: 400;
  color: $assist-font-color;
  line-height: 14px;
}

.manage-bit-account__info {
  display: flex;
  align-items: center;
}

.manage-bit-account__info__icon {
  margin-right: 12px;
}

.manage-bit-account__info__icon__disabled {
  opacity: 0.3;
}
</style>
