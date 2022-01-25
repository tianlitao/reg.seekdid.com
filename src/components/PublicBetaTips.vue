<template>
  <a
    class="public-beta-tips"
    :href="$i18n.locale === 'zh' ? 'https://mp.weixin.qq.com/s/4R5DMOIZtn5ZysDKipxnTw' : 'https://dasystems.medium.com/das-public-beta-is-live-ed9c8e1f01cc'"
    target="_blank"
  >
    🎁 {{ $t('Learn about the rules and benefits of the public test') }} →
  </a>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PublicBetaTips'
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.public-beta-tips {
  margin-bottom: 12px;
  padding: 14px;
  display: block;
  text-align: center;
  background: #FF789C;
  font-size: 13px;
  color: $white;
  line-height: 21px;
  font-weight: 600;
  border-radius: 12px;
}
</style>
