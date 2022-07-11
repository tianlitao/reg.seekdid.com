<template>
  <nav class="bottom-nav">
    <nuxt-link
      v-for="(menu, index) in menus"
      :key="index"
      class="bottom-nav__item"
      :to="menu.path">
      <Iconfont
        :name="menu.icon"
        :color="isTargetPath(menu.path) ? '#22C493' : '#A0A1AB'"/>
      <span
        class="bottom-nav__item__text"
        :class="{ 'bottom-nav__item__text_active': isTargetPath(menu.path) }">
        {{ $tt(menu.text) }}
      </span>
    </nuxt-link>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import NavMixin from '~/components/nav/Nav.mixin.vue'

export default Vue.extend({
  name: 'BottomNav',
  components: {
    Iconfont
  },
  mixins: [NavMixin]
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.bottom-nav {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 100%;
  height: calc(48px + constant(safe-area-inset-bottom));
  height: calc(48px + env(safe-area-inset-bottom));
  background-color: $white;
  box-shadow: 0px -1px 0px 0px rgb(0 0 0 / 10%);
}

.bottom-nav__item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding-top: 6px;
}

.bottom-nav__item__text {
  margin-top: 4px;
  font-size: $font-size-12;
  font-weight: 600;
  color: #8E8E93;
  line-height: 12px;
}

.bottom-nav__item__text_active {
  color: $success-font-color;
}
</style>
