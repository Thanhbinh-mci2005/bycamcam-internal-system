'use client'

import { Topbar } from '@/components/layout/topbar'
import { ProductDetail } from '@/components/products/product-detail'
import { ProductForm } from '@/components/products/product-form'
import { ProductTable } from '@/components/products/product-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { formatStatusLabel, getStatusColor } from '@/lib/utils'
import type { Product, ProductCategory, ProductStatus } from '@/types'
import { Plus, Search } from 'lucide-react'
import { useState, useMemo } from 'react'

type FilterStatus = ProductStatus | 'all'
type FilterCategory = ProductCategory | 'all'

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'slow_moving', label: 'Slow Moving' },
  { value: 'potential', label: 'Potential' },
  { value: 'discontinued', label: 'Discontinued' },
]

const CATEGORY_FILTERS: { value: FilterCategory; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'bags', label: 'Bags' },
  { value: 'shoes', label: 'Shoes' },
]

interface Props {
  initialProducts: Product[]
}

export function ProductsClient({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || p.status === statusFilter
      const matchCategory = categoryFilter === 'all' || p.category === categoryFilter
      return matchSearch && matchStatus && matchCategory
    })
  }, [products, search, statusFilter, categoryFilter])

  const statusCounts = useMemo(() => ({
    active: products.filter(p => p.status === 'active').length,
    slow_moving: products.filter(p => p.status === 'slow_moving').length,
    potential: products.filter(p => p.status === 'potential').length,
    discontinued: products.filter(p => p.status === 'discontinued').length,
  }), [products])

  function handleCreate(data: Partial<Product>) {
    const newProduct: Product = {
      id: `new-${Date.now()}`,
      sku: data.sku!,
      name: data.name!,
      category: data.category!,
      collection: data.collection ?? 'SS2024',
      status: data.status ?? 'active',
      cost: data.cost!,
      price: data.price!,
      margin: data.price! > 0 ? ((data.price! - data.cost!) / data.price!) * 100 : 0,
      notes: data.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      inventory: { id: `inv-${Date.now()}`, product_id: `new-${Date.now()}`, quantity: 0, low_stock_threshold: 20, updated_at: new Date().toISOString() }
    }
    setProducts(prev => [newProduct, ...prev])
    setModalOpen(false)
  }

  function handleEdit(data: Partial<Product>) {
    if (!editProduct) return
    setProducts(prev => prev.map(p =>
      p.id === editProduct.id
        ? { ...p, ...data, margin: data.price! > 0 ? ((data.price! - data.cost!) / data.price!) * 100 : 0, updated_at: new Date().toISOString() }
        : p
    ))
    setEditProduct(null)
  }

  function handleDelete() {
    if (!deleteProduct) return
    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id))
    setDeleteProduct(null)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Products" subtitle={`${products.length} total SKUs`} />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Status Summary */}
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as FilterStatus)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                statusFilter === status ? 'border-stone-300 bg-stone-100' : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <Badge className={getStatusColor(status)}>{formatStatusLabel(status)}</Badge>
              <span className="text-stone-600">{count}</span>
            </button>
          ))}
          {statusFilter !== 'all' && (
            <button onClick={() => setStatusFilter('all')} className="text-xs text-stone-400 hover:text-stone-600 underline">
              Clear filter
            </button>
          )}
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="pl-8"
            />
          </div>

          <Select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as FilterCategory)}
            className="w-40"
          >
            {CATEGORY_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </Select>

          <div className="flex items-center gap-2 ml-auto">
            <p className="text-sm text-stone-400">{filtered.length} products</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={15} className="mr-1.5" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <ProductTable
            products={filtered}
            onView={(p) => setViewProduct(p)}
            onEdit={(p) => setEditProduct(p)}
            onDelete={(p) => setDeleteProduct(p)}
          />
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Product" size="lg">
        <ProductForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editProduct} onClose={() => setEditProduct(null)} title="Edit Product" size="lg">
        {editProduct && (
          <ProductForm initial={editProduct} onSubmit={handleEdit} onCancel={() => setEditProduct(null)} />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteProduct} onClose={() => setDeleteProduct(null)} title="Delete Product" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-stone-600">
            Are you sure you want to delete <strong>{deleteProduct?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteProduct(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      {/* Product Detail Panel */}
      <ProductDetail product={viewProduct} onClose={() => setViewProduct(null)} />
    </div>
  )
}
