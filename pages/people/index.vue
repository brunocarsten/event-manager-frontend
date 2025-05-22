<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Pessoas Cadastradas ({{ peopleCount }})
          </h2>
          <UButton size="sm" to="/people/create">Novo cadastro</UButton>
        </div>
      </template>

      <ULoading v-if="pending" />
      <div v-else-if="error" class="py-4 text-red-500">
        Erro ao carregar pessoas.
      </div>
      <table v-else class="w-full table-auto">
        <thead>
          <tr class="bg-gray-200 dark:bg-gray-700">
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Nome</th>
            <th class="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="person in people"
            :key="person.id"
            class="border-b border-gray-200 dark:border-gray-700"
          >
            <td class="px-4 py-2">{{ person.id }}</td>
            <td class="px-4 py-2">{{ person.full_name }}</td>
            <td class="px-4 py-2 text-right">
              <UButton :to="`/people/${person.id}`" size="sm">Detalhes</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
interface Person {
  id: number
  full_name: string
}
const { data: people, pending, error } = await useApi<Person[]>("/people")
const peopleCount = computed(() => people.value?.length ?? 0)
</script>
