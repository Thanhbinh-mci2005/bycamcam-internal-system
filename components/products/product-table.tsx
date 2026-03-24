'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercent, formatStatusLabel, getStatusColor } from '@/lib/utils'
import type { Product } from '@/types'
import { AlertTriangle, Edit2, Trash2 } from 'lucide-react'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-stone-400 text-sm">
        No products found. Try adjusting your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">SKU</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Product</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Category</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Collection</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Status</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Cost</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Price</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Margin</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">Stock</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50">
          {products.map((product) => {
            const qty = product.inventory?.quantity ?? 0
            const threshold = product.inventory?.low_stock_threshold ?? 10
            const isLowStock = qty <= threshold

            return (
              <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                <td className="py-3 px-4">
                  <span className="font-mono text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    {product.sku}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-stone-900">{product.name}</p>
                    {product.notes && (
                      <p className="text-xs text-stone-400 truncate max-w-[200px]">{product.notes}</p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 capitalize text-stone-600">{product.category}</td>
                <td className="py-3 px-4">
                  <span className="text-xs font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                    {product.collection}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(product.status)}>
                    {formatStatusLabel(product.status)}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right text-stone-600">{formatCurrency(product.cost)}</td>
                <td className="py-3 px-4 text-right font-semibold text-stone-900">{formatCurrency(product.price)}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-semibold ${(product.margin ?? 0) >= 50 ? 'text-green-600' : 'text-amber-600'}`}>
                    {formatPercent(product.margin ?? 0)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isLowStock && <AlertTriangle size={13} className="text-red-500" />}
                    <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-stone-700'}`}>
                      {qty}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    <Button size="icon" variant="ghost" onClick={() => onEdit(product)} className="h-7 w-7">
                      <Edit2 size={13} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(product)} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
