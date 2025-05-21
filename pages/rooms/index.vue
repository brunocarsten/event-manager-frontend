<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Salas Cadastradas ({{ count }})</h2>
          <UButton size="sm" @click="goToCreate">Nova Sala</UButton>
        </div>
      </template>

      <div v-if="pending">
        <ULoading message="Carregando salas..." />
      </div>
      <div v-else-if="error" class="text-red-500 p-4">
        Erro ao carregar salas.
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
            v-for="room in list"
            :key="room.id"
            class="border-b border-gray-200 dark:border-gray-700"
          >
            <td class="px-4 py-2">{{ room.id }}</td>
            <td class="px-4 py-2">{{ room.name }}</td>
            <td class="px-4 py-2">{{ room.capacity }}</td>
            <td class="px-4 py-2 text-right">
              <UButton size="sm" variant="outline" @click="goToDetail(room.id)">
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
const router = useRouter()
const { data, pending, error } =
  useApi<{ id: number; name: string; capacity: number }[]>("/rooms")

const list = computed(() => data.value ?? [])
const count = computed(() => list.value.length)

function goToCreate() {
  router.push("/rooms/create")
}

function goToDetail(id: number) {
  router.push(`/rooms/${id}`)
}
</script>
