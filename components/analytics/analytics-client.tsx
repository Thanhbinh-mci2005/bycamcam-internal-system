'use client'

import { Topbar } from '@/components/layout/topbar'
import { formatCurrency, formatPercent } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

interface CategoryRow {
  name: string
  count: number
}

interface StatusRow {
  name: string
  value: number
  color: string
}

interface PlatformRow {
  name: string
  spend: number
  revenue: number
}

interface TopProduct {
  sku: string
  name: string
  gmv: number
  sold7d: number
  roas: number
}

interface Props {
  totalGmv: number
  totalAdSpend: number
  roas: number
  avgMargin: number
  categoryData: CategoryRow[]
  statusDistribution: StatusRow[]
  platformData: PlatformRow[]
  topProducts: TopProduct[]
}

const COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899']

export function AnalyticsClient({
  totalGmv,
  totalAdSpend,
  roas,
  avgMargin,
  categoryData,
  statusDistribution,
  platformData,
  topProducts,
}: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Analytics" subtitle="Performance overview — real data from CSV" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total GMV', value: formatCurrency(totalGmv) },
            { label: 'Total Ad Spend', value: formatCurrency(totalAdSpend) },
            { label: 'Overall ROAS', value: `${roas.toFixed(2)}x` },
            { label: 'Shopee vs TikTok GMV Split', value: platformData.map(p => `${p.name}: ${formatCurrency(p.revenue)}`).join(' / ') },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{kpi.label}</p>
              <p className="text-base font-bold text-stone-900 mt-1 truncate">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Platform GMV vs Spend */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-stone-800 mb-4">Platform GMV vs Ad Spend (M VND)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={platformData.map(p => ({
                  name: p.name,
                  spend: Math.round(p.spend / 1_000_000 * 10) / 10,
                  revenue: Math.round(p.revenue / 1_000_000 * 10) / 10,
                }))}
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}M`} />
                <Tooltip formatter={(v) => [`${v}M VND`]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="spend" fill="#e7e5e4" name="Ad Spend" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#f59e0b" name="GMV" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products by GMV */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-stone-800 mb-4">Top 10 Products by GMV</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={topProducts.map(p => ({
                  name: p.sku.length > 14 ? p.sku.slice(0, 14) : p.sku,
                  gmv: Math.round(p.gmv / 1_000_000 * 10) / 10,
                }))}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 80, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={(v) => `${v}M`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={80} />
                <Tooltip formatter={(v) => [`${v}M VND GMV`]} />
                <Bar dataKey="gmv" fill="#f59e0b" name="GMV" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product Status Distribution */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-stone-800 mb-4">Product Status Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={true}
                >
                  {statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-stone-800 mb-4">SKUs by Category</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" name="SKUs" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform detail */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-stone-800 mb-4">Platform Performance Detail</h3>
          <div className="grid grid-cols-2 gap-6">
            {platformData.map(p => (
              <div key={p.name} className="space-y-3">
                <h4 className="text-sm font-medium text-stone-700">{p.name}</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-stone-50 rounded-lg p-3">
                    <p className="text-xs text-stone-500">Ad Spend</p>
                    <p className="text-sm font-bold text-stone-800">{formatCurrency(p.spend)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-stone-500">GMV</p>
                    <p className="text-sm font-bold text-green-700">{formatCurrency(p.revenue)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs text-stone-500">ROAS</p>
                    <p className="text-sm font-bold text-amber-700">{p.spend > 0 ? (p.revenue / p.spend).toFixed(2) : '0'}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
