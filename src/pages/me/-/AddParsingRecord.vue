<template>
  <Dialog
    :showing="showing"
    :title="$t('Add parsing record')"
    closeButton
    @close="onClose"
  >
    <ValidationObserver
      ref="addParsingRecordForm"
      class="add-parsing-record"
      tag="form"
      @submit.prevent="onSave"
    >
      <div class="add-parsing-record__content">
        <label class="add-parsing-record__label add-parsing-record__margin-top-24">
          {{ $t('Type') }}
        </label>
        <ValidationProvider
          v-slot="{ errors }"
          :name="$t('Type')"
          rules="selectRequired"
        >
          <Select
            v-model="newParsingRecord.type"
            :options="parsingRecordTypeOptions"
            :placeholder="$t('Please select the type')"
            :errorMessages="errors"
            @input="onChangeParsingRecordType"
          />
        </ValidationProvider>
        <template v-if="newParsingRecord.type === ParsingRecordType.address">
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $t('Main Chain') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Main Chain')"
            rules="selectRequired"
          >
            <Select
              v-model="newParsingRecord.key"
              :options="PARSING_RECORD_SUPPORT_CHAINS"
              :placeholder="$t('Please select the main chain')"
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $t('Address') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Address')"
            :rules="`required|address:${newParsingRecord.key}`"
          >
            <TextInput
              v-model.trim="newParsingRecord.value"
              :placeholder="$t('Please enter the address')"
              :errorMessages="errors"
            />
          </ValidationProvider>
        </template>
        <template v-if="newParsingRecord.type === ParsingRecordType.profile">
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $t('Key') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Key')"
            rules="selectRequired"
          >
            <Select
              v-model="newParsingRecord.key"
              :options="PROFILE_KEY_OPTIONS"
              :placeholder="$t('Please select the key')"
              :errorMessages="errors"
              @input="onChangeProfileKey"
            />
          </ValidationProvider>
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ capitalize(newParsingRecord.key) }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="capitalize(newParsingRecord.key)"
            :rules="`required|max:1024|profileValue:${newParsingRecord.key}`"
          >
            <TextInput
              v-model="newParsingRecord.value"
              :placeholder="$t('Please enter {value}', { value: capitalize(newParsingRecord.key) })"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
        </template>
        <template v-if="newParsingRecord.type === ParsingRecordType.dweb">
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $t('Key') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Key')"
            rules="selectRequired"
          >
            <Select
              v-model="newParsingRecord.key"
              :options="DWEB_KEY_OPTIONS"
              :placeholder="$t('Please select the key')"
              :errorMessages="errors"
              @input="onChangeProfileKey"
            />
          </ValidationProvider>
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ getDwebKeyOptionsKey(newParsingRecord.key) }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="getDwebKeyOptionsKey(newParsingRecord.key)"
            rules="required|max:1024"
          >
            <TextInput
              v-model.trim="newParsingRecord.value"
              :placeholder="$t('Please enter {value}', { value: getDwebKeyOptionsKey(newParsingRecord.key) })"
              :errorMessages="errors"
            />
          </ValidationProvider>
        </template>
        <template v-if="newParsingRecord.type === ParsingRecordType.customKey">
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $t('Custom Key') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Custom Key')"
            rules="required|objectkey|max:255"
          >
            <TextInput
              v-model.trim="newParsingRecord.key"
              :placeholder="$t('Please enter custom key')"
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $t('Custom Value') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Custom Value')"
            rules="required|max:1024"
          >
            <TextInput
              v-model="newParsingRecord.value"
              :placeholder="$t('Please enter custom value')"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
        </template>
        <template v-if="newParsingRecord.type">
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $t('Label') }}
            <span class="add-parsing-record__label__tip">({{ $t('Optional') }})</span>
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Label')"
            rules="max:64"
          >
            <TextInput
              v-model="newParsingRecord.label"
              :placeholder="$t('e.g. personal account')"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $t('TTL') }}
            <span class="add-parsing-record__label__tip">({{ $t('Unit: second') }})</span>
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('TTL')"
            rules="positiveIntegers"
          >
            <TextInput
              v-model.trim="newParsingRecord.ttl"
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              :placeholder="$t('{ttl} (recommended)', { ttl: minTTL })"
              :errorMessages="errors"
            />
          </ValidationProvider>
        </template>
      </div>
      <Button
        class="add-parsing-record__margin-top-24"
        type="submit"
        block
        success
      >
        {{ $t('Save') }}
      </Button>
    </ValidationObserver>
    <span slot="action" />
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import {
  IAccountParsingRecord,
  ParsingRecordAction,
  ParsingRecordProfileKey,
  ParsingRecordType
} from '~/services/Account'
import Button from '~/components/Button.vue'
import Select from '~/components/form/Select.vue'
import TextInput from '~/components/form/TextInput.vue'
import Dialog from '~/components/Dialog.vue'
import { PARSING_RECORD_SUPPORT_CHAINS } from '~/constant/chain'
import { COMMON_KEYS } from '~/store/common'
import { capitalize } from '~/modules/tools'
import { DWEB_KEY_OPTIONS, PROFILE_KEY_OPTIONS } from '~/constant'

export default Vue.extend({
  name: 'AddParsingRecord',
  components: {
    ValidationProvider,
    ValidationObserver,
    Dialog,
    Select,
    TextInput,
    Button
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      PARSING_RECORD_SUPPORT_CHAINS,
      ParsingRecordType,
      ParsingRecordProfileKey,
      PROFILE_KEY_OPTIONS,
      DWEB_KEY_OPTIONS,
      newParsingRecord: {
        type: '',
        key: '',
        label: '',
        value: '',
        ttl: '',
        action: ''
      } as IAccountParsingRecord
    }
  },
  computed: {
    ...mapState({
      common: COMMON_KEYS.namespace
    }),
    minTTL (): string {
      return (this.common.config.min_ttl || '300') + ''
    },
    parsingRecordTypeOptions (): { text: any, value: string }[] {
      return [{
        text: this.$t('Address'),
        value: ParsingRecordType.address
      }, {
        text: this.$t('Profile'),
        value: ParsingRecordType.profile
      }, {
        text: 'DWeb',
        value: ParsingRecordType.dweb
      }, {
        text: this.$t('Custom Key'),
        value: ParsingRecordType.customKey
      }]
    }
  },
  watch: {
    minTTL (newVal) {
      this.newParsingRecord.ttl = newVal
    }
  },
  methods: {
    capitalize,
    onClose () {
      this.resetNewParsingRecord()
      this.$emit('close', false)
    },
    onTrim () {
      this.newParsingRecord.label = this.newParsingRecord.label && this.newParsingRecord.label.trim()
      this.newParsingRecord.value = this.newParsingRecord.value && this.newParsingRecord.value.trim()
    },
    async onSave () {
      const verified = await (this.$refs.addParsingRecordForm as HTMLFormElement).validate()
      if (!verified) {
        return
      }
      this.newParsingRecord.action = ParsingRecordAction.add
      this.$emit('save', { ...this.newParsingRecord })
      this.resetNewParsingRecord()
      this.$emit('close', false)
    },
    resetNewParsingRecord () {
      Object.assign(this.newParsingRecord, {
        type: '',
        key: '',
        label: '',
        value: '',
        ttl: this.minTTL,
        action: ''
      })
    },
    onChangeParsingRecordType () {
      Object.assign(this.newParsingRecord, {
        key: '',
        label: '',
        value: '',
        ttl: this.minTTL
      })
    },
    onChangeProfileKey () {
      Object.assign(this.newParsingRecord, {
        label: '',
        value: '',
        ttl: this.minTTL
      })
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

.add-parsing-record {
  display: flex;
  flex-direction: column;
}

.add-parsing-record__content {
  min-height: 300px;
}

.add-parsing-record__label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.add-parsing-record__label__tip {
  font-size: 12px;
  font-weight: 400;
  color: $assist-font-color;
  line-height: 16px;
}

.add-parsing-record__margin-top-24 {
  margin-top: 24px;
}

.add-parsing-record__margin-top-32 {
  margin-top: 32px;
}
</style>
