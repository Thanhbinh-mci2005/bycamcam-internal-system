import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  accent?: 'default' | 'amber' | 'green' | 'red' | 'blue'
}

const accentMap = {
  default: { icon: 'bg-stone-100 text-stone-600', border: '' },
  amber: { icon: 'bg-amber-100 text-amber-600', border: 'border-l-4 border-l-amber-400' },
  green: { icon: 'bg-green-100 text-green-600', border: 'border-l-4 border-l-green-400' },
  red: { icon: 'bg-red-100 text-red-600', border: 'border-l-4 border-l-red-400' },
  blue: { icon: 'bg-blue-100 text-blue-600', border: 'border-l-4 border-l-blue-400' },
}

export function MetricCard({ title, value, subtitle, icon: Icon, trend, accent = 'default' }: MetricCardProps) {
  const a = accentMap[accent]
  return (
    <div className={cn('bg-white rounded-xl border border-stone-200 shadow-sm p-5', a.border)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-stone-900 truncate">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-stone-400">{subtitle}</p>}
          {trend && (
            <p className={cn('mt-1 text-xs font-medium', trend.positive ? 'text-green-600' : 'text-red-600')}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ml-3', a.icon)}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  )
}
