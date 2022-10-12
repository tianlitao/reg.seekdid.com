<template>
  <div class="pending">
    <Breadcrumb class="pending__breadcrumb" :items="breadcrumbItems" />
    <div v-if="fetchDataLoading" class="pending__loading">
      <StatusTip
        class="pending__loading__tip"
        icon="⏳"
        iconSize="72"
        :tip="$tt('Loading')"
        tipFontSize="14"
      />
    </div>
    <template v-else>
      <RegisteringAccounts></RegisteringAccounts>
      <ul class="pending__list">
        <li
          v-for="account in processingNfts"
          :key="account.account"
          class="pending__list__item"
          :class="{ 'pending__list__item__disabled': account.cross_direction === CrossDirection.toCKB }"
          @click="onClickAccount(account)"
        >
          <div class="account-status__list__container">
            <IconImage
              class="pending__list__logo"
              :url="`${IDENTICON_SERVE}${account.account}`"
              :alt="account.account"
              :size="44"
              rounded
            />
            <span>
<!--              <template v-if="isSubAccount(account.account)">-->
<!--                {{ account.account.split('.')[1] }}<span class="pending__list__sub-account">#{{ account.account.split('.')[0] }}</span>.{{ account.account.split('.')[2] }}-->
<!--              </template>-->
<!--              <template v-else>-->
<!--                {{ account.account }}-->
<!--              </template>-->
              {{ account.account }}
              <div>
                <span
                  v-if="account.cross_direction === CrossDirection.fromCKB"
                  class="pending__list__status-text pending__list__status-text_from-ckb"
                >
                  {{ $tt('Converting to NFT') }}
                </span>
                <template v-if="account.cross_direction === CrossDirection.toCKB">
                  <span
                    class="pending__list__status-text pending__list__status-text_to-ckb"
                  >
                    {{ $tt('Converting to a normal .bit') }}
                  </span>
                  <a
                    v-if="account.recycle_hash"
                    class="pending__list__trx-id"
                    :href="`${ETH.explorerTrx}${account.recycle_hash}`"
                    target="_blank"
                  >
                    {{ collapseString(account.recycle_hash, 5, 5) }}
                    <Iconfont
                      class="pending__list__trx-id__icon"
                      name="arrow-right"
                      color="#B0B8BF"
                      size="14"
                    />
                  </a>
                </template>
              </div>
            </span>
          </div>
          <div
            v-if="account.cross_direction === CrossDirection.fromCKB"
            class="pending__list__status"
          >
            <span class="pending__list__mint">{{ $tt('Mint now') }}</span>
            <Iconfont
              name="arrow-right"
              color="#121314"
              size="16"
            />
          </div>
        </li>
      </ul>
      <div class="pending__no-more">
        {{ $tt('No more') }}
      </div>
    </template>
    <MintNft
      v-model="mintNftDialogShowing"
      :account="selectAccount"
      @completed="mintCompleted"
    />
    <MintCompleted
      v-model="mintCompletedDialogShowing"
      :account="selectAccount"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'
import { mapState } from 'vuex'
import StatusTip from '~/components/StatusTip.vue'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { CrossDirection, IDENTICON_SERVE } from '~/constant'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { IDirectionList } from '~/services/CrossEth'
import { collapseString } from '~/modules/tools'
import MintCompleted from '~/pages/me/-/MintCompleted.vue'
import MintNft from '~/pages/me/-/MintNft.vue'
import { ETH } from '~/constant/chain'
import { SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'
import RegisteringAccounts from '~/pages/me/-/RegisteringAccounts.vue'

export default Vue.extend({
  name: 'ConversionProcessing',
  components: {
    StatusTip,
    IconImage,
    Iconfont,
    Breadcrumb,
    MintCompleted,
    MintNft,
    RegisteringAccounts
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    breadcrumbItems (): any {
      return [{
        text: this.$tt('My'),
        href: '/me'
      }, {
        text: this.$tt('Pending')
      }]
    }
  },
  data () {
    return {
      ETH,
      CrossDirection,
      IDENTICON_SERVE,
      fetchDataLoading: false,
      processingNfts: [] as IDirectionList[],
      selectAccount: '',
      mintNftDialogShowing: false,
      mintCompletedDialogShowing: false
    }
  },
  head (): { [key: string]: string | TranslateResult } {
    return {
      title: this.$tt('Converting')
    }
  },
  mounted () {
    this.getDirectionList()
  },
  methods: {
    collapseString,
    isSubAccount (accont: string): boolean {
      return SUB_ACCOUNT_REG_EXP.test(accont)
    },
    async getDirectionList () {
      if (this.processingNfts.length === 0) {
        this.fetchDataLoading = true
      }
      try {
        const res = await this.$services.crossEth.directionList({
          key_info: {
            coin_type: String(this.connectedAccount.chain.coinType),
            key: this.connectedAccount.address
          }
        })
        if (res) {
          this.processingNfts = res.list
        }
      }
      catch (err) {
        console.error(err)
      }
      finally {
        this.fetchDataLoading = false
      }
    },
    onClickAccount (account: IDirectionList) {
      if (account.cross_direction === CrossDirection.toCKB) {
        return
      }
      this.selectAccount = account.account
      this.mintNftDialogShowing = true
    },
    mintCompleted () {
      this.getDirectionList()
      this.mintCompletedDialogShowing = true
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.pending {
  flex: 1;
}

.pending__loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.pending__loading__tip {
  font-weight: 600;
}

.pending__list {
  padding: 0 12px;
}

.pending__list__item {
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

.pending__list__item__disabled {
  cursor: no-drop;
  background: $white !important;
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

.pending__list__logo {
  margin-right: 12px;
}

.pending__list__status {
  display: flex;
  align-items: center;
  flex: none;
  font-size: $font-size-14;
  font-weight: 500;
  color: $primary-color;

  .iconfont {
    margin-left: 6px;
  }
}

.pending__list__status-text {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  font-size: $font-size-12;
}

.pending__list__status-text_to-ckb {
  color: $success-font-color;
  background: #D6EFE7;
}

.pending__list__status-text_from-ckb {
  color: $primary-color;
  background: rgba(192, 203, 246, 0.57);
}

.pending__list__mint {
  display: flex;
  margin-right: -8px;
}

.pending__no-more {
  padding: 16px 0;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: $assist-font-color;
}

.pending__breadcrumb {
  padding: 16px 12px 4px 12px;
}

.pending__list__trx-id {
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: $font-size-12;
  font-weight: 400;
  color: $third-font-color;
  line-height: 14px;
  margin-top: 2px;
}

.pending__list__trx-id__icon {
  margin-left: -2px;
}

.pending__list__sub-account {
  color: $warn-font-color;
}
</style>
