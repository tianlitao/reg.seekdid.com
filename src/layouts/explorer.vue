<template>
  <div
    :class="{
      'layout-explorer': !isMobile
    }"
  >
    <TopNav v-if="!isMobile" />
    <div
      :class="{
        'layout-explorer__container': !isMobile,
        'layout-explorer__container_mobile': isMobile
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
  name: 'LayoutExplorer',
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

.layout-explorer {
  padding-bottom: 24px;
  min-height: calc(100vh - 24px);
  background: $background;
}

.layout-explorer__container {
  display: flex;
  margin: 24px auto 0 auto;
  width: $pc-layout-container-width;
  min-height: calc(100vh - 66px);
  background: $white;
  box-shadow: $pc-layout-container-box-shadow;
  border-radius: 16px;
  border: $container-border;
  overflow: hidden;
}

.layout-explorer__container_mobile {
  display: flex;
  min-height: 110vh;
  margin-bottom: calc(48px + constant(safe-area-inset-bottom));
  margin-bottom: calc(48px + env(safe-area-inset-bottom));
}
</style>
