<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Espaços de Café Cadastrados ({{ count }})
          </h2>
          <UButton size="sm" to="/coffee-spaces/create"
            >Novo Espaço de Café</UButton
          >
        </div>
      </template>

      <div v-if="pending">
        <ULoading message="Carregando espaços de café..." />
      </div>
      <div v-else-if="error" class="text-red-500 p-4">
        Erro ao carregar espaços.
      </div>

      <table v-else class="w-full table-auto mt-4">
        <thead>
          <tr class="bg-gray-200 dark:bg-gray-700">
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Nome</th>
            <th class="px-4 py-2 text-left">Lotação</th>
            <th class="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="space in list"
            :key="space.id"
            class="border-b border-gray-200 dark:border-gray-700"
          >
            <td class="px-4 py-2">{{ space.id }}</td>
            <td class="px-4 py-2">{{ space.name }}</td>
            <td class="px-4 py-2">{{ space.capacity }}</td>
            <td class="px-4 py-2 text-right">
              <UButton
                size="sm"
                variant="outline"
                :to="`/coffee-spaces/${space.id}`"
              >
                Detalhes
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
type CoffeeSpaceList = {
  id: number
  name: string
  capacity: number
}
const { data, pending, error } = await useApi<CoffeeSpaceList[]>(
  "/coffee-spaces"
)

const list = computed(() => data.value ?? [])
const count = computed(() => list.value.length)
</script>
