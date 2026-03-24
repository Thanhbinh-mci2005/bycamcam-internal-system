'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { calculateMargin } from '@/lib/utils'
import type { Product, ProductCategory, ProductStatus } from '@/types'
import { useState } from 'react'

interface ProductFormProps {
  initial?: Partial<Product>
  onSubmit: (data: Partial<Product>) => void
  onCancel: () => void
  loading?: boolean
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'dresses', label: 'Dresses' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'bags', label: 'Bags' },
  { value: 'shoes', label: 'Shoes' },
]

const STATUSES: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'slow_moving', label: 'Slow Moving' },
  { value: 'potential', label: 'Potential' },
  { value: 'discontinued', label: 'Discontinued' },
]

export function ProductForm({ initial, onSubmit, onCancel, loading }: ProductFormProps) {
  const [form, setForm] = useState({
    sku: initial?.sku ?? '',
    name: initial?.name ?? '',
    category: initial?.category ?? 'tops',
    collection: initial?.collection ?? 'SS2024',
    status: initial?.status ?? 'active',
    cost: initial?.cost ?? 0,
    price: initial?.price ?? 0,
    notes: initial?.notes ?? '',
  })

  const margin = calculateMargin(Number(form.cost), Number(form.price))

  function handleChange(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      ...form,
      cost: Number(form.cost),
      price: Number(form.price),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">SKU Code *</label>
          <Input
            value={form.sku}
            onChange={e => handleChange('sku', e.target.value)}
            placeholder="BCM-TOP-001"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Collection</label>
          <Input
            value={form.collection}
            onChange={e => handleChange('collection', e.target.value)}
            placeholder="SS2024"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-stone-600">Product Name *</label>
        <Input
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder="Linen Button-Down Blouse White"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Category *</label>
          <Select value={form.category} onChange={e => handleChange('category', e.target.value)} required>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Status *</label>
          <Select value={form.status} onChange={e => handleChange('status', e.target.value)} required>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Cost (VND) *</label>
          <Input
            type="number"
            value={form.cost}
            onChange={e => handleChange('cost', e.target.value)}
            placeholder="150000"
            min={0}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Selling Price (VND) *</label>
          <Input
            type="number"
            value={form.price}
            onChange={e => handleChange('price', e.target.value)}
            placeholder="350000"
            min={0}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Margin</label>
          <div className="h-9 flex items-center px-3 rounded-lg border border-stone-200 bg-stone-50">
            <span className={`text-sm font-semibold ${margin >= 50 ? 'text-green-600' : margin >= 30 ? 'text-amber-600' : 'text-red-600'}`}>
              {margin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-stone-600">Notes</label>
        <Textarea
          value={form.notes}
          onChange={e => handleChange('notes', e.target.value)}
          placeholder="Internal notes about this product..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initial?.id ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
