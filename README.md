# Plotfolio - Personal Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Một website portfolio cá nhân hiện đại được xây dựng với Nuxt.js 3, TypeScript và Tailwind CSS. Website này tích hợp Spotify API để hiển thị thông tin âm nhạc, GitHub API để hiển thị repositories, và hỗ trợ đa ngôn ngữ với 9 ngôn ngữ khác nhau.

## ✨ Tính năng

### 🎨 Giao diện
- **Dark/Light Mode**: Hỗ trợ chuyển đổi theme tự động theo hệ thống
- **Responsive Design**: Tối ưu cho mọi thiết bị (mobile, tablet, desktop)
- **Smooth Animations**: Hiệu ứng chuyển trang và animation mượt mà
- **Custom Scrollbar**: Thanh cuộn tùy chỉnh với hiệu ứng đẹp mắt
- **3D Background**: Hiệu ứng nền silk với Three.js

### 🎵 Tích hợp Spotify
- **Currently Playing**: Hiển thị bài hát đang phát với progress bar real-time
- **Top Tracks**: Top 6 bài hát được nghe nhiều nhất (7 ngày gần đây)
- **Top Artists**: Top 4 nghệ sĩ được nghe nhiều nhất (4 tuần gần đây)
- **Recent Tracks**: 14 bài hát đã nghe gần đây
- **Account Info**: Thông tin tài khoản Spotify (profile, followers, total listening time)

### 💻 GitHub Integration
- **Repositories**: Hiển thị danh sách repositories công khai từ GitHub
- **Auto-sorted**: Sắp xếp theo số lượng stars
- **Repository Cards**: Card đẹp mắt với thông tin ngôn ngữ, license, stars

### 🌍 Đa ngôn ngữ (i18n)
Hỗ trợ 9 ngôn ngữ:
- 🇺🇸 English (en)
- 🇻🇳 Tiếng Việt (vi)
- 🇮🇩 Bahasa Indonesia (id)
- 🇯🇵 日本語 (ja)
- 🇨🇳 简体中文 (zh_Hans)
- 🇭🇰 繁體中文 (香港) (zh_HK)
- 🇹🇼 繁體中文 (台灣) (zh_TW)
- 🇸🇦 العربية (ar)
- 🇩🇪 Deutsch (de)
- 🇷🇺 Русский (ru)

### 💰 Trang Donate
- **VietQR Integration**: Tích hợp VietQR để thanh toán qua ngân hàng Việt Nam
- **Crypto Payments**: Hỗ trợ thanh toán bằng USDT (TRC20) và Litecoin
- **Multiple Platforms**: Liên kết đến GitHub Sponsors, Ko-fi, Patreon, Buy Me a Coffee
- **QR Code Processing**: Xử lý QR code tự động theo dark/light mode

### 📱 Progressive Web App (PWA)
- **Offline Support**: Hỗ trợ offline với service worker
- **Installable**: Có thể cài đặt như ứng dụng trên mobile/desktop
- **Manifest**: Cấu hình PWA manifest đầy đủ

### 🔍 SEO & Performance
- **Meta Tags**: Đầy đủ Open Graph và Twitter Card tags
- **Sitemap**: Tự động generate sitemap
- **Robots.txt**: Cấu hình robots.txt
- **Google Analytics**: Tích hợp Google Analytics (production only)
- **Lazy Loading**: Lazy load components và images

## 🚀 Bắt đầu

### Yêu cầu
- Node.js >= 18
- npm, yarn, hoặc pnpm

### Cài đặt

1. **Clone repository**
```bash
git clone https://github.com/zhw1nq/website.git
cd website
```

2. **Cài đặt dependencies**
```bash
# Sử dụng npm
npm install

# Hoặc yarn
yarn install

# Hoặc pnpm (khuyến nghị)
pnpm install
```

3. **Cấu hình environment variables**

Tạo file `.env` trong thư mục gốc:
```env
# Spotify API (tùy chọn - nếu không có sẽ ẩn trang songs)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token

# Google Analytics (tùy chọn - chỉ production)
GOOGLE_ANALYTICS_ID=your_ga_id

# Discord User ID (tùy chọn)
DISCORD_USER_ID=your_discord_user_id
```

4. **Chạy development server**
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Website sẽ chạy tại `http://localhost:3000`

### Lấy Spotify Refresh Token

Để sử dụng tính năng Spotify, bạn cần:

1. Tạo Spotify App tại [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Lấy `Client ID` và `Client Secret`
3. Authorize app và lấy `Refresh Token`

Xem hướng dẫn chi tiết trong file `scripts/get-spotify-refresh-token.md` (nếu có) hoặc tham khảo [Spotify Web API Authorization Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization).

## 📦 Build & Deploy

### Build cho production
```bash
npm run build
```

### Preview production build
```bash
npm run start
```

### Generate static site
```bash
npm run generate
```

### Deploy lên Netlify

Dự án đã được cấu hình sẵn cho Netlify với `netlify.toml`. Chỉ cần:

1. Push code lên GitHub
2. Kết nối repository với Netlify
3. Thêm environment variables trong Netlify dashboard
4. Deploy tự động!

## 📁 Cấu trúc dự án

```
plotfolio/
├── assets/              # Assets tĩnh (CSS, fonts, images)
│   ├── css/            # SCSS styles
│   ├── fonts/          # Custom fonts
│   └── files/          # Các file khác
├── components/          # Vue components
│   ├── Card/           # Card components
│   ├── Loaders/        # Loading components
│   ├── SkeletonLoader/ # Skeleton loaders
│   └── Smart/          # Smart components (Image, Link)
├── config/             # Configuration files
├── lang/               # i18n translation files
├── netlify/            # Netlify functions
│   └── functions/      # Serverless functions
├── pages/              # Nuxt pages (auto-routing)
│   └── me/             # Sub-pages
├── plugins/            # Nuxt plugins
├── public/             # Public static files
├── server/             # Server API routes
│   └── api/            # API endpoints
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── app.vue             # Root component
├── nuxt.config.ts      # Nuxt configuration
├── tailwind.config.ts  # Tailwind configuration
└── package.json        # Dependencies
```

## 🛠️ Công nghệ sử dụng

### Core
- **[Nuxt 3](https://nuxt.com)** - Vue.js framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[SCSS](https://sass-lang.com/)** - CSS preprocessor

### Modules & Plugins
- **@nuxtjs/color-mode** - Dark/Light mode support
- **@nuxtjs/tailwindcss** - Tailwind CSS integration
- **@nuxt/icon** - Icon component
- **vue-i18n** - Internationalization
- **vue-tippy** - Tooltip component
- **@vite-pwa/nuxt** - PWA support
- **nuxt-disqus** - Disqus comments
- **nuxt-gtag** - Google Analytics
- **@nuxtjs/sitemap** - Sitemap generation
- **@nuxtjs/robots** - Robots.txt generation

### APIs & Services
- **Spotify Web API** - Music data
- **GitHub API** - Repository data
- **VietQR API** - QR code generation

### Other
- **Three.js** - 3D graphics (background effects)
- **medium-zoom** - Image zoom

## 🎨 Tùy chỉnh

### Thay đổi thông tin cá nhân

Chỉnh sửa trong `nuxt.config.ts`:
```typescript
runtimeConfig: {
  public: {
    social: {
      github: "https://github.com/yourusername",
      email: "your@email.com",
      // ...
    },
    location: {
      timezone: "UTC+7",
      address: "Your Address",
    },
  },
}
```

### Thay đổi ngôn ngữ

Thêm file translation mới trong `lang/` và cập nhật `plugins/i18n.ts`.

### Thay đổi theme colors

Chỉnh sửa `tailwind.config.ts` và `assets/css/main.scss`.

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run start` - Preview production build
- `npm run generate` - Generate static site

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 👤 Tác giả

**zhw1nq**

- Website: [vhming.dev](https://vhming.dev)
- GitHub: [@zhw1nq](https://github.com/zhw1nq)
- Email: zhw1nq@gmail.com

## 🙏 Lời cảm ơn

- [Nuxt.js](https://nuxt.com) - Framework tuyệt vời
- [Vue.js](https://vuejs.org/) - Progressive framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Spotify](https://spotify.com) - Music API
- [GitHub](https://github.com) - Code hosting & API

## 📞 Liên hệ

Nếu có bất kỳ câu hỏi nào, vui lòng:
- Mở một [Issue](https://github.com/zhw1nq/website/issues)
- Gửi email: zhw1nq@gmail.com
- Truy cập trang [Contact](https://vhming.dev/me/contact)

---

⭐ Nếu bạn thích dự án này, hãy cho một star!

