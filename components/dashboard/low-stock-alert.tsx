import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface LowStockAlertProps {
  products: Product[]
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          <h3 className="text-sm font-semibold text-stone-800">Low Stock Alerts</h3>
          <Badge className="bg-red-100 text-red-700">{products.length}</Badge>
        </div>
        <Link href="/inventory" className="text-xs text-amber-600 hover:underline font-medium">
          View all
        </Link>
      </div>
      <div className="divide-y divide-stone-50">
        {products.length === 0 && (
          <p className="px-5 py-8 text-sm text-stone-400 text-center">All stock levels are healthy</p>
        )}
        {products.map((product) => {
          const qty = product.inventory?.quantity ?? 0
          const threshold = product.inventory?.low_stock_threshold ?? 10
          const isCritical = qty <= Math.floor(threshold / 2)
          return (
            <div key={product.id} className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                <p className="text-xs text-stone-400">{product.sku} · {product.inventory?.warehouse_location}</p>
              </div>
              <div className="flex items-center gap-3 ml-3">
                <div className="text-right">
                  <p className={`text-sm font-bold ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
                    {qty} left
                  </p>
                  <p className="text-xs text-stone-400">min {threshold}</p>
                </div>
                <Badge className={isCritical ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}>
                  {isCritical ? 'Critical' : 'Low'}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
