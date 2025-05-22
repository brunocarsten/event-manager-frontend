<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Alocação de salas e cafés</h1>
        <p class="text-sm text-muted">
          Alocação de salas e cafés para os participantes do evento.
          <br />
          As salas e cafés são alocados de acordo com a disponibilidade.
        </p>
      </template>
      <div class="flex px-4 py-3.5 border-b border-accented">
        <UInput
          :model-value="table?.tableApi?.getColumn('personName')?.getFilterValue() as string"
          class="max-w-sm"
          placeholder="Filtrar por nome"
          @update:model-value="
            table?.tableApi?.getColumn('personName')?.setFilterValue($event)
          "
        />
      </div>
      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        :data="form"
        :columns="columns"
        :loading="pending"
        row-key="personId"
        class="mt-4"
      >
        <template #personName-cell="{ row }">
          {{ row.original.personName }}
        </template>
        <template #stage1Room-cell="{ row }">
          <USelect
            v-model="row.original.stage1Room"
            :items="roomOptions1"
            placeholder="Sala Etapa 1"
            class="min-w-[180px]"
          />
        </template>
        <template #stage1Coffee-cell="{ row }">
          <USelect
            v-model="row.original.stage1Coffee"
            :items="coffeeOptions1"
            placeholder="Café Etapa 1"
            class="min-w-[180px]"
          />
        </template>
        <template #stage2Room-cell="{ row }">
          <USelect
            v-model="row.original.stage2Room"
            :items="roomOptions2"
            placeholder="Sala Etapa 2"
            class="min-w-[180px]"
          />
        </template>
        <template #stage2Coffee-cell="{ row }">
          <USelect
            v-model="row.original.stage2Coffee"
            :items="coffeeOptions2"
            placeholder="Café Etapa 2"
            class="min-w-[180px]"
          />
        </template>
        <template #actions-cell="{ row }">
          <UButton
            size="sm"
            :loading="row.original.loading"
            @click="save(row.original as any)"
          >
            Salvar
          </UButton>
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
interface RawAllocation {
  person: { id: number; name: string }
  stages: { stage: number; room: string; coffee_space: string }[]
}
interface AllocForm {
  personId: number
  personName: string
  stage1Room: string
  stage1Coffee: string
  stage2Room: string
  stage2Coffee: string
  loading: boolean
  error: string | null
}
interface Resource {
  name: string
  capacity: number
}

const config = useRuntimeConfig()
const { data: rawAllocations, pending } = await useApi<RawAllocation[]>(
  "/allocations"
)
const { data: rooms } = await useApi<Resource[]>("/rooms")
const { data: coffeeSpaces } = await useApi<Resource[]>("/coffee-spaces")

const table = useTemplateRef("table")

const columnFilters = ref([
  {
    id: "personName",
    value: "",
  },
])

const form = reactive<AllocForm[]>([])
watch(
  () => rawAllocations.value,
  () => {
    form.splice(0)
    rawAllocations.value?.forEach((item) => {
      const [s1, s2] = [1, 2].map((stage) =>
        item.stages.find((s) => s.stage === stage)
      )
      form.push({
        personId: item.person.id,
        personName: item.person.name,
        stage1Room: s1?.room || "",
        stage1Coffee: s1?.coffee_space || "",
        stage2Room: s2?.room || "",
        stage2Coffee: s2?.coffee_space || "",
        loading: false,
        error: null,
      })
    })
  },
  { immediate: true }
)

function countBy(
  field: "stage1Room" | "stage2Room" | "stage1Coffee" | "stage2Coffee"
) {
  return computed(() =>
    form.reduce<Record<string, number>>((acc, row) => {
      const val = row[field]
      if (val) acc[val] = (acc[val] || 0) + 1
      return acc
    }, {})
  )
}

function makeOptions(
  resources: Resource[],
  counts: ReturnType<typeof countBy>
) {
  return resources.map((r) => {
    const used = counts.value[r.name] || 0
    return {
      label: `${r.name}${used >= r.capacity ? " (lotada)" : ""}`,
      value: r.name,
      disabled: used >= r.capacity,
    }
  })
}

const counts1Room = countBy("stage1Room"),
  counts2Room = countBy("stage2Room")
const counts1Coffee = countBy("stage1Coffee"),
  counts2Coffee = countBy("stage2Coffee")

const roomOptions1 = computed(() => makeOptions(rooms.value || [], counts1Room))
const roomOptions2 = computed(() => makeOptions(rooms.value || [], counts2Room))
const coffeeOptions1 = computed(() =>
  makeOptions(coffeeSpaces.value || [], counts1Coffee)
)
const coffeeOptions2 = computed(() =>
  makeOptions(coffeeSpaces.value || [], counts2Coffee)
)

const columns = computed(() => [
  { accessorKey: "personName", header: "Participante" },
  { accessorKey: "stage1Room", header: "Sala Etapa 1" },
  { accessorKey: "stage1Coffee", header: "Café Etapa 1" },
  { accessorKey: "stage2Room", header: "Sala Etapa 2" },
  { accessorKey: "stage2Coffee", header: "Café Etapa 2" },
  { accessorKey: "actions", header: "Ações" },
])

async function save(entry: AllocForm) {
  entry.loading = true
  entry.error = null
  try {
    await $fetch(`${config.public.apiBase}/people/${entry.personId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: {
        stage_1_room: entry.stage1Room,
        stage_1_coffee_space: entry.stage1Coffee,
        stage_2_room: entry.stage2Room,
        stage_2_coffee_space: entry.stage2Coffee,
      },
    })
  } catch (err: any) {
    entry.error = err.message || "Erro ao salvar alocação."
  } finally {
    entry.loading = false
  }
}
</script>
