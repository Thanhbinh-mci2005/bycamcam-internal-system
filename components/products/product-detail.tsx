'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatStatusLabel, getStatusColor } from '@/lib/utils'
import type { Product } from '@/types'
import { AlertTriangle, ExternalLink, X } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  product: Product | null
  onClose: () => void
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-stone-800 leading-snug whitespace-pre-line">{String(value)}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest border-b border-stone-100 pb-1.5">{title}</h4>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {children}
      </div>
    </div>
  )
}

function FullWidthField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="col-span-2 space-y-0.5">
      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-line">{value}</p>
    </div>
  )
}

export function ProductDetail({ product, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const qty = product?.inventory?.quantity
  const threshold = product?.inventory?.low_stock_threshold ?? 20
  const isLowStock = qty !== undefined && qty <= threshold

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-200 ${product ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[480px] max-w-[95vw] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          product ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {product && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-stone-100">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {product.sku}
                  </span>
                  <Badge className={getStatusColor(product.status)}>
                    {formatStatusLabel(product.status)}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-stone-900 leading-snug">{product.name}</h2>
                {product.collection && product.collection !== 'General' && (
                  <p className="text-xs text-stone-400 mt-0.5">{product.collection}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors shrink-0 mt-0.5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Product image */}
              {product.image_url && (
                <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}

              {/* Thông tin cơ bản */}
              <Section title="Thông tin cơ bản">
                <Field label="SKU_ Sản phẩm" value={product.sku} />
                <Field label="SKU_ Phân loại" value={product.sku_variants} />
                <Field label="ID Shopee" value={product.shopee_id} />
                <Field label="ID Tiktok" value={product.tiktok_id} />
                <Field label="Trạng thái SP" value={formatStatusLabel(product.status)} />
                <Field label="Nhóm" value={product.team} />
                <Field label="Loại SP" value={product.product_type} />
                <Field label="Chi tiết dòng sản phẩm" value={product.product_line} />
              </Section>

              {/* Giá & Kho */}
              <Section title="Giá & Kho">
                <Field label="Giá bán Shopee" value={product.price > 0 ? formatCurrency(product.price) : undefined} />
                <Field label="Tên ký hiệu Kho" value={product.warehouse_name} />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">Tồn kho</p>
                  {qty !== undefined ? (
                    <div className="flex items-center gap-1.5">
                      {isLowStock && <AlertTriangle size={13} className="text-red-500" />}
                      <span className={`text-sm font-bold ${isLowStock ? 'text-red-600' : 'text-stone-800'}`}>
                        {qty} đơn vị
                      </span>
                      {isLowStock && <span className="text-xs text-red-400">(thấp)</span>}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-400">Chưa có dữ liệu</p>
                  )}
                </div>
                <Field label="THÔNG TIN HÀNG VỀ" value={product.delivery_info} />
              </Section>

              {/* Chất liệu & Màu sắc */}
              <Section title="Chất liệu & Đặc điểm">
                <Field label="Chất liệu" value={product.material} />
                <Field label="Màu sắc" value={product.colors} />
                <FullWidthField label="Điểm nổi bật của sản phẩm" value={product.highlights} />
              </Section>

              {/* Nhân sự */}
              <Section title="Nhân sự phụ trách">
                <Field label="Phụ trách chính" value={product.owner} />
                <Field label="Phụ trách SX" value={product.production_owner} />
                <Field label="Thiết kế" value={product.designer} />
              </Section>

              {/* Sản xuất */}
              {(product.order_cycle_days || product.production_days) && (
                <Section title="Thời gian sản xuất">
                  <Field
                    label="Chu kỳ đặt hàng (ngày)"
                    value={product.order_cycle_days !== undefined ? `${product.order_cycle_days} ngày` : undefined}
                  />
                  <Field
                    label="Thời gian sản xuất (ngày)"
                    value={product.production_days !== undefined ? `${product.production_days} ngày` : undefined}
                  />
                </Section>
              )}

              {/* Hình ảnh tham khảo */}
              {(product.lookbook_ref || product.image_2d_ref || product.image_embed) && (
                <Section title="Hình ảnh">
                  <FullWidthField label="Ảnh lookbook" value={product.lookbook_ref} />
                  <FullWidthField label="Ảnh 2D" value={product.image_2d_ref} />
                  <FullWidthField label="Hình ảnh" value={product.image_embed} />
                </Section>
              )}

              {/* Links */}
              {(product.shopee_url || product.tiktok_url || product.image_url) && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest border-b border-stone-100 pb-1.5">Liên kết</h4>
                  <div className="space-y-2">
                    {product.image_url && (
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">Link hình ảnh</p>
                        <a
                          href={product.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 hover:underline truncate max-w-full"
                        >
                          {product.image_url.slice(0, 60)}…
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                    {product.shopee_url && (
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">Link Shopee cho khách</p>
                        <a
                          href={product.shopee_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 hover:underline truncate max-w-full"
                        >
                          {product.shopee_url.slice(0, 60)}{product.shopee_url.length > 60 ? '…' : ''}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                    {product.tiktok_url && (
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">Link TikTok cho khách</p>
                        <a
                          href={product.tiktok_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 hover:underline truncate max-w-full"
                        >
                          {product.tiktok_url.slice(0, 60)}{product.tiktok_url.length > 60 ? '…' : ''}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>Đóng</Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
