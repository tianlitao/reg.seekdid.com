<template>
  <div class="account-info-page">
    <Breadcrumb class="account-info-page__breadcrumb" :items="breadcrumbItems" />
    <AccountInfo
      v-if="accountName"
      :accountName="accountName"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AccountInfo from '~/pages/explorer/-/AccountInfo.vue'
import Breadcrumb from '~/components/Breadcrumb.vue'

export default Vue.extend({
  name: 'AccountInfoPage',
  components: {
    AccountInfo,
    Breadcrumb
  },
  layout: 'noBottomNav',
  data () {
    return {
      accountName: this.$route.params.account
    }
  },
  computed: {
    breadcrumbItems (): any {
      return [{
        text: this.$tt('Explorer'),
        href: '/explorer'
      }, {
        text: this.$tt('Account details')
      }]
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.account-info-page {
  flex: 1;
  background: #F7F8F9;
}

.account-info-page__breadcrumb {
  padding: 16px 12px 4px 12px;
}
</style>
