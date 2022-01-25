<template>
  <span class="lang-switcher">
    <span class="lang-switcher__trigger" @click="showOptions">
      {{ $i18n.localeProperties.name }}
      <Iconfont
        class="lang-switcher__trigger__icon"
        name="toggle"
        size="16"
        color="#11142D"
      />
    </span>
    <BottomSheet
      v-model="showing"
      :title="$t('Switch Language')"
    >
      <ul class="lang-switcher__list">
        <li
          v-for="locale in availableLocales"
          :key="locale.code"
          class="lang-switcher__list__item"
          @click="switchLocalePath(locale.code)"
        >
          <span>{{ locale.name }}</span>
          <span v-if="$i18n.locale === locale.code">
            <Iconfont name="check" color="#22C493" />
          </span>
        </li>
      </ul>
    </BottomSheet>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import BottomSheet from '~/components/BottomSheet.vue'

export default Vue.extend({
  name: 'LangSwitcher',
  components: {
    Iconfont,
    BottomSheet
  },
  data () {
    return {
      showing: false
    }
  },
  computed: {
    availableLocales () {
      return this.$i18n.locales
    }
  },
  methods: {
    switchLocalePath (code: string) {
      this.showing = false
      this.$i18n.setLocale(code)
    },
    showOptions () {
      this.showing = true
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.lang-switcher {
  display: inline-flex;
  height: 32px;
  cursor: pointer;
}

.lang-switcher__trigger {
  display: inline-flex;
  padding: 8px 8px 8px 12px;
  background: $normal-color;
  border-radius: 8px;
  color: $assist-font-color;
  font-size: 14px;

  &:hover {
    background: #073A8D;
    background: rgba(7, 58, 141, 0.08);
  }
}

.lang-switcher__trigger__icon {
  margin-left: 4px;
}

.lang-switcher__list {
  height: 380px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0 !important;
  }
}

.lang-switcher__list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 24px 0 16px;
  margin-bottom: 16px;
  border: $container-border;
  border-radius: 16px;
  font-size: 18px;
  color: $primary-font-color;

  &:hover {
    background: #F6F7F9;
  }
}
</style>
