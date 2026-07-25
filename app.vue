<script setup lang="ts">
import { gsap } from 'gsap'

const colorMode = useColorMode()
const isProduction = import.meta.env.PROD
const { domain } = useCurrentDomain()
const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()

const isHomePage = computed(() => route.path === '/')

useHead(() => {
  const currentDomain = domain.value || "vhming.dev"

  return {
    titleTemplate: `%s - ${currentDomain}`,
    htmlAttrs: {
      class: `min-h-screen bg-neutral-900 ${colorMode.preference} ${colorMode.value}`,
    },
    bodyAttrs: {
      class: 'bg-neutral-900 text-white min-h-screen',
    },
    meta: [
      {
        hid: "og:site_name",
        name: "og:site_name",
        content: currentDomain,
      },
      {
        hid: "og:image",
        name: "og:image",
        content: "/logo.png",
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: "/logo.png",
      },
    ],
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
    ],
  }
})

// Route & fetch loading states
const routeLoading = ref(false)
const isGlobalLoading = useState('globalLoading', () => false)
const showLoadingBar = computed(() => routeLoading.value || isGlobalLoading.value)

const loadingBarRef = ref<HTMLElement | null>(null)
const isBarVisible = ref(false)
let currentTween: gsap.core.Tween | null = null

const startLoading = () => {
  isBarVisible.value = true
  nextTick(() => {
    const el = loadingBarRef.value
    if (!el) return
    if (currentTween) currentTween.kill()

    gsap.set(el, { scaleX: 0, transformOrigin: 'left center', opacity: 1 })
    currentTween = gsap.to(el, {
      scaleX: 1,
      duration: 0.85,
      ease: 'circ.inOut',
    })
  })
}

const finishLoading = () => {
  const el = loadingBarRef.value
  if (!el) {
    isBarVisible.value = false
    return
  }
  
  if (currentTween) currentTween.kill()
  
  gsap.to(el, {
    scaleX: 1,
    duration: 0.25,
    ease: 'circ.out',
    onComplete: () => {
      if (!loadingBarRef.value) return
      gsap.to(loadingBarRef.value, {
        opacity: 0,
        duration: 0.35,
        ease: 'circ.inOut',
        onComplete: () => {
          isBarVisible.value = false
          if (loadingBarRef.value) {
            gsap.set(loadingBarRef.value, { scaleX: 0, opacity: 1 })
          }
        }
      })
    }
  })
}

// Router loading state hooks
nuxtApp.hook('page:start', () => { routeLoading.value = true })
nuxtApp.hook('page:finish', () => {
  setTimeout(() => { routeLoading.value = false }, 300)
})

router.beforeEach((to, from, next) => {
  routeLoading.value = true
  next()
})
router.afterEach(() => {
  setTimeout(() => { routeLoading.value = false }, 300)
})

const isIntroComplete = useState('introComplete', () => false)

const handleIntroComplete = () => {
  isIntroComplete.value = true
  if (process.client) {
    const el = document.getElementById('page-elements')
    if (el) {
      gsap.to(el, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.8,
        ease: 'power2.out',
      })
    }
  }
}

watch(showLoadingBar, (newVal) => {
  if (newVal) {
    startLoading()
  } else {
    finishLoading()
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-neutral-900 relative overflow-hidden">
    <!-- Ambient Floating Lines Background (Active ONLY on Home page) -->
    <ClientOnly>
      <FloatingLines
        v-if="isHomePage"
        :linesGradient="['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#d4baff', '#ffb3e6', '#ffb3ba']"
        :enabledWaves="['top', 'middle', 'bottom']"
        :lineCount="8"
        :lineDistance="8"
        :animationSpeed="1"
        :bendRadius="8.0"
        :bendStrength="-2.0"
        :interactive="true"
        :parallax="true"
      />
    </ClientOnly>

    <!-- Intro Preloader Animation -->
    <ClientOnly>
      <IntroPreloader @complete="handleIntroComplete" />
    </ClientOnly>

    <!-- Custom GSAP Top Loading Bar -->
    <div
      v-show="isBarVisible"
      class="fixed top-0 left-0 right-0 h-[3px] z-[9999] overflow-hidden pointer-events-none"
    >
      <div ref="loadingBarRef" class="h-full w-full rainbow-loading-bar"></div>
    </div>

    <!-- UI Elements Container (Hidden until preloader completes) -->
    <div id="page-elements" class="opacity-0 invisible pointer-events-auto relative z-10">
      <Navbar class="pt-10 relative z-20" />

      <!-- Main Page View -->
      <main class="responsive-screen min-h-screen pb-12 sm:pb-16 md:pb-20 relative z-10">
        <NuxtPage />
      </main>

      <!-- Footer -->
      <Footer class="relative z-20" />

      <!-- Go to Top Button -->
      <GoTop />

      <!-- Custom In-Web Modern Scrollbar -->
      <ClientOnly>
        <ModernScrollbar />
      </ClientOnly>

      <!-- Notification Popup -->
      <LazyNotificationPopup />

      <!-- PWA Manifest -->
      <ClientOnly>
        <component :is="'VitePwaManifest'" v-if="isProduction" />
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.rainbow-loading-bar {
  background: linear-gradient(
    90deg,
    #ffb3ba 0%,
    #ffdfba 14.28%,
    #ffffba 28.57%,
    #baffc9 42.85%,
    #bae1ff 57.14%,
    #c7ceea 71.42%,
    #e8baff 85.71%,
    #ffb3ba 100%
  );
  background-size: 200% 100%;
  animation: rainbowFlow 3s linear infinite;
  will-change: transform, opacity;
}

@keyframes rainbowFlow {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
}
</style>
