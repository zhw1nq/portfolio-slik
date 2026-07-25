import { defineNuxtConfig } from "nuxt/config"

const nitroPreset = process.env.NITRO_PRESET || "vercel"
const headImage = "/logo.png"
const headDescription =
  "A passionate full-stack developer and game designer, also the owner of vhming.dev, crafting digital experiences with modern web technologies and creative design."

const siteHead = {
  title: "vhming.dev",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      hid: "description",
      name: "description",
      content: headDescription,
    },
    {
      hid: "keywords",
      name: "keywords",
      content: "vhming, vhming.dev, fullstack developer, game designer, portfolio, web developer, game developer, UI/UX designer, Nuxt, Vue, Three.js",
    },
    {
      hid: "author",
      name: "author",
      content: "vhming",
    },
    {
      hid: "robots",
      name: "robots",
      content: "index, follow",
    },
    /* Twitter */
    {
      hid: "twitter:card",
      name: "twitter:card",
      content: "summary",
    },
    {
      hid: "twitter:site",
      name: "twitter:site",
      content: "@vhming",
    },
    {
      hid: "twitter:creator",
      name: "twitter:creator",
      content: "@vhming",
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: "vhming.dev",
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: headDescription,
    },
    {
      hid: "twitter:image",
      name: "twitter:image",
      content: headImage,
    },
    /* Open-Graph */
    {
      hid: "og:type",
      name: "og:type",
      content: "website",
    },
    {
      hid: "og:url",
      name: "og:url",
      content: "https://vhming.dev",
    },
    {
      hid: "og:locale",
      name: "og:locale",
      content: "vi_VN",
    },
    {
      hid: "og:site_name",
      name: "og:site_name",
      content: "vhming.dev",
    },
    {
      hid: "og:description",
      name: "og:description",
      content: headDescription,
    },
    {
      hid: "og:image",
      name: "og:image",
      content: headImage,
    },
    /* Others */
    {
      hid: "theme-color",
      name: "theme-color",
      content: "#171717",
    },
  ].map((i) => {
    const item = { ...i } as Record<string, string>
    if (item.name && !item.property) item.property = item.name
    return item
  }),
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/logo.png",
    },
    {
      rel: "shortcut icon",
      type: "image/png",
      href: "/logo.png",
    },
    {
      rel: "apple-touch-icon",
      href: "/logo.png",
    },
    {
      rel: "stylesheet",
      type: "text/css",
      href: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css",
    },
  ],
}

export default defineNuxtConfig({
  experimental: {
    appManifest: false,
  },

  nitro: {
    preset: nitroPreset,
    experimental: {
      trustedProxy: true,
    },
    ...(process.env.NODE_ENV === "development" && {
      minify: false,
      sourceMap: false,
    }),
  },

  devServer: {
    host: "0.0.0.0",
  },

  app: {
    head: siteHead,
    pageTransition: { name: "fade", mode: "out-in" },
  },

  vite: {
    plugins: [
      {
        name: "resolve-app-manifest-fallback",
        resolveId(id: string) {
          if (id === "#app-manifest" || id === "\0#app-manifest") {
            return "\0#app-manifest"
          }
        },
        load(id: string) {
          if (id === "\0#app-manifest") {
            return "export default {}"
          }
        },
      },
    ],
    optimizeDeps: {
      include: ["vue-i18n", "vue-tippy", "medium-zoom"],
      exclude: process.env.NODE_ENV === "development" ? ["@nuxtjs/google-fonts"] : [],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },

  css: ["~/assets/css/main.scss"],

  modules: [
    ...(process.env.NODE_ENV === "production" ? ["@vite-pwa/nuxt"] : []),
    [
      "@nuxtjs/color-mode",
      {
        preference: "dark",
        fallback: "dark",
        hid: "nuxt-color-mode-script",
        classSuffix: "",
        storageKey: "color-mode",
      },
    ],
    [
      "@nuxt/icon",
      {
        serverBundle: {
          collections: process.env.NODE_ENV === "production"
            ? ["heroicons", "line-md", "mdi", "svg-spinners", "devicon"]
            : ["heroicons", "line-md", "mdi"],
        },
      },
    ],
    ...(process.env.NODE_ENV === "production" ? ["@nuxtjs/sitemap", "@nuxtjs/robots"] : []),
    ...(process.env.NODE_ENV === "production"
      ? [
          [
            "@nuxtjs/google-fonts",
            {
              display: "swap",
              families: {
                Inter: [400, 500, 600, 700],
              },
              preload: false,
              preconnect: false,
            },
          ],
        ]
      : []),
    [
      "@nuxtjs/tailwindcss",
      {
        viewer: false,
        config: "~/tailwind.config.ts",
        exposeConfig: false,
        injectPosition: 0,
        cssPath: "~/assets/css/tailwind.css",
      },
    ],
    ...(process.env.NODE_ENV === "production"
      ? [
          [
            "nuxt-disqus",
            {
              shortname: "vhming-com",
            },
          ],
        ]
      : []),
    [
      "nuxt-gtag",
      {
        enabled: process.env.NODE_ENV === "production",
        id: process.env.GOOGLE_ANALYTICS_ID,
      },
    ],
  ],

  sitemap: {},

  site: {
    url: "https://vhming.dev",
    name: "vhming.dev",
  },

  pwa: {
    manifest: {
      name: "vhming.dev",
      short_name: "vhming.dev",
      theme_color: "#171717",
      description:
        "A passionate full-stack developer and game designer, crafting digital experiences with modern web technologies.",
      lang: "vi",
      icons: [
        {
          src: "/logo.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      social: {
        github: "https://github.com/zhw1nq",
        facebook: "https://facebook.com/vhming",
        email: "hi@vhming.com",
        emailAlt: "hi@vhming.dev",
        phone: "+84 876.7878.32",
        discord: "@vhming",
      },
      location: {
        timezone: "UTC+7 và UTC+8",
        address: "Phường Móng Cái 1, Tỉnh Quảng Ninh, Việt Nam",
      },
      sponsor: {
        github: "https://github.com/sponsors/zhw1nq",
      },
      discord: {
        userId: process.env.DISCORD_USER_ID || "1263398676345393204",
      },
      isDev: process.env.NODE_ENV === "development",
      spotifyApiUrl: process.env.SPOTIFY_API_URL || "/api/spotify",
    },
  },

  compatibilityDate: "2025-01-16",
})
