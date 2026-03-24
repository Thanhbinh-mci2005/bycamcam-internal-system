'use client'

import { Topbar } from '@/components/layout/topbar'
import { mockCampaigns, mockProducts } from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'

const campaignPerformance = mockCampaigns
  .filter(c => c.status === 'active' || c.status === 'paused')
  .map(c => ({
    name: c.name.split(' - ')[0].slice(0, 14),
    spend: Math.round(c.spend / 1000000 * 10) / 10,
    revenue: Math.round(c.revenue / 1000000 * 10) / 10,
    roas: c.spend > 0 ? Math.round((c.revenue / c.spend) * 10) / 10 : 0,
  }))

const categoryData = [
  { name: 'Tops', count: mockProducts.filter(p => p.category === 'tops').length, value: mockProducts.filter(p => p.category === 'tops').reduce((s, p) => s + p.price, 0) },
  { name: 'Dresses', count: mockProducts.filter(p => p.category === 'dresses').length, value: mockProducts.filter(p => p.category === 'dresses').reduce((s, p) => s + p.price, 0) },
  { name: 'Bottoms', count: mockProducts.filter(p => p.category === 'bottoms').length, value: mockProducts.filter(p => p.category === 'bottoms').reduce((s, p) => s + p.price, 0) },
  { name: 'Outerwear', count: mockProducts.filter(p => p.category === 'outerwear').length, value: mockProducts.filter(p => p.category === 'outerwear').reduce((s, p) => s + p.price, 0) },
  { name: 'Bags', count: mockProducts.filter(p => p.category === 'bags').length, value: mockProducts.filter(p => p.category === 'bags').reduce((s, p) => s + p.price, 0) },
  { name: 'Accessories', count: mockProducts.filter(p => p.category === 'accessories').length, value: mockProducts.filter(p => p.category === 'accessories').reduce((s, p) => s + p.price, 0) },
]

const statusDistribution = [
  { name: 'Active', value: mockProducts.filter(p => p.status === 'active').length, color: '#22c55e' },
  { name: 'Slow Moving', value: mockProducts.filter(p => p.status === 'slow_moving').length, color: '#eab308' },
  { name: 'Potential', value: mockProducts.filter(p => p.status === 'potential').length, color: '#3b82f6' },
  { name: 'Discontinued', value: mockProducts.filter(p => p.status === 'discontinued').length, color: '#a8a29e' },
]

const platformData = [
  { name: 'TikTok Shop', spend: mockCampaigns.filter(c => c.platform === 'tiktok_shop').reduce((s, c) => s + c.spend, 0), revenue: mockCampaigns.filter(c => c.platform === 'tiktok_shop').reduce((s, c) => s + c.revenue, 0) },
  { name: 'Shopee', spend: mockCampaigns.filter(c => c.platform === 'shopee').reduce((s, c) => s + c.spend, 0), revenue: mockCampaigns.filter(c => c.platform === 'shopee').reduce((s, c) => s + c.revenue, 0) },
]

const COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899']

const fmt = (v: number) => `${v}M`

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Analytics" subtitle="Performance overview" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue (Active)', value: formatCurrency(mockCampaigns.filter(c => c.status === 'active').reduce((s, c) => s + c.revenue, 0)) },
            { label: 'Total Ad Spend (Active)', value: formatCurrency(mockCampaigns.filter(c => c.status === 'active').reduce((s, c) => s + c.spend, 0)) },
            { label: 'Average ROAS', value: '4.28x' },
            { label: 'Avg Product Margin', value: formatPercent(mockProducts.reduce((s, p) => s + (p.margin ?? 0), 0) / mockProducts.length) },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{kpi.label}</p>
              <p className="text-xl font-bold text-stone-900 mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Campaign Performance */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-stone-800 mb-4">Campaign Spend vs Revenue (M VND)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={campaignPerformance} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={fmt} />
                <Tooltip formatter={(v) => [`${v}M VND`]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="spend" fill="#e7e5e4" name="Spend" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ROAS by Campaign */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-stone-800 mb-4">ROAS by Campaign</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={campaignPerformance} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}x`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                <Tooltip formatter={(v) => [`${v}x ROAS`]} />
                <Bar dataKey="roas" fill="#22c55e" name="ROAS" radius={[0, 4, 4, 0]}>
                  {campaignPerformance.map((_, i) => (
                    <Cell key={i} fill={_.roas >= 4 ? '#16a34a' : _.roas >= 3 ? '#22c55e' : _.roas >= 2 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product Status Distribution */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-stone-800 mb-4">Product Status Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={true}>
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

        {/* Platform Comparison */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-stone-800 mb-4">Platform Performance Comparison</h3>
          <div className="grid grid-cols-2 gap-6">
            {platformData.map(p => (
              <div key={p.name} className="space-y-3">
                <h4 className="text-sm font-medium text-stone-700">{p.name}</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-stone-50 rounded-lg p-3">
                    <p className="text-xs text-stone-500">Spend</p>
                    <p className="text-sm font-bold text-stone-800">{formatCurrency(p.spend)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-stone-500">Revenue</p>
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
