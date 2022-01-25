<template>
  <div
    :class="{
      'layout-default': !isMobile
    }"
  >
    <TopNav v-if="!isMobile" />
    <div
      :class="{
        'layout-default__container': !isMobile,
        'layout-default__container_mobile': isMobile
      }"
      :style="{ minHeight: isMobile && minHeight }"
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
  name: 'LayoutDefault',
  components: {
    TopNav,
    BottomNav
  },
  computed: {
    isMobile,
    minHeight () {
      return `${window.innerHeight - 48}px`
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.layout-default {
  padding-bottom: 24px;
  min-height: calc(100vh - 24px);
  background: $background;
}

.layout-default__container {
  display: flex;
  margin: 24px auto 0 auto;
  width: $pc-layout-container-width;
  min-height: $pc-layout-container-min-height;
  background: $white;
  box-shadow: $pc-layout-container-box-shadow;
  border-radius: 16px;
  border: $container-border;
  overflow: hidden;
}

.layout-default__container_mobile {
  display: flex;
  margin-bottom: calc(48px + constant(safe-area-inset-bottom));
  margin-bottom: calc(48px + env(safe-area-inset-bottom));
}
</style>
