<template>
  <div class="record-container">
    <h4 class="record-container__title">{{ title }}</h4>
    <div class="record-container__content">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'RecordContainer',
  components: {

  },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {

    }
  },
  methods: {

  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.record-container {
  position: relative;
}

.record-container__title {
  position: relative;
  margin: 0 auto;
  width: 174px;
  height: 34px;
  line-height: 34px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  background-color: $white;
  background-image: url('/images/me/record-container-header.png');
}

.record-container__content {
  margin-top: -18px;
  padding: 18px 16px 8px 16px;
  background: #FFFFFF;
  border: 1px solid #ECEFF6;
  border-radius: 12px;
}
</style>
