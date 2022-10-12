<template>
  <div
    class="register-guide-card__container"
    :style="{ backgroundColor: backgroundColor }"
  >
    <Iconfont
      class="register-guide-card__icon"
      :name="iconName"
      size="32"
    />
    <div class="register-guide-card__text">
      <div class="register-guide-card__title">
        {{ title }}
      </div>
      <div
        v-if="description"
        class="register-guide-card__description"
      >
        {{ description }}
      </div>
    </div>
    <Iconfont
      class="register-guide-card__arrow"
      name="arrow-right"
      color="#31333E"
      size="14"
    />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import Iconfont from '~/components/icon/Iconfont.vue'

export default defineComponent({
  name: 'RegisterGuideCard',
  components: {
    Iconfont
  },
  props: {
    title: String,
    description: String,
    backgroundColor: String,
    iconName: String
  },
  setup () {
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.register-guide-card__container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 311px;
  margin: 0 auto 12px auto;
  border: 1px solid rgba(98, 126, 234, 0.1);
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

.register-guide-card__icon {
  width: 32px;
  height: 32px;
  padding-left: 20px;
  padding-right: 12px;
}

.register-guide-card__text {
  flex: 1;
  text-align: left;
  padding: 20px 0;
}

.register-guide-card__title {
  font-size: $font-size-16;
  font-weight: bold;
  color: $primary-font-color;
}

.register-guide-card__description {
  margin-top: 4px;
  font-size: $font-size-12;
  color: $assist-font-color;
}

.register-guide-card__arrow {
  padding-right: 30px;
}
</style>
