/**
 * lib/csv-parser.ts
 *
 * Robust, zero-dependency CSV parsing utilities for messy Google Sheets exports.
 * All functions are pure — no file I/O. Use lib/data/*.ts for file loading.
 *
 * Handles:
 *  - Quoted fields with embedded commas
 *  - Quoted fields with embedded newlines (multi-line cells)
 *  - Escaped double-quotes ("")
 *  - CRLF and LF line endings
 *  - Vietnamese column names → normalized snake_case keys
 *  - Messy price strings ("176 258", "431.901.389 đ", "5,39%")
 */

// ---------------------------------------------------------------------------
// Core CSV tokenizer
// ---------------------------------------------------------------------------

/**
 * Parse raw CSV text into a 2D array of strings.
 * Fully handles quoted fields, embedded newlines, and escaped quotes.
 */
export function parseCsvText(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  const n = text.length

  for (let i = 0; i < n; i++) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        // Check for escaped quote ("")
        if (i + 1 < n && text[i + 1] === '"') {
          field += '"'
          i++ // skip second quote
        } else {
          inQuotes = false
        }
      } else {
        // Newlines inside quotes are part of the field value
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        row.push(field.trim())
        field = ''
      } else if (ch === '\r') {
        // Skip bare CR; CRLF is handled by skipping \r then processing \n
      } else if (ch === '\n') {
        row.push(field.trim())
        rows.push(row)
        row = []
        field = ''
      } else {
        field += ch
      }
    }
  }

  // Flush last field / row
  const lastField = field.trim()
  if (lastField || row.length > 0) {
    row.push(lastField)
    if (row.some(f => f !== '')) rows.push(row)
  }

  return rows
}

// ---------------------------------------------------------------------------
// Header detection
// ---------------------------------------------------------------------------

/**
 * Auto-detect the actual header row by finding the first row that contains
 * ALL of the provided anchor column names (case-insensitive substring match).
 *
 * Returns the 0-based row index, or -1 if not found.
 */
export function detectHeaderRow(rows: string[][], anchorCols: string[]): number {
  for (let i = 0; i < rows.length; i++) {
    const rowText = rows[i].join('\t').toLowerCase()
    if (anchorCols.every(anchor => rowText.includes(anchor.toLowerCase()))) {
      return i
    }
  }
  return -1
}

// ---------------------------------------------------------------------------
// Column name normalization
// ---------------------------------------------------------------------------

/**
 * Mapping from Vietnamese / mixed column names to clean snake_case keys.
 * Keys are lowercased + stripped of extra spaces before lookup.
 */
const COL_NAME_MAP: Record<string, string> = {
  // Product CSV
  'id shopee': 'shopee_id',
  'id tiktok': 'tiktok_id',
  'tên sản phẩm': 'name',
  'tên sp': 'name',
  'giá bán shopee': 'price_shopee_raw',
  'tên ký hiệu kho': 'warehouse_name',
  'thông tin hàng về': 'delivery_info',
  'loại sp': 'product_type',
  'chi tiết dòng sản phẩm': 'product_line',
  'chất liệu': 'material',
  'sku_ sản phẩm': 'sku',
  'sku_sản phẩm': 'sku',
  'sku_ phân loại': 'sku_variants',
  'link hình ảnh': 'image_url',
  'hình ảnh': 'image',
  'trạng thái sp': 'status_raw',
  'nhóm': 'team',
  'phụ trách chính': 'owner',
  'phụ trách sx': 'production_owner',
  'thiết kế': 'designer',
  'màu sắc': 'colors',
  'bảng size': 'size_chart',
  'link shopee cho khách': 'shopee_url',
  'link tiktok cho khách': 'tiktok_url',
  'team booking': 'booking_team',
  'task booking': 'booking_task',
  'tên bst': 'collection',

  // Metrics CSV
  'sku': 'sku',
  'trạng thái': 'status_raw',
  'tồn hàng': 'stock',
  'giá thu về shp': 'price_shopee_raw',
  'giá thu về tiktok': 'price_tiktok_raw',
  'giá kì vọng': 'expected_price_raw',
  'tổng bán 2 sàn 7n': 'total_sold_7d',
  'xu hướng 60 ngày': 'trend_60d',
  'x (30n)': 'sold_30d',
  'x (7n)': 'sold_7d',
  'lượt truy cập': 'traffic',
  'ctr': 'ctr_raw',
  'cr': 'cr_raw',
  'view': 'views',
  'gmv shp': 'gmv_shopee_raw',
  'gmv tts': 'gmv_tiktok_raw',
  'ads shopee': 'ads_shopee_raw',
  'ads tiktok': 'ads_tiktok_raw',
  'chi phí booking': 'booking_cost_raw',
  'roi tổng': 'roi_total_raw',
  'shopee': 'growth_shopee_raw',
  'tiktok': 'growth_tiktok_raw',
  'team': 'team',
}

/**
 * Normalize a raw column header string to a snake_case key.
 * Falls back to a generic ASCII slug if not in the mapping.
 */
export function normalizeColName(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    // collapse internal newlines (multi-line header cells)
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s+/g, ' ')

  if (COL_NAME_MAP[cleaned]) return COL_NAME_MAP[cleaned]

  // Generic fallback: strip non-ASCII, replace spaces/special chars with _
  const slug = cleaned
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // strip diacritics
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return slug || 'col_unknown'
}

/**
 * Build a header → column-index map from a header row.
 * Duplicate column names get a numeric suffix (_2, _3, …).
 */
export function buildColMap(headerRow: string[]): Record<string, number> {
  const map: Record<string, number> = {}
  const seen: Record<string, number> = {}

  headerRow.forEach((raw, i) => {
    let key = normalizeColName(raw)
    if (!key || key === 'col_unknown') key = `col_${i}`

    if (key in seen) {
      seen[key]++
      key = `${key}_${seen[key]}`
    } else {
      seen[key] = 1
    }
    map[key] = i
  })

  return map
}

// ---------------------------------------------------------------------------
// Number / price parsers
// ---------------------------------------------------------------------------

/**
 * Extract the first numeric token from a messy string.
 * Handles formats: "176", "176 258", "5,39%", "165,83 240,732"
 *
 * Vietnamese Google Sheets uses comma as thousands separator sometimes.
 * We strip commas and periods used as thousands separators.
 */
export function parseFirstNumber(raw: string): number {
  if (!raw || typeof raw !== 'string') return 0

  // Take the first whitespace-delimited token
  const token = raw.trim().split(/\s+/)[0]

  // Remove currency symbols, percent, Vietnamese dong sign
  const cleaned = token.replace(/[đ%.,\s]/g, '')

  const n = parseFloat(cleaned)
  return isNaN(n) ? 0 : n
}

/**
 * Parse a VND price field like "176 258" (two prices in k-VND separated by space).
 * Returns the BASE price in full VND (first number × 1000).
 *
 * The product CSV stores prices as integers in thousands of VND.
 * e.g., "176 258" → base price = 176,000 VND, premium = 258,000 VND
 */
export function parsePriceVnd(raw: string): number {
  const first = parseFirstNumber(raw)
  if (first === 0) return 0
  // Values < 10000 are in k-VND; multiply to get full VND
  return first < 10000 ? first * 1000 : first
}

/**
 * Parse premium / second price from a "176 258" price string.
 * Returns 0 if there's only one price.
 */
export function parsePremiumPriceVnd(raw: string): number {
  if (!raw) return 0
  const tokens = raw.trim().split(/\s+/).filter(t => /^\d/.test(t))
  if (tokens.length < 2) return 0
  const n = parseFloat(tokens[1].replace(/[đ%,]/g, ''))
  if (isNaN(n)) return 0
  return n < 10000 ? n * 1000 : n
}

/**
 * Parse a Vietnamese VND amount string like "431.901.389 đ" → 431901389.
 * Handles:
 *   "431.901.389 đ"
 *   "8.791.244 đ"
 *   "0 đ"
 *   "" → 0
 */
export function parseVndAmount(raw: string): number {
  if (!raw) return 0
  // Remove currency symbol and whitespace, then remove dots (thousands sep)
  const cleaned = raw.replace(/\s*đ\s*/gi, '').replace(/\./g, '').trim()
  const n = parseFloat(cleaned.replace(/,/g, '.'))
  return isNaN(n) ? 0 : n
}

/**
 * Parse a percentage string like "5,39%" or "5.39%" → 5.39 (numeric).
 */
export function parsePercent(raw: string): number {
  if (!raw) return 0
  const cleaned = raw.replace('%', '').replace(',', '.').trim()
  const n = parseFloat(cleaned)
  return isNaN(n) ? 0 : n
}

/**
 * Parse a plain integer string with possible thousand separators.
 * "2.147" → 2147, "5,278" → 5278, "94" → 94
 */
export function parseInteger(raw: string): number {
  if (!raw) return 0
  const cleaned = raw.replace(/[.,\s]/g, '')
  const n = parseInt(cleaned, 10)
  return isNaN(n) ? 0 : n
}

// ---------------------------------------------------------------------------
// Status mapping
// ---------------------------------------------------------------------------

/**
 * Map Vietnamese product status strings to our internal ProductStatus enum.
 */
export type ProductStatus = 'active' | 'slow_moving' | 'potential' | 'discontinued'

const STATUS_MAP: Record<string, ProductStatus> = {
  'sp đang bán': 'active',
  'sp đang test': 'potential',
  'sp đã chốt sx': 'potential',
  'ưu tiên sx': 'potential',
  'sp huỷ mẫu': 'discontinued',
  'sp hủy mẫu': 'discontinued',
  'bán hết cắt mẫu': 'discontinued',
  'sp không tái': 'discontinued',
  'bán hết': 'discontinued',
}

export function mapStatus(raw: string): ProductStatus {
  if (!raw) return 'active'
  const key = raw.trim().toLowerCase()
  return STATUS_MAP[key] ?? 'active'
}

// ---------------------------------------------------------------------------
// Category derivation
// ---------------------------------------------------------------------------

export type ProductCategory =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'accessories'
  | 'bags'
  | 'shoes'

/**
 * Derive a product category from the Vietnamese product line name or product name.
 * Priority: product_line → product_name keyword match → fallback 'tops'
 */
export function deriveCategory(productLine: string, productName: string): ProductCategory {
  const line = (productLine ?? '').toLowerCase().trim()
  const name = (productName ?? '').toLowerCase()

  // Product line → category
  if (line.includes('babytee') || line.includes('baby tee')) return 'tops'
  if (line.includes('sơ mi') || line.includes('so mi')) return 'tops'
  if (line.includes('polo')) return 'tops'
  if (line.includes('áo thun') || line.includes('ao thun')) return 'tops'
  if (line.includes('áo kiểu') || line.includes('ao kieu')) return 'tops'
  if (line.includes('long sleeve')) return 'tops'
  if (line.includes('sweater')) return 'tops'
  if (line.includes('len') || line.includes('dệt kim')) return 'tops'
  if (line.includes('hoodie')) return 'outerwear'
  if (line.includes('áo khoác') || line.includes('ao khoac')) return 'outerwear'
  if (line.includes('áo phao') || line.includes('ao phao')) return 'outerwear'
  if (line.includes('quần dài') || line.includes('quan dai')) return 'bottoms'
  if (line.includes('quần short') || line.includes('quan short')) return 'bottoms'
  if (line.includes('quần ống') || line.includes('quan ong')) return 'bottoms'
  if (line.includes('quần vải') || line.includes('quan vai')) return 'bottoms'
  if (line.includes('chân váy') || line.includes('chan vay')) return 'dresses'
  if (line.includes('quần váy') || line.includes('quan vay')) return 'dresses'
  if (line.includes('váy') || line.includes('vay') || line.includes('đầm') || line.includes('dam')) return 'dresses'
  if (line.includes('áo dài') || line.includes('ao dai')) return 'dresses'
  if (line.includes('túi') || line.includes('bag')) return 'bags'
  if (line.includes('phụ kiện') || line.includes('phu kien')) return 'accessories'

  // Fallback: keyword match on product name
  if (name.includes('quần váy') || name.includes('váy') || name.includes('đầm')) return 'dresses'
  if (name.includes('quần')) return 'bottoms'
  if (name.includes('khoác') || name.includes('phao') || name.includes('hoodie')) return 'outerwear'
  if (name.includes('áo')) return 'tops'
  if (name.includes('túi')) return 'bags'

  return 'tops' // default
}

// ---------------------------------------------------------------------------
// Row validation helpers
// ---------------------------------------------------------------------------

/** Returns true if a row looks like a valid product row (has a real SKU). */
export function isValidProductRow(row: string[], skuColIndex: number): boolean {
  const sku = (row[skuColIndex] ?? '').trim()
  // Valid SKU must contain an underscore and be >3 chars (e.g. "406DU1_QTD009_")
  return sku.length > 3 && sku.includes('_')
}

/** Returns true if the row is a real data row and not a #N/A or empty stub. */
export function isValidMetricsRow(row: string[], skuColIndex: number, statusColIndex: number): boolean {
  const sku = (row[skuColIndex] ?? '').trim()
  const status = (row[statusColIndex] ?? '').trim()
  if (!sku || !sku.includes('_')) return false
  if (status === '#N/A' || status === '') return false
  return true
}
