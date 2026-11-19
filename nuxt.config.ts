import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'FaizBastomi | Portfolio',
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
        { rel: 'icon', type: 'image/jpeg', sizes: '16x16', href: '/image/favicon_16.jpg' },
        { rel: 'icon', type: 'image/jpeg', sizes: '32x32', href: '/image/favicon_32.jpg' },
      ],
      meta: [
        { property: 'og:url', content: 'https://faizdev.my.id/' },
        { property: 'og:title', content: 'FaizBastomi | Portfolio' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/image/profile.jpg' },
      ],
    },
  },

  runtimeConfig: {
    dashboardPath: process.env.DASHBOARD_PATH || '',
    dashboardPassword: process.env.DASHBOARD_PASSWORD || '',
    sessionSecret: process.env.SESSION_SECRET || '',
  },
});
