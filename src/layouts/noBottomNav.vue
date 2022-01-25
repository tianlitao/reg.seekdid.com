<template>
  <div
    :class="{
      'layout-no-bottom-nav': !isMobile
    }"
  >
    <TopNav v-if="!isMobile" />
    <div
      :class="{
        'layout-no-bottom-nav__container': !isMobile,
        'layout-no-bottom-nav__container_mobile': isMobile
      }"
      :style="{ minHeight: isMobile && minHeight }"
    >
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TopNav from '~/components/nav/TopNav.vue'
import { isMobile } from '~/modules/tools'

export default Vue.extend({
  name: 'LayoutNoBottomNav',
  components: {
    TopNav
  },
  computed: {
    isMobile,
    minHeight () {
      return `${window.innerHeight}px`
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.layout-no-bottom-nav {
  padding-bottom: 24px;
  min-height: calc(100vh - 24px);
  background: $background;
}

.layout-no-bottom-nav__container {
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

.layout-no-bottom-nav__container_mobile {
  display: flex;
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
}
</style>
