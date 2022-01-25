<template>
  <div class="parsing-records">
    <h3 class="parsing-records__titile">
      <span>{{ $t('DAS records') }}</span>
      <span
        v-if="root && isManager"
        class="parsing-records__titile__action-button"
        :class="{ 'parsing-records__titile__action-button__disabled': !canManage }"
        @click="onManage"
      >{{ $t('Manage') }}</span>
    </h3>
    <ul v-if="accountParsingRecords.length > 0">
      <li
        v-if="addressParsingRecords.length > 0"
        class="parsing-records__item-label"
      >
        {{ $t('Address') }}
      </li>
      <li
        v-for="(record, index) in addressParsingRecords"
        :key="`address${index}`"
        class="parsing-records__item"
      >
        <span>{{ findParsingRecordChain(record.key).text }}</span>
        <span class="parsing-records__item__info">
          <span
            v-if="record.label"
            class="parsing-records__item__tag"
          >{{ record.label }}</span>
          <a
            v-if="record.value && CHAINNAME_TO_CHAIN[record.key].explorerAddress"
            class="parse-record__details__item__link"
            :href="`${CHAINNAME_TO_CHAIN[record.key].explorerAddress}${record.value}`"
            target="_blank"
          >
            {{ collapseString(record.value, 5, 5) }}
          </a>
          <span
            v-else
            class="parse-record__details__item__value"
          >
            {{ collapseString(record.value, 5, 5) }}
          </span>
          <Iconfont
            class="parse-record__details__item__more"
            name="more"
            size="18"
            color="#A0A1AB"
            @click="showParseRecordDetails(record)"
          />
        </span>
      </li>
      <li
        v-if="profileParsingRecords.length > 0"
        class="parsing-records__item-label"
      >
        {{ $t('Profile') }}
      </li>
      <li
        v-for="(record, index) in profileParsingRecords"
        :key="`profile${index}`"
        class="parsing-records__item"
      >
        <span class="parsing-records__item__capitalize">{{ record.key }}</span>
        <span class="parsing-records__item__info">
          <span
            v-if="record.label"
            class="parsing-records__item__tag"
          >{{ record.label }}</span>
          <span class="parsing-records__item__value">{{ record.value.length > 16 ? collapseString(record.value, 6, 6) : record.value }}</span>
          <Iconfont
            name="more"
            size="18"
            color="#A0A1AB"
            @click="showParseRecordDetails(record)"
          />
        </span>
      </li>
      <li
        v-if="dwebParsingRecords.length > 0"
        class="parsing-records__item-label"
      >
        DWeb
      </li>
      <li
        v-for="(record, index) in dwebParsingRecords"
        :key="`dweb${index}`"
        class="parsing-records__item"
      >
        <span>{{ getDwebKeyOptionsKey(record.key) }}</span>
        <span class="parsing-records__item__info">
          <span
            v-if="record.label"
            class="parsing-records__item__tag"
          >{{ record.label }}</span>
          <span class="parsing-records__item__value">{{ record.value.length > 16 ? collapseString(record.value, 6, 6) : record.value }}</span>
          <Iconfont
            name="more"
            size="18"
            color="#A0A1AB"
            @click="showParseRecordDetails(record)"
          />
        </span>
      </li>
      <li
        v-if="customParsingRecords.length > 0"
        class="parsing-records__item-label"
      >
        {{ $t('Custom') }}
      </li>
      <li
        v-for="(record, index) in customParsingRecords"
        :key="`custom${index}`"
        class="parsing-records__item"
      >
        <span>{{ collapseString(record.key, 4, 4) }}</span>
        <span class="parsing-records__item__info">
          <span
            v-if="record.label"
            class="parsing-records__item__tag"
          >{{ record.label }}</span>
          <span class="parsing-records__item__value">
            {{ collapseString(record.value, 5, 5) }}
          </span>
          <Iconfont
            class="parse-record__details__item__more"
            name="more"
            size="18"
            color="#A0A1AB"
            @click="showParseRecordDetails(record)"
          />
        </span>
      </li>
    </ul>
    <div v-else class="parse-record__no-record">
      {{ $t('No record') }}
    </div>
    <Dialog
      v-model="parseRecordDetailsShowing"
      :title="$t('Parse record details')"
      closeButton
    >
      <ul class="parse-record__details">
        <template v-if="parseRecordDetails.type === ParsingRecordType.address">
          <li class="parse-record__details__item">
            <span class="parse-record__details__item__label">{{ $t('Main Chain') }}</span>
            <span class="parse-record__details__value">{{ findParsingRecordChain(parseRecordDetails.key).text }}</span>
          </li>
          <li class="parse-record__details__item">
            <span class="parse-record__details__item__label">{{ $t('Address') }}</span>
            <a
              v-if="parseRecordDetails.value"
              class="parse-record__details__link"
              :href="`${CHAINNAME_TO_CHAIN[parseRecordDetails.key].explorerAddress}${parseRecordDetails.value}`"
              target="_blank"
            >
              {{ parseRecordDetails.value }}
            </a>
            <span
              v-else
              class="parse-record__details__address"
            >
              {{ parseRecordDetails.value }}
            </span>
          </li>
        </template>
        <template v-if="parseRecordDetails.type === ParsingRecordType.profile">
          <li class="parse-record__details__item">
            <span class="parse-record__details__item__label">{{ parseRecordDetails.key }}</span>
            <a
              v-if="/^https?:\/\/.+/.test(parseRecordDetails.value)"
              class="parse-record__details__item__link parse-record__details__value"
              :href="parseRecordDetails.value"
              target="_blank"
            >
              {{ parseRecordDetails.value }}
            </a>
            <a
              v-else-if="ParsingRecordProfileLink[parseRecordDetails.key]"
              class="parse-record__details__item__link parse-record__details__value"
              :href="ParsingRecordProfileLink[parseRecordDetails.key] + parseRecordDetails.value"
              target="_blank"
            >
              {{ parseRecordDetails.value }}
            </a>
            <span
              v-else
              class="parse-record__details__value"
            >
              {{ parseRecordDetails.value }}
            </span>
          </li>
        </template>
        <template v-if="parseRecordDetails.type === ParsingRecordType.dweb">
          <li class="parse-record__details__item">
            <span class="parse-record__details__item__label">{{ parseRecordDetails.key }}</span>
            <a
              v-if="/^https?:\/\/.+/.test(parseRecordDetails.value)"
              class="parse-record__details__item__link parse-record__details__value"
              :href="parseRecordDetails.value"
              target="_blank"
            >
              {{ parseRecordDetails.value }}
            </a>
            <span
              v-else
              class="parse-record__details__value"
            >
              {{ parseRecordDetails.value }}
            </span>
          </li>
        </template>
        <template v-if="parseRecordDetails.type === ParsingRecordType.customKey">
          <li class="parse-record__details__item">
            <span class="parse-record__details__item__label">{{ $t('Custom Key') }}</span>
            <span class="parse-record__details__value">{{ parseRecordDetails.key }}</span>
          </li>
          <li class="parse-record__details__item">
            <span class="parse-record__details__item__label">{{ $t('Custom Value') }}</span>
            <a
              v-if="/^https?:\/\/.+/.test(parseRecordDetails.value)"
              class="parse-record__details__item__link parse-record__details__value"
              :href="parseRecordDetails.value"
              target="_blank"
            >
              {{ parseRecordDetails.value }}
            </a>
            <span
              v-else
              class="parse-record__details__value"
            >
              {{ parseRecordDetails.value }}
            </span>
          </li>
        </template>
        <li
          v-if="parseRecordDetails.label"
          class="parse-record__details__item"
        >
          <span class="parse-record__details__item__label">{{ $t('Label') }}</span>
          <span class="parse-record__details__value">{{ parseRecordDetails.label }}</span>
        </li>
        <li class="parse-record__details__item">
          <span class="parse-record__details__item__label">{{ $t('TTL') }}</span>
          <span class="parse-record__details__value">{{ $t('{duration} seconds', { duration: parseRecordDetails.ttl }) }}</span>
        </li>
      </ul>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { collapseString, findParsingRecordChain } from '~/modules/tools'
import Iconfont from '~/components/icon/Iconfont.vue'
import Dialog from '~/components/Dialog.vue'
import { IAccountInfo, IAccountParsingRecord, ParsingRecordProfileKey, ParsingRecordProfileLink, ParsingRecordType } from '~/services/Account'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { CHAINNAME_TO_CHAIN } from '~/constant/chain'
import { ACCOUNT_STATUS, DWEB_KEY_OPTIONS } from '~/constant'

export default Vue.extend({
  name: 'ParsingRecords',
  components: {
    Iconfont,
    Dialog
  },
  props: {
    root: {
      type: Boolean,
      default: false
    },
    accountInfo: {
      type: Object as PropType<IAccountInfo>,
      required: true
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    isManager (): boolean {
      return !!this.accountInfo.manager && this.connectedAccount.address.toUpperCase() === this.accountInfo.manager.toUpperCase()
    },
    canManage (): boolean {
      return ![ACCOUNT_STATUS.onePriceSell].includes(this.accountInfo.status)
    }
  },
  data () {
    return {
      ParsingRecordProfileLink,
      CHAINNAME_TO_CHAIN,
      ParsingRecordType,
      ParsingRecordProfileKey,
      parseRecordDetailsShowing: false,
      parseRecordDetails: {} as IAccountParsingRecord,
      accountParsingRecords: [] as IAccountParsingRecord[],
      addressParsingRecords: [] as IAccountParsingRecord[],
      profileParsingRecords: [] as IAccountParsingRecord[],
      dwebParsingRecords: [] as IAccountParsingRecord[],
      customParsingRecords: [] as IAccountParsingRecord[]
    }
  },
  mounted () {
    this.getAccountParsingRecords()
  },
  methods: {
    findParsingRecordChain,
    collapseString,
    async getAccountParsingRecords () {
      try {
        const res = await this.$services.account.accountParsingRecords(this.accountInfo.account)
        this.accountParsingRecords = res.records
        if (res.records && res.records.length > 0) {
          res.records.forEach((record: IAccountParsingRecord) => {
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
          })
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    showParseRecordDetails (record: IAccountParsingRecord) {
      this.parseRecordDetails = record
      this.parseRecordDetailsShowing = true
    },
    onManage () {
      if (this.canManage) {
        this.$emit('manage')
      }
      else {
        this.$alert({
          title: this.$t('Tips'),
          message: this.$t('If a DAS account is on sale, it is in a special status and cannot be operated other than renewed and delisted.')
        })
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
  padding: 0 16px 14px 16px;
  border-radius: 16px;
  background: #FFFFFF;
}

.parsing-records__titile {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 18px;
  font-weight: bold;
  padding: 16px 0;
  box-shadow: 0 1px 0 0 $container-border-color;
}

.parsing-records__titile__action-button {
  font-size: 14px;
  font-weight: 400;
  color: $link-font-color;
  cursor: pointer;
}

.parsing-records__titile__action-button__disabled {
  color: $third-font-color;
  cursor: default;
}

.parsing-records__item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.parsing-records__item-label {
  padding: 10px 0 2px 0;
  font-size: 12px;
  color: $assist-font-color;
}

.parsing-records__item__info {
  display: flex;
  align-items: center;
}

.parsing-records__item__capitalize {
  text-transform:capitalize;
}

.parsing-records__item__tag {
  padding: 1px 6px;
  max-width: 80px;
  border-radius: 4px;
  border: $container-border;
  font-size: 12px;
  font-weight: 600;
  color: $primary-font-color;
  line-height: 17px;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.parsing-records__item__value {
  margin: 0 8px;
}

.parse-record__no-record {
  display: flex;
  justify-content: center;
  height: 80px;
  align-items: center;
  color: $assist-font-color;
}

.parse-record__details {
  margin: 12px 0 8px 0;
  padding: 8px 16px 8px 16px;
  background: $normal-color;
  border-radius: 12px;
  border: $container-border;
}

.parse-record__details__item {
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
}

.parse-record__details__item__label {
  font-size: 12px;
  color: $assist-font-color;
  line-height: 16px;
  margin-right: 10px;
  text-transform: capitalize;
}

.parse-record__details__address {
  width: 70%;
  word-break: break-all;
  text-align: right;
  line-height: 17px;
  color: $primary-font-color;
}

.parse-record__details__link {
  width: 70%;
  word-break: break-all;
  text-align: right;
  line-height: 17px;
  color: $link-font-color;
}

.parse-record__details__item__link {
  margin: 0 8px;
  color: $link-font-color;
}

.parse-record__details__item__value {
  margin: 0 8px;
  color: $primary-font-color;
}

.parse-record__details__value {
  margin: 0;
  flex: 1;
  width: 100px;
  word-wrap: break-word;
  text-align: right;
}

.parse-record__details__item__more {
  cursor: pointer;
}
</style>
