/* Define constants */
const image = "https://vhming.dev/myLogo.svg"
const description =
  "A passionate full-stack developer and game designer, also the owner of vhming.dev, crafting digital experiences with modern web technologies and creative design."

const head = {
  title: "vhming.dev",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      hid: "description",
      name: "description",
      content: description,
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
      content: "@zhw1nq",
    },
    {
      hid: "twitter:creator",
      name: "twitter:creator",
      content: "@zhw1nq",
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: "vhming.dev",
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: description,
    },
    {
      hid: "twitter:image",
      name: "twitter:image",
      content: image,
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
      content: description,
    },
    {
      hid: "og:image",
      name: "og:image",
      content: image,
    },
    /* Others */
    {
      hid: "theme-color",
      name: "theme-color",
      content: "#171717",
    },
  ].map((i) => {
    // @ts-ignore-next-line
    if (i.name && !i.property) i.property = i.name
    return i
  }),
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "https://vhming.dev/assets/icons/icon.ico",
    },
    {
      rel: "stylesheet",
      type: "text/css",
      href: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css",
    },
  ],
}

export default head
