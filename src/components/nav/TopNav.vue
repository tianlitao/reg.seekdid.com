<template>
  <div class="top-nav">
    <div class="top-nav__container">
      <a
        href="https://did.id"
        target="_blank"
      >
        <img class="top-nav__logo" src="/images/explorer/das-logo.png" alt="logo">
      </a>
      <nav class="top-nav__menus">
        <nuxt-link
          v-for="(menu, index) in menus"
          :key="index"
          class="top-nav__item"
          :class="{ 'top-nav__item_active': isTargetPath(menu.path) }"
          :to="menu.path"
        >
          <span class="top-nav__item__text">{{ $tt(menu.text) }}</span>
          <span
            v-if="isTargetPath(menu.path)"
            class="top-nav__item__tag"
          />
        </nuxt-link>
        <a
          class="top-nav__item"
          :href="didtop"
          target="_self"
        >
          <span class="top-nav__item__text top-nav__item__marketplace">
            {{ $tt('Marketplace') }}
            <Iconfont
              class="top-nav__item__marketplace__icon"
              name="arrow-right-up"
              size="7"
              color="#11142D"
            />
          </span>
        </a>
      </nav>
      <LangSwitcher />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavMixin from '~/components/nav/Nav.mixin.vue'
import LangSwitcher from '~/components/LangSwitcher.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { didtop } from '~~/config'

export default Vue.extend({
  name: 'TopNav',
  components: {
    LangSwitcher,
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

.top-nav {
  height: 60px;
  background: $white;
  box-shadow: 0 1px 0 0 $container-border-color;
}

.top-nav__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  max-width: 1200px;
  box-shadow: 0 1px 0 0 $container-border-color;
}

.top-nav__logo {
  height: 28px;
}

.top-nav__menus {
  display: flex;
  min-width: $pc-layout-container-width;
}

.top-nav__item {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 60px;
  font-size: 16px;
  font-weight: 600;
  color: $primary-font-color;
  cursor: pointer;
}

.top-nav__item__text {
  padding: 0 12px;
  height: 36px;
  border-radius: 8px;
  line-height: 36px;

  &:hover {
    background: rgba(7, 58, 141, 0.08);
  }
}

.top-nav__item_active {
  color: #667FFF;
}

.top-nav__item__tag {
  position: absolute;
  width: 34px;
  height: 2px;
  background: #667FFF;
  border-radius: 100px 100px 0 0;
  bottom: 0;
}

.top-nav__item__marketplace {
  display: flex;
}

.top-nav__item__marketplace__icon {
  margin-top: 6px;
  margin-left: 2px;
}
</style>
