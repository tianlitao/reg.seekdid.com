<template>
  <div class="reward">
    <div class="reward__container">
      <img
        class="reward__logo"
        src="/images/me/reward-logo.png"
        alt="reward"
      >
      <h1 class="reward__title">
        {{ $tt('Invite others to register and earn {rewardFactor}% reward', { rewardFactor: rewardFactor }) }}
      </h1>
      <div class="reward__factor-desc">
        {{ $tt('If someone else opens and successfully registers a DAS account through the link below, you will earn {rewardFactor}% of the registration fee.', { rewardFactor: rewardFactor }) }}
      </div>
      <template v-if="invitationAccount">
        <div
          class="reward__invitation-link"
          @click="onChangeInvitationLink"
        >
          <span>
            <div class="reward__invitation-link__label">{{ $tt('My invitation link') }}</div>
            <div>{{ invitationLink }}</div>
          </span>
          <Iconfont
            class="reward__invitation__icon-toggle"
            name="toggle"
            color="#B2B3BD"
          />
        </div>
        <div class="reward__invitation-link__action">
          <Button
            class="reward__share-picture"
            :to="`/me/invitation-link/${invitationAccount}`"
            success
          >
            {{ $tt('Share image') }}
          </Button>
          <Button
            class="reward__share-on-twitter"
            success
            @click="onShareTwitter"
          >
            {{ $tt('Share on Twitter') }}
          </Button>
        </div>
        <Button
          class="reward__copy-invitation-link"
          block
          normal
          @click="onCopyInvitationLink"
        >
          {{ $tt('Copy to friends') }}
        </Button>
      </template>
      <template v-else>
        <div
          class="reward__invitation-link reward__invitation-link__label"
        >
          {{ $tt("You do not have a DAS account, register your DAS account to generate an invitation link and get the reward.") }}
        </div>
        <Button
          class="reward__register-now"
          success
          block
          @click="goHome"
        >
          {{ $tt('Register Now') }}
        </Button>
      </template>
      <RecordContainer class="reward__bonus" :title="$tt('Transferable Balance')">
        <i18n
          tag="div"
          class="reward__my-bonus__unissued-tip"
          path="邀请奖励说明"
          :i18nkey="$tt('邀请奖励说明')"
        >
          <template
            slot="minMergeBonus"
          >
            {{ `${thousandSplit(shrinkUnit(minMergeBonus, 0))}` }}
          </template>
          <template
            slot="faq"
          >
            <a
              :href="$i18n.locale === 'zh-CN' ? 'https://docs.did.id/zh/faq#%E9%82%80%E8%AF%B7%E4%BA%BA-%E6%B8%A0%E9%81%93%E5%A5%96%E5%8A%B1%E7%9A%84%E7%BB%93%E7%AE%97%E6%98%AF%E4%B8%AD%E5%BF%83%E5%8C%96%E7%9A%84%E5%90%97-%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E6%BB%A1%E4%B8%80%E5%AE%9A%E6%95%B0%E9%A2%9D%E4%B9%8B%E5%90%8E%E6%89%8D%E4%BC%9A%E5%8F%91%E6%94%BE' : 'https://docs.did.id/faq#is-the-settlement-of-inviter-channel-rewards-centralized-and-why-are-they-paid-out-only-after-a-certain-amount-is-reached'"
              target="_blank"
            >
              <Iconfont
                name="info"
                color="#A0A1AB"
                size="18"
              />
            </a>
          </template>
        </i18n>
        <div class="reward__split-line" />
        <div
          class="reward__action-button"
          @click="onManageBalance"
        >
          {{ $tt('Manage Balance') }}
        </div>
      </RecordContainer>
      <RecordContainer
        class="reward__margin-bottom-32"
        :title="$tt('Transfer out records')"
      >
        <template v-if="transferOutRecords.length === 0">
          <div class="reward__no-record">
            {{ $tt('No record') }}
          </div>
        </template>
        <template v-else>
          <div class="reward__transfer-out-total">
            {{ $tt('Cumulative transfer out {transferOutTotal} CKB', { transferOutTotal: thousandSplit(transferOutTotal) }) }}
          </div>
          <table class="reward__table">
            <thead>
              <tr class="reward__thead__tr">
                <th class="reward__thead__th">
                  {{ $tt('Bonus (CKB)') }}
                </th>
                <th class="reward__thead__th reward__thead__th__align-right">
                  Hash
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(record, index) in transferOutRecords"
                :key="index"
                class="reward__tbody__tr"
              >
                <td class="reward__tbody__td">
                  {{ record.amount }}
                </td>
                <td class="reward__tbody__td reward__thead__th__align-right">
                  <a
                    class="reward__table__link"
                    :href="`${CKB.explorerTrx}${record.hash}`"
                    target="_blank"
                  >
                    {{ collapseString(record.hash, 8, 8) }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="reward__split-line" />
          <div
            class="reward__action-button"
            @click="goTransferOutRecords"
          >
            {{ $tt('View all') }}
          </div>
        </template>
      </RecordContainer>
      <RecordContainer :title="$tt('Reward records')">
        <template v-if="rewardRecords.length === 0">
          <div class="reward__no-record">
            {{ $tt('No record, go ahead and invite~') }}
          </div>
        </template>
        <template v-else>
          <table class="reward__table">
            <thead>
              <tr class="reward__thead__tr">
                <th class="reward__thead__th">
                  {{ $tt('Bonus (CKB)') }}
                </th>
                <th class="reward__thead__th reward__thead__th__align-right">
                  {{ $tt(`Invitees's DAS`) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(record, index) in rewardRecords"
                :key="index"
                class="reward__tbody__tr"
              >
                <td class="reward__tbody__td">
                  {{ record.reward }}
                </td>
                <td class="reward__tbody__td reward__thead__th__align-right">
                  <nuxt-link
                    class="reward__table__link"
                    :to="`/explorer/account/${record.invitee}`"
                  >
                    {{ toHashedStyle(record.invitee) }}
                  </nuxt-link>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="reward__split-line" />
          <div
            class="reward__action-button"
            @click="goRewardRecords"
          >
            {{ $tt('View all') }}
          </div>
        </template>
      </RecordContainer>
      <BottomSheet
        v-model="selectAccountShowing"
        :title="$tt('Toggle invite link')"
      >
        <ul class="reward__account-list">
          <li
            v-for="item in myAccounts"
            :key="item.account"
            class="reward__account-list__item"
            @click="onSelectAccount(item.account)"
          >
            <span class="reward__account-list__account-info">
              <IconImage
                class="reward__account-list__logo"
                :url="`${IDENTICON_SERVE}${item.account}`"
                :alt="item.account"
                :size="40"
                rounded
              />
              <span class="reward__account-list__account-name">{{ toHashedStyle(item.account) }}</span>
            </span>
            <Iconfont
              v-if="invitationAccount === item.account"
              class="reward__account-list__icon-check"
              name="check"
              color="#22C493"
            />
          </li>
          <li
            v-if="loadMoreShowing"
            class="reward__account-list__action reward__account-list__link"
            @click="getMyAccounts"
          >
            {{ $tt('Load more') }}
          </li>
          <li
            v-else-if="loadingShowing"
            class="reward__account-list__action"
          >
            {{ $tt('Loading') }}
          </li>
          <li
            v-else-if="noMoreShowing"
            class="reward__account-list__action"
          >
            {{ $tt('No more') }}
          </li>
        </ul>
      </BottomSheet>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Button from '~/components/Button.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import {
  collapseString,
  copyText,
  fromSatoshi,
  shrinkUnit,
  thousandSplit,
  isMobile,
  toHashedStyle
} from '~/modules/tools'
import { DEFAULT_PAGE_SIZE, IDENTICON_SERVE } from '~/constant'
import RecordContainer from '~/pages/me/-/RecordContainer.vue'
import BottomSheet from '~/components/BottomSheet.vue'
import IconImage from '~/components/icon/IconImage.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import {
  IAccountInfo,
  IMyRewardsResInviteList,
  ITransferOutRecordsResList
} from '~/services/Account'
import { CKB } from '~/constant/chain'
import { COMMON_KEYS } from '~/store/common'
import config from '~~/config'

export default Vue.extend({
  name: 'Reward',
  components: {
    Button,
    Iconfont,
    RecordContainer,
    BottomSheet,
    IconImage
  },
  computed: {
    isMobile,
    ...mapState({
      common: COMMON_KEYS.namespace,
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType,
      computedChainId: ME_KEYS.computedChainId
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    minMergeBonus (): string {
      const minValue = this.common.config.income_cell_min_transfer_value
      return minValue ? fromSatoshi(minValue) : '0'
    },
    invitationLink (): string {
      return `${config.domain}explorer?inviter=${this.invitationAccount}`
    },
    rewardFactor (): number {
      const rate = this.common?.config?.profit_rate_of_inviter
      return (rate || 0) * 100
    }
  },
  data () {
    return {
      config,
      CKB,
      IDENTICON_SERVE,
      selectAccountShowing: false,
      invitationAccount: this.$route.query.invitationAccount,
      transferOutTotal: '0',
      rewardRecords: [] as IMyRewardsResInviteList[],
      transferOutRecords: [] as ITransferOutRecordsResList[],
      myAccounts: [] as IAccountInfo[],
      page: 0,
      loadMoreShowing: false,
      loadingShowing: false,
      noMoreShowing: false
    }
  },
  mounted () {
    if (!this.invitationAccount) {
      this.invitationAccount = this.myAccounts[0] ? this.myAccounts[0].account : ''
    }
    this.$store.dispatch(COMMON_KEYS.fetchTokens)
    this.getTransferOutRecords()
    this.getMyRewards()
    this.getMyAccounts()
  },
  methods: {
    shrinkUnit,
    thousandSplit,
    collapseString,
    toHashedStyle,
    onManageBalance () {
      if (this.isMobile) {
        window.location.href = config.dasBalance
      }
      else {
        window.open(config.dasBalance)
      }
    },
    onShareTwitter () {
      const text = `\uD83E\uDD29I have got a cool "${this.invitationAccount}"! @dotbitHQ\n\n\uD83D\uDE80Come get your .bit now!\n\nRegister & Get a ✨5% discount:\n${config.domain}explorer?inviter=${this.invitationAccount}`
      const url = `https://twitter.com/compose/tweet?text=${encodeURIComponent(text)}`
      window.open(url)
    },
    async getMyRewards () {
      if (!this.connectedAccount.address) {
        return
      }
      try {
        const res = await this.$services.account.myRewards({
          address: this.connectedAccount.address,
          chainType: this.computedChainType,
          size: 10
        })
        const list = res.list && res.list.map((item: IMyRewardsResInviteList) => {
          return {
            ...item,
            reward: thousandSplit(shrinkUnit(item.reward, CKB.decimals))
          }
        })
        this.rewardRecords = list
      }
      catch (err) {
        console.error(err)
      }
    },
    async getTransferOutRecords () {
      if (!this.connectedAccount.address) {
        return
      }
      try {
        const res = await this.$services.account.transferOutRecords({
          address: this.connectedAccount.address,
          chainType: this.computedChainType,
          size: 10
        })
        this.transferOutTotal = shrinkUnit(res.total, CKB.decimals)
        const list = res.list && res.list.map((item: ITransferOutRecordsResList) => {
          return {
            ...item,
            amount: thousandSplit(shrinkUnit(item.amount, CKB.decimals))
          }
        })
        this.transferOutRecords = list
      }
      catch (err) {
        console.error(err)
      }
    },
    async getMyAccounts () {
      if (!this.connectedAccount.address) {
        return
      }
      if (this.page > 0) {
        this.loadMoreShowing = false
        this.loadingShowing = true
      }

      try {
        this.page = this.page + 1
        const res = await this.$services.account.myAccounts({
          chain_type: this.computedChainType,
          address: this.connectedAccount.address,
          page: this.page,
          keyword: ''
        })
        this.loadingShowing = false
        if (res && res.list) {
          this.myAccounts.push(...res.list)
          const length = res.list.length
          if (this.page === 1 && !this.invitationAccount) {
            this.invitationAccount = res.list[0]?.account
          }
          if (length < DEFAULT_PAGE_SIZE) {
            this.loadMoreShowing = false
            this.noMoreShowing = true
          }
          else {
            this.loadMoreShowing = true
          }
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    onChangeInvitationLink () {
      this.selectAccountShowing = true
    },
    onSelectAccount (accountName: string) {
      this.invitationAccount = accountName
      this.selectAccountShowing = false
      this.getMyRewards()
    },
    onCopyInvitationLink () {
      if (this.myAccounts.length === 0) {
        this.$alert({
          title: this.$tt('Tips'),
          message: (this.$tt('You have not registered for a DAS account yet, you cannot invite others to register, go register for a DAS account now!') as string)
        })
        return
      }
      copyText(this.invitationLink).then(() => {
        this.$toast('👌 ' + this.$tt('Copied'))
      })
    },
    goHome () {
      this.$router.push('/explorer')
    },
    goRewardRecords () {
      this.$router.push('/me/reward-records')
    },
    goTransferOutRecords () {
      this.$router.push('/me/transfer-out-records')
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.reward__container {
  margin: 12px 0 26px 0;
  padding: 24px;
  border-radius: 16px;
  background: $white;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%);
  text-align: center;
}

.reward__logo {
  width: 104px;
}

.reward__title {
  margin: 24px 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: $primary-font-color;
}

.reward__factor-desc {
  margin-bottom: 24px;
  font-size: 14px;
  color: $assist-font-color;
  line-height: 20px;
}

.reward__invitation-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  border: $container-border;
  text-align: left;
  word-break: break-all;
  cursor: pointer;

  &:hover {
    background: #F6F7F9;
  }
}

.reward__invitation-link__label {
  font-size: 12px;
  color: $assist-font-color;
  line-height: 18px;
}

.reward__invitation__icon-toggle {
  min-width: 24px;
}

.reward__account-list {
  height: 380px;
  padding: 24px 0 20px 0;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0 !important;
  }
}

.reward__account-list__action {
  margin: 26px;
  text-align: center;
  line-height: 20px;
  color: $assist-font-color;
}

.reward__account-list__link {
  cursor: pointer;
  color: $link-font-color;
}

.reward__account-list__item {
  margin-bottom: 16px;
  padding: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $white;
  border-radius: 16px;
  border: $container-border;
  cursor: pointer;

  &:hover {
    background: #F6F7F9;
  }
}

.reward__account-list__account-name {
  word-break: break-all;
  text-align: left;
  margin-right: 14px;
}

.reward__account-list__icon-check {
  min-width: 24px;
}

.reward__account-list__logo {
  margin-right: 16px;
}

.reward__account-list__account-info {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: $primary-font-color;
}

.reward__invitation-link__action {
  margin: 24px 0 10px 0;
  display: flex;
}

.reward__copy-invitation-link {
  margin-bottom: 32px;
  height: 52px;
  border-radius: 9px;
  font-size: 18px;
  border: 1px solid #ECEFF6;
}

.reward__register-now {
  margin: 24px 0 32px 0;
  height: 52px;
  border-radius: 9px;
  font-size: 18px;
}

.reward__share-picture {
  margin-right: 10px;
  flex: 1;
  height: 52px;
  border-radius: 9px;
  font-size: 18px;
}

.reward__share-on-twitter {
  margin-left: 10px;
  flex: 1;
  height: 52px;
  border-radius: 9px;
  font-size: 18px;
  background: #1DA1F2;
}

.reward__bonus {
  margin-bottom: 32px;
}

.reward__my-bonus {
  margin-top: 12px;
  line-height: 38px;
  font-size: 32px;
  font-family: $barlow-medium;
  color: #FE61A0;
}

.reward__my-bonus-fiat-currency {
  margin: 6px 0 16px 0;
  font-size: 12px;
  font-weight: 600;
  color: $assist-font-color;
}

.reward__my-bonus__unissued-tip {
  margin: 20px 0;
  font-size: 14px;
  color: $assist-font-color;
  line-height: 16px;
}

.reward__split-line {
  margin-bottom: 6px;
  height: 1px;
  background: $container-border-color;
  opacity: 0.3;
}

.reward__action-button {
  height: 30px;
  color: $focus-color;
  line-height: 30px;
  cursor: pointer;
}

.reward__no-record {
  display: flex;
  justify-content: center;
  height: 80px;
  align-items: center;
  font-weight: 600;
  color: $assist-font-color;
}

.reward__transfer-out-total {
  font-size: 12px;
  color: $assist-font-color;
}

.reward__table {
  display: flex;
  flex-direction: column;
}

.reward__thead__tr {
  display: flex;
  box-shadow: 0 1px 0 0 $normal-color;
}

.reward__thead__th {
  display: flex;
  align-items: center;
  flex: 1;
  height: 28px;
  font-size: 12px;
  color: $assist-font-color;
  font-weight: 400;
}

.reward__thead__th__align-right {
  justify-content: flex-end;
}

.reward__tbody__tr {
  display: flex;
}

.reward__tbody__td {
  display: flex;
  align-items: center;
  flex: 1;
  height: 50px;
  font-weight: 600;
}

.reward__table__link {
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: $link-font-color;
}

.reward__margin-bottom-32 {
  margin-bottom: 32px;
}
</style>
