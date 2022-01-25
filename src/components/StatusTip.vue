<template>
  <div
    class="status-tip"
    :style="{ fontSize: `${iconSize}px` }">
    {{ icon }}
    <p
      class="status-tip__tip"
      :style="{ fontSize: `${tipFontSize}px` }">
      {{ tip }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'StatusTip',
  props: {
    icon: {
      type: String,
      required: true
    },
    iconSize: {
      type: String,
      default: '72'
    },
    tip: {
      type: String,
      required: true
    },
    tipFontSize: {
      type: String,
      default: '24'
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.status-tip {
  text-align: center;
}

.status-tip__tip {
  margin-top: 16px;
  font-weight: bold;
}
</style>
