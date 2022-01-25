<template>
  <div>
    <BottomSheet
      :showing="showing"
      :title="loggedIn ? i18n.t('Switch wallet') : i18n.t('Connect wallet')"
      :closeButton="loggedIn"
      @close="onClose"
    >
      <div v-if="!config.isProdData" class="wallets-connect__test-tip">
        <div class="wallets-connect__test-tip__container">
          <span class="wallets-connect__test-tip__icon">💡</span>
          {{ i18n.t('ETH wallets switch to Goerli test network before connecting') }}
        </div>
        <div class="wallets-connect__test-tip__container">
          <span class="wallets-connect__test-tip__icon">💡</span>
          {{ i18n.t('TRON wallets switch to Nile test network before connecting') }}
        </div>
        <div class="wallets-connect__test-tip__container">
          <span class="wallets-connect__test-tip__icon">💡</span>
          {{ i18n.t('BSC wallets switch to Testnet before connecting') }}
        </div>
        <div class="wallets-connect__test-tip__container">
          <span class="wallets-connect__test-tip__icon">💡</span>
          {{ i18n.t('Polygon wallets switch to Testnet before connecting') }}
        </div>
      </div>
      <div
        v-if="tutorialsShowing"
        class="wallets-connect__tutorials"
      >
        <span class="wallets-connect__tutorials__emoji">💡</span>
        <div>
          <div>{{ i18n.t('This is a non-wallet environment, so we recommend using it through the wallet App for a better experience.') }}</div>
          <a
            class="wallets-connect__tutorials__link"
            :href="i18n.locale === 'zh' ? 'https://mp.weixin.qq.com/s/m-oIZOKwHkGbu6QkchgtwA' : 'https://dasystems.medium.com/das-is-now-listed-on-tokenpocket-a05bcfdf0484'"
            target="_blank"
          >{{ i18n.t('Learn how to use') }} →</a>
        </div>
      </div>
      <div class="wallets-connect__cross-chain-tips">{{ i18n.t('Powerful cross-chain capability is a unique feature of DAS, which means you can register and use DAS in multiple public chain environments. Please select the public chain you are currently using.') }}</div>
      <ul class="wallets-connect__select-wallet-list">
        <li
          v-for="wallet in walletList"
          :key="wallet.name"
          class="wallets-connect__select-wallet-list__item"
          :class="{ 'wallets-connect__select-wallet-list__no-support': !wallet.supported }"
          @click="onLogin(wallet)"
        >
          <div class="wallets-connect__select-wallet-list__wallet-info">
            <IconImage
              v-if="wallet.logo"
              class="wallets-connect__select-wallet-list__logo"
              :url="wallet.logo"
              :alt="wallet.name"
              :size="32"
            />
            <Iconfont
              v-else
              class="wallets-connect__select-wallet-list__logo"
              :name="wallet.icon"
              size="32"
            />
            <div>
              {{ wallet.title }}
              <div
                v-if="wallet.name === WALLETS.tronLink"
                class="wallets-connect__tronlink__tips"
              >
                {{ i18n.t('Only supported in imToken, TokenPocket, TronLink') }}
              </div>
            </div>
          </div>
          <span class="wallets-connect__select-wallet-list__arrow">
            <Iconfont size="24" name="arrow-right" color="#11142D" />
          </span>
        </li>
      </ul>
    </BottomSheet>
    <Dialog
      :showing="tipsShowing"
      :title="i18n.t('Tips')"
      :actionButtonText="i18n.t('Understand, Continue')"
      @close="onCloseTips"
    >
      <div class="wallets-connect__hardware-wallet__title">
        {{ i18n.t('DO NOT use DAS with ANY hardware wallet!') }}
      </div>
      <div class="wallets-connect__hardware-wallet__content">
        {{ i18n.t('Since most hardware wallets have incompatibility problems.') }}
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import VueI18n, { IVueI18n } from 'vue-i18n'
import type VueAnalytics from 'vue-analytics'
import { mapState, Store } from 'vuex'
import BottomSheet from '~/components/BottomSheet.vue'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { IAlertOptions } from '~/plugins/alert'
import { WALLETS } from '~/constant'
import { ME_KEYS } from '~/store/me'
import { isMobileDevices } from '~/modules/tools'
import config from '~~/config'
import Dialog from '~/components/Dialog.vue'
import { COMMON_KEYS } from '~/store/common'

interface IWallet {
  title: string
  name: string
  supported: boolean
  logo?: string
  icon?: string
  link?: string
}

export const EVENT = {
  abcWalletConnect: 'abcWalletConnect',
  metaMaskConnect: 'metaMaskConnect',
  bscWalletConnect: 'bscWalletConnect',
  polygonWalletConnect: 'polygonWalletConnect',
  walletConnectConnect: 'walletConnectConnect',
  coinbaseWalletConnect: 'coinbaseWalletConnect',
  tronLinkConnect: 'tronLinkConnect',
  close: 'close'
}

export default Vue.extend({
  name: 'WalletsConnect',
  components: {
    Iconfont,
    IconImage,
    BottomSheet,
    Dialog
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
    i18n: {
      type: Object as PropType<VueI18n & IVueI18n>,
      default: () => (({} as VueI18n & IVueI18n))
    },
    $alert: {
      type: Function as PropType<(options: IAlertOptions) => void>,
      default: () => {}
    },
    $toast: {
      type: Function as PropType<(message: string, duration?: number) => void>,
      default: () => {}
    },
    $store: {
      type: Object as PropType<Store<any>>,
      default: () => ({} as Store<any>)
    },
    $ga: {
      type: Object as PropType<VueAnalytics>,
      required: true
    }
  },
  data () {
    return {
      WALLETS,
      config,
      tutorialsShowing: false
    }
  },
  computed: {
    isMobileDevices,
    ...mapState({
      me: ME_KEYS.namespace,
      common: COMMON_KEYS.namespace
    }),
    loggedIn (): boolean {
      return this.me.loggedIn
    },
    tipsShowing (): boolean {
      return this.common.hardwareWalletTipsShow
    },
    walletList (): IWallet[] {
      const walletConnect: IWallet = {
        title: WALLETS.walletConnect,
        name: WALLETS.walletConnect,
        logo: '/images/components/walletConnect-wallet-logo.png',
        supported: true
      }

      const tronLink: IWallet = {
        title: (this.i18n.t('Connect Tron environment') as string),
        name: WALLETS.tronLink,
        icon: 'tron',
        supported: true
      }

      const metaMask: IWallet = {
        title: (this.i18n.t('Connect ETH environment') as string),
        name: WALLETS.metaMask,
        icon: 'ethereum',
        supported: true
      }

      const bscWallet: IWallet = {
        title: (this.i18n.t('Connect BSC environment') as string),
        name: WALLETS.bscWallet,
        icon: 'binance-smart-chain',
        supported: true
      }

      const polygonWallet: IWallet = {
        title: (this.i18n.t('Connect Polygon environment') as string),
        name: WALLETS.polygonWallet,
        icon: 'polygon',
        supported: true
      }

      return [metaMask, tronLink, bscWallet, polygonWallet]
    }
  },
  mounted () {
    window.setTimeout(() => {
      const { tronWeb, ethereum } = window
      if (this.isMobileDevices && typeof tronWeb === 'undefined' && typeof ethereum === 'undefined') {
        this.tutorialsShowing = true
      }
    }, 1500)
  },
  methods: {
    onLogin (wallet: IWallet) {
      if (wallet.link) {
        window.open(wallet.link)
        return
      }

      this.$ga.event('connect wallet', 'click', wallet.name)

      switch (wallet.name) {
        case WALLETS.abcWallet:
          this.$emit(EVENT.abcWalletConnect)
          break
        case WALLETS.metaMask:
          this.$emit(EVENT.metaMaskConnect)
          break
        case WALLETS.bscWallet:
          this.$emit(EVENT.bscWalletConnect)
          break
        case WALLETS.polygonWallet:
          this.$emit(EVENT.polygonWalletConnect)
          break
        case WALLETS.walletConnect:
          localStorage.removeItem('walletconnect')
          this.$emit(EVENT.walletConnectConnect)
          break
        case WALLETS.coinbaseWallet:
          this.$emit(EVENT.coinbaseWalletConnect)
          break
        case WALLETS.tronLink:
          this.$emit(EVENT.tronLinkConnect)
          break
      }
    },
    onCloseTips () {
      this.$store?.commit(COMMON_KEYS.setHardwareWalletTipsShow, false)
    },
    onClose () {
      this.$emit(EVENT.close, false)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.wallets-connect__test-tip {
  margin-bottom: 18px;
  padding: 10px;
  color: $error-font-color;
  font-weight: bold;
  background: rgba(223, 74, 70, 0.1);
  border-radius: 10px;
}

.wallets-connect__test-tip__container {
  display: flex;
}

.wallets-connect__test-tip__icon {
  margin-right: 4px;
}

.wallets-connect__cross-chain-tips {
  color: #636D85;
}

.wallets-connect__select-wallet-list {
  padding: 16px 0 34px 0;
  height: 460px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0 !important;
  }
}

.wallets-connect__select-wallet-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px;
  border: $container-border;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    background: #F6F7F9;
  }
}

.wallets-connect__select-wallet-list__no-support {
  filter: grayscale(100%);
  cursor: no-drop;
  color: $assist-font-color;

  &:hover {
    background: $white;
  }
}

.wallets-connect__select-wallet-list__logo {
  margin-right: 12px;
}

.wallets-connect__select-wallet-list__wallet-info {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.wallets-connect__tutorials {
  margin-bottom: 18px;
  padding: 16px 12px;
  display: flex;
  font-size: 16px;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 22px;
  background: #F6F7F9;
  border-radius: 16px;
}

.wallets-connect__tutorials__emoji {
  margin-right: 8px;
}

.wallets-connect__tutorials__link {
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  color: $link-font-color;
  line-height: 20px;
  margin-top: 12px;
}

.wallets-connect__hardware-wallet__title {
  color: $error-font-color;
  text-align: center;
  font-weight: 600;
  margin-bottom: 12px;
}

.wallets-connect__hardware-wallet__content {
  text-align: center;
}

.wallets-connect__tronlink__tips {
  margin-top: 4px;
  font-weight: 400;
  font-size: 12px;
  color: $assist-font-color;
}

.wallets-connect__select-wallet-list__arrow {
  display: inline-block;
  min-width: 24px;
  min-height: 24px;
}
</style>
