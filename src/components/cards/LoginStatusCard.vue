<template>
  <div class="login-status-card">
    <div class="login-status-card__login-status">
      {{ loggedIn ? $tt('Currently connected wallet') : $tt('Not connected to wallet') }}
    </div>
    <div class="login-status-card__info">
      <span
        class="login-status-card__account"
        :class="{ 'login-status-card__account__can-copy': loggedIn }"
      >
        <Iconfont
          class="login-status-card__account-icon"
          :name="loggedIn ? connectedAccount.chain.icon : 'default-avatar'"
          size="33"
        />
        <div v-if="loggedIn && dasReverse.account && dasReverse.is_valid">
          <div
            class="login-status-card__reverse-record__account"
            @click="onCopyAddress(dasReverse.account)"
          >
            {{ toHashedStyle(dasReverse.account) }}
            <IconImage
              v-if="connectedAccount.protocol === WalletProtocol.walletConnect"
              class="login-status-card__wallet-connect"
              url="/images/components/wallet-connect.png"
              alt="logo"
              :size="20"
            />
          </div>
          <div
            class="login-status-card__reverse-record__address"
            @click="onCopyAddress(connectedAccount.address)"
          >
            {{ collapseString(connectedAccount.address, 5, 5) }}
          </div>
        </div>
        <template v-else>
          <span>{{ loggedIn ? collapseString(connectedAccount.address, 5, 5) : $tt('Please connect') }}</span>
          <IconImage
            v-if="connectedAccount.protocol === WalletProtocol.walletConnect"
            class="login-status-card__wallet-connect"
            url="/images/components/wallet-connect.png"
            alt="logo"
            :size="20"
          />
        </template>
      </span>
      <span
        class="login-status-card__connect-wallet"
        @click="onConnectWallet"
      >
        {{ loggedIn ? $tt('Switch wallet') : $tt('Connect wallet') }}
      </span>
    </div>
    <template v-if="!hideReverseRecordSetting">
      <div
        v-if="dasReverse.account && dasReverse.is_valid"
        class="login-status-card__edit-das-reverse"
        @click="goDasReverse"
      >
        <span class="login-status-card__edit-das-reverse__header">
          <span>{{ $tt('Reverse record') }}</span>
          <span class="login-status-card__edit-das-reverse__account">
            <Iconfont
              name="check-strong"
              color="#167B58"
              size="16"
            />
            {{ toHashedStyle(dasReverse.account) }}
          </span>
        </span>
        <span class="login-status-card__action">
          {{ $tt('Edit') }}
          <Iconfont class="login-status-card__action__icon" name="arrow-right" color="#62BFA0" />
        </span>
        <img
          class="login-status-card__background-image"
          src="/images/reverse/das-reverse-status.svg"
        >
      </div>
      <div
        v-else-if="dasReverse.account && !dasReverse.is_valid"
        class="login-status-card__edit-das-reverse"
        @click="goDasReverse"
      >
        <span class="login-status-card__edit-das-reverse__header">
          <span>{{ $tt('Reverse record') }}</span>
          <span class="login-status-card__edit-das-reverse__account">
            <Iconfont
              name="warning"
              color="#167B58"
              size="16"
            />
            {{ $tt('Invalid') }}
          </span>
        </span>
        <span class="login-status-card__action">
          {{ $tt('Learn more') }}
          <Iconfont class="login-status-card__action__icon" name="arrow-right" color="#62BFA0" />
        </span>
        <img
          class="login-status-card__background-image"
          src="/images/reverse/das-reverse-status.svg"
        >
      </div>
      <div
        v-else
        class="login-status-card__set-das-reverse"
        @click="goDasReverse"
      >
        <span>{{ $tt('Reverse record') }}</span>
        <span class="login-status-card__action">
          {{ $tt('Not set') }}
          <Iconfont class="login-status-card__action__icon" name="arrow-right" color="#62BFA0" />
        </span>
        <img
          class="login-status-card__background-image"
          src="/images/reverse/das-reverse-status.svg"
        >
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { collapseString, copyText, toHashedStyle } from '~/modules/tools'
import Iconfont from '~/components/icon/Iconfont.vue'
import IconImage from '~/components/icon/IconImage.vue'
import { WalletProtocol } from '~/constant'
import { IReverseLatestRes } from '~/services/DasReverse'
import { REVERSE_KEYS } from '~/store/reverse'

export default Vue.extend({
  name: 'LoginStatusCard',
  components: {
    Iconfont,
    IconImage
  },
  props: {
    hideReverseRecordSetting: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace,
      reverse: REVERSE_KEYS.namespace
    }),
    loggedIn (): boolean {
      return !!this.me.connectedAccount.address
    },
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    dasReverse (): IReverseLatestRes {
      return this.reverse.dasReverse
    }
  },
  data () {
    return {
      WalletProtocol
    }
  },
  methods: {
    toHashedStyle,
    collapseString,
    onConnectWallet () {
      this.$walletSdk.walletsConnect()
    },
    goDasReverse () {
      this.$router.push('/alias')
    },
    onCopyAddress (address: string) {
      if (!address) {
        return
      }
      copyText(address).then(() => {
        this.$toast('👌 ' + this.$tt('Copied'))
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.login-status-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 16px;
  background: $assist-color;
}

.login-status-card__login-status {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 600;
  color: $third-font-color;
}

.login-status-card__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-status-card__account {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: $white;
}

.login-status-card__account__can-copy {
  cursor: pointer;
  word-break: break-word;
  hyphens: auto;
}

.login-status-card__account-icon {
  flex: none;
  margin-right: 12px;
}

.login-status-card__wallet-connect {
  margin-left: 10px;
}

.login-status-card__connect-wallet {
  flex: none;
  padding: 0 10px;
  height: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  line-height: 24px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: $white;
  cursor: pointer;
}

.login-status-card__edit-das-reverse,
.login-status-card__set-das-reverse {
  position: relative;
  padding: 0 10px 0 12px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  background: #94E1C0 linear-gradient(270deg, #C6F2E1 0%, #94E1C0 100%);
  border-radius: 8px;
  border: 1px solid rgba(53, 199, 144, 0.2);
  font-size: 16px;
  font-weight: 600;
  color: #167B58;
  cursor: pointer;
  overflow: hidden;
}

.login-status-card__background-image {
  position: absolute;
  right: 0;
}

.login-status-card__action {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #167B58;
  line-height: 16px;
  z-index: 1;
}

.login-status-card__action__icon {
  margin-left: -10px;
}

.login-status-card__edit-das-reverse__header {
  display: inline-grid;
}

.login-status-card__edit-das-reverse__account {
  margin-left: -2px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #167B58;
  line-height: 14px;
}

.login-status-card__reverse-record__address {
  font-size: 12px;
  font-weight: 600;
  color: $third-font-color;
}

.login-status-card__reverse-record__account {
  display: flex;
}
</style>
