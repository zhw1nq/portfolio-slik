<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'

const { t } = useI18n()
const isVisible = ref(false)

onMounted(() => {
  // Trigger slide down entry animation shortly after mount
  setTimeout(() => {
    isVisible.value = true
  }, 300)

  // Automatically slide up and hide after 4.8 seconds
  setTimeout(() => {
    isVisible.value = false
  }, 4800)
})
</script>

<template>
  <Transition name="notification-slide">
    <div
      v-if="isVisible"
      class="notification-popup w-11/12 sm:max-w-md p-4 space-y-1 rounded-lg shadow-md select-none ring-1 ring-white/10 dark:ring-white/20 background-when-supports"
    >
      <div class="flex items-center gap-2">
        <ClientOnly>
          <h3 class="font-medium leading-tight dark:text-white flex items-center gap-2">
            <Icon name="heroicons:bell" class="w-5 h-5" />
            {{ t("notification.title") }}
          </h3>
          <template #fallback>
            <h3 class="font-medium leading-tight dark:text-white flex items-center gap-2">
              <Icon name="heroicons:bell" class="w-5 h-5" />
              Notification
            </h3>
          </template>
        </ClientOnly>
      </div>

      <ClientOnly>
        <p class="text-sm light:opacity-50 dark:text-white/50">
          {{ t("notification.messagePrefix") }}
          <SmartLink
            href="https://github.com/zhw1nq/portfolio-slik"
            blank
            class="underline hover:text-black dark:hover:text-white transition-colors"
          >
            github.com/zhw1nq/portfolio-slik
          </SmartLink>
        </p>
        <template #fallback>
          <p class="text-sm light:opacity-50 dark:text-white/50">
            The source code is public at
            <SmartLink
              href="https://github.com/zhw1nq/portfolio-slik"
              blank
              class="underline hover:text-black dark:hover:text-white transition-colors"
            >
              github.com/zhw1nq/portfolio-slik
            </SmartLink>
          </p>
        </template>
      </ClientOnly>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.notification-popup {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translate(-50%, 0) scale(1);
  z-index: 9999;
}

.background-when-supports {
  @apply backdrop-blur-md backdrop-filter bg-white/70 dark:bg-neutral-900;
}

@supports (backdrop-filter: blur()) {
  .background-when-supports {
    @apply backdrop-blur-md backdrop-filter bg-white/30 dark:bg-neutral-800/30;
  }
}

/* inOutCirc / easeInOutCirc Transition */
.notification-slide-enter-active {
  transition: transform 0.6s cubic-bezier(0.85, 0, 0.15, 1), opacity 0.6s cubic-bezier(0.85, 0, 0.15, 1);
}
.notification-slide-leave-active {
  transition: transform 0.6s cubic-bezier(0.85, 0, 0.15, 1), opacity 0.6s cubic-bezier(0.85, 0, 0.15, 1);
}
.notification-slide-enter-from,
.notification-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -40px) scale(0.9);
}
</style>
