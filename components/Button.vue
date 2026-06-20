<script setup lang="ts">
interface Props {
  href?: any
  icon?: string | null
  block?: boolean
  rounded?: boolean
  blank?: boolean
  disabled?: boolean
  backdrop?: boolean
}

defineProps<Props>()
</script>

<template>
  <SmartLink
    v-if="href && !disabled"
    :href="href"
    :blank="blank"
    :class="[
      'cursor-pointer justify-center px-3 sm:px-4 py-1.5 sm:py-2 card-base flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm',
      rounded ? 'rounded-full' : 'rounded-lg',
      backdrop && 'backdrop-blur-lg',
      !block && 'w-max',
    ]"
  >
    <Icon :name="icon" v-if="icon && !$slots.icon" class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
    <slot v-else name="icon" />
    <span v-if="$slots.default">
      <slot />
    </span>
  </SmartLink>
  <button
    v-else
    :disabled="disabled"
    :class="[
      'cursor-pointer justify-center px-3 sm:px-4 py-1.5 sm:py-2 card-base flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm',
      rounded ? 'rounded-full' : 'rounded-lg',
      backdrop && 'backdrop-blur-lg',
      !block && 'w-max',
      disabled && 'opacity-50 cursor-not-allowed',
    ]"
  >
    <Icon :name="icon" v-if="icon && !$slots.icon" class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
    <slot v-else name="icon" />
    <span v-if="$slots.default">
      <slot />
    </span>
  </button>
</template>
