const moneyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  minimumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

export function displayCategory(value?: string | null): string {
  return value?.trim() ? value : '总预算'
}

export function formatMoney(value?: string | number | null): string {
  const amount = Number(value ?? 0)
  return moneyFormatter.format(Number.isFinite(amount) ? amount : 0)
}

export function formatPercent(value?: string | number | null): string {
  if (value === null || value === undefined || value === '') {
    return '--'
  }
  const amount = Number(value)
  if (!Number.isFinite(amount)) {
    return '--'
  }
  return percentFormatter.format(amount)
}

export function formatDate(value?: string | null, withTime = false): string {
  if (!value) {
    return '--'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return withTime
    ? new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    : new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date)
}

export function warningLabel(value?: string | null): string {
  switch (value) {
    case 'NORMAL':
      return '正常'
    case 'NEAR_LIMIT':
      return '接近预算'
    case 'OVER_BUDGET':
      return '已超支'
    default:
      return '未配置'
  }
}

export function categorySourceLabel(value?: string | null): string {
  switch (value) {
    case 'AUTO':
      return '自动分类'
    case 'MANUAL':
      return '人工修正'
    case 'UNCLASSIFIED':
      return '未分类'
    default:
      return '--'
  }
}

export function directionLabel(value?: string | null): string {
  switch (value) {
    case 'INCOME':
      return '收入'
    case 'EXPENSE':
      return '支出'
    default:
      return '--'
  }
}

export function importSourceLabel(value?: string | null): string {
  switch (value) {
    case 'ALIPAY_CSV':
      return '支付宝 CSV'
    case 'WECHAT_CSV':
      return '微信 CSV'
    default:
      return '--'
  }
}

export function importStatusLabel(value?: string | null): string {
  switch (value) {
    case 'PENDING':
      return '待处理'
    case 'PROCESSING':
      return '处理中'
    case 'SUCCESS':
      return '成功'
    case 'PARTIAL_SUCCESS':
      return '部分成功'
    case 'FAILED':
      return '失败'
    default:
      return '--'
  }
}

export function compactNumber(value?: string | number | null): string {
  const amount = Number(value ?? 0)
  if (!Number.isFinite(amount)) {
    return '--'
  }
  return new Intl.NumberFormat('zh-CN').format(amount)
}
