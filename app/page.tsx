import { Topbar } from '@/components/layout/topbar'
import { MetricCard } from '@/components/dashboard/metric-card'
import { LowStockAlert } from '@/components/dashboard/low-stock-alert'
import { CampaignSummary } from '@/components/dashboard/campaign-summary'
import { TaskSummary } from '@/components/dashboard/task-summary'
import { Badge } from '@/components/ui/badge'
import {
  mockBestSellers,
  mockCampaigns,
  mockDashboardMetrics,
  mockLowStock,
  mockSlowMovers,
  mockTasks,
} from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/utils'
import {
  AlertTriangle,
  Box,
  ClipboardList,
  Megaphone,
  Package,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const m = mockDashboardMetrics
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Dashboard" subtitle={today} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Active SKUs"
            value={String(m.totalActiveSKUs)}
            subtitle={`${m.totalProducts} total products`}
            icon={Box}
            accent="amber"
          />
          <MetricCard
            title="Low Stock Alerts"
            value={String(m.lowStockCount)}
            subtitle="Need restocking"
            icon={AlertTriangle}
            accent="red"
          />
          <MetricCard
            title="Active Campaigns"
            value={String(m.activeCampaigns)}
            subtitle={`ROAS: ${m.roas}x avg`}
            icon={Megaphone}
            accent="blue"
          />
          <MetricCard
            title="Open Tasks"
            value={String(m.pendingTasks)}
            subtitle={m.overdueTasks > 0 ? `${m.overdueTasks} overdue` : 'All on track'}
            icon={ClipboardList}
            accent={m.overdueTasks > 0 ? 'red' : 'green'}
          />
        </div>

        {/* Revenue Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total Ad Spend"
            value={formatCurrency(m.totalAdSpend)}
            subtitle="Active campaigns"
            icon={TrendingDown}
            accent="default"
          />
          <MetricCard
            title="Campaign Revenue"
            value={formatCurrency(m.totalRevenue)}
            subtitle="Active campaigns"
            icon={TrendingUp}
            accent="green"
            trend={{ value: `${m.roas}x ROAS`, positive: true }}
          />
          <MetricCard
            title="Inventory Value"
            value={formatCurrency(m.totalInventoryValue)}
            subtitle="At selling price"
            icon={Package}
            accent="amber"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LowStockAlert products={mockLowStock} />
          <CampaignSummary campaigns={mockCampaigns} />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Best Sellers */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" />
                <h3 className="text-sm font-semibold text-stone-800">Best Sellers</h3>
              </div>
              <Link href="/products" className="text-xs text-amber-600 hover:underline font-medium">View all</Link>
            </div>
            <div className="divide-y divide-stone-50">
              {mockBestSellers.map((product, i) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50">
                  <span className="text-xs font-bold text-stone-300 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                    <p className="text-xs text-stone-400">{product.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-stone-800">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-green-600">{formatPercent(product.margin ?? 0)} margin</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slow Movers */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} className="text-yellow-500" />
                <h3 className="text-sm font-semibold text-stone-800">Slow Moving</h3>
                <Badge className="bg-yellow-100 text-yellow-700">{mockSlowMovers.length}</Badge>
              </div>
              <Link href="/products?status=slow_moving" className="text-xs text-amber-600 hover:underline font-medium">View all</Link>
            </div>
            <div className="divide-y divide-stone-50">
              {mockSlowMovers.map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                    <p className="text-xs text-stone-400">{product.sku} · {product.collection}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-stone-800">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-stone-400">{product.inventory?.quantity} in stock</p>
                  </div>
                </div>
              ))}
              {mockSlowMovers.length === 0 && (
                <p className="px-5 py-8 text-sm text-stone-400 text-center">No slow-moving products</p>
              )}
            </div>
          </div>

          {/* Task Summary */}
          <TaskSummary tasks={mockTasks} />
        </div>
      </div>
    </div>
  )
}
