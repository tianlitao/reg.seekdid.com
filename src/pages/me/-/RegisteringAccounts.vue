<template>
  <div class="registering-accounts">
    <div class="registering-accounts__tips">
      <Iconfont
        class="registering-accounts__tips__icon"
        name="tips"
        size="16"
        color="#E05656"
      />
      {{ $tt('Failed registration or unpaid orders will be automatically closed after 24 hours.') }}
    </div>
    <ul class="registering-accounts__list">
      <li
        v-for="account in registeringAccounts"
        :key="account.account"
        class="registering-accounts__list__item"
        @click="seeDetails(account)"
      >
        <div class="account-status__list__container">
          <IconImage
            class="registering-accounts__list__logo"
            :url="`${IDENTICON_SERVE}${account.account}`"
            :alt="account.account"
            :size="44"
            rounded
          />
          <div class="registering-accounts__list__info">
            <span>{{ account.account }}</span>
            <div>
              <span class="registering-accounts__list__status-text">
                <Iconfont
                  name="loading"
                  size="16"
                  color="#2EB67D"
                />
                {{ $tt('Registering') }}
              </span>
            </div>
          </div>
        </div>
        <Iconfont
          name="arrow-right"
          color="#121314"
          size="18"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IAccountInfo } from '~/services/Account'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { IDENTICON_SERVE } from '~/constant'
import { ME_KEYS } from '~/store/me'
import { CoinType } from '~/constant/chain'

export default Vue.extend({
  name: 'RegisteringAccounts',
  components: {
    IconImage,
    Iconfont
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    registeringAccounts (): IAccountInfo[] {
      return this.me.registeringAccounts
    }
  },
  data () {
    return {
      IDENTICON_SERVE
    }
  },
  mounted () {
    this.getRegisteringAccounts()
  },
  methods: {
    async getRegisteringAccounts () {
      try {
        await this.$store.dispatch(ME_KEYS.fetchRegisteringAccounts)
      }
      catch (err) {
        console.error(err)
      }
    },
    seeDetails (account: IAccountInfo) {
      if (account.cross_coin_type === CoinType.eth) {
        this.$router.push(`/account/register/status/${account.account}?from=registering-accounts&action=mintNft`)
      }
      else {
        this.$router.push(`/account/register/status/${account.account}?from=registering-accounts`)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.registering-accounts {
  flex: 1;
}

.registering-accounts__list {
  padding: 12px 12px 0 12px;
}

.registering-accounts__list__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 8px;
  height: 90px;
  background: $white;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(182, 196, 217, 0.4);
  cursor: pointer;

  &:hover {
    background: #F7F9FA;
  }
}

.account-status__list__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-18;
  font-weight: 600;
  color: $primary-font-color;
  word-break: break-word;
  hyphens: auto;
  line-height: 21px;
}

.registering-accounts__list__info {
  display: flex;
  flex-direction: column;
  font-size: $font-size-18;
  font-weight: 600;
  color: $primary-font-color;
  word-break: break-word;
  hyphens: auto;
}

.registering-accounts__list__logo {
  margin-right: 12px;
}

.registering-accounts__list__status-text {
  display: inline-flex;
  align-items: center;
  margin-top: 4px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: $font-size-12;
  color: $success-font-color;
  background: rgba(0, 223, 155, 0.1);

  svg {
    animation: rotate360DegAnimation 0.9s linear infinite;
  }
}

.registering-accounts__tips {
  margin: 12px 12px 0 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  height: 40px;
  background: #FCECEC;
  border-radius: 8px;
  font-size: $font-size-14;
  font-weight: 600;
  color: $error-font-color;
}

.registering-accounts__tips__icon {
  margin-right: 6px;
}
</style>
