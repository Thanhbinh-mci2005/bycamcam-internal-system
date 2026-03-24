'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Product, ProductCategory, ProductStatus } from '@/types'
import { useState } from 'react'

interface ProductFormProps {
  initial?: Partial<Product>
  onSubmit: (data: Partial<Product>) => void
  onCancel: () => void
  loading?: boolean
}

type Tab = 'dinh_danh' | 'san_pham' | 'phu_trach' | 'hinh_anh' | 'san_xuat'

const TABS: { id: Tab; label: string }[] = [
  { id: 'dinh_danh', label: 'Thông tin định danh' },
  { id: 'san_pham', label: 'Thông tin sản phẩm' },
  { id: 'phu_trach', label: 'Phụ trách & vận hành' },
  { id: 'hinh_anh', label: 'Hình ảnh & tài nguyên' },
  { id: 'san_xuat', label: 'Sản xuất & đặt hàng' },
]

const STATUSES: { value: ProductStatus; label: string }[] = [
  { value: 'active', label: 'SP đang bán' },
  { value: 'potential', label: 'SP đang test / chốt SX' },
  { value: 'slow_moving', label: 'Bán chậm' },
  { value: 'discontinued', label: 'Huỷ mẫu / Không tái' },
]

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'tops', label: 'Áo (Tops)' },
  { value: 'bottoms', label: 'Quần (Bottoms)' },
  { value: 'dresses', label: 'Váy / Đầm (Dresses)' },
  { value: 'outerwear', label: 'Áo khoác (Outerwear)' },
  { value: 'accessories', label: 'Phụ kiện (Accessories)' },
  { value: 'bags', label: 'Túi (Bags)' },
  { value: 'shoes', label: 'Giày (Shoes)' },
]

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">{title}</h4>
      {children}
    </div>
  )
}

export function ProductForm({ initial, onSubmit, onCancel, loading }: ProductFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dinh_danh')

  const [form, setForm] = useState({
    // Định danh
    sku: initial?.sku ?? '',
    sku_variants: initial?.sku_variants ?? '',
    shopee_id: initial?.shopee_id ?? '',
    tiktok_id: initial?.tiktok_id ?? '',
    status: (initial?.status ?? 'active') as ProductStatus,
    // Sản phẩm
    name: initial?.name ?? '',
    price: initial?.price ?? 0,
    warehouse_name: initial?.warehouse_name ?? '',
    product_type: initial?.product_type ?? '',
    product_line: initial?.product_line ?? '',
    material: initial?.material ?? '',
    colors: initial?.colors ?? '',
    delivery_info: initial?.delivery_info ?? '',
    highlights: initial?.highlights ?? '',
    collection: initial?.collection && initial.collection !== 'General' ? initial.collection : '',
    category: (initial?.category ?? 'tops') as ProductCategory,
    // Phụ trách
    team: initial?.team ?? '',
    owner: initial?.owner ?? '',
    production_owner: initial?.production_owner ?? '',
    designer: initial?.designer ?? '',
    // Hình ảnh
    image_url: initial?.image_url ?? '',
    image_embed: initial?.image_embed ?? '',
    lookbook_ref: initial?.lookbook_ref ?? '',
    image_2d_ref: initial?.image_2d_ref ?? '',
    // Sản xuất
    order_cycle_days: initial?.order_cycle_days ?? '',
    production_days: initial?.production_days ?? '',
  })

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const orderDays = Number(form.order_cycle_days) || undefined
    const prodDays = Number(form.production_days) || undefined
    onSubmit({
      sku: form.sku.trim(),
      sku_variants: form.sku_variants.trim() || undefined,
      shopee_id: form.shopee_id.trim() || undefined,
      tiktok_id: form.tiktok_id.trim() || undefined,
      status: form.status,
      name: form.name.trim(),
      price: Number(form.price) || 0,
      cost: 0,
      warehouse_name: form.warehouse_name.trim() || undefined,
      product_type: form.product_type.trim() || undefined,
      product_line: form.product_line.trim() || undefined,
      material: form.material.trim() || undefined,
      colors: form.colors.trim() || undefined,
      delivery_info: form.delivery_info.trim() || undefined,
      highlights: form.highlights.trim() || undefined,
      collection: form.collection.trim() || 'General',
      category: form.category,
      team: form.team.trim() || undefined,
      owner: form.owner.trim() || undefined,
      production_owner: form.production_owner.trim() || undefined,
      designer: form.designer.trim() || undefined,
      image_url: form.image_url.trim() || undefined,
      image_embed: form.image_embed.trim() || undefined,
      lookbook_ref: form.lookbook_ref.trim() || undefined,
      image_2d_ref: form.image_2d_ref.trim() || undefined,
      order_cycle_days: orderDays,
      production_days: prodDays,
    })
  }

  // Check if image_url looks like a real URL for preview
  const imagePreviewUrl = form.image_url.trim().startsWith('http') ? form.image_url.trim() : null

  const isEdit = !!initial?.id

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-stone-100 px-6 pt-2 gap-1 overflow-x-auto shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-semibold whitespace-nowrap rounded-t-lg transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-700 bg-amber-50'
                : 'border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* ── Tab 1: Thông tin định danh ── */}
        {activeTab === 'dinh_danh' && (
          <>
            <FormSection title="Mã & Phân loại">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel required>SKU_ Sản phẩm</FieldLabel>
                  <Input
                    value={form.sku}
                    onChange={e => set('sku', e.target.value)}
                    placeholder="406DU1_QTD009_"
                    required
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Trạng thái SP</FieldLabel>
                  <Select value={form.status} onChange={e => set('status', e.target.value)}>
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>SKU_ Phân loại</FieldLabel>
                <Textarea
                  value={form.sku_variants}
                  onChange={e => set('sku_variants', e.target.value)}
                  placeholder={'406DU1_QTD009_TR\n406DU1_QTD009_GH\n(một SKU mỗi dòng)'}
                  rows={3}
                  className="font-mono text-xs"
                />
                <p className="text-[10px] text-stone-400">Nhập mỗi SKU phân loại trên một dòng riêng</p>
              </div>
            </FormSection>

            <FormSection title="ID nền tảng">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel>ID Shopee</FieldLabel>
                  <Input
                    value={form.shopee_id}
                    onChange={e => set('shopee_id', e.target.value)}
                    placeholder="26952317106"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>ID Tiktok</FieldLabel>
                  <Input
                    value={form.tiktok_id}
                    onChange={e => set('tiktok_id', e.target.value)}
                    placeholder="1730487426535491905"
                  />
                </div>
              </div>
            </FormSection>
          </>
        )}

        {/* ── Tab 2: Thông tin sản phẩm ── */}
        {activeTab === 'san_pham' && (
          <>
            <FormSection title="Cơ bản">
              <div className="space-y-1.5">
                <FieldLabel required>Tên Sản phẩm</FieldLabel>
                <Input
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Quần Vải Đũi Cạp Chun Mềm Mại"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel>Giá bán Shopee (VND)</FieldLabel>
                  <Input
                    type="number"
                    value={form.price || ''}
                    onChange={e => set('price', e.target.value)}
                    placeholder="176000"
                    min={0}
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Tên ký hiệu Kho</FieldLabel>
                  <Input
                    value={form.warehouse_name}
                    onChange={e => set('warehouse_name', e.target.value)}
                    placeholder="Quần Vải Đũi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel>Loại SP</FieldLabel>
                  <Input
                    value={form.product_type}
                    onChange={e => set('product_type', e.target.value)}
                    placeholder="Sản phẩm lẻ"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Chi tiết dòng sản phẩm</FieldLabel>
                  <Input
                    value={form.product_line}
                    onChange={e => set('product_line', e.target.value)}
                    placeholder="Quần dài ứng dụng"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel>Danh mục (Category)</FieldLabel>
                  <Select value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Tên BST (Collection)</FieldLabel>
                  <Input
                    value={form.collection}
                    onChange={e => set('collection', e.target.value)}
                    placeholder="SS2025"
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="Chất liệu & Màu sắc">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel>Chất liệu</FieldLabel>
                  <Input
                    value={form.material}
                    onChange={e => set('material', e.target.value)}
                    placeholder="đũi, cotton, linen..."
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Màu sắc</FieldLabel>
                  <Input
                    value={form.colors}
                    onChange={e => set('colors', e.target.value)}
                    placeholder="Trắng, Đen, Be..."
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="Mô tả & Nội dung">
              <div className="space-y-1.5">
                <FieldLabel>THÔNG TIN HÀNG VỀ</FieldLabel>
                <Textarea
                  value={form.delivery_info}
                  onChange={e => set('delivery_info', e.target.value)}
                  placeholder="Thông tin về lịch hàng về, nhà cung cấp..."
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel>Điểm nổi bật của sản phẩm</FieldLabel>
                <Textarea
                  value={form.highlights}
                  onChange={e => set('highlights', e.target.value)}
                  placeholder="- Quần dài ống rộng giúp che khuyết điểm&#10;- Chất vải thoáng mát..."
                  rows={4}
                />
              </div>
            </FormSection>
          </>
        )}

        {/* ── Tab 3: Phụ trách & vận hành ── */}
        {activeTab === 'phu_trach' && (
          <FormSection title="Nhân sự phụ trách">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel>Nhóm</FieldLabel>
                <Input
                  value={form.team}
                  onChange={e => set('team', e.target.value)}
                  placeholder="Team D"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Phụ trách chính</FieldLabel>
                <Input
                  value={form.owner}
                  onChange={e => set('owner', e.target.value)}
                  placeholder="Bình + Nghĩa"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Phụ trách SX</FieldLabel>
                <Input
                  value={form.production_owner}
                  onChange={e => set('production_owner', e.target.value)}
                  placeholder="Đ. Yến"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Thiết kế</FieldLabel>
                <Input
                  value={form.designer}
                  onChange={e => set('designer', e.target.value)}
                  placeholder="Lan Hương"
                />
              </div>
            </div>
          </FormSection>
        )}

        {/* ── Tab 4: Hình ảnh & tài nguyên ── */}
        {activeTab === 'hinh_anh' && (
          <>
            <FormSection title="Ảnh sản phẩm">
              <div className="space-y-1.5">
                <FieldLabel>Link hình ảnh</FieldLabel>
                <Input
                  value={form.image_url}
                  onChange={e => set('image_url', e.target.value)}
                  placeholder="https://cf.shopee.vn/file/..."
                />
              </div>

              {imagePreviewUrl && (
                <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 w-full max-w-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
                  />
                  <p className="text-[10px] text-stone-400 text-center py-1">Preview</p>
                </div>
              )}

              <div className="space-y-1.5">
                <FieldLabel>Hình ảnh</FieldLabel>
                <Input
                  value={form.image_embed}
                  onChange={e => set('image_embed', e.target.value)}
                  placeholder="Tên file hoặc link embed..."
                />
              </div>
            </FormSection>

            <FormSection title="Tài nguyên hình ảnh khác">
              <div className="space-y-1.5">
                <FieldLabel>Ảnh lookbook</FieldLabel>
                <Input
                  value={form.lookbook_ref}
                  onChange={e => set('lookbook_ref', e.target.value)}
                  placeholder="Tên album lookbook hoặc link..."
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Ảnh 2D</FieldLabel>
                <Input
                  value={form.image_2d_ref}
                  onChange={e => set('image_2d_ref', e.target.value)}
                  placeholder="Tên file ảnh 2D hoặc mã tham chiếu..."
                />
              </div>
            </FormSection>
          </>
        )}

        {/* ── Tab 5: Sản xuất & đặt hàng ── */}
        {activeTab === 'san_xuat' && (
          <FormSection title="Thời gian sản xuất">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel>Chu kỳ đặt hàng (ngày)</FieldLabel>
                <Input
                  type="number"
                  value={form.order_cycle_days}
                  onChange={e => set('order_cycle_days', e.target.value)}
                  placeholder="12"
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Thời gian sản xuất (ngày)</FieldLabel>
                <Input
                  type="number"
                  value={form.production_days}
                  onChange={e => set('production_days', e.target.value)}
                  placeholder="12"
                  min={0}
                />
              </div>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Chu kỳ đặt hàng = thời gian từ lúc chốt đặt đến lúc hàng về kho.<br />
              Thời gian SX = thời gian nhà máy sản xuất.
            </p>
          </FormSection>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-stone-100">
        <div className="flex gap-1">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-2 h-2 rounded-full transition-colors ${activeTab === tab.id ? 'bg-amber-500' : 'bg-stone-200 hover:bg-stone-300'}`}
              title={tab.label}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Huỷ</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </Button>
        </div>
      </div>
    </form>
  )
}
