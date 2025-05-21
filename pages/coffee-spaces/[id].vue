<template>
  <UContainer class="py-8">
    <UCard class="dark:bg-gray-800">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Detalhes do Espaço de Café</h2>
          <UButton size="sm" variant="outline" @click="goBack">Voltar</UButton>
        </div>
      </template>

      <div v-if="pending" class="py-4">
        <ULoading message="Carregando espaço..." />
      </div>
      <div v-else-if="error" class="text-red-500 p-4">{{ error }}</div>

      <div v-else>
        <form class="space-y-4 p-4" @submit.prevent="updateSpace">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nome do Espaço
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
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
              v-model.number="form.capacity"
              type="number"
              min="1"
              required
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div v-if="updateError" class="text-red-500 text-sm">
            {{ updateError }}
          </div>

          <div class="flex items-center space-x-4">
            <UButton :disabled="updateLoading" type="submit">
              <template v-if="updateLoading">
                <ULoading message="Salvando..." />
              </template>
              <template v-else> Salvar </template>
            </UButton>

            <UButton
              class="ml-auto bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600"
              :disabled="updateLoading"
              @click.prevent="deleteSpace"
            >
              <template v-if="updateLoading">
                <ULoading message="Processando..." />
              </template>
              <template v-else> Deletar </template>
            </UButton>
          </div>
        </form>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <UCard class="p-4">
            <template #header>
              <h3 class="text-lg font-medium">Pessoas Etapa 1</h3>
            </template>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li v-for="person in space?.stage_1_people" :key="person">
                {{ person }}
              </li>
            </ul>
          </UCard>

          <UCard class="p-4">
            <template #header>
              <h3 class="text-lg font-medium">Pessoas Etapa 2</h3>
            </template>
            <ul class="list-disc list-inside mt-2 space-y-1">
              <li v-for="person in space?.stage_2_people" :key="person">
                {{ person }}
              </li>
            </ul>
          </UCard>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

interface SpaceDetail {
  id: number
  name: string
  capacity: number
  stage_1_people: string[]
  stage_2_people: string[]
}

const spaceId = route.params.id as string
const {
  data: space,
  pending,
  error,
} = useApi<SpaceDetail>(`/coffee-spaces/${spaceId}`)

const form = reactive({ name: "", capacity: 1 })
const updateLoading = ref(false)
const updateError = ref<string | null>(null)

watchEffect(() => {
  if (space.value) {
    form.name = space.value.name
    form.capacity = space.value.capacity
  }
})

function goBack() {
  router.push("/coffee-spaces")
}

async function updateSpace() {
  updateLoading.value = true
  updateError.value = null
  try {
    await $fetch(`${config.public.apiBase}/coffee-spaces/${spaceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: { name: form.name, capacity: form.capacity },
    })
    router.push("/coffee-spaces")
  } catch (e: any) {
    updateError.value = e?.message || "Erro ao atualizar o espaço."
  } finally {
    updateLoading.value = false
  }
}

async function deleteSpace() {
  if (!confirm("Deseja realmente deletar este espaço?")) return
  updateLoading.value = true
  updateError.value = null
  try {
    await $fetch(`${config.public.apiBase}/coffee-spaces/${spaceId}`, {
      method: "DELETE",
    })
    router.push("/coffee-spaces")
  } catch (e: any) {
    updateError.value = e?.message || "Erro ao deletar o espaço."
  } finally {
    updateLoading.value = false
  }
}
</script>
