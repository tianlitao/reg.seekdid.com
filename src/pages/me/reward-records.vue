<template>
  <div class="reward-records">
    <Breadcrumb class="reward-records__breadcrumb" :items="breadcrumbItems" />
    <div v-if="fetchDataLoading" class="reward-records__loading">
      <StatusTip
        class="reward-records__loading__tip"
        icon="⏳"
        iconSize="72"
        :tip="$tt('Loading')"
        tipFontSize="14"
      />
    </div>
    <template v-else>
      <table class="reward-records__table">
        <thead>
          <tr class="reward-records__thead__tr">
            <th class="reward-records__thead__th">
              {{ $tt('Bonus (CKB)') }}
            </th>
            <th class="reward-records__thead__th reward-records__thead__th__align-right">
              {{ $tt(`Invitees's DAS`) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(record, index) in rewardRecords"
            :key="index"
            class="reward-records__tbody__tr"
          >
            <td class="reward-records__tbody__td">
              <div>
                <div>{{ record.reward }}</div>
                <div class="reward-records-time">{{ record.invitation_time }}</div>
              </div>
            </td>
            <td class="reward-records__tbody__td reward-records__thead__th__align-right">
              <nuxt-link
                class="reward-records__table__link"
                :to="`/explorer/account/${record.invitee}`"
              >
<!--                <template v-if="isSubAccount(record.invitee)">-->
<!--                  {{ record.invitee.split('.')[1] }}<span class="reward-records__table__link__sub-account">#{{ record.invitee.split('.')[0] }}</span>.{{ record.invitee.split('.')[2] }}-->
<!--                </template>-->
<!--                <template v-else>-->
<!--                  {{ record.invitee }}-->
<!--                </template>-->
                {{ record.invitee }}
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="loadMoreShowing"
        class="reward-records__action reward-records__link"
        @click="getMyRewards"
      >
        {{ $tt('Load more') }}
      </div>
      <div
        v-else-if="loadingShowing"
        class="reward-records__action"
      >
        {{ $tt('Loading') }}
      </div>
      <div
        v-else-if="noMoreShowing"
        class="reward-records__action"
      >
        {{ $tt('No more') }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'
import { mapState, mapGetters } from 'vuex'
import { shrinkUnit, thousandSplit } from '~/modules/tools'
import StatusTip from '~/components/StatusTip.vue'
import { CKB } from '~/constant/chain'
import { IMyRewardsResInviteList } from '~/services/Account'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { DEFAULT_PAGE_SIZE } from '~/constant'
import { SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'
import { formatDateTime } from '~/modules/tools'

export default Vue.extend({
  name: 'RewardRecord',
  components: {
    StatusTip,
    Breadcrumb
  },
  layout: 'noBottomNav',
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    breadcrumbItems (): any {
      return [{
        text: this.$tt('My'),
        href: '/me?tab=reward'
      }, {
        text: this.$tt('Reward records')
      }]
    }
  },
  data () {
    return {
      fetchDataLoading: true,
      rewardRecords: [] as IMyRewardsResInviteList[],
      page: 0,
      loadMoreShowing: false,
      loadingShowing: false,
      noMoreShowing: false
    }
  },
  head (): { [key: string]: string | TranslateResult } {
    return {
      title: this.$tt('Reward records')
    }
  },
  mounted () {
    this.getMyRewards()
  },
  methods: {
    thousandSplit,
    isSubAccount (accont: string): boolean {
      return SUB_ACCOUNT_REG_EXP.test(accont)
    },
    async getMyRewards () {
      if (!this.connectedAccount.address) {
        return
      }

      if (this.page > 0) {
        this.loadMoreShowing = false
        this.loadingShowing = true
      }
      try {
        this.page = this.page + 1
        const res = await this.$services.account.myRewards({
          address: this.connectedAccount.address,
          chainType: this.computedChainType,
          page: this.page
        })
        this.rewardRecords = res.list && res.list.map((item: IMyRewardsResInviteList) => {
          return {
            ...item,
            reward: thousandSplit(shrinkUnit(item.reward, CKB.decimals)),
            invitation_time: formatDateTime(item.invitation_time)
          }
        })
        this.loadingShowing = false
        const length = this.rewardRecords.length
        if (length < DEFAULT_PAGE_SIZE) {
          this.loadMoreShowing = false
          this.noMoreShowing = true
        }
        else {
          this.loadMoreShowing = true
        }
      }
      catch (err) {
        console.error(err)
      }
      finally {
        this.fetchDataLoading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.reward-records {
  flex: 1;
  background: $background;
}

.reward-records__table {
  display: flex;
  flex-direction: column;
  background: $white;
}

.reward-records__thead__tr {
  display: flex;
}

.reward-records__thead__th {
  display: flex;
  align-items: center;
  flex: 1;
  height: 28px;
  padding: 0 16px;
  font-size: $font-size-12;
  color: $assist-font-color;
  font-weight: 400;
}

.reward-records__thead__th__align-right {
  justify-content: flex-end;
}

.reward-records__tbody__tr {
  display: flex;
  box-shadow: 0px -1px 0px 0px $normal-color;
}

.reward-records__tbody__td {
  display: flex;
  align-items: center;
  flex: 1;
  height: 48px;
  padding: 0 16px;
  font-weight: 600;
}

.reward-records__table__link {
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color
  }
}

.reward-records__action {
  margin: 26px;
  text-align: center;
  line-height: 20px;
  color: $assist-font-color;
}

.reward-records__link {
  cursor: pointer;
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color
  }
}

.reward-records__loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.reward-records__loading__tip {
  font-weight: 600;
}

.reward-records__breadcrumb {
  padding: 16px 12px;
}

.reward-records__table__link__sub-account {
  color: $warn-font-color;
}

.reward-records-time {
  font-size: 12px;
  color: $third-font-color;
}
</style>
