import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'VND') {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value: number, decimals = 1) {
  return `${value.toFixed(decimals)}%`
}

export function calculateMargin(cost: number, price: number): number {
  if (price === 0) return 0
  return ((price - cost) / price) * 100
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Product status
    active: 'bg-green-100 text-green-800',
    slow_moving: 'bg-yellow-100 text-yellow-800',
    potential: 'bg-blue-100 text-blue-800',
    discontinued: 'bg-gray-100 text-gray-600',
    // Task status
    todo: 'bg-slate-100 text-slate-700',
    doing: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
    // Campaign status
    draft: 'bg-gray-100 text-gray-600',
    paused: 'bg-orange-100 text-orange-700',
    ended: 'bg-red-100 text-red-700',
  }
  return colors[status] ?? 'bg-gray-100 text-gray-600'
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  }
  return colors[priority] ?? 'bg-gray-100 text-gray-600'
}

export function formatStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Active',
    slow_moving: 'Slow Moving',
    potential: 'Potential',
    discontinued: 'Discontinued',
    todo: 'To Do',
    doing: 'Doing',
    done: 'Done',
    draft: 'Draft',
    paused: 'Paused',
    ended: 'Ended',
    tiktok_shop: 'TikTok Shop',
    shopee: 'Shopee',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    import: 'Import',
    export: 'Export',
    adjustment: 'Adjustment',
  }
  return labels[status] ?? status
}

export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date()
}
