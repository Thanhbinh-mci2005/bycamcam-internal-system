-- ============================================================
-- Bycamcam Internal Operations System - Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'staff')) DEFAULT 'staff',
  team TEXT NOT NULL CHECK (team IN ('operations', 'ads', 'design', 'customer_service', 'warehouse')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'bags', 'shoes')),
  collection TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL CHECK (status IN ('active', 'slow_moving', 'potential', 'discontinued')) DEFAULT 'active',
  cost NUMERIC(12,0) NOT NULL DEFAULT 0,
  price NUMERIC(12,0) NOT NULL DEFAULT 0,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Computed margin column
ALTER TABLE products ADD COLUMN IF NOT EXISTS margin NUMERIC(5,2) GENERATED ALWAYS AS (
  CASE WHEN price > 0 THEN ((price - cost)::NUMERIC / price) * 100 ELSE 0 END
) STORED;

-- ============================================================
-- INVENTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  warehouse_location TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('import', 'export', 'adjustment')),
  quantity INTEGER NOT NULL,
  note TEXT,
  performed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok_shop', 'shopee')),
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'ended', 'draft')) DEFAULT 'draft',
  start_date DATE NOT NULL,
  end_date DATE,
  budget NUMERIC(12,0) NOT NULL DEFAULT 0,
  spend NUMERIC(12,0) NOT NULL DEFAULT 0,
  revenue NUMERIC(12,0) NOT NULL DEFAULT 0,
  traffic INTEGER NOT NULL DEFAULT 0,
  ctr NUMERIC(5,2) NOT NULL DEFAULT 0,
  cr NUMERIC(5,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('todo', 'doing', 'done')) DEFAULT 'todo',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  deadline TIMESTAMPTZ,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (basic - expand per role needs)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Authenticated read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read inventory" ON inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read inventory_logs" ON inventory_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read campaigns" ON campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read tasks" ON tasks FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to write (fine-grained per role in app layer)
CREATE POLICY "Authenticated write products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated write inventory" ON inventory FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated write inventory_logs" ON inventory_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated write campaigns" ON campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated write tasks" ON tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated write profiles" ON profiles FOR ALL TO authenticated USING (true);
