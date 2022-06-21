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
        {
          icon: 'tab-me',
          text: 'My',
          path: '/me'
        },
        {
          icon: 'tab-apps',
          text: 'Apps',
          path: '/apps'
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
