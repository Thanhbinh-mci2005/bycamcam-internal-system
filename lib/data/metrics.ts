/**
 * lib/data/metrics.ts
 *
 * SERVER-ONLY. Uses Node.js `fs` to read the operations metrics CSV at build time.
 * Import only from Server Components or API routes.
 *
 * Source file: lib/NỘI BỘ VẬN HÀNH [BYC] - BỘ CHỈ SỐ.csv
 *
 * CSV structure: rows 0–4 are noise (notes, section labels).
 * Row 5 is the actual header row (detected by anchor columns).
 * Rows with status = '#N/A' or empty SKU are skipped.
 *
 * Column map (0-indexed):
 *   0  ID Shopee
 *   1  ID Tiktok
 *   2  Tên sản phẩm
 *   3  SKU                       ← join key
 *   5  Team
 *   6  Trạng thái                → status
 *   7  Tồn hàng                  → stock (units)
 *   8  Giá thu về SHP            → price_shopee (k-VND format)
 *   9  Giá thu về TIKTOK         → price_tiktok
 *  11  Tổng bán 2 sàn 7N         → total_sold_7d
 *  13  X (30N) [Shopee]          → sold_shopee_30d
 *  14  X (7N)  [Shopee]          → sold_shopee_7d
 *  15  Lượt truy cập [Shopee]    → shopee_traffic_7d
 *  16  CTR [Shopee]              → shopee_ctr
 *  17  CR  [Shopee]              → shopee_cr
 *  20  X (30N) [TikTok]          → sold_tiktok_30d
 *  21  X (7N)  [TikTok]          → sold_tiktok_7d
 *  22  View [TikTok Shop Tab]    → tiktok_shop_tab_views
 *  23  CTR [TikTok Shop Tab]     → tiktok_shop_tab_ctr
 *  24  CR  [TikTok Shop Tab]     → tiktok_shop_tab_cr
 *  28  View [Video]              → tiktok_video_views
 *  29  CTR [Video]               → tiktok_video_ctr
 *  35  GMV SHP                   → gmv_shopee (full VND, "431.901.389 đ" format)
 *  36  GMV TTS                   → gmv_tiktok
 *  37  ADS SHOPEE                → ads_shopee
 *  38  ADS TIKTOK                → ads_tiktok
 *  39  CHI PHÍ BOOKING           → booking_cost
 *  40  ROI tổng                  → roi_total (raw number)
 *  41  Shopee                    → growth_shopee (percent)
 *  42  Tiktok                    → growth_tiktok (percent)
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import type { ProductMetrics } from '@/types'
import {
  parseCsvText,
  detectHeaderRow,
  isValidMetricsRow,
  mapStatus,
  parsePriceVnd,
  parseVndAmount,
  parsePercent,
  parseInteger,
  parseFirstNumber,
} from '@/lib/csv-parser'

const CSV_PATH = join(
  process.cwd(),
  'lib',
  'NỘI BỘ VẬN HÀNH [BYC] - BỘ CHỈ SỐ.csv'
)

// Column indices (0-based)
const COL = {
  SHOPEE_ID: 0,
  TIKTOK_ID: 1,
  NAME: 2,
  SKU: 3,
  TEAM: 5,
  STATUS: 6,
  STOCK: 7,
  PRICE_SHOPEE: 8,
  PRICE_TIKTOK: 9,
  TOTAL_SOLD_7D: 11,
  SOLD_SHOPEE_30D: 13,
  SOLD_SHOPEE_7D: 14,
  SHOPEE_TRAFFIC: 15,
  SHOPEE_CTR: 16,
  SHOPEE_CR: 17,
  SOLD_TIKTOK_30D: 20,
  SOLD_TIKTOK_7D: 21,
  TIKTOK_SHOP_TAB_VIEWS: 22,
  TIKTOK_SHOP_TAB_CTR: 23,
  TIKTOK_SHOP_TAB_CR: 24,
  LIVE_VIEWS: 25,
  LIVE_CTR: 26,
  LIVE_CR: 27,
  TIKTOK_VIDEO_VIEWS: 28,
  TIKTOK_VIDEO_CTR: 29,
  TIKTOK_VIDEO_CR: 30,
  PRODUCT_CARD_VIEWS: 31,
  PRODUCT_CARD_CTR: 32,
  PRODUCT_CARD_CR: 33,
  GMV_SHOPEE: 35,
  GMV_TIKTOK: 36,
  ADS_SHOPEE: 37,
  ADS_TIKTOK: 38,
  BOOKING_COST: 39,
  ROI_TOTAL: 40,
  GROWTH_SHOPEE: 41,
  GROWTH_TIKTOK: 42,
} as const

/** Anchors unique enough to identify the actual header row. */
const HEADER_ANCHORS = ['Tồn hàng', 'GMV SHP', 'ADS SHOPEE']

let _cache: ProductMetrics[] | null = null

/**
 * Load and parse all product metrics from the operations metrics CSV.
 * Results are cached after first call.
 * Falls back to empty array if file is unavailable.
 */
export function loadMetrics(): ProductMetrics[] {
  if (_cache) return _cache

  let raw: string
  try {
    raw = readFileSync(CSV_PATH, 'utf-8')
  } catch {
    console.warn('[loadMetrics] Could not read metrics CSV at:', CSV_PATH)
    return []
  }

  const rows = parseCsvText(raw)
  const headerIdx = detectHeaderRow(rows, HEADER_ANCHORS)

  if (headerIdx === -1) {
    console.warn('[loadMetrics] Could not detect header row — CSV structure may have changed.')
    return []
  }

  const dataRows = rows.slice(headerIdx + 1)
  const metrics: ProductMetrics[] = []

  for (const row of dataRows) {
    if (!isValidMetricsRow(row, COL.SKU, COL.STATUS)) continue

    const sku = row[COL.SKU].trim()
    const gmvShopee = parseVndAmount(row[COL.GMV_SHOPEE] ?? '')
    const gmvTiktok = parseVndAmount(row[COL.GMV_TIKTOK] ?? '')
    const adsShopee = parseVndAmount(row[COL.ADS_SHOPEE] ?? '')
    const adsTiktok = parseVndAmount(row[COL.ADS_TIKTOK] ?? '')
    const totalAdSpend = adsShopee + adsTiktok

    const m: ProductMetrics = {
      sku,
      shopee_id: (row[COL.SHOPEE_ID] ?? '').trim(),
      tiktok_id: (row[COL.TIKTOK_ID] ?? '').trim(),
      name: (row[COL.NAME] ?? '').trim(),
      team: (row[COL.TEAM] ?? '').trim(),
      status: mapStatus(row[COL.STATUS] ?? ''),
      stock: parseInteger(row[COL.STOCK] ?? ''),
      price_shopee: parsePriceVnd(row[COL.PRICE_SHOPEE] ?? ''),
      price_tiktok: parsePriceVnd(row[COL.PRICE_TIKTOK] ?? ''),
      total_sold_7d: parseInteger(row[COL.TOTAL_SOLD_7D] ?? ''),
      sold_shopee_30d: parseInteger(row[COL.SOLD_SHOPEE_30D] ?? ''),
      sold_shopee_7d: parseInteger(row[COL.SOLD_SHOPEE_7D] ?? ''),
      sold_tiktok_30d: parseInteger(row[COL.SOLD_TIKTOK_30D] ?? ''),
      sold_tiktok_7d: parseInteger(row[COL.SOLD_TIKTOK_7D] ?? ''),
      shopee_traffic_7d: parseInteger(row[COL.SHOPEE_TRAFFIC] ?? ''),
      shopee_ctr: parsePercent(row[COL.SHOPEE_CTR] ?? ''),
      shopee_cr: parsePercent(row[COL.SHOPEE_CR] ?? ''),
      tiktok_shop_tab_views: parseInteger(row[COL.TIKTOK_SHOP_TAB_VIEWS] ?? ''),
      tiktok_shop_tab_ctr: parsePercent(row[COL.TIKTOK_SHOP_TAB_CTR] ?? ''),
      tiktok_shop_tab_cr: parsePercent(row[COL.TIKTOK_SHOP_TAB_CR] ?? ''),
      live_views: parseInteger(row[COL.LIVE_VIEWS] ?? ''),
      live_ctr: parsePercent(row[COL.LIVE_CTR] ?? ''),
      live_cr: parsePercent(row[COL.LIVE_CR] ?? ''),
      tiktok_video_views: parseInteger(row[COL.TIKTOK_VIDEO_VIEWS] ?? ''),
      tiktok_video_ctr: parsePercent(row[COL.TIKTOK_VIDEO_CTR] ?? ''),
      tiktok_video_cr: parsePercent(row[COL.TIKTOK_VIDEO_CR] ?? ''),
      product_card_views: parseInteger(row[COL.PRODUCT_CARD_VIEWS] ?? ''),
      product_card_ctr: parsePercent(row[COL.PRODUCT_CARD_CTR] ?? ''),
      product_card_cr: parsePercent(row[COL.PRODUCT_CARD_CR] ?? ''),
      gmv_shopee: gmvShopee,
      gmv_tiktok: gmvTiktok,
      gmv_total: gmvShopee + gmvTiktok,
      ads_shopee: adsShopee,
      ads_tiktok: adsTiktok,
      booking_cost: parseVndAmount(row[COL.BOOKING_COST] ?? ''),
      roi_total: parseFirstNumber(row[COL.ROI_TOTAL] ?? ''),
      roas: totalAdSpend > 0 ? (gmvShopee + gmvTiktok) / totalAdSpend : 0,
      growth_shopee: parsePercent(row[COL.GROWTH_SHOPEE] ?? ''),
      growth_tiktok: parsePercent(row[COL.GROWTH_TIKTOK] ?? ''),
    }

    metrics.push(m)
  }

  _cache = metrics
  return metrics
}

/** Reset cache. */
export function resetMetricsCache(): void {
  _cache = null
}
