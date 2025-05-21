
// composables/useApiFetch.ts
import type { UseFetchOptions } from '#app'

interface FetchResult<T> {
  data: Ref<T | null>
  pending: Ref<boolean>
  error: Ref<unknown>
}

/**
 * useApi: Wrapper para useFetch que desembala o `data` de Laravel Resources
 * @param endpoint - Rota da API (ex: '/people')
 * @param options  - Opções compatíveis com UseFetchOptions<{ data: T }, any>
 */
export function useApi<T>(
  endpoint: string,
  options?: UseFetchOptions<{ data: T }, any>
): FetchResult<T> {
  const config = useRuntimeConfig()
  const url = `${config.public.apiBase}${endpoint}`

  const { data: raw, pending, error } = useFetch<{ data: T }>(url, options)

  const data = computed<T | null>(() => raw.value?.data ?? null)

  return { data, pending, error }
}
