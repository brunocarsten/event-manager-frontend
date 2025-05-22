<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Detalhes da Pessoa</h2>
          <UButton size="sm" class="cursor-pointer" @click="goBack">
            Voltar
          </UButton>
        </div>
      </template>

      <div v-if="pending" class="py-4 text-center">Carregando...</div>
      <div v-else-if="error" class="py-4 text-red-500">
        Erro ao carregar os dados.
      </div>

      <div v-else class="space-y-6">
        <div class="space-y-2">
          <div><strong>ID:</strong> {{ person?.id }}</div>
          <div><strong>Nome:</strong> {{ person?.full_name }}</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UCard class="p-4">
            <template #header>
              <h3 class="text-lg font-medium">Etapa 1</h3>
            </template>
            <div class="mt-2 space-y-1">
              <div><strong>Sala:</strong> {{ person?.stage_1.room }}</div>
              <div>
                <strong>Café:</strong> {{ person?.stage_1.coffee_space }}
              </div>
            </div>
          </UCard>

          <UCard class="p-4">
            <template #header>
              <h3 class="text-lg font-medium">Etapa 2</h3>
            </template>
            <div class="mt-2 space-y-1">
              <div><strong>Sala:</strong> {{ person?.stage_2.room }}</div>
              <div>
                <strong>Café:</strong> {{ person?.stage_2.coffee_space }}
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
interface PersonDetail {
  id: number
  full_name: string
  stage_1: { id: number; room: string; coffee_space: string }
  stage_2: { id: number; room: string; coffee_space: string }
}

const route = useRoute()
const router = useRouter()
const personId = route.params.id as string
const {
  data: person,
  pending,
  error,
} = await useApi<PersonDetail>(`/people/${personId}`)

function goBack() {
  router.push("/people")
}
</script>
