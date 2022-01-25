<template>
<!--  <div class="index">-->
<!--    <div class="index__title">The DAS Manager is being upgraded, please visit later.</div>-->
<!--    <div class="index__desc">Your DAS account information is stored securely on the blockchain and will not be lost as a result of the manager upgrade. During the upgrade, you will temporarily be unable to manage your DAS, but you can still use DAS normally in Wallets/Dapp products that have DAS integrated.</div>-->
<!--    <div class="index__tips">This upgrade is in preparation for the new features of DAS. Stay tuned.</div>-->
<!--    <div class="index__title index__margin-top-32">DAS 管理器正在升级，请稍后访问。</div>-->
<!--    <div class="index__desc">你的 DAS 账户信息安全的存储在区块链上，不会因为管理器的升级而丢失。升级期间，你将暂时无法管理你的 DAS，但你仍然可以在集成了 DAS 的钱包/Dapp产品中正常使用 DAS。</div>-->
<!--    <div class="index__tips">本次升级是为 DAS 的新特性作准备，敬请期待。</div>-->
<!--  </div>-->
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Index',
  layout: 'empty',
  mounted () {
    this.$router.replace('/explorer')
  }
})
</script>

<style lang="scss" scoped>
.index {
  padding: 65px 20px 0 20px;
  background-color: aliceblue;
  text-align: center;
}

.index__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 14px;
}

.index__desc {
  margin-bottom: 12px;
  line-height: 17px;
}

.index__tips {
  margin-bottom: 12px;
  line-height: 17px;
}

.index__margin-top-32 {
  margin-top: 32px;
}
</style>
