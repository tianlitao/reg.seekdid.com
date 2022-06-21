<template>
  <div
    :class="{
      'layout-apps': !isMobile
    }"
  >
    <TopNav v-if="!isMobile" />
    <div
      :class="{
        'layout-apps__container': !isMobile,
        'layout-apps__container_mobile': isMobile
      }"
    >
      <Nuxt />
    </div>
    <BottomNav v-if="isMobile" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BottomNav from '~/components/nav/BottomNav.vue'
import TopNav from '~/components/nav/TopNav.vue'
import { isMobile } from '~/modules/tools'

export default Vue.extend({
  name: 'LayoutApps',
  components: {
    TopNav,
    BottomNav
  },
  computed: {
    isMobile
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.layout-apps {
  padding-bottom: 24px;
  min-height: calc(100vh - 24px);
  background: #F7F8F9;
}

.layout-apps__container {
  display: flex;
  margin: 32px auto 0 auto;
  width: 555px;
}

.layout-apps__container_mobile {
  display: flex;
  margin-bottom: calc(48px + constant(safe-area-inset-bottom));
  margin-bottom: calc(48px + env(safe-area-inset-bottom));
}
</style>
