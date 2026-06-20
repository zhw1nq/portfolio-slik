<script setup lang="ts">
interface Props {
  type: 'video' | 'image'
  src: string
  zoomTx?: number
  zoomTy?: number
  zoomScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  zoomTx: 0,
  zoomTy: 0,
  zoomScale: 0.7
})

const emit = defineEmits<{
  close: []
}>()

// Video refs
const videoRef = ref<HTMLVideoElement | null>(null)
const progressTrackRef = ref<HTMLDivElement | null>(null)
const volumeTrackRef = ref<HTMLDivElement | null>(null)

// Playback state
const isPlaying = ref(true)
const isMuted = ref(false)
const volume = ref(1.0)
const savedVolume = ref(1.0)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const buffered = ref(0)

// Drag state
const isDraggingProgress = ref(false)
const isDraggingVolume = ref(false)

// Controls visibility
const controlsVisible = ref(true)
let hideControlsTimer: ReturnType<typeof setTimeout> | null = null

// RAF loop
let rafId: number | null = null

const startRAF = () => {
  if (rafId !== null) return
  const loop = () => {
    if (videoRef.value && !isDraggingProgress.value) {
      currentTime.value = videoRef.value.currentTime
      duration.value = videoRef.value.duration || 0
      progress.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0

      // Update buffered
      if (videoRef.value.buffered.length > 0) {
        buffered.value = (videoRef.value.buffered.end(videoRef.value.buffered.length - 1) / duration.value) * 100
      }
    }
    rafId = requestAnimationFrame(loop)
  }
  loop()
}

const stopRAF = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

// Controls auto-hide
const resetHideTimer = () => {
  controlsVisible.value = true
  if (hideControlsTimer) clearTimeout(hideControlsTimer)
  hideControlsTimer = setTimeout(() => {
    if (isPlaying.value && !isDraggingProgress.value && !isDraggingVolume.value) {
      controlsVisible.value = false
    }
  }, 3000)
}

// Play / Pause
const togglePlay = () => {
  if (!videoRef.value) return
  if (isPlaying.value) {
    videoRef.value.pause()
    isPlaying.value = false
    controlsVisible.value = true
  } else {
    videoRef.value.play().catch(() => {})
    isPlaying.value = true
    resetHideTimer()
  }
}

// Volume
const toggleMute = () => {
  if (!videoRef.value) return
  if (volume.value > 0) {
    savedVolume.value = volume.value
    volume.value = 0
    videoRef.value.volume = 0
    isMuted.value = true
  } else {
    volume.value = savedVolume.value > 0 ? savedVolume.value : 1.0
    videoRef.value.volume = volume.value
    isMuted.value = false
  }
}

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'heroicons:speaker-x-mark-solid'
  if (volume.value < 0.5) return 'heroicons:speaker-wave-solid'
  return 'heroicons:speaker-wave-solid'
})

// Progress seeking
const seekTo = (clientX: number) => {
  if (!progressTrackRef.value || !videoRef.value) return
  const rect = progressTrackRef.value.getBoundingClientRect()
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  videoRef.value.currentTime = pct * duration.value
  progress.value = pct * 100
  currentTime.value = videoRef.value.currentTime
}

const onProgressDown = (e: MouseEvent) => {
  isDraggingProgress.value = true
  seekTo(e.clientX)
  window.addEventListener('mousemove', onProgressMove)
  window.addEventListener('mouseup', onProgressUp)
}
const onProgressMove = (e: MouseEvent) => {
  if (isDraggingProgress.value) seekTo(e.clientX)
}
const onProgressUp = () => {
  isDraggingProgress.value = false
  window.removeEventListener('mousemove', onProgressMove)
  window.removeEventListener('mouseup', onProgressUp)
}

// Volume seeking
const seekVolume = (clientX: number) => {
  if (!volumeTrackRef.value || !videoRef.value) return
  const rect = volumeTrackRef.value.getBoundingClientRect()
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  volume.value = pct
  videoRef.value.volume = pct
  isMuted.value = pct === 0
  if (pct > 0) savedVolume.value = pct
}

const onVolumeDown = (e: MouseEvent) => {
  isDraggingVolume.value = true
  seekVolume(e.clientX)
  window.addEventListener('mousemove', onVolumeMove)
  window.addEventListener('mouseup', onVolumeUp)
}
const onVolumeMove = (e: MouseEvent) => {
  if (isDraggingVolume.value) seekVolume(e.clientX)
}
const onVolumeUp = () => {
  isDraggingVolume.value = false
  window.removeEventListener('mousemove', onVolumeMove)
  window.removeEventListener('mouseup', onVolumeUp)
}

// Time formatting
const fmt = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec < 10 ? '0' : ''}${sec}`
}

// Keyboard
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
  if (props.type !== 'video') return
  if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay() }
  if (e.key === 'm') toggleMute()
  if (e.key === 'ArrowLeft' && videoRef.value) { videoRef.value.currentTime -= 5; resetHideTimer() }
  if (e.key === 'ArrowRight' && videoRef.value) { videoRef.value.currentTime += 5; resetHideTimer() }
  if (e.key === 'ArrowUp') { volume.value = Math.min(1, volume.value + 0.1); if (videoRef.value) videoRef.value.volume = volume.value; isMuted.value = false; resetHideTimer() }
  if (e.key === 'ArrowDown') { volume.value = Math.max(0, volume.value - 0.1); if (videoRef.value) videoRef.value.volume = volume.value; isMuted.value = volume.value === 0; resetHideTimer() }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  if (props.type === 'video') {
    startRAF()
    resetHideTimer()
  }
})

onUnmounted(() => {
  stopRAF()
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('mousemove', onProgressMove)
  window.removeEventListener('mouseup', onProgressUp)
  window.removeEventListener('mousemove', onVolumeMove)
  window.removeEventListener('mouseup', onVolumeUp)
  if (hideControlsTimer) clearTimeout(hideControlsTimer)
})
</script>

<template>
  <div
    class="fixed inset-0 z-[100] bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8"
    @click="emit('close')"
    @mousemove="type === 'video' ? resetHideTimer() : undefined"
  >
    <!-- Close -->
    <button
      class="absolute top-5 right-5 text-white/60 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all z-50 cursor-pointer"
      @click.stop="emit('close')"
    >
      <Icon name="heroicons:x-mark-solid" class="h-5 w-5" />
    </button>

    <!-- Player Card -->
    <div
      class="player-card relative w-[95%] max-w-4xl rounded-xl overflow-hidden flex flex-col shadow-2xl cursor-default"
      :style="{
        '--tx': `${zoomTx}px`,
        '--ty': `${zoomTy}px`,
        '--scale': zoomScale
      }"
      @click.stop
    >
      <!-- Media Area -->
      <div class="relative w-full aspect-video bg-black flex items-center justify-center select-none">
        <!-- Video -->
        <video
          v-if="type === 'video'"
          ref="videoRef"
          :src="src"
          autoplay
          loop
          :muted="isMuted"
          class="w-full h-full object-contain"
          @click="togglePlay"
        />

        <!-- Image -->
        <img
          v-else
          :src="src"
          class="w-full h-full object-contain"
        />

        <!-- Play/Pause overlay animation -->
        <Transition name="fade-play-icon">
          <div
            v-if="type === 'video' && !isPlaying"
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div class="bg-black/50 backdrop-blur-sm rounded-full p-5">
              <Icon name="heroicons:play-solid" class="h-10 w-10 text-white" />
            </div>
          </div>
        </Transition>
      </div>

      <!-- Controls Bar (Video Only) -->
      <div
        v-if="type === 'video'"
        class="controls-bar"
        :class="{ 'controls-hidden': !controlsVisible }"
      >
        <!-- Progress Track -->
        <div
          ref="progressTrackRef"
          class="progress-track"
          :class="{ 'progress-active': isDraggingProgress }"
          @mousedown="onProgressDown"
        >
          <!-- Buffered -->
          <div class="progress-buffered" :style="{ width: `${buffered}%` }" />
          <!-- Filled -->
          <div class="progress-fill" :style="{ width: `${progress}%` }" />
          <!-- Thumb -->
          <div
            class="progress-thumb"
            :style="{ left: `${progress}%` }"
          />
        </div>

        <!-- Bottom Row -->
        <div class="controls-row">
          <!-- Left controls -->
          <div class="flex items-center gap-3">
            <!-- Play/Pause -->
            <button class="ctrl-btn" @click="togglePlay">
              <Icon :name="isPlaying ? 'heroicons:pause-solid' : 'heroicons:play-solid'" class="h-5 w-5" />
            </button>

            <!-- Volume -->
            <div class="volume-group">
              <button class="ctrl-btn" @click="toggleMute">
                <Icon :name="volumeIcon" class="h-5 w-5" />
              </button>
              <div
                ref="volumeTrackRef"
                class="volume-track"
                @mousedown="onVolumeDown"
              >
                <div class="volume-fill" :style="{ width: `${volume * 100}%` }" />
                <div class="volume-thumb" :style="{ left: `${volume * 100}%` }" />
              </div>
            </div>

            <!-- Time -->
            <span class="time-display">{{ fmt(currentTime) }} / {{ fmt(duration) }}</span>
          </div>

          <!-- Right -->
          <span class="brand-label">vhming.dev</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── Player Card ─── */
.player-card {
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.08);
  animation: zoomIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes zoomIn {
  from {
    transform: translate(var(--tx), var(--ty)) scale(var(--scale));
    opacity: 0.2;
  }
  to {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
}

/* ─── Controls Bar ─── */
.controls-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7));
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.controls-hidden {
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
}

/* ─── Progress Track ─── */
.progress-track {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.12);
  border-radius: 9999px;
  cursor: pointer;
  transition: height 0.15s ease;
}

.progress-track:hover,
.progress-active {
  height: 6px;
}

.progress-buffered {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(255,255,255,0.15);
  border-radius: 9999px;
  pointer-events: none;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #3b82f6;
  border-radius: 9999px;
  pointer-events: none;
  transition: background 0.15s ease;
}

.progress-track:hover .progress-fill,
.progress-active .progress-fill {
  background: #60a5fa;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: #fff;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.15s ease;
  pointer-events: none;
  box-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

.progress-track:hover .progress-thumb,
.progress-active .progress-thumb {
  transform: translate(-50%, -50%) scale(1);
}

/* ─── Controls Row ─── */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ctrl-btn {
  color: rgba(255,255,255,0.85);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.15s ease, background 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ctrl-btn:hover {
  color: #fff;
  background: rgba(255,255,255,0.1);
}

/* ─── Volume ─── */
.volume-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-track {
  position: relative;
  width: 70px;
  height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 9999px;
  cursor: pointer;
  transition: height 0.15s ease;
}

.volume-track:hover {
  height: 6px;
}

.volume-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #3b82f6;
  border-radius: 9999px;
  pointer-events: none;
}

.volume-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: #fff;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.15s ease;
  pointer-events: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.volume-track:hover .volume-thumb {
  transform: translate(-50%, -50%) scale(1);
}

/* ─── Time & Brand ─── */
.time-display {
  font-size: 12px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: rgba(255,255,255,0.55);
  user-select: none;
  white-space: nowrap;
}

.brand-label {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  user-select: none;
}

/* ─── Play icon fade ─── */
.fade-play-icon-enter-active,
.fade-play-icon-leave-active {
  transition: opacity 0.2s ease;
}
.fade-play-icon-enter-from,
.fade-play-icon-leave-to {
  opacity: 0;
}
</style>
