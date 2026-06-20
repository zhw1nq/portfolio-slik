<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { $prepareMeta } = useNuxtApp()
const { t } = useI18n()

useHead(() => ({
  title: t("pages.community.metaTitle"),
  meta: $prepareMeta({
    title: t("pages.community.metaTitle"),
    description: t("pages.community.metaDescription"),
  }),
}))

const communities = computed(() => [
  {
    name: t('pages.community.items.sevenmau.name'),
    role: t('pages.community.items.sevenmau.role'),
    desc: t('pages.community.items.sevenmau.desc'),
    url: 'https://7-mau.com',
    video: '/assets/images/7-mau.webm',
    features: [
      t('pages.community.items.sevenmau.f1'),
      t('pages.community.items.sevenmau.f2'),
      t('pages.community.items.sevenmau.f3'),
      t('pages.community.items.sevenmau.f4'),
    ],
    tags: ['CS2', 'Server Hosting', 'Community', 'Vietnam']
  },
  {
    name: t('pages.community.items.zsystems.name'),
    role: t('pages.community.items.zsystems.role'),
    desc: t('pages.community.items.zsystems.desc'),
    url: '',
    video: '/assets/images/zsystems.webm',
    features: [
      t('pages.community.items.zsystems.f1'),
      t('pages.community.items.zsystems.f2'),
      t('pages.community.items.zsystems.f3'),
      t('pages.community.items.zsystems.f4'),
    ],
    tags: ['Web Dashboard', 'Next.js / Nuxt', 'Source Query']
  },
  {
    name: t('pages.community.items.ntmg.name'),
    role: t('pages.community.items.ntmg.role'),
    desc: t('pages.community.items.ntmg.desc'),
    url: '',
    image: '/assets/images/ntmg.png',
    features: [
      t('pages.community.items.ntmg.f1'),
      t('pages.community.items.ntmg.f2'),
      t('pages.community.items.ntmg.f3'),
    ],
    tags: ['Open Source', 'Discord Bot', 'Technical Consulting', 'Script Fixes']
  },
  {
    name: t('pages.community.items.swiftly.name'),
    role: t('pages.community.items.swiftly.role'),
    desc: t('pages.community.items.swiftly.desc'),
    url: '',
    image: '/assets/images/community_swiftly.png',
    features: [
      t('pages.community.items.swiftly.f1'),
      t('pages.community.items.swiftly.f2'),
      t('pages.community.items.swiftly.f3'),
    ],
    tags: ['SwiftlyS2 Framework', 'Game Plugin', 'C# / Scripting', 'Server Automation']
  }
])

// Lightbox state
const activePreview = ref<{ type: 'video' | 'image'; src: string } | null>(null)
const zoomStyles = ref({ tx: 0, ty: 0, scale: 0.7 })

const openPreview = (type: 'video' | 'image', src: string, event?: MouseEvent) => {
  activePreview.value = { type, src }

  if (event) {
    const el = event.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const targetCy = cy - (type === 'video' ? 36 : 0)
    const tx = (rect.left + rect.width / 2) - cx
    const ty = (rect.top + rect.height / 2) - targetCy
    const modalWidth = Math.min(window.innerWidth * 0.95, 896)
    const scale = rect.width / modalWidth
    zoomStyles.value = { tx, ty, scale }
  } else {
    zoomStyles.value = { tx: 0, ty: 0, scale: 0.7 }
  }
}

const closePreview = () => {
  activePreview.value = null
}
</script>

<template>
  <PageLayout :title="t('pages.community.title')" :description="t('pages.community.description')">
    <ClientOnly>
      <div class="flex flex-col gap-6 sm:gap-8">
        <div
          v-for="(item, index) in communities"
          :key="index"
          class="rounded-xl overflow-hidden backdrop-blur-md bg-white/5 dark:bg-neutral-800/30 ring-1 ring-black/10 dark:ring-white/10 flex flex-col transition-all hover:ring-black/20 dark:hover:ring-white/20 hover:shadow-lg duration-300"
          :class="index === 0 ? 'w-full' : 'md:flex-row'"
        >
          <!-- Prominent Top Video layout for the first item (7-mau) -->
          <template v-if="index === 0">
            <!-- Top Video Preview -->
            <div
              v-if="item.video"
              class="relative w-full overflow-hidden border-b border-black/5 dark:border-white/5 cursor-pointer block"
              @click="openPreview('video', item.video, $event)"
            >
              <video
                autoplay
                loop
                muted
                playsinline
                :src="item.video"
                class="w-full h-56 sm:h-72 md:h-[400px] object-cover"
              ></video>
            </div>

            <!-- Bottom Content Details -->
            <div class="w-full p-5 sm:p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg sm:text-xl font-semibold text-black dark:text-white leading-tight">
                    {{ item.name }}
                  </h2>
                  <SmartLink
                    v-if="item.url"
                    :href="item.url"
                    blank
                    class="text-xs font-semibold text-blue-500 dark:text-blue-400 flex items-center gap-1 hover:underline"
                  >
                    <span>Link</span>
                    <Icon name="line-md:external-link" class="h-3 w-3" />
                  </SmartLink>
                </div>

                <div class="flex flex-col space-y-1">
                  <span class="font-semibold text-xs sm:text-sm text-blue-500 dark:text-blue-400">
                    {{ item.role }}
                  </span>
                  <p class="text-black/60 dark:text-white/40 text-xs sm:text-sm leading-relaxed">
                    {{ item.desc }}
                  </p>
                </div>

                <!-- Key Features -->
                <div class="space-y-1.5 pt-3 border-t border-black/5 dark:border-white/5">
                  <span class="text-[11px] font-semibold text-black/40 dark:text-white/30 uppercase tracking-wider block mb-1">Highlights</span>
                  <ul class="space-y-1.5">
                    <li v-for="feat in item.features" :key="feat" class="flex items-start gap-2 text-xs text-black/70 dark:text-white/60">
                      <Icon name="line-md:confirm" class="h-4 w-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{{ feat }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 pt-3 border-t border-black/5 dark:border-white/5">
                <span v-for="tag in item.tags" :key="tag" class="text-[10px] font-medium bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/40 px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5">
                  {{ tag }}
                </span>
              </div>
            </div>
          </template>

          <!-- Normal side-by-side layout for the other items -->
          <template v-else>
            <!-- Left: Preview (Video or Image) -->
            <div class="md:w-5/12 relative overflow-hidden border-b border-black/5 dark:border-white/5 md:border-b-0 md:border-r border-black/5 dark:border-white/5">
              <!-- Video Preview option -->
              <div
                v-if="item.video"
                class="w-full h-48 sm:h-64 md:h-full block relative cursor-pointer"
                @click="openPreview('video', item.video, $event)"
              >
                <video
                  autoplay
                  loop
                  muted
                  playsinline
                  :src="item.video"
                  class="w-full h-full object-cover"
                ></video>
              </div>

              <!-- Image Preview option -->
              <div
                v-else-if="item.image"
                class="w-full h-48 sm:h-64 md:h-full block relative cursor-pointer"
                @click="openPreview('image', item.image, $event)"
              >
                <SmartImage
                  :src="item.image"
                  class="w-full h-48 sm:h-64 md:h-full object-cover"
                />
              </div>
            </div>

            <!-- Right: Details Content -->
            <div class="md:w-7/12 p-5 sm:p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg sm:text-xl font-semibold text-black dark:text-white leading-tight">
                    {{ item.name }}
                  </h2>
                  <SmartLink
                    v-if="item.url"
                    :href="item.url"
                    blank
                    class="text-xs font-semibold text-blue-500 dark:text-blue-400 flex items-center gap-1 hover:underline"
                  >
                    <span>Link</span>
                    <Icon name="line-md:external-link" class="h-3 w-3" />
                  </SmartLink>
                </div>

                <div class="flex flex-col space-y-1">
                  <span class="font-semibold text-xs sm:text-sm text-blue-500 dark:text-blue-400">
                    {{ item.role }}
                  </span>
                  <p class="text-black/60 dark:text-white/40 text-xs sm:text-sm leading-relaxed">
                    {{ item.desc }}
                  </p>
                </div>

                <!-- Key Features -->
                <div class="space-y-1.5 pt-3 border-t border-black/5 dark:border-white/5">
                  <span class="text-[11px] font-semibold text-black/40 dark:text-white/30 uppercase tracking-wider block mb-1">Highlights</span>
                  <ul class="space-y-1.5">
                    <li v-for="feat in item.features" :key="feat" class="flex items-start gap-2 text-xs text-black/70 dark:text-white/60">
                      <Icon name="line-md:confirm" class="h-4 w-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{{ feat }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 pt-3 border-t border-black/5 dark:border-white/5">
                <span v-for="tag in item.tags" :key="tag" class="text-[10px] font-medium bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/40 px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5">
                  {{ tag }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <template #fallback>
        <div class="flex flex-col gap-6">
          <div v-for="i in 4" :key="i" class="rounded-xl card-base p-6 animate-pulse flex flex-col md:flex-row gap-6">
            <div class="md:w-5/12 h-48 bg-black/10 dark:bg-white/10 rounded-lg"></div>
            <div class="md:w-7/12 space-y-4">
              <div class="h-6 bg-black/10 dark:bg-white/10 rounded w-1/3"></div>
              <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-full"></div>
              <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Media Player Modal -->
    <Teleport to="body">
      <MediaPlayer
        v-if="activePreview"
        :type="activePreview.type"
        :src="activePreview.src"
        :zoom-tx="zoomStyles.tx"
        :zoom-ty="zoomStyles.ty"
        :zoom-scale="zoomStyles.scale"
        @close="closePreview"
      />
    </Teleport>
  </PageLayout>
</template>
