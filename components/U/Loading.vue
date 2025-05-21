<template>
  <div class="flex justify-center items-center">
    <div class="dots-spinner">
      <span v-for="n in 8" :key="n" :style="getDotStyle(n)" class="dot" />
    </div>
    <p class="ml-2 text-gray-600 dark:text-gray-300">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: "Carregando...",
  },
})

/**
 * Calcula a posição de cada ponto em círculo.
 */
function getDotStyle(n: number) {
  const total = 8
  const angle = (360 / total) * (n - 1)
  const radius = 12 // px
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const rad = (angle * Math.PI) / 180
  return {
    transform: `rotate(${angle}deg) translate(${radius}px)`,
    animationDelay: `${(n - 1) * 0.1}s`,
  }
}
</script>

<style scoped>
.dots-spinner {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 50%;
  background: #3b82f6;
  opacity: 0.6;
  animation: dotFade 0.8s linear infinite;
}
@keyframes dotFade {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
