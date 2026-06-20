<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { $prepareMeta } = useNuxtApp()
const { t } = useI18n()

useHead(() => ({
  title: t("pages.jobs.metaTitle"),
  meta: $prepareMeta({
    title: t("pages.jobs.metaTitle"),
    description: t("pages.jobs.metaDescription"),
  }),
}))

const jobs = computed(() => [
  {
    role: t('pages.jobs.items.neverlose.role'),
    company: t('pages.jobs.items.neverlose.company'),
    desc: t('pages.jobs.items.neverlose.desc'),
    icon: 'line-md:server-twotone',
    url: 'https://neverlose.cc'
  },
  {
    role: t('pages.jobs.items.sevenColor.role'),
    company: t('pages.jobs.items.sevenColor.company'),
    desc: t('pages.jobs.items.sevenColor.desc'),
    icon: 'line-md:server-twotone',
    url: ''
  },
  {
    role: t('pages.jobs.items.hvhfl.role'),
    company: t('pages.jobs.items.hvhfl.company'),
    desc: t('pages.jobs.items.hvhfl.desc'),
    icon: 'line-md:server-twotone',
    url: 'https://hvhfl.cn'
  },
  {
    role: t('pages.jobs.items.phyddoser.role'),
    company: t('pages.jobs.items.phyddoser.company'),
    desc: t('pages.jobs.items.phyddoser.desc'),
    icon: 'line-md:server-twotone',
    url: ''
  },
  {
    role: t('pages.jobs.items.vnsserver.role'),
    company: t('pages.jobs.items.vnsserver.company'),
    desc: t('pages.jobs.items.vnsserver.desc'),
    icon: 'line-md:server-twotone',
    url: ''
  }
])
</script>

<template>
  <PageLayout :title="t('pages.jobs.title')" :description="t('pages.jobs.description')">
    <ClientOnly>
      <div class="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        <Card
          v-for="(job, index) in jobs"
          :key="index"
          :title="job.role"
          :href="job.url || null"
          :blank="!!job.url"
          :cursor="!!job.url"
        >
          <template #icon>
            <Icon :name="job.icon" class="h-7 w-7 sm:h-9 sm:w-9 text-black/70 dark:text-white/70" />
          </template>

          <div class="flex flex-col space-y-1">
            <span class="font-semibold text-xs text-blue-500 dark:text-blue-400">
              {{ job.company }}
            </span>
            <span class="text-black/50 dark:text-white/30 text-xs sm:text-sm leading-relaxed">
              {{ job.desc }}
            </span>
          </div>
        </Card>
      </div>

      <template #fallback>
        <div class="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
          <div v-for="i in 5" :key="i" class="rounded-lg card-base p-4 animate-pulse">
            <div class="h-5 bg-black/10 dark:bg-white/10 rounded w-1/3 mb-2"></div>
            <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-2/3"></div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </PageLayout>
</template>
