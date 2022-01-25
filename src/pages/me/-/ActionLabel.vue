<template>
  <span
    class="action-label"
    :class="{
      'action-label_change': action === ParsingRecordAction.change,
      'action-label_add': action === ParsingRecordAction.add,
      'action-label_delete': action === ParsingRecordAction.delete
    }">
    <template v-if="action === ParsingRecordAction.delete">
      {{ $t('Delete') }}
    </template>
    <template v-else-if="action === ParsingRecordAction.add">
      {{ $t('Add') }}
    </template>
    <template v-else-if="action === ParsingRecordAction.change">
      {{ $t('Modify') }}
    </template>
    <template v-else>
      {{ $t('No change') }}
    </template>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ParsingRecordAction } from '~/services/Account'

export default Vue.extend({
  name: 'ActionLabel',
  props: {
    action: {
      type: String as PropType<ParsingRecordAction>,
      required: true
    }
  },
  data () {
    return {
      ParsingRecordAction
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.action-label {
  display: inline-block;
  width: 64px;
  padding: 3px 6px;
  border: $container-border;
  background: $white;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}

.action-label_change,
.action-label_add {
  color: $success-font-color;
  border: 0;
  background: rgba(0, 223, 155, 0.1);
}

.action-label_delete {
  color: $error-font-color;
  border: 0;
  background: rgba(223, 74, 70, 0.1);
}
</style>
