'use client'

import { Topbar } from '@/components/layout/topbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { mockInventoryLogs } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import type { InventoryLog, InventoryLogType, Product } from '@/types'
import { AlertTriangle, ArrowDown, ArrowUp, History, Package, Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'

interface Props {
  initialProducts: Product[]
}

export function InventoryClient({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [logs, setLogs] = useState<InventoryLog[]>(mockInventoryLogs)
  const [search, setSearch] = useState('')
  const [logModal, setLogModal] = useState<{ product: Product; type: InventoryLogType } | null>(null)
  const [logForm, setLogForm] = useState({ quantity: 0, note: '' })

  const filtered = useMemo(() =>
    products.filter(p =>
      !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    ), [products, search])

  const lowStockCount = products.filter(p => p.inventory && p.inventory.quantity <= p.inventory.low_stock_threshold).length

  function handleLogSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!logModal) return
    const { product, type } = logModal
    const qty = type === 'export' ? -Math.abs(logForm.quantity) : Math.abs(logForm.quantity)

    setProducts(prev => prev.map(p => {
      if (p.id !== product.id || !p.inventory) return p
      return { ...p, inventory: { ...p.inventory, quantity: Math.max(0, p.inventory.quantity + qty) } }
    }))

    const newLog: InventoryLog = {
      id: `log-${Date.now()}`,
      product_id: product.id,
      type,
      quantity: Math.abs(logForm.quantity),
      note: logForm.note,
      created_at: new Date().toISOString(),
      product: { sku: product.sku, name: product.name }
    }
    setLogs(prev => [newLog, ...prev])
    setLogModal(null)
    setLogForm({ quantity: 0, note: '' })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Inventory" subtitle="Stock tracking and management" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Total SKUs</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{products.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-l-4 border-l-red-400 border-stone-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Low Stock</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{lowStockCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Total Units</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {products.reduce((s, p) => s + (p.inventory?.quantity ?? 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Inventory Value</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {formatCurrency(products.reduce((s, p) => s + (p.inventory?.quantity ?? 0) * p.price, 0))}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Stock Table */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-stone-500" />
                <h3 className="text-sm font-semibold text-stone-800">Stock Levels</h3>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 h-8 w-44 text-xs" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-500 uppercase">SKU</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-stone-500 uppercase">Product</th>
                    <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-500 uppercase">Stock</th>
                    <th className="text-right py-2.5 px-4 text-xs font-semibold text-stone-500 uppercase">Status</th>
                    <th className="py-2.5 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map(product => {
                    const qty = product.inventory?.quantity ?? 0
                    const threshold = product.inventory?.low_stock_threshold ?? 20
                    const isLow = qty <= threshold
                    const isCritical = qty <= Math.floor(threshold / 2)

                    return (
                      <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                        <td className="py-2.5 px-4">
                          <span className="font-mono text-xs font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">{product.sku}</span>
                        </td>
                        <td className="py-2.5 px-4 font-medium text-stone-800 max-w-[180px] truncate">{product.name}</td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isLow && <AlertTriangle size={12} className="text-red-500" />}
                            <span className={`font-bold ${isCritical ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-stone-800'}`}>{qty}</span>
                            <span className="text-xs text-stone-400">/ min {threshold}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {isCritical ? (
                            <Badge className="bg-red-100 text-red-700">Critical</Badge>
                          ) : isLow ? (
                            <Badge className="bg-orange-100 text-orange-700">Low</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700">OK</Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="outline" onClick={() => setLogModal({ product, type: 'import' })} className="h-7 text-xs">
                              <ArrowDown size={11} className="mr-1" /> In
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setLogModal({ product, type: 'export' })} className="h-7 text-xs">
                              <ArrowUp size={11} className="mr-1" /> Out
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-stone-100">
              <History size={16} className="text-stone-500" />
              <h3 className="text-sm font-semibold text-stone-800">Stock History</h3>
            </div>
            <div className="divide-y divide-stone-50 max-h-[500px] overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-stone-700 truncate">{log.product?.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{log.note}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {log.type === 'import' ? (
                        <ArrowDown size={12} className="text-green-500" />
                      ) : (
                        <ArrowUp size={12} className="text-red-500" />
                      )}
                      <span className={`text-sm font-bold ${log.type === 'import' ? 'text-green-600' : 'text-red-600'}`}>
                        {log.type === 'import' ? '+' : '-'}{log.quantity}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 mt-1">{format(new Date(log.created_at), 'MMM d, HH:mm')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      <Modal
        open={!!logModal}
        onClose={() => { setLogModal(null); setLogForm({ quantity: 0, note: '' }) }}
        title={logModal?.type === 'import' ? `Stock In — ${logModal.product.sku}` : `Stock Out — ${logModal?.product.sku}`}
        size="sm"
      >
        <form onSubmit={handleLogSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-stone-700">{logModal?.product.name}</p>
            <p className="text-xs text-stone-400 mt-0.5">Current stock: {logModal?.product.inventory?.quantity ?? 0} units</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-600">Quantity *</label>
            <Input
              type="number"
              min={1}
              value={logForm.quantity || ''}
              onChange={e => setLogForm(prev => ({ ...prev, quantity: Number(e.target.value) }))}
              placeholder="Enter quantity"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-600">Note</label>
            <Textarea
              value={logForm.note}
              onChange={e => setLogForm(prev => ({ ...prev, note: e.target.value }))}
              placeholder="e.g. Shopee order fulfillment, Restock Batch #123"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-3 justify-end pt-2 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => { setLogModal(null); setLogForm({ quantity: 0, note: '' }) }}>Cancel</Button>
            <Button type="submit" className={logModal?.type === 'import' ? '' : 'bg-red-600 hover:bg-red-500'}>
              {logModal?.type === 'import' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
