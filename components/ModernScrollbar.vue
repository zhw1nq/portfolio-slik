<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollProgress = ref(0)
const isScrolling = ref(false)
const isPressed = ref(false)
const isDragging = ref(false)
const scrollSpeed = ref(1)
const isIntroComplete = useState('introComplete', () => false)

const trackRef = ref<HTMLElement | null>(null)

let scrollTimeout: NodeJS.Timeout | null = null
let lastScrollTop = 0
let lastScrollTime = Date.now()
let dragStartY = 0
let dragStartScrollTop = 0

const updateScroll = () => {
  if (typeof window === 'undefined') return
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  
  const now = Date.now()
  const timeDelta = Math.max(now - lastScrollTime, 12)
  const distDelta = Math.abs(scrollTop - lastScrollTop)
  
  const velocity = distDelta / timeDelta
  scrollSpeed.value = Math.min(1 + velocity * 1.8, 2.4)
  
  lastScrollTop = scrollTop
  lastScrollTime = now

  if (scrollHeight > 0) {
    scrollProgress.value = Math.min(Math.max(scrollTop / scrollHeight, 0), 1)
  } else {
    scrollProgress.value = 0
  }

  isScrolling.value = true
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    isScrolling.value = false
    scrollSpeed.value = 1
  }, 160)
}

const handleTrackClick = (e: MouseEvent) => {
  if (isDragging.value || !trackRef.value) return
  const rect = trackRef.value.getBoundingClientRect()
  const clickY = e.clientY - rect.top
  const percentage = clickY / rect.height
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({
    top: percentage * scrollHeight,
    behavior: 'smooth'
  })
}

const handleMouseDown = (e: MouseEvent) => {
  isPressed.value = true
  isDragging.value = true
  dragStartY = e.clientY
  dragStartScrollTop = window.scrollY || document.documentElement.scrollTop
  
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !trackRef.value) return
  const rect = trackRef.value.getBoundingClientRect()
  const deltaY = e.clientY - dragStartY
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
  const newScrollTop = dragStartScrollTop + (deltaY / rect.height) * scrollableHeight
  
  // Instant zero-lag scroll positioning
  window.scrollTo(0, Math.min(Math.max(newScrollTop, 0), scrollableHeight))
}

const handleMouseUp = () => {
  isPressed.value = false
  isDragging.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    lastScrollTop = window.scrollY || document.documentElement.scrollTop
    lastScrollTime = Date.now()
  }
  window.addEventListener('scroll', updateScroll, { passive: true })
  updateScroll()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }
  window.removeEventListener('scroll', updateScroll)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<template>
  <Transition name="fade">
    <!-- Desktop ONLY (Hidden on mobile / touch devices) -->
    <div
      v-if="isIntroComplete"
      class="hidden md:flex fixed right-3.5 top-1/2 -translate-y-1/2 z-[9990] flex-col items-center pointer-events-auto select-none"
    >
      <!-- Transparent Track -->
      <div
        ref="trackRef"
        class="relative h-60 w-3 rounded-full bg-transparent cursor-pointer overflow-visible flex justify-center"
        @click="handleTrackClick"
        @mousedown="handleMouseDown"
      >
        <!-- Pure White Thumb Pill (Instant 0-lag drag) -->
        <div
          class="absolute left-1/2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.75)] transform-gpu origin-center cursor-grab active:cursor-grabbing"
          :class="{
            '!transition-none': isDragging,
            'rubber-press': isPressed && !isDragging,
            'rubber-stretch': isScrolling && !isPressed && !isDragging,
            'rubber-bounce': !isScrolling && !isPressed && !isDragging
          }"
          :style="{
            top: `${scrollProgress * 82}%`,
            height: '18%',
            transform: isPressed && !isDragging
              ? 'translate(-50%, 0) scaleY(0.8) scaleX(1.12)' 
              : `translate(-50%, 0) scaleY(${isScrolling ? scrollSpeed : 1}) scaleX(${isScrolling ? 1 / Math.sqrt(scrollSpeed) : 1})`
          }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.rubber-press {
  transition: transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.rubber-stretch {
  transition: transform 0.06s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.rubber-bounce {
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
