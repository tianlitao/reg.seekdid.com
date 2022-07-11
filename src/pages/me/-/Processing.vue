<template>
  <div
    class="processing"
    @click="onClick"
  >
    <span class="processing_item">
      <Iconfont
        class="processing_icon"
        name="processing"
        color="#E9862D"
        size="18"
      />
      {{ title }}
    </span>
    <span class="processing_item">
      <span class="processing_number">{{ number }}</span>
      <Iconfont
        class="processing_item_arrow-right"
        name="arrow-right"
        color="#E9862D"
        size="16"
      />
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'

export default Vue.extend({
  name: 'Processing',
  components: {
    Iconfont
  },
  props: {
    title: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      required: true
    },
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    onClick () {
      this.$router.push(this.to)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.processing {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background: #FFEDD3;
  border-radius: 8px;
  cursor: pointer;
  color: $warn-font-color;
  font-weight: 600;

  .processing_item {
    display: flex;
    align-items: center;
  }

  .processing_icon {
    margin-right: 8px;
  }

  .processing_item_arrow-right {
    margin-left: 6px;
  }

  .processing_number {
    font-size: $font-size-14;
    font-weight: 600;
    color: $warn-font-color;
    margin-right: -8px;
    margin-top: 1px;
  }
}
</style>
