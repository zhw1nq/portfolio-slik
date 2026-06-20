<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'

interface Props {
  linesGradient?: string[]
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>
  lineCount?: number | number[]
  lineDistance?: number | number[]
  topWavePosition?: { x: number; y: number; rotate: number }
  middleWavePosition?: { x: number; y: number; rotate: number }
  bottomWavePosition?: { x: number; y: number; rotate: number }
  animationSpeed?: number
  interactive?: boolean
  bendRadius?: number
  bendStrength?: number
  mouseDamping?: number
  parallax?: boolean
  parallaxStrength?: number
  mixBlendMode?: string
}

const props = withDefaults(defineProps<Props>(), {
  enabledWaves: () => ['top', 'middle', 'bottom'],
  lineCount: () => [6],
  lineDistance: () => [5],
  bottomWavePosition: () => ({ x: 2.0, y: -0.7, rotate: -1 }),
  animationSpeed: 1,
  interactive: true,
  bendRadius: 5.0,
  bendStrength: -0.5,
  mouseDamping: 0.05,
  parallax: true,
  parallaxStrength: 0.2,
  mixBlendMode: 'screen'
})

const containerRef = ref<HTMLDivElement | null>(null)
const targetMouse = new Vector2(-1000, -1000)
const currentMouse = new Vector2(-1000, -1000)
let targetInfluence = 0
let currentInfluence = 0
const targetParallax = new Vector2(0, 0)
const currentParallax = new Vector2(0, 0)

let renderer: WebGLRenderer | null = null
let scene: Scene | null = null
let camera: OrthographicCamera | null = null
let material: ShaderMaterial | null = null
let geometry: PlaneGeometry | null = null
let mesh: Mesh | null = null
let clock: Clock | null = null
let animationId = 0
let resizeObserver: ResizeObserver | null = null
let isActive = true

const MAX_GRADIENT_STOPS = 8

function hexToVec3(hex: string): Vector3 {
  let value = hex.trim()
  if (value.startsWith('#')) {
    value = value.slice(1)
  }
  let r = 255
  let g = 255
  let b = 255
  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16)
    g = parseInt(value[1] + value[1], 16)
    b = parseInt(value[2] + value[2], 16)
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16)
    g = parseInt(value.slice(2, 4), 16)
    b = parseInt(value.slice(4, 6), 16)
  }
  return new Vector3(r / 255, g / 255, b / 255)
}

const vertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;
varying vec2 vUv;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;
  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }
  vec3 gradientColor;
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    // Cycle colors over time (all lines change color together, no 8 colors at once)
    float timeOffset = iTime * animationSpeed * 0.05;
    float cycledT = fract(timeOffset);

    float clampedT = clamp(cycledT, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);
    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];
    gradientColor = mix(c1, c2, f);
  }
  return gradientColor * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  // Balanced brightness and blur
  return 0.012 / (abs(m) + 0.02) + 0.008;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);
  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  if (enableBottom) {
    for (int i = 0; i < 40; ++i) {
      if (i >= bottomLineCount) break;
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.3;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < 40; ++i) {
      if (i >= middleLineCount) break;
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.6;
    }
  }

  if (enableTop) {
    for (int i = 0; i < 40; ++i) {
      if (i >= topLineCount) break;
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
    }
  }

  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`

const getLineCount = (waveType: 'top' | 'middle' | 'bottom') => {
  if (typeof props.lineCount === 'number') return props.lineCount
  if (!props.enabledWaves.includes(waveType)) return 0
  const index = props.enabledWaves.indexOf(waveType)
  return props.lineCount[index] ?? 6
}

const getLineDistance = (waveType: 'top' | 'middle' | 'bottom') => {
  if (typeof props.lineDistance === 'number') return props.lineDistance
  if (!props.enabledWaves.includes(waveType)) return 0.1
  const index = props.enabledWaves.indexOf(waveType)
  return props.lineDistance[index] ?? 0.1
}

const topLineCount = computed(() => props.enabledWaves.includes('top') ? getLineCount('top') : 0)
const middleLineCount = computed(() => props.enabledWaves.includes('middle') ? getLineCount('middle') : 0)
const bottomLineCount = computed(() => props.enabledWaves.includes('bottom') ? getLineCount('bottom') : 0)

const topLineDistance = computed(() => props.enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01)
const middleLineDistance = computed(() => props.enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01)
const bottomLineDistance = computed(() => props.enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01)

const setSize = () => {
  if (!isActive || !containerRef.value || !renderer || !material) return
  const width = containerRef.value.clientWidth || 1
  const height = containerRef.value.clientHeight || 1

  renderer.setSize(width, height, false)

  const canvasWidth = renderer.domElement.width
  const canvasHeight = renderer.domElement.height
  material.uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1)
}

const handlePointerMove = (event: PointerEvent) => {
  if (!renderer) return
  const rect = renderer.domElement.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const dpr = renderer.getPixelRatio()

  targetMouse.set(x * dpr, (rect.height - y) * dpr)
  targetInfluence = 1.0

  if (props.parallax) {
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const offsetX = (x - centerX) / rect.width
    const offsetY = -(y - centerY) / rect.height
    targetParallax.set(offsetX * props.parallaxStrength, offsetY * props.parallaxStrength)
  }
}

const handlePointerLeave = () => {
  targetInfluence = 0.0
}

const renderLoop = () => {
  if (!isActive || !renderer || !scene || !camera || !material || !clock) return

  material.uniforms.iTime.value = clock.getElapsedTime()

  if (props.interactive) {
    currentMouse.lerp(targetMouse, props.mouseDamping)
    material.uniforms.iMouse.value.copy(currentMouse)

    currentInfluence += (targetInfluence - currentInfluence) * props.mouseDamping
    material.uniforms.bendInfluence.value = currentInfluence
  }

  if (props.parallax) {
    currentParallax.lerp(targetParallax, props.mouseDamping)
    material.uniforms.parallaxOffset.value.copy(currentParallax)
  }

  renderer.render(scene, camera)
  animationId = requestAnimationFrame(renderLoop)
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  isActive = true
  scene = new Scene()

  camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  camera.position.z = 1

  renderer = new WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  container.appendChild(renderer.domElement)

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new Vector3(1, 1, 1) },
    animationSpeed: { value: props.animationSpeed },

    enableTop: { value: props.enabledWaves.includes('top') },
    enableMiddle: { value: props.enabledWaves.includes('middle') },
    enableBottom: { value: props.enabledWaves.includes('bottom') },

    topLineCount: { value: topLineCount.value },
    middleLineCount: { value: middleLineCount.value },
    bottomLineCount: { value: bottomLineCount.value },

    topLineDistance: { value: topLineDistance.value },
    middleLineDistance: { value: middleLineDistance.value },
    bottomLineDistance: { value: bottomLineDistance.value },

    topWavePosition: {
      value: new Vector3(
        props.topWavePosition?.x ?? 10.0,
        props.topWavePosition?.y ?? 0.5,
        props.topWavePosition?.rotate ?? -0.4
      )
    },
    middleWavePosition: {
      value: new Vector3(
        props.middleWavePosition?.x ?? 5.0,
        props.middleWavePosition?.y ?? 0.0,
        props.middleWavePosition?.rotate ?? 0.2
      )
    },
    bottomWavePosition: {
      value: new Vector3(
        props.bottomWavePosition?.x ?? 2.0,
        props.bottomWavePosition?.y ?? -0.7,
        props.bottomWavePosition?.rotate ?? 0.4
      )
    },

    iMouse: { value: new Vector2(-1000, -1000) },
    interactive: { value: props.interactive },
    bendRadius: { value: props.bendRadius },
    bendStrength: { value: props.bendStrength },
    bendInfluence: { value: 0 },

    parallax: { value: props.parallax },
    parallaxStrength: { value: props.parallaxStrength },
    parallaxOffset: { value: new Vector2(0, 0) },

    lineGradient: {
      value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1))
    },
    lineGradientCount: { value: 0 }
  }

  if (props.linesGradient && props.linesGradient.length > 0) {
    const stops = props.linesGradient.slice(0, MAX_GRADIENT_STOPS)
    uniforms.lineGradientCount.value = stops.length

    stops.forEach((hex, i) => {
      const color = hexToVec3(hex)
      uniforms.lineGradient.value[i].set(color.x, color.y, color.z)
    })
  }

  material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  })

  geometry = new PlaneGeometry(2, 2)
  mesh = new Mesh(geometry, material)
  scene.add(mesh)

  clock = new Clock()

  setSize()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      setSize()
    })
    resizeObserver.observe(container)
  }

  if (props.interactive) {
    renderer.domElement.addEventListener('pointermove', handlePointerMove)
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave)
  }

  renderLoop()
})

onBeforeUnmount(() => {
  isActive = false
  cancelAnimationFrame(animationId)

  if (resizeObserver && containerRef.value) {
    resizeObserver.disconnect()
  }

  if (renderer && renderer.domElement) {
    if (props.interactive) {
      renderer.domElement.removeEventListener('pointermove', handlePointerMove)
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave)
    }
    if (renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement)
    }
    renderer.dispose()
    renderer.forceContextLoss()
  }

  if (geometry) geometry.dispose()
  if (material) material.dispose()
})

watch(() => props.animationSpeed, (val) => {
  if (material) material.uniforms.animationSpeed.value = val
})
watch(() => props.interactive, (val) => {
  if (material) {
    material.uniforms.interactive.value = val
    if (renderer && renderer.domElement) {
      if (val) {
        renderer.domElement.addEventListener('pointermove', handlePointerMove)
        renderer.domElement.addEventListener('pointerleave', handlePointerLeave)
      } else {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove)
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave)
      }
    }
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="floating-lines-container"
    :style="{
      mixBlendMode: mixBlendMode as any
    }"
  />
</template>

<style scoped>
.floating-lines-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.floating-lines-container :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
