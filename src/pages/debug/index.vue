<template>
  <div class="debug">
    <div class="debug__item">
      page origin: <span class="debug__value">{{ origin }}</span>
    </div>
    <div class="debug__item">
      isMobile: <span class="debug__value">{{ isMobile }}</span>
    </div>
    <div class="debug__item">
      isMobileDevices: <span class="debug__value">{{ isMobileDevices }}</span>
    </div>
    <div>-----------</div>
    <div class="debug__item">
      ethereumStatic
      <div>isMetaMask: <span class="debug__value">{{ ethereumStatic.isMetaMask }}</span></div>
      <div>isCoinbaseWallet: <span class="debug__value">{{ ethereumStatic.isCoinbaseWallet }}</span></div>
      <div>isImToken: <span class="debug__value">{{ ethereumStatic.isImToken }}</span></div>
      <div>isHbWallet: <span class="debug__value">{{ ethereumStatic.isHbWallet }}</span></div>
      <div>selectedAddress: <span class="debug__value">{{ ethereumStatic.selectedAddress || ethereumStatic.address }}</span></div>
      <div>chainId: <span class="debug__value">{{ chainIdHexToNumber(ethereumStatic.networkVersion || ethereumStatic.chainId) }}</span></div>
    </div>
    <div>-----------</div>
    <div class="debug__item">
      ethereumComputed
      <div>isMetaMask: <span class="debug__value">{{ ethereumComputed.isMetaMask }}</span></div>
      <div>isCoinbaseWallet: <span class="debug__value">{{ ethereumComputed.isCoinbaseWallet }}</span></div>
      <div>isImToken: <span class="debug__value">{{ ethereumComputed.isImToken }}</span></div>
      <div>isHbWallet: <span class="debug__value">{{ ethereumComputed.isHbWallet }}</span></div>
      <div>selectedAddress: <span class="debug__value">{{ ethereumComputed.selectedAddress || ethereumComputed.address }}</span></div>
      <div>chainId: <span class="debug__value">{{ chainIdHexToNumber(ethereumComputed.networkVersion || ethereumComputed.chainId) }}</span></div>
    </div>
    <div class="debug__item">
      userAgent: <span class="debug__value">{{ userAgent }}</span>
    </div>
    <div>-----eip-712------</div>
    <div>
      mmJson: <input v-model="mmJson" /> <button @click="signEIP712" >EIP-712</button>
    </div>
    <div>
      Result: {{ signDataRes }}
    </div>
    <div>
      mmHash: {{ mmHash }}
    </div>
    <div>-----personal_sign------</div>
    <div>
      Hex: <input v-model="hexString" /> <button @click="personalSign" >Personal Sign</button>
    </div>
    <div>
      Result: {{ personalSignRes }}
    </div>
    <div>-----localStorage------</div>
    <div class="debug__item">
      localStorage: {{ localStorageValue }}
      <Button @click="onCopy(localStorageValue)">copy localStorage</Button>
      <Button @click="onClearCache">clear cache</Button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import {
  chainIdHexToNumber,
  copyText,
  isMobile,
  isMobileDevices,
  loadScript,
  mmJsonHashAndChainIdHex
} from '~/modules/tools'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import config from '~~/config'

export default Vue.extend({
  name: 'Debug',
  layout: 'noBottomNav',
  data () {
    return {
      ethereumStatic: '',
      mmJson: '{"primaryType":"Mail","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Mail":[{"name":"contents","type":"string"}]},"domain":{"chainId":1,"name":"CCTip","verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC","version":"1"},"message":{"contents":"0xtest"}}',
      mmHash: '',
      signDataRes: '' as (string | Error | undefined),
      hexString: '0xtest',
      personalSignRes: ''
    }
  },
  computed: {
    isMobile,
    isMobileDevices,
    ...mapState({
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedEvmChainId: ME_KEYS.computedEvmChainId
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    ethereumComputed (): string {
      console.log('--------ethereumComputed---------')
      console.log(window.ethereum)
      console.log('-----------------')
      return window.ethereum || {}
    },
    userAgent (): string {
      return window.navigator.userAgent
    },
    origin (): string {
      return window.location.origin
    },
    localStorageValue (): string {
      return localStorage.getItem('app.da.systems') || ''
    }
  },
  beforeMount () {
    loadScript('//cdn.jsdelivr.net/npm/eruda', 'eruda').then(() => {
      window.eruda.init()
      this.ethereumStatic = window.ethereum || {}
      console.log('--------beforeMount---------')
      console.log(this.ethereumStatic)
      console.log('-----------------')

      setTimeout(() => {
        console.log('--------setTimeout---------')
        console.log(window.ethereum)
        console.log('-----------------')
      }, 10000)
    })
  },
  methods: {
    chainIdHexToNumber,
    async signEIP712 () {
      const _mmJson = JSON.parse(this.mmJson)
      _mmJson.domain.chainId = this.computedEvmChainId
      try {
        const { ethereum } = window
        const res = await ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [this.connectedAccount.address, JSON.stringify(_mmJson)],
          from: this.connectedAccount.address
        })
        this.signDataRes = res
        this.mmHash = mmJsonHashAndChainIdHex(_mmJson, _mmJson.domain.chainId)
      }
      catch (err) {
        console.error(err)
        window.alert(err)
      }
    },
    async personalSign () {
      try {
        const { ethereum } = window
        const res = await ethereum.request({
          method: 'personal_sign',
          params: [this.hexString, this.connectedAccount.address]
        })
        if (res) {
          this.personalSignRes = res
        }
      }
      catch (err) {
        console.error(err)
        window.alert(err)
      }
    },
    onCopy (value: string) {
      copyText(value).then(() => {
        this.$toast('👌 ' + this.$t('Copied'))
      })
    },
    onClearCache () {
      localStorage.removeItem('app.da.systems')
      window.location.href = config.domain
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.debug {
  flex: 1;
  padding: 12px 12px 0 12px;
  word-break: break-all;
}

.debug__item {
  margin-bottom: 12px;
}

.debug__value {
  color: $error-color
}
</style>
