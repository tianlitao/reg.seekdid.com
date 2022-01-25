<template>
  <BottomSheet
    :showing="showing"
    :title="$t('Confirm information')"
    @close="onClose">
    <div class="confirm-changes__container">
      <div class="confirm-changes__content">
        <div
          v-if="addressParsingRecords.length > 0"
          class="confirm-changes__group">
          {{ $t('Address') }}
        </div>
        <div
          v-for="(record, index) in addressParsingRecords"
          :key="`address${index}`"
          class="confirm-changes__item">
          <span class="confirm-changes__item__header">
            <ActionLabel
              class="confirm-changes__item__action-label"
              :action="record.action"/>
            <span :class="{ 'confirm-changes__item_delete': record.action === ParsingRecordAction.delete }">
              {{ findParsingRecordChain(record.key).text }}
            </span>
          </span>
          <span
            class="confirm-changes__item__value"
            :class="{ 'confirm-changes__item_delete': record.action === ParsingRecordAction.delete }">
            {{ collapseString(record.value, 5, 5) }}
          </span>
        </div>
        <div
          v-if="profileParsingRecords.length > 0"
          class="confirm-changes__group confirm-changes__margin-top-14">
          {{ $t('Profile') }}
        </div>
        <div
          v-for="(record, index) in profileParsingRecords"
          :key="`profile${index}`"
          class="confirm-changes__item">
          <span class="confirm-changes__item__header">
            <ActionLabel
              class="confirm-changes__item__action-label"
              :action="record.action"/>
            <span
              class="confirm-changes__item__capitalize"
              :class="{ 'confirm-changes__item_delete': record.action === ParsingRecordAction.delete }">
              {{ record.key }}
            </span>
          </span>
          <span
            class="confirm-changes__item__value"
            :class="{ 'confirm-changes__item_delete': record.action === ParsingRecordAction.delete }">
            {{ record.value.length > 16 ? collapseString(record.value, 6, 6) : record.value }}
          </span>
        </div>
        <div
          v-if="dwebParsingRecords.length > 0"
          class="confirm-changes__group confirm-changes__margin-top-14">
          DWeb
        </div>
        <div
          v-for="(record, index) in dwebParsingRecords"
          :key="`dweb${index}`"
          class="confirm-changes__item">
          <span class="confirm-changes__item__header">
            <ActionLabel
              class="confirm-changes__item__action-label"
              :action="record.action"/>
            <span :class="{ 'confirm-changes__item_delete': record.action === ParsingRecordAction.delete }">
              {{ getDwebKeyOptionsKey(record.key) }}
            </span>
          </span>
          <span
            class="confirm-changes__item__value"
            :class="{ 'confirm-changes__item_delete': record.action === ParsingRecordAction.delete }">
            {{ record.value.length > 16 ? collapseString(record.value, 6, 6) : record.value }}
          </span>
        </div>
        <div
          v-if="customParsingRecords.length > 0"
          class="confirm-changes__group confirm-changes__margin-top-14">
          {{ $t('Custom') }}
        </div>
        <div
          v-for="(record, index) in customParsingRecords"
          :key="`custom${index}`"
          class="confirm-changes__item">
          <span class="confirm-changes__item__header">
            <ActionLabel
              class="confirm-changes__item__action-label"
              :action="record.action"/>
            <span :class="{ 'confirm-changes__item_delete': record.action === ParsingRecordAction.delete }">
              {{ collapseString(record.key, 4, 4) }}
            </span>
          </span>
          <span
            class="confirm-changes__item__value"
            :class="{ 'confirm-changes__item_delete': record.action === ParsingRecordAction.delete }">
            {{ record.value.length > 16 ? collapseString(record.value, 6, 6) : record.value }}
          </span>
        </div>
      </div>
    </div>
    <WalletConnectTips />
    <Button
      class="confirm-changes__button"
      block
      success
      @click="onSave">
      {{ $t('Confirm changes') }}
    </Button>
  </BottomSheet>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import WalletConnectTips from '~/components/WalletConnectTips.vue'
import BottomSheet from '~/components/BottomSheet.vue'
import Button from '~/components/Button.vue'
import { IAccountParsingRecord, ParsingRecordAction } from '~/services/Account'
import { collapseString, findParsingRecordChain } from '~/modules/tools'
import ActionLabel from '~/pages/me/-/ActionLabel.vue'
import { DWEB_KEY_OPTIONS } from '~/constant'

export default Vue.extend({
  name: 'ConfirmChanges',
  components: {
    BottomSheet,
    Button,
    ActionLabel,
    WalletConnectTips
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: false
    },
    addressParsingRecords: {
      type: Array as PropType<IAccountParsingRecord[]>,
      required: true
    },
    profileParsingRecords: {
      type: Array as PropType<IAccountParsingRecord[]>,
      required: true
    },
    dwebParsingRecords: {
      type: Array as PropType<IAccountParsingRecord[]>,
      required: true
    },
    customParsingRecords: {
      type: Array as PropType<IAccountParsingRecord[]>,
      required: true
    }
  },
  data () {
    return {
      ParsingRecordAction
    }
  },
  methods: {
    findParsingRecordChain,
    collapseString,
    onSave () {
      this.$emit('confirm')
      this.$emit('close', false)
    },
    onClose () {
      this.$emit('close', false)
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

.confirm-changes__container {
  height: 370px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0 !important;
  }
}

.confirm-changes__content {
  margin-top: 24px;
  padding: 16px;
  border-radius: 12px;
  border: $container-border;
  background: $normal-color;
}

.confirm-changes__group {
  margin-bottom: 2px;
  font-size: 14px;
  color: $assist-font-color;
}

.confirm-changes__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-weight: 600;
}

.confirm-changes__item_delete {
  color: $third-font-color;
  text-decoration: line-through;
}

.confirm-changes__item__capitalize {
  text-transform: capitalize;
}

.confirm-changes__item__action-label {
  margin-right: 10px;
}

.confirm-changes__button {
  margin-bottom: 34px;
}

.confirm-changes__margin-top-14 {
  margin-top: 14px;
}
</style>
