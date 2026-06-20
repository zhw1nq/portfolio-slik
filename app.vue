<script setup lang="ts">
const colorMode = useColorMode()
const isProduction = import.meta.env.PROD

useHead(() => {
  let string = "vhming.dev"

  return {
    titleTemplate: `%s - ${string}`,
    htmlAttrs: {
      class: `min-h-screen ${colorMode.preference} ${colorMode.value}`,
    },
    meta: [
      {
        hid: "og:site_name",
        name: "og:site_name",
        content: string,
      },
    ],
  }
})

// Route & fetch loading states
const routeLoading = ref(false)
const isGlobalLoading = useState('globalLoading', () => false)

const router = useRouter()
router.beforeEach((to, from, next) => {
  routeLoading.value = true
  next()
})
router.afterEach(() => {
  setTimeout(() => {
    routeLoading.value = false
  }, 400)
})

onMounted(() => {
  routeLoading.value = true
  setTimeout(() => {
    routeLoading.value = false
  }, 600)
})

const showLoadingBar = computed(() => routeLoading.value || isGlobalLoading.value)
</script>

<template>
  <!-- Locked to dark mode background (light mode bg-gray-50 is commented/disabled) -->
  <div class="min-h-screen bg-neutral-900 relative">
    <!-- Custom Glowing Top Loading Bar -->
    <Transition name="fade-loading">
      <div v-if="showLoadingBar"
        class="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-pink-500 z-[9999] shadow-[0_2px_8px_rgba(99,102,241,0.6)] overflow-hidden">
        <div class="h-full w-full bg-white/20 animate-loading-bar-top"></div>
      </div>
    </Transition>

    <Navbar class="pt-10 relative z-20" />

    <!-- Nuxt component -->
    <main class="responsive-screen min-h-screen pb-12 sm:pb-16 md:pb-20 relative z-10">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <Footer class="relative z-20" />

    <!-- Go to top button -->
    <GoTop />

    <!-- Custom Dot Scrollbar -->
    <ClientOnly>
      <DotScrollbar />
    </ClientOnly>

    <!-- Notification Popup -->
    <LazyNotificationPopup />

    <!-- Other Components -->
    <ClientOnly>
      <component :is="'VitePwaManifest'" v-if="isProduction" />
    </ClientOnly>

    <!-- Custom Glowing Vertical Loading Bar on the Right -->
    <Transition name="fade-loading">
      <div v-if="showLoadingBar"
        class="fixed right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-blue-500 via-indigo-500 via-purple-500 to-pink-500 z-[9999] shadow-[-2px_0_8px_rgba(99,102,241,0.6)] overflow-hidden">
        <div class="h-full w-full bg-white/20 animate-loading-bar"></div>
      </div>
    </Transition>
  </div>
</template>

<style>
@keyframes loadingBarAnimation {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(100%);
  }
}

@keyframes loadingBarAnimationTop {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-loading-bar {
  animation: loadingBarAnimation 1.5s infinite linear;
}

.animate-loading-bar-top {
  animation: loadingBarAnimationTop 1.5s infinite linear;
}

.fade-loading-enter-active,
.fade-loading-leave-active {
  transition: opacity 0.3s ease;
}

.fade-loading-enter-from,
.fade-loading-leave-to {
  opacity: 0;
}
</style>
