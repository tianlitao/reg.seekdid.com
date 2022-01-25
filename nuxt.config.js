import abcConfig from './abc.config'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  srcDir: 'src/',
  server: {
    host: abcConfig.host,
    port: abcConfig.port
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'DAS - Cross-chain decentralized account',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { hid: 'description', name: 'description', content: 'DAS is a blockchain-based, decentralized and open sourced account system. It is the first account system with broad compatibility and complete ownership and control by users. DAS can be used as a cryptocurrency collection account, as a domain name, or as an account for accessing general Internet services.' },
      { hid: 'keyword', name: 'keywords', content: 'domain, domain name, blockchain domain, nervos, ckb, das, domain name registration, purchase domain name, website domain, domain name service, domain name hosting, timyang, .bit, domain investment, DNS, buy domain name' },
      // The Open Graph protocol
      { hid: 'og:description', property: 'og:description', content: 'DAS is a blockchain-based, decentralized and open sourced account system. It is the first account system with broad compatibility and complete ownership and control by users. DAS can be used as a cryptocurrency collection account, as a domain name, or as an account for accessing general Internet services.' },
      { hid: 'og:title', property: 'og:title', content: 'DAS - Cross-chain decentralized account' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'DAS - Cross-chain decentralized account' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:url', property: 'og:url', content: 'https://da.systems/' },
      { hid: 'og:image', property: 'og:image', content: `https://${abcConfig.hostname}/images/seo-thumbnail-image.png` },
      // Twitter
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', content: 'DAS - Cross-chain decentralized account' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'DAS - Cross-chain decentralized account' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'DAS is a blockchain-based, decentralized and open sourced account system. It is the first account system with broad compatibility and complete ownership and control by users. DAS can be used as a cryptocurrency collection account, as a domain name, or as an account for accessing general Internet services.' },
      { hid: 'twitter:image', name: 'twitter:image', content: `https://${abcConfig.hostname}/images/seo-thumbnail-image.png` },
      { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: 'DAS - Cross-chain decentralized account' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [{
      src: '//at.alicdn.com/t/font_2342047_h6ht5qlxt6j.js',
      async: true
    }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/init.scss',
    '~/assets/index.scss'
  ],

  // Customize the progress-bar color
  loading: { color: '#00aadd' },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vuex-persistedstate.ts',
    '~/plugins/vee-validate',
    '~/plugins/services.ts',
    '~/plugins/alert.ts',
    '~/plugins/toast.ts',
    '~/plugins/wallet-sdk.ts',
    '~/plugins/url-query-parser.ts'
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://google-analytics.nuxtjs.org/
    '@nuxtjs/google-analytics'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://sentry.nuxtjs.org/
    '@nuxtjs/sentry',
    // https://i18n.nuxtjs.org/
    'nuxt-i18n'
  ],

  googleAnalytics: {
    dev: true,
    id: abcConfig.googleAnalyticsId,
    autoTracking: {
      screenview: true,
      pageviewOnLoad: false,
      transformQueryString: false,
      skipSamePath: true
    }
  },

  sentry: {
    disabled: true,
    dsn: abcConfig.sentryDsn,
    config: {
      autoSessionTracking: false
    }
  },

  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json',
        iso: 'en-US',
        name: 'English'
      },
      {
        code: 'zh',
        file: 'zh.json',
        iso: 'zh-CN',
        name: '简体中文'
      },
      {
        code: 'ru',
        file: 'ru.json',
        iso: 'ru-RU',
        name: 'русский'
      },
      {
        code: 'ja',
        file: 'ja.json',
        iso: 'ja-JP',
        name: '日本語'
      },
      {
        code: 'de',
        file: 'de.json',
        iso: 'de-DE',
        name: 'Deutsch'
      },
      {
        code: 'ko',
        file: 'ko.json',
        iso: 'ko-KR',
        name: '한국어'
      },
      {
        code: 'fr',
        file: 'fr.json',
        iso: 'fr-FR',
        name: 'français'
      },
      {
        code: 'es',
        file: 'es.json',
        iso: 'es-ES',
        name: 'Español'
      },
      {
        code: 'pt',
        file: 'pt.json',
        iso: 'pt-PT',
        name: 'português'
      }
    ],
    strategy: 'no_prefix',
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en'
    },
    lazy: true,
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'das_i18n_redirected',
      onlyOnRoot: true
    }
  },

  // disable prefetching globally
  router: {
    prefetchLinks: false
  },

  render: {
    // prevent preload, improve first time performance
    resourceHints: false,
    // https://nuxtjs.org/guides/directory-structure/static
    // https://www.npmjs.com/package/serve-static
    static: {
      maxAge: 7 * 24 * 60 * 60 * 1000 // 这里会造成 static/ 目录里面 7 天的缓存，所以如果有紧急换图的场景，需要更换文件名称
    }
  },

  // The build Property: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build
  build: {
    // For debug purpose
    'html.minify': !abcConfig.isProd,
    extractCSS: true
  }
}
