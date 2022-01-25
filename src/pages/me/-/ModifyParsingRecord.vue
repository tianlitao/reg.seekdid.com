<template>
  <Dialog
    :showing="showing"
    :title="$t('Edit parsing records')"
    closeButton
    @close="onClose"
  >
    <ValidationObserver
      ref="modifyParsingRecordForm"
      class="modify-parsing-record"
      tag="form"
      @submit.prevent="onSave"
    >
      <div class="modify-parsing-record">
        <template v-if="modifyParsingRecord.type === ParsingRecordType.address">
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $t('Main Chain') }}
          </label>
          <Select
            v-model="modifyParsingRecord.key"
            :options="PARSING_RECORD_SUPPORT_CHAINS"
          />
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $t('Address') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Address')"
            :rules="`required|address:${modifyParsingRecord.key}`"
          >
            <TextInput
              v-model.trim="modifyParsingRecord.value"
              :placeholder="$t('Please enter the address')"
              :errorMessages="errors"
            />
          </ValidationProvider>
        </template>
        <template v-if="modifyParsingRecord.type === ParsingRecordType.profile">
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $t('Key') }}
          </label>
          <Select
            v-model="modifyParsingRecord.key"
            :options="PROFILE_KEY_OPTIONS"
          />
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ capitalize(modifyParsingRecord.key) }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="capitalize(modifyParsingRecord.key)"
            :rules="`required|max:1024|profileValue:${modifyParsingRecord.key}`"
          >
            <TextInput
              v-model="modifyParsingRecord.value"
              :placeholder="$t('Please enter {value}', { value: capitalize(modifyParsingRecord.value) })"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
        </template>
        <template v-if="modifyParsingRecord.type === ParsingRecordType.dweb">
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $t('Key') }}
          </label>
          <Select
            v-model="modifyParsingRecord.key"
            :options="DWEB_KEY_OPTIONS"
          />
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ getDwebKeyOptionsKey(modifyParsingRecord.key) }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="getDwebKeyOptionsKey(modifyParsingRecord.key)"
            rules="required|max:1024"
          >
            <TextInput
              v-model.trim="modifyParsingRecord.value"
              :placeholder="$t('Please enter {value}', { value: modifyParsingRecord.value })"
              :errorMessages="errors"
            />
          </ValidationProvider>
        </template>
        <template v-if="modifyParsingRecord.type === ParsingRecordType.customKey">
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $t('Custom Key') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Custom Key')"
            rules="required|objectkey|max:255"
          >
            <TextInput
              v-model.trim="modifyParsingRecord.key"
              :placeholder="$t('Please enter custom key')"
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $t('Custom Value') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Custom Value')"
            rules="required|max:1024"
          >
            <TextInput
              v-model="modifyParsingRecord.value"
              :placeholder="$t('Please enter custom value')"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
        </template>
        <template v-if="modifyParsingRecord.type">
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $t('Label') }}
            <span class="modify-parsing-record__label__tip">({{ $t('Optional') }})</span>
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('Label')"
            rules="max:64"
          >
            <TextInput
              v-model="modifyParsingRecord.label"
              :placeholder="$t('e.g. personal account')"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $t('TTL') }}
            <span class="modify-parsing-record__label__tip">({{ $t('Unit: second') }})</span>
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$t('TTL')"
            rules="positiveIntegers"
          >
            <TextInput
              v-model.trim="modifyParsingRecord.ttl"
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
        class="modify-parsing-record__margin-top-24"
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
import Vue, { PropType } from 'vue'
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
  name: 'ModifyParsingRecord',
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
    },
    record: {
      type: Object as PropType<IAccountParsingRecord>,
      required: true
    }
  },
  data () {
    return {
      PARSING_RECORD_SUPPORT_CHAINS,
      ParsingRecordType,
      ParsingRecordProfileKey,
      PROFILE_KEY_OPTIONS,
      DWEB_KEY_OPTIONS,
      modifyParsingRecord: {
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
    }
  },
  watch: {
    record (newVal) {
      Object.assign(this.modifyParsingRecord, newVal)
    }
  },
  methods: {
    capitalize,
    onClose () {
      this.$emit('close', false)
    },
    onTrim () {
      this.modifyParsingRecord.label = this.modifyParsingRecord.label && this.modifyParsingRecord.label.trim()
      this.modifyParsingRecord.value = this.modifyParsingRecord.value && this.modifyParsingRecord.value.trim()
    },
    async onSave () {
      const verified = await (this.$refs.modifyParsingRecordForm as HTMLFormElement).validate()
      if (!verified) {
        return
      }
      this.modifyParsingRecord.action = ParsingRecordAction.change
      this.$emit('save', { ...this.modifyParsingRecord })
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

.modify-parsing-record {
  display: flex;
  flex-direction: column;
}

.modify-parsing-record__label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.modify-parsing-record__label__tip {
  font-size: 12px;
  font-weight: 400;
  color: $assist-font-color;
  line-height: 16px;
}

.modify-parsing-record__margin-top-24 {
  margin-top: 24px;
}

.modify-parsing-record__margin-top-32 {
  margin-top: 32px;
}
</style>
