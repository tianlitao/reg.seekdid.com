<template>
  <div class="invitation-link">
    <Breadcrumb class="invitation-link__breadcrumb" :items="breadcrumbItems" />
    <i18n
      tag="h1"
      class="invitation-link__title"
      path="奖励提成说明"
      :i18nkey="$tt('奖励提成说明')"
    >
      <span class="invitation-link__reward-factor" slot="rewardFactor">
        {{ $tt('earn {rewardFactor}%', { rewardFactor: rewardFactor }) }}
      </span>
    </i18n>
    <div class="invitation-link__tip">{{ $tt('Open this page in your browser to download the poster') }}</div>
    <div class="invite-link-img__container">
      <img
        v-if="inviteLinkImgBase64"
        class="invitation-link__image"
        :src="inviteLinkImgBase64"
        alt="invitation-link"
      >
      <canvas id="myCanvas" width="750" height="845" />
      <QrcodeVue
        id="qrcodeVue"
        class="invitation-link__qrcode"
        :value="invitationLink"
        size="59"
        level="Q"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import QrcodeVue from 'qrcode.vue'
import { mapState } from 'vuex'
import Breadcrumb from '~/components/Breadcrumb.vue'
import config from '~~/config'
import { isMobile } from '~/modules/tools'
import { COMMON_KEYS } from '~/store/common'

export default Vue.extend({
  name: 'InviteLink',
  components: {
    QrcodeVue,
    Breadcrumb
  },
  layout: 'noBottomNav',
  data () {
    return {
      invitationAccount: this.$route.params.account,
      inviteLinkImgBase64: ''
    }
  },
  computed: {
    isMobile,
    ...mapState({
      common: COMMON_KEYS.namespace
    }),
    rewardFactor (): number {
      const rate = this.common?.config?.profit_rate_of_inviter
      return (rate || 0) * 100
    },
    invitationLink (): string {
      return `${config.domain}explorer?inviter=${this.invitationAccount}`
    },
    breadcrumbItems (): any {
      const from = this.$route.query.from
      if (from && from === 'registering') {
        return [{
          text: this.$tt('Explorer'),
          href: '/explorer'
        }, {
          text: this.$tt('Register'),
          href: `/account/register/status/${this.invitationAccount}`
        }, {
          text: this.$tt('Poster')
        }]
      }
      return [{
        text: this.$tt('My'),
        href: `/me?tab=reward&invitationAccount=${this.invitationAccount}`
      }, {
        text: this.$tt('Poster')
      }]
    }
  },
  watch: {
    '$i18n.locale' () {
      this.onShowShare()
    }
  },
  mounted () {
    this.$store.dispatch(COMMON_KEYS.fetchConfig)
    this.onShowShare()
  },
  methods: {
    onShowShare () {
      const bgImg = new Image()
      bgImg.onload = () => {
        const myCanvas = (document.getElementById('myCanvas') as HTMLCanvasElement)
        const ctx = (myCanvas.getContext('2d') as CanvasRenderingContext2D)
        ctx.drawImage(bgImg, 0, 0, 750, 845)
        const qrcodeVueCanvas = (document.querySelector('#qrcodeVue>canvas') as HTMLCanvasElement)
        const qrcodeBase64 = qrcodeVueCanvas.toDataURL('image/jpeg', 1.0)
        const qrcodeImg = new Image()
        qrcodeImg.onload = () => {
          ctx.drawImage(qrcodeImg, 540, 580, 130, 130)
          if (this.invitationAccount.length > 14) {
            ctx.font = 'bold 60px Arial'
            ctx.fillStyle = '#22C493'
            ctx.fillText(this.invitationAccount, 75, 465)
          }
          else if (this.invitationAccount.length > 10) {
            ctx.font = 'bold 80px Arial'
            ctx.fillStyle = '#22C493'
            ctx.fillText(this.invitationAccount, 75, 475)
          }
          else {
            ctx.font = 'bold 106px Arial'
            ctx.fillStyle = '#22C493'
            ctx.fillText(this.invitationAccount, 75, 475)
          }
          this.inviteLinkImgBase64 = myCanvas.toDataURL('image/jpeg', 1.0)
        }
        qrcodeImg.src = qrcodeBase64
      }
      bgImg.src = `${config.domain}/images/me/invitation-link-bg-${this.$i18n.locale}.png`
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.invitation-link {
  display: flex;
  flex-direction: column;
}

.invitation-link__breadcrumb {
  margin: 16px 12px;
}

.invitation-link__title {
  margin: 44px 12px 8px 12px;
  font-size: 24px;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 33px;
  text-align: center;
}

.invitation-link__reward-factor {
  display: inline-flex;
  color: #FF6DAD;
}

.invitation-link__tip {
  margin: 0 12px 16px 12px;
  color: $assist-font-color;
  line-height: 20px;
  text-align: center;
}

.invite-link-img__container {
  position: relative;
}

#myCanvas {
  width: 100%;
  z-index: -10;
}

.invitation-link__image {
  position: absolute;
  display: block;
  width: 100%;
  z-index: 3;
}

.invitation-link__qrcode {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: -10;
}
</style>
