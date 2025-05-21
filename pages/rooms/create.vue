<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Cadastrar Nova Sala</h2>
          <UButton size="sm" variant="outline" @click="goBack">Voltar</UButton>
        </div>
      </template>

      <form class="space-y-4 p-4" @submit.prevent="submit">
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nome da Sala
          </label>
          <input
            id="name"
            v-model="data.name"
            type="text"
            required
            placeholder="Digite o nome da sala"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            for="capacity"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Lotação
          </label>
          <input
            id="capacity"
            v-model.number="data.capacity"
            type="number"
            min="1"
            required
            placeholder="Digite a lotação"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

        <div>
          <UButton :disabled="pending" type="submit">
            <template v-if="pending">
              <ULoading message="Criando..." />
            </template>
            <template v-else> Criar </template>
          </UButton>
        </div>
      </form>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const router = useRouter()
const config = useRuntimeConfig()

const pending = ref(false)
const error = ref<string | null>(null)

const data = reactive({
  name: "",
  capacity: 1,
})

function goBack() {
  router.push("/rooms")
}

async function submit() {
  pending.value = true
  error.value = null
  try {
    await $fetch(`${config.public.apiBase}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { ...data },
    })
    router.push("/rooms")
  } catch (e: any) {
    error.value = e?.message || "Erro ao criar sala."
  } finally {
    pending.value = false
  }
}
</script>
