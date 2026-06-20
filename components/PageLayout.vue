<script setup lang="ts">
interface Props {
  title: string
  description?: string | string[]
  icon?: string
}

const props = defineProps<Props>()

const getDescriptions = computed(() => {
  return typeof props.description === "string"
    ? [props.description]
    : props.description
})
</script>

<template>
  <div class="text-black/50 dark:text-white/30">
    <header class="space-y-2 my-6 sm:my-8 md:my-12">
      <h1 class="text-black/90 dark:text-white/90 text-2xl sm:text-3xl md:text-4xl font-semibold flex items-center gap-2.5 sm:gap-3">
        <Icon v-if="icon" :name="icon" class="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-black/70 dark:text-white/70 flex-shrink-0" />
        <span>{{ title }}</span>
      </h1>

      <p
        v-for="(description, index) in getDescriptions"
        :key="`description-${index}`"
        class="text-sm sm:text-base"
      >
        {{ description }}
      </p>
    </header>

    <slot />
  </div>
</template>
