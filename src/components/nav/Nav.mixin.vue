<template>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      menus: [
        {
          icon: 'tab-explorer',
          text: 'Explorer',
          path: '/explorer'
        },
        // {
        //   icon: 'tab-auction',
        //   text: 'Bid',
        //   path: '/auction'
        // },
        {
          icon: 'tab-me',
          text: 'My',
          path: '/me'
        }
      ]
    }
  },
  methods: {
    isTargetPath (path: string): boolean {
      return this.$route.path.includes(path)
    }
  }
})
</script>
