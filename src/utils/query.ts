import type { LocationQueryValue } from 'vue-router'

export function getQueryString(value: LocationQueryValue | LocationQueryValue[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0] ?? undefined
  }
  return value ?? undefined
}

export function getQueryNumber(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
  fallback: number,
): number {
  const raw = getQueryString(value)
  if (!raw) {
    return fallback
  }
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function compactQuery(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}
