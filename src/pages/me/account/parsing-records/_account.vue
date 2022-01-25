<template>
  <div :class="isMobile ? 'parsing-records_mobile' : 'parsing-records'">
    <Breadcrumb
      :class="isMobile ? 'parsing-records_mobile__breadcrumb' : 'parsing-records__breadcrumb'"
      :items="breadcrumbItems"
    />
    <div
      class="parsing-records__margin-top-16"
      :class="isMobile ? 'parsing-records__item_mobile' : 'parsing-records__item'"
      @click="addNewParsingRecords"
    >
      <span class="parsing-records__item__header">
        <Iconfont
          class="parsing-records__item__icon"
          name="create"
          color="#22C493"
          size="20"
        />
        {{ $t('Add new record') }}
      </span>
    </div>
    <div v-if="fetchDataLoading" class="parsing-records__loading">
      <StatusTip
        class="parsing-records__loading__tip"
        icon="⏳"
        iconSize="72"
        :tip="$t('Loading...')"
        tipFontSize="14"
      />
    </div>
    <template v-else>
      <div
        v-if="addressLabelShowing"
        class="parsing-records__item__group"
      >
        {{ $t('Address') }}
      </div>
      <template v-for="(record, index) in addressParsingRecords">
        <div
          v-if="record.action !== ParsingRecordAction.delete"
          :key="`address${index}`"
          :class="isMobile ? 'parsing-records__item_mobile' : 'parsing-records__item'"
          @click="modifyParsingRecord(record)"
        >
          <span class="parsing-records__item__header">
            <Iconfont
              class="parsing-records__item__icon"
              name="remove"
              color="#DF4A46"
              size="20"
              @click.stop="deleteParsingRecord(record)"
            />
            {{ findParsingRecordChain(record.key).text }}
          </span>
          <span class="parsing-records__item__other">
            <span
              v-if="record.label"
              class="parsing-records__item__tag"
            >
              {{ record.label }}
            </span>
            <span>{{ collapseString(record.value, 5, 5) }}</span>
            <Iconfont
              class="parsing-records__item__arrow-right"
              name="arrow-right"
              color="#E4E4E4"
            />
          </span>
        </div>
      </template>
      <div
        v-if="profileLabelShowing"
        class="parsing-records__item__group"
      >
        {{ $t('Profile') }}
      </div>
      <template v-for="(record, index) in profileParsingRecords">
        <div
          v-if="record.action !== ParsingRecordAction.delete"
          :key="`profile${index}`"
          :class="isMobile ? 'parsing-records__item_mobile' : 'parsing-records__item'"
          @click="modifyParsingRecord(record)"
        >
          <span class="parsing-records__item__header parsing-records__item__capitalize">
            <Iconfont
              class="parsing-records__item__icon"
              name="remove"
              color="#DF4A46"
              size="20"
              @click.stop="deleteParsingRecord(record)"
            />
            {{ record.key }}
          </span>
          <span class="parsing-records__item__other">
            <span
              v-if="record.label"
              class="parsing-records__item__tag"
            >
              {{ record.label }}
            </span>
            <span>{{ record.value.length > 16 ? collapseString(record.value, 6, 6) : record.value }}</span>
            <Iconfont
              class="parsing-records__item__arrow-right"
              name="arrow-right"
              color="#E4E4E4"
            />
          </span>
        </div>
      </template>
      <div
        v-if="dwebLabelShowing"
        class="parsing-records__item__group"
      >
        DWeb
      </div>
      <template v-for="(record, index) in dwebParsingRecords">
        <div
          v-if="record.action !== ParsingRecordAction.delete"
          :key="`dweb${index}`"
          :class="isMobile ? 'parsing-records__item_mobile' : 'parsing-records__item'"
          @click="modifyParsingRecord(record)"
        >
          <span class="parsing-records__item__header">
            <Iconfont
              class="parsing-records__item__icon"
              name="remove"
              color="#DF4A46"
              size="20"
              @click.stop="deleteParsingRecord(record)"
            />
            {{ getDwebKeyOptionsKey(record.key) }}
          </span>
          <span class="parsing-records__item__other">
            <span
              v-if="record.label"
              class="parsing-records__item__tag"
            >
              {{ record.label }}
            </span>
            <span>{{ record.value.length > 16 ? collapseString(record.value, 6, 6) : record.value }}</span>
            <Iconfont
              class="parsing-records__item__arrow-right"
              name="arrow-right"
              color="#E4E4E4"
            />
          </span>
        </div>
      </template>
      <div
        v-if="customLabelShowing"
        class="parsing-records__item__group"
      >
        {{ $t('Custom') }}
      </div>
      <template v-for="(record, index) in customParsingRecords">
        <div
          v-if="record.action !== ParsingRecordAction.delete"
          :key="`custom${index}`"
          :class="isMobile ? 'parsing-records__item_mobile' : 'parsing-records__item'"
          @click="modifyParsingRecord(record)"
        >
          <span class="parsing-records__item__header">
            <Iconfont
              class="parsing-records__item__icon"
              name="remove"
              color="#DF4A46"
              size="20"
              @click.stop="deleteParsingRecord(record)"
            />
            {{ collapseString(record.key, 4, 4) }}
          </span>
          <span class="parsing-records__item__other">
            <span
              v-if="record.label"
              class="parsing-records__item__tag"
            >
              {{ record.label }}
            </span>
            <span>{{ record.value.length > 16 ? collapseString(record.value, 6, 6) : record.value }}</span>
            <Iconfont
              class="parsing-records__item__arrow-right"
              name="arrow-right"
              color="#E4E4E4"
            />
          </span>
        </div>
      </template>
    </template>
    <div class="parsing-records__bottom-action">
      <div class="parsing-records__bottom-action__tip">
        {{ $t('Save to take effect') }}
      </div>
      <Button
        :loading="saveChangesLoading"
        :disabled="!parsingRecordsIsChanged"
        block
        success
        @click="saveChanges"
      >
        {{ $t('Save changes') }}
      </Button>
    </div>
    <ModifyParsingRecord
      v-model="modifyParsingRecordShowing"
      :record="currentModifyParsingRecord"
      @save="saveModifyParsingRecord"
    />
    <AddParsingRecord
      v-model="addParsingRecordShowing"
      @save="saveNewParsingRecord"
    />
    <ConfirmChanges
      v-model="confirmChangesShowing"
      :addressParsingRecords="addressParsingRecords"
      :profileParsingRecords="profileParsingRecords"
      :dwebParsingRecords="dwebParsingRecords"
      :customParsingRecords="customParsingRecords"
      @confirm="onConfirmChanges"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import {
  IAccountInfo,
  IAccountParsingRecord,
  ParsingRecordAction,
  ParsingRecordType
} from '~/services/Account'
import { collapseString, findParsingRecordChain, isMobile, mmJsonHashAndChainIdHex, sleep } from '~/modules/tools'
import Iconfont from '~/components/icon/Iconfont.vue'
import StatusTip from '~/components/StatusTip.vue'
import Button from '~/components/Button.vue'
import AddParsingRecord from '~/pages/me/-/AddParsingRecord.vue'
import ModifyParsingRecord from '~/pages/me/-/ModifyParsingRecord.vue'
import ConfirmChanges from '~/pages/me/-/ConfirmChanges.vue'
import errno from '~/constant/errno'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { CYCLE_CALL_FUNCTION_TIME, DWEB_KEY_OPTIONS, ORDER_ACTION_TYPE, TRX_STATUS } from '~/constant'
import { COMMON_KEYS } from '~/store/common'
import Breadcrumb from '~/components/Breadcrumb.vue'
import { LOCK_SCRIPT_TYPE, NEW_LOCK_SCRIPT_TYPE } from '~/constant/chain'

const PARSING_RECORD_MAX_LIMIT = 100

export default Vue.extend({
  name: 'ParsingRecords',
  components: {
    Iconfont,
    ModifyParsingRecord,
    AddParsingRecord,
    StatusTip,
    ConfirmChanges,
    Button,
    Breadcrumb
  },
  layout: 'noBottomNav',
  data () {
    return {
      ParsingRecordAction,
      fetchDataLoading: false,
      accountName: this.$route.params.account,
      accountInfo: {
        account: this.$route.params.account
      } as IAccountInfo,
      addressParsingRecords: [] as IAccountParsingRecord[],
      profileParsingRecords: [] as IAccountParsingRecord[],
      dwebParsingRecords: [] as IAccountParsingRecord[],
      customParsingRecords: [] as IAccountParsingRecord[],
      currentModifyParsingRecord: {} as IAccountParsingRecord,
      addParsingRecordShowing: false,
      modifyParsingRecordShowing: false,
      parsingRecordsIsChanged: false,
      saveChangesLoading: false,
      confirmChangesShowing: false
    }
  },
  head (): { [key: string]: string } {
    return {
      title: (this.$t('Manage parsing records') as string)
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace,
      common: COMMON_KEYS.namespace
    }),
    ...mapGetters({
      computedChainId: ME_KEYS.computedChainId,
      computedEvmChainId: ME_KEYS.computedEvmChainId
    }),
    isMobile,
    editRecordsThrottle (): number {
      const value = this.common.config.edit_records_throttle
      if (value) {
        return parseInt(String(value / 60))
      }
      return 5
    },
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    addressLabelShowing (): boolean {
      const _records = this.addressParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      return _records.length > 0
    },
    profileLabelShowing (): boolean {
      const _records = this.profileParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      return _records.length > 0
    },
    dwebLabelShowing (): boolean {
      const _records = this.dwebParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      return _records.length > 0
    },
    customLabelShowing (): boolean {
      const _records = this.customParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      return _records.length > 0
    },
    breadcrumbItems (): any {
      return [{
        text: this.$t('My'),
        href: '/me'
      }, {
        text: this.$t('Account details'),
        href: `/me/account/${this.accountName}`
      }, {
        text: this.$t('Manage parsing records')
      }]
    }
  },
  async mounted () {
    this.$store.dispatch(COMMON_KEYS.fetchConfig)
    this.fetchDataLoading = true
    await this.getAccountInfo()
    await this.getAccountParsingRecords()
    this.fetchDataLoading = false
  },
  methods: {
    collapseString,
    findParsingRecordChain,
    async getAccountInfo () {
      try {
        this.accountInfo = await this.$services.account.accountInfo(this.accountName)
      }
      catch (err) {
        console.error(err)
      }
    },
    async getAccountParsingRecords () {
      try {
        const res = await this.$services.account.accountParsingRecords(this.accountName)
        if (res.records && res.records.length > 0) {
          res.records.forEach((record: IAccountParsingRecord) => {
            if (record.type === ParsingRecordType.address) {
              this.addressParsingRecords.push({
                ...record,
                action: ''
              })
            }
            else if (record.type === ParsingRecordType.profile) {
              this.profileParsingRecords.push({
                ...record,
                action: ''
              })
            }
            else if (record.type === ParsingRecordType.dweb) {
              this.dwebParsingRecords.push({
                ...record,
                action: ''
              })
            }
            else if (record.type === ParsingRecordType.customKey) {
              this.customParsingRecords.push({
                ...record,
                action: ''
              })
            }
          })
        }
      }
      catch (err: any) {
        console.error(err)
        this.$alert({
          title: this.$t('Error'),
          message: `${err.code}: ${err.message}`
        })
      }
    },
    addNewParsingRecords () {
      if (this.fetchDataLoading || this.saveChangesLoading) {
        return
      }
      const _total = this.addressParsingRecords.length + this.profileParsingRecords.length + this.customParsingRecords.length
      if (_total >= PARSING_RECORD_MAX_LIMIT) {
        this.$alert({
          title: this.$t('Tips'),
          message: this.$t('You cannot add new parsing records, and the number of parsing records cannot exceed {num}', { num: PARSING_RECORD_MAX_LIMIT })
        })
      }
      else {
        this.addParsingRecordShowing = true
      }
    },
    saveNewParsingRecord (record: IAccountParsingRecord) {
      if (record.type === ParsingRecordType.address) {
        this.addressParsingRecords.push(record)
      }
      else if (record.type === ParsingRecordType.profile) {
        this.profileParsingRecords.push(record)
      }
      else if (record.type === ParsingRecordType.dweb) {
        this.dwebParsingRecords.push(record)
      }
      else if (record.type === ParsingRecordType.customKey) {
        this.customParsingRecords.push(record)
      }
      this.parsingRecordsIsChanged = true
    },
    modifyParsingRecord (record: IAccountParsingRecord) {
      if (this.saveChangesLoading) {
        return
      }
      this.currentModifyParsingRecord = record
      this.modifyParsingRecordShowing = true
    },
    saveModifyParsingRecord (record: IAccountParsingRecord) {
      Object.assign(this.currentModifyParsingRecord, record)
      this.parsingRecordsIsChanged = true
    },
    deleteParsingRecord (record: IAccountParsingRecord) {
      if (this.saveChangesLoading) {
        return
      }
      record.action = ParsingRecordAction.delete
      this.parsingRecordsIsChanged = true
    },
    saveChanges () {
      this.confirmChangesShowing = true
    },
    async onConfirmChanges () {
      this.saveChangesLoading = true
      const _addressParsingRecords = this.addressParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      const _profileParsingRecords = this.profileParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      const _dwebParsingRecords = this.dwebParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      const _customParsingRecords = this.customParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })

      try {
        const res = await this.$services.account.editRecords({
          evm_chain_id: this.computedEvmChainId,
          chain_type: this.computedChainId,
          address: this.connectedAccount.address,
          account: this.accountName,
          raw_param: {
            records: [
              ..._addressParsingRecords,
              ..._profileParsingRecords,
              ..._dwebParsingRecords,
              ..._customParsingRecords
            ]
          }
        })

        if (!res) {
          this.saveChangesLoading = false
          return
        }

        for (const item of res.sign_list) {
          if (item.sign_msg) {
            if (LOCK_SCRIPT_TYPE.eth && item.sign_type === NEW_LOCK_SCRIPT_TYPE.eip712) {
              const mmJson = JSON.parse(JSON.stringify(res.mm_json))
              mmJson.message.digest = item.sign_msg
              const signDataRes = await this.$walletSdk.signData(mmJson, true)
              item.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
            }
            else {
              const signDataRes = await this.$walletSdk.signData(item.sign_msg)
              item.sign_msg = (signDataRes as string)
            }
            // sometimes metamask need a duration to receive next signing request
            await sleep(1000)
          }
        }

        await this.$services.account.sendTrx(res)

        this.confirmChangesShowing = false
        this.parsingRecordsIsChanged = false
        this.$alert({
          title: this.$t('Tips'),
          message: this.$t('Modification has been submitted, it will take about 5 minutes to take effect, please check back later')
        })
        this.checkOrderStatus()
      }
      catch (err: any) {
        console.error(err)
        this.saveChangesLoading = false
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.rpcApiErrAccountFrequencyLimit) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('If the operation is too frequent, please try again after {timeInterval} minutes', { timeInterval: this.editRecordsThrottle })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$t('Tips'),
              message: this.$t('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else {
            this.$alert({
              title: this.$t('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
    },
    async checkOrderStatus () {
      try {
        const res = await this.$services.account.trxStatus({
          evm_chain_id: this.computedEvmChainId,
          chain_type: this.computedChainId,
          address: this.connectedAccount.address,
          actions: [ORDER_ACTION_TYPE.editRecords]
        })
        if (res && res.status === TRX_STATUS.pending) {
          window.setTimeout(() => {
            this.checkOrderStatus()
          }, CYCLE_CALL_FUNCTION_TIME * 2)
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.apiErrorCodeNotExitsTrx) {
          this.saveChangesLoading = false
          this.$toast('👌 ' + this.$t('Modify succeeded'))
        }
      }
    },
    getDwebKeyOptionsKey (value: string): string {
      const res = DWEB_KEY_OPTIONS.find((option) => {
        return option.value === value
      })
      return res ? res.text : ''
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.parsing-records {
  position: relative;
  flex: 1;
  padding: 0 24px 160px 24px;
}

.parsing-records_mobile {
  position: relative;
  flex: 1;
  padding-bottom: 160px;
  background: #F7F8F9;
}

.parsing-records__loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.parsing-records__loading__tip {
  font-weight: 600;
}

.parsing-records__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: $container-border;
  line-height: 17px;
  background: $white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #F6F7F9;
  }
}

.parsing-records__item_mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  line-height: 17px;
  background: $white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #F6F7F9;
  }
}

.parsing-records__item__header {
  display: flex;
  align-items: center;
}

.parsing-records__item__capitalize {
  text-transform:capitalize;
}

.parsing-records__item__other {
  display: flex;
  align-items: center;
}

.parsing-records__item__group {
  margin: 16px 16px 8px 16px;
  font-size: 12px;
  color: $assist-font-color;
}

.parsing-records__item__icon {
  margin-right: 12px;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
}

.parsing-records__item__tag {
  margin-right: 8px;
  padding: 1px 6px;
  max-width: 80px;
  border: $container-border;
  border-radius: 4px;
  font-size: 12px;
  background: $white;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.parsing-records__bottom-action {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 24px 34px 24px;
  background: $white;
}

.parsing-records__bottom-action__tip {
  padding: 8px 0;
  font-weight: 600;
  color: $third-font-color;
  font-size: 12px;
  text-align: center;
}

.parsing-records__margin-top-16 {
  margin-top: 16px;
}

.parsing-records__breadcrumb {
  padding-top: 16px;
}

.parsing-records_mobile__breadcrumb {
  padding: 16px 12px 0 12px;
}
</style>
