<script setup lang="ts">
import { gsap } from 'gsap'

const emits = defineEmits<{
  (e: 'complete'): void
}>()

const { $lenis } = useNuxtApp()
const isIntroComplete = useState('introComplete', () => false)

const isVisible = ref(true)

const containerRef = ref<HTMLElement | null>(null)

// 15 narrow shutter curtain panels (odd number for center-out opening)
const panels = Array.from({ length: 15 }, (_, i) => i)

onMounted(() => {
  isIntroComplete.value = false

  // Lock scroll during preloader
  if ($lenis && typeof $lenis.stop === 'function') {
    $lenis.stop()
  }

  nextTick(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        isVisible.value = false
        if ($lenis && typeof $lenis.start === 'function') {
          $lenis.start()
        }
        isIntroComplete.value = true
        emits('complete')
      },
    })

    // Initial states
    gsap.set('.intro-panel', { yPercent: 0 })
    gsap.set('.logo-wrapper', { 
      opacity: 0, 
      scale: 0.4, 
      rotateY: 90, 
      filter: 'blur(12px)',
      transformOrigin: 'center center' 
    })

    // Timeline sequence
    tl.to('.logo-wrapper', {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      ease: 'back.out(2)',
    })
    .to('.logo-wrapper', {
      opacity: 0,
      y: -25,
      duration: 0.4,
      ease: 'power2.in',
    }, '+=0.6')
    // Open 15 frosted glass blur panels from center outward to 2 sides
    .to('.intro-panel', {
      yPercent: -100,
      duration: 0.85,
      stagger: {
        from: 'center',
        amount: 0.45,
      },
      ease: 'circ.inOut',
    }, '-=0.15')
  })
})
</script>

<template>
  <div
    v-if="isVisible"
    ref="containerRef"
    class="fixed inset-0 z-[99999] overflow-hidden pointer-events-auto select-none bg-transparent"
  >
    <!-- 15 Seamless Frosted Glass Blur Shutter Panels -->
    <div class="absolute inset-0 -left-[2vw] w-[104vw] flex h-full pointer-events-none overflow-hidden bg-transparent">
      <div
        v-for="p in panels"
        :key="p"
        class="intro-panel flex-1 backdrop-blur-3xl bg-neutral-950/80 -mr-[1px] h-full w-[calc(100%/15+2px)] border-none shadow-none"
      ></div>
    </div>

    <!-- Intro Content Layer -->
    <div class="relative z-10 w-full h-full flex flex-col justify-center items-center p-6 text-white">
      <!-- Central Website Logo Reveal -->
      <div class="flex flex-col items-center justify-center text-center">
        <div class="relative py-6 px-8 flex flex-col items-center justify-center">
          <!-- Website SVG Logo with Bright Luminous Edge Glow -->
          <div class="logo-wrapper relative z-10">
            <img
              src="/myLogo.svg"
              alt="Logo"
              class="h-16 sm:h-24 md:h-28 w-auto object-contain logo-luminous-glow"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo-luminous-glow {
  filter: drop-shadow(0 4px 16px rgba(255, 255, 255, 0.25));
}
</style>
