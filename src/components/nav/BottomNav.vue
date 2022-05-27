<template>
  <nav class="bottom-nav">
    <nuxt-link
      v-for="(menu, index) in menus"
      :key="index"
      class="bottom-nav__item"
      :to="menu.path">
      <Iconfont
        :name="menu.icon"
        :color="isTargetPath(menu.path) ? '#667FFF' : '#A0A1AB'"/>
      <span
        class="bottom-nav__item__text"
        :class="{ 'bottom-nav__item__text_active': isTargetPath(menu.path) }">
        {{ $tt(menu.text) }}
      </span>
    </nuxt-link>
    <a
      class="bottom-nav__item"
      :href="didtop"
      target="_self"
    >
      <Iconfont
        name="tab-market"
        color="#A0A1AB"/>
      <span
        class="bottom-nav__item__text">
        {{ $tt('Marketplace') }}
      </span>
    </a>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import NavMixin from '~/components/nav/Nav.mixin.vue'
import { didtop } from '~~/config'

export default Vue.extend({
  name: 'BottomNav',
  components: {
    Iconfont
  },
  mixins: [NavMixin],
  data () {
    return {
      didtop
    }
  }
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
  font-size: 12px;
  font-weight: 600;
  color: #8E8E93;
  line-height: 12px;
}

.bottom-nav__item__text_active {
  color: #667FFF;
}
</style>
