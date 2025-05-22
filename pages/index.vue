<template>
  <UContainer class="py-8">
    <UCard class="mb-6 p-4 relative">
      <div class="relative">
        <UInput
          v-model="searchQuery"
          placeholder="Buscar pessoas, salas ou cafés"
          class="w-full"
        />
        <ul
          v-if="searchQuery && searchResults.length"
          class="absolute top-full left-0 w-full bg-white dark:bg-gray-800 rounded shadow max-h-48 overflow-auto z-10"
        >
          <li
            v-for="item in searchResults"
            :key="item.id"
            class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 cursor-pointer"
            @click="navigate(item.path)"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </UCard>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <NuxtLink to="/people">
        <UCard class="p-4">
          <template #header>
            <h3 class="text-lg font-medium">Total de Pessoas</h3>
          </template>
          <div class="py-4 min-h-[100px]">
            <ULoading v-if="peoplePending" message="Carregando pessoas..." />
            <div v-else class="text-3xl font-bold mt-2">{{ peopleCount }}</div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/rooms">
        <UCard class="p-4">
          <template #header>
            <h3 class="text-lg font-medium">Total de Salas</h3>
          </template>
          <div class="py-4 min-h-[100px]">
            <ULoading v-if="roomsPending" message="Carregando salas..." />
            <div v-else class="text-3xl font-bold mt-2">{{ roomsCount }}</div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/coffee-spaces">
        <UCard class="p-4">
          <template #header>
            <h3 class="text-lg font-medium">Total de Espaços de Café</h3>
          </template>
          <div class="py-4 min-h-[100px]">
            <ULoading v-if="coffeePending" message="Carregando cafés..." />
            <div v-else class="text-3xl font-bold mt-2">{{ coffeeCount }}</div>
          </div>
        </UCard>
      </NuxtLink>

      <UCard class="p-4">
        <template #header>
          <h3 class="text-lg font-medium">Alocações Pendentes</h3>
        </template>
        <div class="py-4 min-h-[100px]">
          <ULoading v-if="allocPending" message="Carregando alocações..." />
          <div v-else class="text-3xl font-bold mt-2">
            {{ pendingAllocations }}
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <UButton color="primary" to="/people/create"> Cadastrar pessoa </UButton>
      <UButton color="primary" to="/rooms/create"> Cadastrat Sala </UButton>
      <UButton color="primary" to="/coffee-spaces/create">
        Cadastrar Espaço de Café
      </UButton>
      <UButton color="secondary" @click="navigate('/allocations')">
        Alocar Participantes
      </UButton>
    </div>

    <UCard class="p-4">
      <template #header>
        <div class="space-y-3 grid grid-cols-3 gap-10">
          <span class="text-lg font-medium">Últimas Alocações</span>
          <span class="text-center">Etapa 1</span>
          <span class="text-end">Etapa 2</span>
        </div>
      </template>
      <div v-if="allocPending" class="py-4">
        <ULoading message="Carregando alocações..." />
      </div>
      <ul v-else class="mt-2 space-y-3">
        <li
          v-for="alloc in recentAllocations"
          :key="alloc.personId"
          class="grid grid-cols-3 gap-10"
        >
          <span>{{ alloc.personName }}</span>
          <span class="text-sm text-center">
            {{ alloc.stage1?.room || "—" }} | Café:
            {{ alloc.stage1?.coffee || "—" }}
          </span>
          <span class="text-sm text-end">
            {{ alloc.stage2?.room || "—" }} | Café:
            {{ alloc.stage2?.coffee || "—" }}
          </span>
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
interface PersonList {
  id: number
  full_name: string
  stage1: string | null
  stage2: string | null
}
interface RoomList {
  id: number
  name: string
  capacity: number
}
interface CoffeeSpaceList {
  id: number
  name: string
  capacity: number
}
interface RawAllocation {
  person: { id: number; name: string }
  stages: { stage: number; room: string; coffee_space: string }[]
  updated_at: string
  created_at: string
}
interface GroupedAllocation {
  personId: number
  personName: string
  stage1: { room: string; coffee: string } | null
  stage2: { room: string; coffee: string } | null
  updated_at?: string
  created_at?: string
}

const router = useRouter()
const { data: people, pending: peoplePending } = useApi<PersonList[]>("/people")
const { data: rooms, pending: roomsPending } = useApi<RoomList[]>("/rooms")
const { data: coffeeSpaces, pending: coffeePending } =
  useApi<CoffeeSpaceList[]>("/coffee-spaces")
const { data: rawAllocations, pending: allocPending } =
  useApi<RawAllocation[]>("/allocations")

const searchQuery = ref("")
interface SearchItem {
  id: string
  label: string
  path: string
}

const searchResults = computed<SearchItem[]>(() => {
  const term = searchQuery.value.toLowerCase()
  const results: SearchItem[] = []
  people.value?.forEach((p) => {
    if (p.full_name.toLowerCase().includes(term)) {
      results.push({
        id: `p-${p.id}`,
        label: `Pessoa: ${p.full_name}`,
        path: `/people/${p.id}`,
      })
    }
  })
  rooms.value?.forEach((r) => {
    if (r.name.toLowerCase().includes(term)) {
      results.push({
        id: `r-${r.id}`,
        label: `Sala: ${r.name}`,
        path: `/rooms/${r.id}`,
      })
    }
  })
  coffeeSpaces.value?.forEach((c) => {
    if (c.name.toLowerCase().includes(term)) {
      results.push({
        id: `c-${c.id}`,
        label: `Café: ${c.name}`,
        path: `/coffee-spaces/${c.id}`,
      })
    }
  })
  return results
})

const peopleCount = computed(() => people.value?.length ?? 0)
const roomsCount = computed(() => rooms.value?.length ?? 0)
const coffeeCount = computed(() => coffeeSpaces.value?.length ?? 0)

const groupedAllocations = computed<GroupedAllocation[]>(
  () =>
    rawAllocations.value?.map((item) => {
      const stage1Entry = item.stages.find((s) => s.stage === 1)
      const stage2Entry = item.stages.find((s) => s.stage === 2)
      return {
        personId: item.person.id,
        personName: item.person.name,
        stage1: stage1Entry
          ? { room: stage1Entry.room, coffee: stage1Entry.coffee_space }
          : null,
        stage2: stage2Entry
          ? { room: stage2Entry.room, coffee: stage2Entry.coffee_space }
          : null,
      }
    }) ?? []
)

const pendingAllocations = computed(
  () =>
    (people.value ?? []).filter((a) => a.stage1 === null || a.stage2 === null)
      .length
)

const recentAllocations = computed<GroupedAllocation[]>(() => {
  if (!rawAllocations.value) return []
  return [...rawAllocations.value]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 5)
    .map((item) =>
      groupedAllocations.value.find((a) => a.personId === item.person.id)
    )
    .filter((a): a is GroupedAllocation => !!a)
})

function navigate(path: string) {
  router.push(path)
}
</script>
