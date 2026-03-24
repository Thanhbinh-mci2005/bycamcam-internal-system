/**
 * lib/data/products.ts
 *
 * SERVER-ONLY. Uses Node.js `fs` to read the product master CSV at build time.
 * Import only from Server Components or API routes.
 *
 * Source file: lib/[LPB_BYC] BOOKING 2026 - Thông tin sản phẩm.csv
 *
 * CSV structure (0-indexed columns after auto-detected header row 2):
 *   0  ID Shopee
 *   1  ID Tiktok
 *   2  Tên Sản phẩm            → name
 *   3  Giá bán Shopee           → price (k-VND, first of two tiers)
 *   4  Tên ký hiệu Kho          → warehouse_name
 *   7  Chi tiết dòng sản phẩm   → product_line → category (derived)
 *   8  Chất liệu                → material → notes
 *   9  SKU_ Sản phẩm            → sku
 *  13  Trạng thái SP            → status (Vietnamese → enum)
 *  14  Nhóm                     → team
 *  18  Màu sắc                  → colors
 *  41  Link shopee cho khách    → shopee_url
 *  42  Link tiktok cho khách    → tiktok_url
 *  47  Tên BST                  → collection
 *
 * Note: `cost` is not available in this CSV — defaults to 0.
 * Note: `inventory` is populated separately by metrics.ts via SKU join.
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import type { Product } from '@/types'
import {
  parseCsvText,
  detectHeaderRow,
  isValidProductRow,
  deriveCategory,
  mapStatus,
  parsePriceVnd,
  parseInteger,
} from '@/lib/csv-parser'

const CSV_PATH = join(
  process.cwd(),
  'lib',
  '[LPB_BYC] BOOKING 2026 - Thông tin sản phẩm.csv'
)

// Column indices (0-based), relative to the detected header row
const COL = {
  SHOPEE_ID: 0,
  TIKTOK_ID: 1,
  NAME: 2,
  PRICE_SHOPEE: 3,
  WAREHOUSE_NAME: 4,
  DELIVERY_INFO: 5,
  PRODUCT_TYPE: 6,
  PRODUCT_LINE: 7,
  MATERIAL: 8,
  SKU: 9,
  SKU_VARIANTS: 10,
  IMAGE_URL: 11,
  IMAGE_EMBED: 12,
  STATUS: 13,
  TEAM: 14,
  OWNER: 15,
  PRODUCTION_OWNER: 16,
  DESIGNER: 17,
  COLORS: 18,
  HIGHLIGHTS: 23,
  ORDER_CYCLE_DAYS: 26,
  PRODUCTION_DAYS: 27,
  LOOKBOOK_REF: 29,
  IMAGE_2D_REF: 30,
  SHOPEE_URL: 41,
  TIKTOK_URL: 42,
  COLLECTION: 47,
} as const

/** Anchor columns used to auto-detect the real header row. */
const HEADER_ANCHORS = ['ID Shopee', 'SKU_ Sản phẩm', 'Trạng thái SP']

/** Fallback: if SKU is empty on a row but the row has name + shopee_id, derive a sku-like id. */
function deriveId(row: string[]): string {
  const shopeeId = row[COL.SHOPEE_ID]?.trim()
  const sku = row[COL.SKU]?.trim()
  if (sku) return sku.toLowerCase().replace(/[^a-z0-9_]/g, '-')
  if (shopeeId) return `shopee-${shopeeId}`
  return `product-${Math.random().toString(36).slice(2)}`
}

let _cache: Product[] | null = null

/**
 * Load and parse all products from the product master CSV.
 * Results are cached in memory after the first call (suitable for build-time use).
 *
 * Falls back to an empty array if the file cannot be read.
 */
export function loadProducts(): Product[] {
  if (_cache) return _cache

  let raw: string
  try {
    raw = readFileSync(CSV_PATH, 'utf-8')
  } catch {
    console.warn('[loadProducts] Could not read product CSV at:', CSV_PATH)
    return []
  }

  const rows = parseCsvText(raw)
  const headerIdx = detectHeaderRow(rows, HEADER_ANCHORS)

  if (headerIdx === -1) {
    console.warn('[loadProducts] Could not detect header row — CSV structure may have changed.')
    return []
  }

  const dataRows = rows.slice(headerIdx + 1)
  const products: Product[] = []

  for (const row of dataRows) {
    // Skip rows without a valid SKU
    if (!isValidProductRow(row, COL.SKU)) continue

    const sku = row[COL.SKU].trim()
    const name = (row[COL.NAME] ?? '').trim()
    const productLine = (row[COL.PRODUCT_LINE] ?? '').trim()
    const status = mapStatus(row[COL.STATUS] ?? '')
    const price = parsePriceVnd(row[COL.PRICE_SHOPEE] ?? '')
    const material = (row[COL.MATERIAL] ?? '').trim()
    const colors = (row[COL.COLORS] ?? '').replace(/\n/g, ', ').trim()
    const collection = (row[COL.COLLECTION] ?? '').trim() || 'General'
    const team = (row[COL.TEAM] ?? '').trim()
    const imageUrl = (row[COL.IMAGE_URL] ?? '').trim()

    const product: Product = {
      id: deriveId(row),
      sku,
      name: name || sku,
      category: deriveCategory(productLine, name),
      collection,
      status,
      cost: 0,
      price,
      margin: undefined,
      image_url: imageUrl || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // inventory is populated by the caller after joining with metrics
      // extended product profile fields
      shopee_id: (row[COL.SHOPEE_ID] ?? '').trim() || undefined,
      tiktok_id: (row[COL.TIKTOK_ID] ?? '').trim() || undefined,
      warehouse_name: (row[COL.WAREHOUSE_NAME] ?? '').trim() || undefined,
      delivery_info: (row[COL.DELIVERY_INFO] ?? '').trim() || undefined,
      product_type: (row[COL.PRODUCT_TYPE] ?? '').trim() || undefined,
      product_line: productLine || undefined,
      material: material || undefined,
      sku_variants: (row[COL.SKU_VARIANTS] ?? '').replace(/\n/g, ', ').trim() || undefined,
      image_embed: (row[COL.IMAGE_EMBED] ?? '').trim() || undefined,
      team: team || undefined,
      owner: (row[COL.OWNER] ?? '').trim() || undefined,
      production_owner: (row[COL.PRODUCTION_OWNER] ?? '').trim() || undefined,
      designer: (row[COL.DESIGNER] ?? '').trim() || undefined,
      highlights: (row[COL.HIGHLIGHTS] ?? '').trim() || undefined,
      order_cycle_days: parseInteger(row[COL.ORDER_CYCLE_DAYS] ?? '') || undefined,
      production_days: parseInteger(row[COL.PRODUCTION_DAYS] ?? '') || undefined,
      lookbook_ref: (row[COL.LOOKBOOK_REF] ?? '').trim() || undefined,
      image_2d_ref: (row[COL.IMAGE_2D_REF] ?? '').trim() || undefined,
      shopee_url: (row[COL.SHOPEE_URL] ?? '').trim() || undefined,
      tiktok_url: (row[COL.TIKTOK_URL] ?? '').trim() || undefined,
      colors: colors || undefined,
    }

    products.push(product)
  }

  _cache = products
  return products
}

/** Reset the cache (useful in tests or development hot-reload). */
export function resetProductCache(): void {
  _cache = null
}
