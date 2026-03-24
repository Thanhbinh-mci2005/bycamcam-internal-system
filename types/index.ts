export type UserRole = 'admin' | 'manager' | 'staff'
export type UserTeam = 'operations' | 'ads' | 'design' | 'customer_service' | 'warehouse'

export type ProductStatus = 'active' | 'slow_moving' | 'potential' | 'discontinued'
export type ProductCategory = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'accessories' | 'bags' | 'shoes'

export type Platform = 'tiktok_shop' | 'shopee'
export type CampaignStatus = 'active' | 'paused' | 'ended' | 'draft'

export type TaskStatus = 'todo' | 'doing' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type InventoryLogType = 'import' | 'export' | 'adjustment'

export interface Profile {
  id: string
  user_id: string
  name: string
  email: string
  role: UserRole
  team: UserTeam
  avatar_url?: string
  created_at: string
}

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  collection: string
  status: ProductStatus
  cost: number
  price: number
  margin?: number
  notes?: string
  image_url?: string
  created_at: string
  updated_at: string
  // joined
  inventory?: Inventory
}

export interface Inventory {
  id: string
  product_id: string
  quantity: number
  low_stock_threshold: number
  warehouse_location?: string
  updated_at: string
}

export interface InventoryLog {
  id: string
  product_id: string
  type: InventoryLogType
  quantity: number
  note?: string
  performed_by?: string
  created_at: string
  product?: Pick<Product, 'sku' | 'name'>
}

export interface Campaign {
  id: string
  name: string
  product_id?: string
  platform: Platform
  status: CampaignStatus
  start_date: string
  end_date?: string
  budget: number
  spend: number
  revenue: number
  traffic: number
  ctr: number
  cr: number
  notes?: string
  created_at: string
  product?: Pick<Product, 'sku' | 'name'>
}

export interface Task {
  id: string
  title: string
  description?: string
  assigned_to?: string
  created_by?: string
  status: TaskStatus
  priority: TaskPriority
  deadline?: string
  product_id?: string
  campaign_id?: string
  created_at: string
  updated_at: string
  assignee?: Pick<Profile, 'name' | 'team'>
  product?: Pick<Product, 'sku' | 'name'>
}

export interface DashboardMetrics {
  totalActiveSKUs: number
  totalProducts: number
  lowStockCount: number
  totalInventoryValue: number
  activeCampaigns: number
  totalAdSpend: number
  totalRevenue: number
  roas: number
  pendingTasks: number
  overdueTasks: number
}
