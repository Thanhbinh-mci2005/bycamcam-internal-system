import { AnalyticsClient } from '@/components/analytics/analytics-client'
import { loadMetrics } from '@/lib/data/metrics'
import { loadProducts } from '@/lib/data/products'

export default function AnalyticsPage() {
  const metrics = loadMetrics()
  const products = loadProducts()

  const totalAdSpend = metrics.reduce((s, m) => s + m.ads_shopee + m.ads_tiktok, 0)
  const totalGmv = metrics.reduce((s, m) => s + m.gmv_total, 0)
  const roas = totalAdSpend > 0 ? totalGmv / totalAdSpend : 0

  const categoryData = (['tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'bags', 'shoes'] as const).map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: products.filter(p => p.category === cat).length,
  })).filter(d => d.count > 0)

  const statusDistribution = [
    { name: 'Active', value: products.filter(p => p.status === 'active').length, color: '#22c55e' },
    { name: 'Potential', value: products.filter(p => p.status === 'potential').length, color: '#3b82f6' },
    { name: 'Slow Moving', value: products.filter(p => p.status === 'slow_moving').length, color: '#eab308' },
    { name: 'Discontinued', value: products.filter(p => p.status === 'discontinued').length, color: '#a8a29e' },
  ].filter(d => d.value > 0)

  const platformData = [
    {
      name: 'Shopee',
      spend: metrics.reduce((s, m) => s + m.ads_shopee, 0),
      revenue: metrics.reduce((s, m) => s + m.gmv_shopee, 0),
    },
    {
      name: 'TikTok Shop',
      spend: metrics.reduce((s, m) => s + m.ads_tiktok, 0),
      revenue: metrics.reduce((s, m) => s + m.gmv_tiktok, 0),
    },
  ]

  const topProducts = [...metrics]
    .sort((a, b) => b.gmv_total - a.gmv_total)
    .slice(0, 10)
    .map(m => ({
      sku: m.sku,
      name: m.name,
      gmv: m.gmv_total,
      sold7d: m.total_sold_7d,
      roas: m.roas,
    }))

  return (
    <AnalyticsClient
      totalGmv={totalGmv}
      totalAdSpend={totalAdSpend}
      roas={roas}
      avgMargin={0}
      categoryData={categoryData}
      statusDistribution={statusDistribution}
      platformData={platformData}
      topProducts={topProducts}
    />
  )
}
