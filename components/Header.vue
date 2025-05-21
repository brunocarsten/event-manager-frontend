<template>
  <div class="sticky top-0 left-0 right-0 z-50">
    <nav
      class="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 shadow"
    >
      <div class="flex items-center">
        <button class="p-2 focus:outline-none" @click="toggleMenu">
          <svg
            v-if="!menuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-800 dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-800 dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <NuxtLink to="/">
          <h1 class="ml-3 text-xl font-semibold text-gray-800 dark:text-white">
            Sistema de Evento
          </h1>
        </NuxtLink>
      </div>

      <ColorModeButton />

      <transition name="fade">
        <div
          v-if="menuOpen"
          class="fixed inset-0 bg-black opacity-50 z-40"
          @click="toggleMenu"
        />
      </transition>
      <transition name="slide">
        <aside
          v-if="menuOpen"
          class="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 z-50 p-4"
        >
          <slot name="menu">
            <ul class="space-y-2">
              <li><NuxtLink to="/">Dashboard</NuxtLink></li>
              <li><NuxtLink to="/people">Pessoas</NuxtLink></li>
              <li><NuxtLink to="/rooms">Salas</NuxtLink></li>
              <li><NuxtLink to="/coffee-spaces">Espaços de Café</NuxtLink></li>
              <li><NuxtLink to="/allocations">Alocações</NuxtLink></li>
            </ul>
          </slot>
        </aside>
      </transition>
    </nav>
  </div>
</template>

<script setup lang="ts">
const menuOpen = ref(false)
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
