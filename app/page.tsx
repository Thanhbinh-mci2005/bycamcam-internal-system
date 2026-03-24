import { Topbar } from '@/components/layout/topbar'
import { MetricCard } from '@/components/dashboard/metric-card'
import { LowStockAlert } from '@/components/dashboard/low-stock-alert'
import { CampaignSummary } from '@/components/dashboard/campaign-summary'
import { TaskSummary } from '@/components/dashboard/task-summary'
import { Badge } from '@/components/ui/badge'
import { loadMetrics } from '@/lib/data/metrics'
import { loadProducts } from '@/lib/data/products'
import { mockCampaigns, mockTasks } from '@/lib/mock-data'
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
  const products = loadProducts()
  const metrics = loadMetrics()

  // Aggregate KPIs from metrics CSV
  const totalAdSpend = metrics.reduce((s, m) => s + m.ads_shopee + m.ads_tiktok, 0)
  const totalRevenue = metrics.reduce((s, m) => s + m.gmv_total, 0)
  const roas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0

  const activeSKUs = products.filter(p => p.status === 'active').length
  const LOW_STOCK_THRESHOLD = 20
  const lowStockItems = metrics.filter(m => m.stock > 0 && m.stock <= LOW_STOCK_THRESHOLD)
  const lowStockCount = lowStockItems.length

  // Inventory value = sum(stock × price_shopee) from metrics
  const inventoryValue = metrics.reduce((s, m) => s + m.stock * m.price_shopee, 0)

  // Best sellers: top 5 by total_sold_7d
  const bestSellers = [...metrics]
    .sort((a, b) => b.total_sold_7d - a.total_sold_7d)
    .slice(0, 5)

  // Slow movers: products with status slow_moving (from products CSV)
  const slowMovers = products
    .filter(p => p.status === 'slow_moving')
    .slice(0, 5)
    .map(p => {
      const m = metrics.find(m => m.sku === p.sku)
      return { ...p, inventory: m ? { id: `inv-${p.sku}`, product_id: p.id, quantity: m.stock, low_stock_threshold: LOW_STOCK_THRESHOLD, updated_at: new Date().toISOString() } : p.inventory }
    })

  // Low stock for the alert widget: products with stock data
  const lowStockProducts = lowStockItems.slice(0, 5).map(m => ({
    id: m.sku,
    sku: m.sku,
    name: m.name,
    category: 'tops' as const,
    collection: '',
    status: m.status,
    cost: 0,
    price: m.price_shopee,
    created_at: '',
    updated_at: '',
    inventory: {
      id: `inv-${m.sku}`,
      product_id: m.sku,
      quantity: m.stock,
      low_stock_threshold: LOW_STOCK_THRESHOLD,
      updated_at: '',
    },
  }))

  const pendingTasks = mockTasks.filter(t => t.status !== 'done').length
  const overdueTasks = mockTasks.filter(t => t.status !== 'done' && t.deadline && new Date(t.deadline) < new Date()).length

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Dashboard" subtitle={today} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Active SKUs"
            value={String(activeSKUs)}
            subtitle={`${products.length} total products`}
            icon={Box}
            accent="amber"
          />
          <MetricCard
            title="Low Stock Alerts"
            value={String(lowStockCount)}
            subtitle="Need restocking"
            icon={AlertTriangle}
            accent="red"
          />
          <MetricCard
            title="Active Campaigns"
            value={String(mockCampaigns.filter(c => c.status === 'active').length)}
            subtitle={`ROAS: ${roas.toFixed(1)}x avg`}
            icon={Megaphone}
            accent="blue"
          />
          <MetricCard
            title="Open Tasks"
            value={String(pendingTasks)}
            subtitle={overdueTasks > 0 ? `${overdueTasks} overdue` : 'All on track'}
            icon={ClipboardList}
            accent={overdueTasks > 0 ? 'red' : 'green'}
          />
        </div>

        {/* Revenue Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total Ad Spend"
            value={formatCurrency(totalAdSpend)}
            subtitle="All platforms"
            icon={TrendingDown}
            accent="default"
          />
          <MetricCard
            title="Total GMV"
            value={formatCurrency(totalRevenue)}
            subtitle="Shopee + TikTok"
            icon={TrendingUp}
            accent="green"
            trend={{ value: `${roas.toFixed(1)}x ROAS`, positive: true }}
          />
          <MetricCard
            title="Inventory Value"
            value={formatCurrency(inventoryValue)}
            subtitle="At selling price"
            icon={Package}
            accent="amber"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LowStockAlert products={lowStockProducts} />
          <CampaignSummary campaigns={mockCampaigns} />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Best Sellers */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" />
                <h3 className="text-sm font-semibold text-stone-800">Best Sellers (7d)</h3>
              </div>
              <Link href="/products" className="text-xs text-amber-600 hover:underline font-medium">View all</Link>
            </div>
            <div className="divide-y divide-stone-50">
              {bestSellers.map((m, i) => (
                <div key={m.sku} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50">
                  <span className="text-xs font-bold text-stone-300 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{m.name || m.sku}</p>
                    <p className="text-xs text-stone-400">{m.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-stone-800">{m.total_sold_7d} sold</p>
                    <p className="text-xs text-green-600">{formatCurrency(m.gmv_total)} GMV</p>
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
                <Badge className="bg-yellow-100 text-yellow-700">{slowMovers.length}</Badge>
              </div>
              <Link href="/products?status=slow_moving" className="text-xs text-amber-600 hover:underline font-medium">View all</Link>
            </div>
            <div className="divide-y divide-stone-50">
              {slowMovers.map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                    <p className="text-xs text-stone-400">{product.sku} · {product.collection}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-stone-800">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-stone-400">{product.inventory?.quantity ?? '—'} in stock</p>
                  </div>
                </div>
              ))}
              {slowMovers.length === 0 && (
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
