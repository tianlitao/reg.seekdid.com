<template>
  <div class="transfer-out-records">
    <Breadcrumb class="transfer-out-records__breadcrumb" :items="breadcrumbItems" />
    <div v-if="fetchDataLoading" class="transfer-out-records__loading">
      <StatusTip
        class="transfer-out-records__loading__tip"
        icon="⏳"
        iconSize="72"
        :tip="$tt('Loading')"
        tipFontSize="14"
      />
    </div>
    <template v-else>
      <table class="transfer-out-records__table">
        <thead>
          <tr class="transfer-out-records__thead__tr">
            <th class="transfer-out-records__thead__th">
              {{ $tt('Bonus (CKB)') }}
            </th>
            <th class="transfer-out-records__thead__th transfer-out-records__thead__th__align-right">
              Hash
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(record, index) in transferOutRecords"
            :key="index"
            class="transfer-out-records__tbody__tr"
          >
            <td class="transfer-out-records__tbody__td">
              {{ record.amount }}
            </td>
            <td class="transfer-out-records__tbody__td transfer-out-records__thead__th__align-right">
              <a
                class="transfer-out-records__table__link"
                :href="`${CKB.explorerTrx}${record.hash}`"
                target="_blank"
              >
                {{ collapseString(record.hash, 8, 8) }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="loadMoreShowing"
        class="transfer-out-records__action transfer-out-records__link"
        @click="getTransferOutRecords"
      >
        {{ $tt('Load more') }}
      </div>
      <div
        v-else-if="loadingShowing"
        class="transfer-out-records__action"
      >
        {{ $tt('Loading') }}
      </div>
      <div
        v-else-if="noMoreShowing"
        class="transfer-out-records__action"
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
import { collapseString, shrinkUnit, thousandSplit } from '~/modules/tools'
import StatusTip from '~/components/StatusTip.vue'
import { CKB } from '~/constant/chain'
import { ITransferOutRecordsResList } from '~/services/Account'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { DEFAULT_PAGE_SIZE } from '~/constant'

export default Vue.extend({
  name: 'TransferOutRecords',
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
        text: this.$tt('Transfer out records')
      }]
    }
  },
  data () {
    return {
      CKB,
      fetchDataLoading: true,
      transferOutRecords: [] as ITransferOutRecordsResList[],
      page: 0,
      loadMoreShowing: false,
      loadingShowing: false,
      noMoreShowing: false
    }
  },
  head (): { [key: string]: string | TranslateResult } {
    return {
      title: this.$tt('Transfer out records')
    }
  },
  mounted () {
    this.getTransferOutRecords()
  },
  methods: {
    collapseString,
    thousandSplit,
    async getTransferOutRecords () {
      if (!this.connectedAccount.address) {
        return
      }

      if (this.page > 0) {
        this.loadMoreShowing = false
        this.loadingShowing = true
      }
      try {
        this.page = this.page + 1
        const res = await this.$services.account.transferOutRecords({
          address: this.connectedAccount.address,
          chainType: this.computedChainType,
          page: this.page
        })
        this.transferOutRecords = res.list && res.list.map((item: ITransferOutRecordsResList) => {
          return {
            ...item,
            amount: thousandSplit(shrinkUnit(item.amount, CKB.decimals))
          }
        })
        this.loadingShowing = false
        const length = this.transferOutRecords.length
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

.transfer-out-records {
  flex: 1;
  background: $background;
}

.transfer-out-records__table {
  display: flex;
  flex-direction: column;
  background: $white;
}

.transfer-out-records__thead__tr {
  display: flex;
}

.transfer-out-records__thead__th {
  display: flex;
  align-items: center;
  flex: 1;
  height: 28px;
  padding: 0 16px;
  font-size: $font-size-12;
  color: $assist-font-color;
  font-weight: 400;
}

.transfer-out-records__thead__th__align-right {
  justify-content: flex-end;
}

.transfer-out-records__tbody__tr {
  display: flex;
  box-shadow: 0px -1px 0px 0px $normal-color;
}

.transfer-out-records__tbody__td {
  display: flex;
  align-items: center;
  flex: 1;
  height: 48px;
  padding: 0 16px;
  font-weight: 600;
}

.transfer-out-records__table__link {
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color
  }
}

.transfer-out-records__action {
  margin: 26px;
  text-align: center;
  line-height: 20px;
  color: $assist-font-color;
}

.transfer-out-records__link {
  cursor: pointer;
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color
  }
}

.transfer-out-records__loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.transfer-out-records__loading__tip {
  font-weight: 600;
}

.transfer-out-records__breadcrumb {
  padding: 16px 12px;
}

</style>
