<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()

const cards = computed(() => [
  {
    title: t("pages.donate.title"),
    href: "/me/donate",
    icon: "line-md:heart-filled-half",
  },
  {
    title: t("pages.repos.title"),
    href: "/me/repos",
    icon: "line-md:github",
  },
  {
    title: t("pages.community.title"),
    href: "/me/community",
    icon: "heroicons:user-group",
  },
  {
    title: t("pages.contact.title"),
    href: "/me/contact",
    icon: "line-md:at",
  },
  {
    title: t("pages.jobs.title"),
    href: "/me/jobs",
    icon: "line-md:briefcase-twotone",
  },
  {
    title: t("pages.songs.title"),
    href: "/me/songs",
    icon: "line-md:volume-high-filled",
  },
])

// Animation settings
const ICON_SIZE = 28 // px

const fullStackIcons = [
  { name: 'TypeScript', class: 'devicon-typescript-plain' },
  { name: 'React', class: 'devicon-react-original' },
  { name: 'Vue', class: 'devicon-vuejs-plain' },
  { name: 'Tailwind', class: 'devicon-tailwindcss-plain' },
  { name: 'Node.js', class: 'devicon-nodejs-line' },
  { name: 'Docker', class: 'devicon-docker-plain' },
  { name: 'Git', class: 'devicon-git-plain' },
  { name: 'Next.js', class: 'devicon-nextjs-plain' },
  { name: 'Nuxt', class: 'devicon-nuxt-original' },
  { name: 'Three.js', class: 'devicon-threejs-original' },
  { name: 'Express', class: 'devicon-express-original' },
  { name: 'MySQL', class: 'devicon-mysql-original' },
  { name: 'AWS', class: 'devicon-amazonwebservices-plain-wordmark' },
  { name: 'GitHub', class: 'devicon-github-original' },
]

const gameDesignIcons = [
  { name: 'Unity', class: 'devicon-unity-plain' },
  { name: 'Lua', class: 'devicon-lua-plain' },
  { name: 'C#', class: 'devicon-csharp-plain' },
  { name: 'Source Engine', class: 'devicon-sourceengine-plain' },
  { name: 'Adobe Illustrator', class: 'devicon-illustrator-plain' },
  { name: 'Adobe Photoshop', class: 'devicon-photoshop-plain' },
]

const { $prepareMeta } = useNuxtApp()

useHead(() => ({
  title: t("pages.home.title"),
  meta: $prepareMeta({
    title: t("pages.home.title"),
    description: t("footer.company.description"),
  }),
}))

const isIntroComplete = useState('introComplete', () => false)

const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger)

  nextTick(() => {
    // Hero text entrance animation with explicit fromTo to prevent jitter
    gsap.fromTo('.hero-animate', 
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'circ.out', stagger: 0.12 }
    )

    // Side Cards entrance with SmoothSlide fromTo
    gsap.fromTo('.reveal-card', 
      { opacity: 0, y: 35, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'circ.out', stagger: 0.08, delay: 0.1 }
    )

    // Tech Stack Marquees entrance fromTo
    gsap.fromTo('.reveal-marquee', 
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'circ.out', stagger: 0.12, delay: 0.15 }
    )
  })
}

onMounted(() => {
  if (isIntroComplete.value) {
    initAnimations()
  } else {
    const unwatch = watch(isIntroComplete, (completed) => {
      if (completed) {
        initAnimations()
        unwatch()
      }
    })
  }
})
</script>

<template>
  <div
    class="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-11rem)] flex flex-col py-8 sm:py-12 md:my-0 items-center justify-center relative w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-0 flex items-center gap-8 lg:gap-16 relative z-10 w-full reveal-card-container">
      <ClientOnly>
        <div class="hidden lg:flex flex-col gap-4 w-2/12 z-10">
          <Card v-for="(card, index) in cards.slice(0, 3)" :key="`card-ml-${index}`" :title="card.title"
            :href="card.href"
            class="reveal-card w-32 flex items-center justify-center transform hover:scale-105 transition-all backdrop-blur-md bg-white/30 dark:bg-neutral-800/30 ring-1 ring-black/10 dark:ring-white/10"
            :class="{
              'ml-auto': index % 2 === 0,
              'rotate-2': index === 0,
              '-rotate-3': index === 1,
              'rotate-1': index === 2,
            }" :style="{
              aspectRatio: '1/1',
            }">
            <template #title>
              <div class="flex flex-col gap-2 items-center">
                <Icon :name="card.icon" class="h-8 w-8" />
                {{ card.title }}
              </div>
            </template>
          </Card>
        </div>
      </ClientOnly>

      <header class="flex-1 min-w-0 z-10 w-full">
        <div class="space-y-6 sm:space-y-8 z-10">
          <div class="space-y-3 sm:space-y-4">
            <h1
              class="hero-animate font-semibold text-center text-base sm:text-lg text-black/50 dark:text-white/50 md:text-xl flex items-center justify-center flex-wrap gap-2">
              <ClientOnly>
                <span>{{ t("home.hi") }}</span>
                <template #fallback>
                  <span>Hi, I am</span>
                </template>
              </ClientOnly>
              <span
                class="text-black/60 select-none dark:text-white/60 transition-colors backdrop-blur-md bg-white/30 dark:bg-neutral-800/30 ring-1 ring-black/10 dark:ring-white/10 rounded-full py-2 sm:py-2.5 pl-2.5 sm:pl-3 pr-3 sm:pr-4 gap-1 inline-flex items-center w-max font-medium text-sm sm:text-base">
                <SmartImage src="/assets/images/go_up.gif" class="object-cover h-6 w-6 sm:h-8 sm:w-8" />
                vhming
              </span>
            </h1>

            <div class="flex flex-col items-center w-full max-w-5xl mx-auto px-2 sm:px-4">
              <div class="inline-flex flex-col items-center hero-animate w-full text-center">
                <h1 class="font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-5xl 2xl:text-6xl text-black/90 dark:text-white/90 leading-tight">
                  <ClientOnly>
                    <span class="block text-center lg:whitespace-nowrap">{{ t("home.fullStackDeveloper") }}</span>
                    <template #fallback>
                      <span class="block text-center lg:whitespace-nowrap">Full-Stack Developer</span>
                    </template>
                  </ClientOnly>
                </h1>
                <ClientOnly>
                  <span
                    class="block text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl opacity-60 mt-1 sm:mt-2 font-semibold text-black/90 dark:text-white/90 text-center w-full leading-snug lg:whitespace-nowrap">
                    {{ t("home.gameDesigner") }}
                  </span>
                  <template #fallback>
                    <span
                      class="block text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl opacity-60 mt-1 sm:mt-2 font-semibold text-black/90 dark:text-white/90 text-center w-full leading-snug lg:whitespace-nowrap">
                      Game & UI/UX Designer
                    </span>
                  </template>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 sm:mt-6 flex flex-col items-center justify-center gap-y-3 sm:gap-y-4">
          <!-- Full-Stack Icons Slider (right to left) -->
          <div class="reveal-marquee flex flex-col items-center gap-y-2 w-full">
            <ClientOnly>
              <span
                class="text-[10px] sm:text-xs text-black/40 dark:text-white/40 font-normal tracking-wider uppercase">{{
                  t("home.fullStackDev") }}</span>
              <template #fallback>
                <span
                  class="text-[10px] sm:text-xs text-black/40 dark:text-white/40 font-normal tracking-wider uppercase">Full-Stack
                  Development</span>
              </template>
            </ClientOnly>
            <div class="marquee-container">
              <ClientOnly>
                <InfiniteMarquee direction="left" :speed="40" :pause-on-hover="true">
                  <i v-for="(icon, idx) in fullStackIcons" :key="`fs-${idx}`"
                    :class="`${icon.class} text-black dark:text-white`"
                    :style="`display: inline-block; font-size: ${ICON_SIZE}px; margin: 0 16px;`"
                    v-tippy="{ content: icon.name, placement: 'bottom' }" />
                </InfiniteMarquee>
              </ClientOnly>
            </div>
          </div>

          <!-- Game Design Icons Slider (left to right) -->
          <div class="reveal-marquee flex flex-col items-center gap-y-2 w-full">
            <ClientOnly>
              <span
                class="text-[10px] sm:text-xs text-black/40 dark:text-white/40 font-normal tracking-wider uppercase">{{
                  t("home.gameDev") }}</span>
              <template #fallback>
                <span
                  class="text-[10px] sm:text-xs text-black/40 dark:text-white/40 font-normal tracking-wider uppercase">Game
                  Development & Design</span>
              </template>
            </ClientOnly>
            <div class="marquee-container">
              <ClientOnly>
                <InfiniteMarquee direction="right" :speed="40" :pause-on-hover="true">
                  <i v-for="(icon, idx) in gameDesignIcons" :key="`gd-${idx}`"
                    :class="`${icon.class} text-black dark:text-white`"
                    :style="`display: inline-block; font-size: ${ICON_SIZE}px; margin: 0 16px;`"
                    v-tippy="{ content: icon.name, placement: 'bottom' }" />
                </InfiniteMarquee>
              </ClientOnly>
            </div>
          </div>
        </div>
      </header>

      <ClientOnly>
        <div class="hidden lg:flex flex-col gap-4 w-2/12 z-10">
          <Card v-for="(card, index) in cards.slice(3, 6)" :key="`card-mr-${index}`" :title="card.title"
            :href="card.href"
            class="reveal-card w-32 flex items-center justify-center transform hover:scale-105 transition-all backdrop-blur-md bg-white/30 dark:bg-neutral-800/30 ring-1 ring-black/10 dark:ring-white/10"
            :class="{
              'ml-auto': index % 2 !== 0,
              '-rotate-2': index === 0,
              'rotate-3': index === 1,
              '-rotate-1': index === 2,
            }" :style="{
              aspectRatio: '1/1',
            }">
            <template #title>
              <div class="flex flex-col gap-2 items-center">
                <Icon :name="card.icon" class="h-8 w-8" />
                {{ card.title }}
              </div>
            </template>
          </Card>
        </div>
      </ClientOnly>
    </div>

    <ClientOnly>
      <div class="grid lg:hidden grid-cols-2 gap-3 sm:gap-4 w-full mt-8 sm:mt-12 md:mt-16 z-10 px-4 sm:px-6">
        <Card v-for="(card, index) in cards" :key="`card-m-${index}`" :title="card.title" :href="card.href"
          class="reveal-card w-full flex items-center justify-center backdrop-blur-md bg-white/30 dark:bg-neutral-800/30 ring-1 ring-black/10 dark:ring-white/10"
          :style="{
            aspectRatio: '1/1',
          }">
          <template #title>
            <div class="flex flex-col gap-1.5 sm:gap-2 items-center text-sm sm:text-base">
              <Icon :name="card.icon" class="h-6 w-6 sm:h-8 sm:w-8" />
              {{ card.title }}
            </div>
          </template>
        </Card>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.marquee-container {
  width: 100%;
  max-width: 400px;
}
</style>
