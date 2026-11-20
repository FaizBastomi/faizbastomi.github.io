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
      title: 'Faiz Bastomi | Full-Stack Developer & Open Source Builder',
      link: [
        {
          rel: 'canonical',
          href: 'https://faizdev.my.id/',
        },
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/jpeg', sizes: '16x16', href: '/image/favicon_16.jpg' },
        { rel: 'icon', type: 'image/jpeg', sizes: '32x32', href: '/image/favicon_32.jpg' },
        { rel: 'apple-touch-icon', href: '/image/favicon_32.jpg' },
      ],
      meta: [
        {
          name: 'description',
          content:
            'Portfolio of Faiz Bastomi, a full-stack developer and open source builder focused on TypeScript, Nuxt, Node.js, and clean software engineering.',
        },
        {
          name: 'keywords',
          content: 'Faiz Bastomi, faizdev, full-stack developer, software engineer, TypeScript, Nuxt, Vue, Node.js, portfolio',
        },
        { name: 'author', content: 'Faiz Bastomi' },
        { name: 'creator', content: 'Faiz Bastomi' },
        { name: 'publisher', content: 'Faiz Bastomi' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#1e1e2e' },
        { property: 'og:site_name', content: 'Faiz Bastomi Portfolio' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:url', content: 'https://faizdev.my.id/' },
        { property: 'og:title', content: 'Faiz Bastomi | Full-Stack Developer & Open Source Builder' },
        {
          property: 'og:description',
          content:
            'Portfolio of Faiz Bastomi, a full-stack developer and open source builder focused on TypeScript, Nuxt, Node.js, and clean software engineering.',
        },
        { property: 'og:image', content: 'https://faizdev.my.id/image/profile.jpg' },
        { property: 'og:image:alt', content: 'Faiz Bastomi profile portrait' },
        { property: 'og:image:width', content: '256' },
        { property: 'og:image:height', content: '256' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Faiz Bastomi | Full-Stack Developer & Open Source Builder' },
        {
          name: 'twitter:description',
          content:
            'Portfolio of Faiz Bastomi, a full-stack developer and open source builder focused on TypeScript, Nuxt, Node.js, and clean software engineering.',
        },
        { name: 'twitter:image', content: 'https://faizdev.my.id/image/profile.jpg' },
        { name: 'twitter:image:alt', content: 'Faiz Bastomi profile portrait' },
      ],
    },
  },

  runtimeConfig: {
    dashboardPath: process.env.DASHBOARD_PATH || '',
    dashboardPassword: process.env.DASHBOARD_PASSWORD || '',
    sessionSecret: process.env.SESSION_SECRET || '',
  },
});
