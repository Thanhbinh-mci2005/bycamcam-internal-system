import { ProductsClient } from '@/components/products/products-client'
import { loadMetrics } from '@/lib/data/metrics'
import { loadProducts } from '@/lib/data/products'
import type { Product } from '@/types'

export default function ProductsPage() {
  const products = loadProducts()
  const metricsMap = new Map(loadMetrics().map(m => [m.sku, m]))

  const productsWithInventory: Product[] = products.map(p => {
    const m = metricsMap.get(p.sku)
    return {
      ...p,
      inventory: m
        ? {
            id: `inv-${p.sku}`,
            product_id: p.id,
            quantity: m.stock,
            low_stock_threshold: 20,
            updated_at: new Date().toISOString(),
          }
        : undefined,
    }
  })

  return <ProductsClient initialProducts={productsWithInventory} />
}
