function formatPart(value: number): string {
  return String(value).padStart(2, '0')
}

export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${formatPart(date.getMonth() + 1)}-${formatPart(date.getDate())}`
}

export function getPreviousMonthRange(today = new Date()): { dateFrom: string; dateTo: string; budgetMonth: string } {
  const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth.getTime() - 24 * 60 * 60 * 1000)
  const firstDayOfPreviousMonth = new Date(lastDayOfPreviousMonth.getFullYear(), lastDayOfPreviousMonth.getMonth(), 1)

  return {
    dateFrom: toDateString(firstDayOfPreviousMonth),
    dateTo: toDateString(lastDayOfPreviousMonth),
    budgetMonth: toDateString(firstDayOfPreviousMonth),
  }
}

export function toMonthLabel(value: string): string {
  if (!value) {
    return '--'
  }
  const [year, month] = value.split('-')
  return `${year}年${month}月`
}
