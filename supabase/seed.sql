-- ============================================================
-- Bycamcam Internal System - Seed Data (Realistic Fashion Brand)
-- ============================================================

-- ============================================================
-- PROFILES (team members)
-- ============================================================
INSERT INTO profiles (id, user_id, name, email, role, team) VALUES
  ('11111111-0000-0000-0000-000000000001', NULL, 'Cam Nguyen', 'cam@bycamcam.vn', 'admin', 'operations'),
  ('11111111-0000-0000-0000-000000000002', NULL, 'Linh Tran', 'linh@bycamcam.vn', 'manager', 'ads'),
  ('11111111-0000-0000-0000-000000000003', NULL, 'Hana Pham', 'hana@bycamcam.vn', 'staff', 'design'),
  ('11111111-0000-0000-0000-000000000004', NULL, 'Minh Le', 'minh@bycamcam.vn', 'staff', 'ads'),
  ('11111111-0000-0000-0000-000000000005', NULL, 'Thu Vo', 'thu@bycamcam.vn', 'staff', 'customer_service'),
  ('11111111-0000-0000-0000-000000000006', NULL, 'Duc Hoang', 'duc@bycamcam.vn', 'manager', 'warehouse'),
  ('11111111-0000-0000-0000-000000000007', NULL, 'Anh Nguyen', 'anh@bycamcam.vn', 'staff', 'design')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PRODUCTS (fashion SKUs)
-- ============================================================
INSERT INTO products (id, sku, name, category, collection, status, cost, price, notes) VALUES
  -- SS2024 Collection
  ('22222222-0000-0000-0000-000000000001', 'BCM-TOP-001', 'Linen Button-Down Blouse White', 'tops', 'SS2024', 'active', 180000, 420000, 'Bestseller. Restock needed weekly.'),
  ('22222222-0000-0000-0000-000000000002', 'BCM-TOP-002', 'Ribbed Crop Tank Sage', 'tops', 'SS2024', 'active', 95000, 250000, 'TikTok viral item. High demand.'),
  ('22222222-0000-0000-0000-000000000003', 'BCM-TOP-003', 'Off-Shoulder Ruffle Top Black', 'tops', 'SS2024', 'slow_moving', 130000, 310000, 'Low engagement on ads. Consider discount.'),
  ('22222222-0000-0000-0000-000000000004', 'BCM-DRESS-001', 'Slip Midi Dress Ivory', 'dresses', 'SS2024', 'active', 250000, 590000, 'Featured in campaign. Strong ROAS.'),
  ('22222222-0000-0000-0000-000000000005', 'BCM-DRESS-002', 'Floral Wrap Dress Terracotta', 'dresses', 'SS2024', 'active', 220000, 520000, 'Popular on Shopee. Bundle with accessories.'),
  ('22222222-0000-0000-0000-000000000006', 'BCM-DRESS-003', 'Denim Mini Dress Blue', 'dresses', 'FW2023', 'slow_moving', 200000, 450000, 'End of season. On clearance.'),
  ('22222222-0000-0000-0000-000000000007', 'BCM-BTM-001', 'Wide-Leg Linen Pants Beige', 'bottoms', 'SS2024', 'active', 160000, 380000, 'Core product. Always in demand.'),
  ('22222222-0000-0000-0000-000000000008', 'BCM-BTM-002', 'Pleated Midi Skirt Dusty Rose', 'bottoms', 'SS2024', 'potential', 140000, 340000, 'New launch. Testing with influencers.'),
  ('22222222-0000-0000-0000-000000000009', 'BCM-BTM-003', 'Cargo Pants Khaki', 'bottoms', 'FW2023', 'discontinued', 175000, 390000, 'Discontinued. Clear remaining stock.'),
  ('22222222-0000-0000-0000-000000000010', 'BCM-OUT-001', 'Oversized Blazer Sand', 'outerwear', 'FW2023', 'active', 320000, 750000, 'Year-round bestseller.'),
  ('22222222-0000-0000-0000-000000000011', 'BCM-OUT-002', 'Cropped Denim Jacket Light Wash', 'outerwear', 'SS2024', 'active', 280000, 650000, 'Good for TikTok styling content.'),
  ('22222222-0000-0000-0000-000000000012', 'BCM-ACC-001', 'Woven Straw Hat Natural', 'accessories', 'SS2024', 'active', 65000, 180000, 'High margin. Bundle with dresses.'),
  ('22222222-0000-0000-0000-000000000013', 'BCM-ACC-002', 'Silk Scrunchie Set Multicolor', 'accessories', 'SS2024', 'active', 25000, 89000, 'Impulse buy item. Great for add-on.'),
  ('22222222-0000-0000-0000-000000000014', 'BCM-BAG-001', 'Mini Crossbody Bag Tan', 'bags', 'SS2024', 'active', 180000, 450000, 'Very popular on TikTok. Restock urgent.'),
  ('22222222-0000-0000-0000-000000000015', 'BCM-BAG-002', 'Tote Canvas Bag Cream', 'bags', 'SS2024', 'potential', 120000, 290000, 'New. Low sales so far.'),
  ('22222222-0000-0000-0000-000000000016', 'BCM-TOP-004', 'Crochet Halter Top White', 'tops', 'SS2024', 'active', 110000, 280000, 'Trending. Push more ad budget.'),
  ('22222222-0000-0000-0000-000000000017', 'BCM-DRESS-004', 'Maxi Sundress Lemon Yellow', 'dresses', 'SS2024', 'potential', 230000, 540000, 'New arrival. Content being shot.'),
  ('22222222-0000-0000-0000-000000000018', 'BCM-BTM-004', 'Linen Shorts Olive', 'bottoms', 'SS2024', 'active', 120000, 290000, 'Good summer seller.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- INVENTORY
-- ============================================================
INSERT INTO inventory (product_id, quantity, low_stock_threshold, warehouse_location) VALUES
  ('22222222-0000-0000-0000-000000000001', 45, 15, 'Shelf A1'),
  ('22222222-0000-0000-0000-000000000002', 8, 10, 'Shelf A2'),  -- low stock
  ('22222222-0000-0000-0000-000000000003', 32, 10, 'Shelf A3'),
  ('22222222-0000-0000-0000-000000000004', 22, 10, 'Shelf B1'),
  ('22222222-0000-0000-0000-000000000005', 18, 10, 'Shelf B2'),
  ('22222222-0000-0000-0000-000000000006', 5, 10, 'Shelf B3'),   -- low stock
  ('22222222-0000-0000-0000-000000000007', 60, 15, 'Shelf C1'),
  ('22222222-0000-0000-0000-000000000008', 25, 10, 'Shelf C2'),
  ('22222222-0000-0000-0000-000000000009', 12, 5, 'Shelf C3'),
  ('22222222-0000-0000-0000-000000000010', 30, 10, 'Shelf D1'),
  ('22222222-0000-0000-0000-000000000011', 14, 10, 'Shelf D2'),
  ('22222222-0000-0000-0000-000000000012', 7, 10, 'Shelf E1'),   -- low stock
  ('22222222-0000-0000-0000-000000000013', 95, 20, 'Shelf E2'),
  ('22222222-0000-0000-0000-000000000014', 4, 10, 'Shelf F1'),   -- low stock
  ('22222222-0000-0000-0000-000000000015', 18, 10, 'Shelf F2'),
  ('22222222-0000-0000-0000-000000000016', 28, 10, 'Shelf A4'),
  ('22222222-0000-0000-0000-000000000017', 20, 10, 'Shelf B4'),
  ('22222222-0000-0000-0000-000000000018', 35, 10, 'Shelf C4')
ON CONFLICT (product_id) DO NOTHING;

-- ============================================================
-- INVENTORY LOGS (recent activity)
-- ============================================================
INSERT INTO inventory_logs (product_id, type, quantity, note, performed_by, created_at) VALUES
  ('22222222-0000-0000-0000-000000000001', 'import', 50, 'Restock from supplier - Batch #2403', '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '2 days'),
  ('22222222-0000-0000-0000-000000000001', 'export', 12, 'Shopee order fulfillment', '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '1 day'),
  ('22222222-0000-0000-0000-000000000002', 'export', 20, 'TikTok Shop flash sale', '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '3 days'),
  ('22222222-0000-0000-0000-000000000004', 'import', 30, 'Restock for campaign launch', '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '5 days'),
  ('22222222-0000-0000-0000-000000000014', 'export', 8, 'TikTok Shop orders', '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '1 day'),
  ('22222222-0000-0000-0000-000000000007', 'import', 40, 'Monthly restock', '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '7 days'),
  ('22222222-0000-0000-0000-000000000012', 'export', 15, 'Bundle orders with dresses', '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '2 days'),
  ('22222222-0000-0000-0000-000000000010', 'import', 20, 'FW restock', '11111111-0000-0000-0000-000000000006', NOW() - INTERVAL '10 days')
ON CONFLICT DO NOTHING;

-- ============================================================
-- CAMPAIGNS
-- ============================================================
INSERT INTO campaigns (id, name, product_id, platform, status, start_date, end_date, budget, spend, revenue, traffic, ctr, cr, notes) VALUES
  ('33333333-0000-0000-0000-000000000001', 'SS2024 Dress Launch - TikTok', '22222222-0000-0000-0000-000000000004', 'tiktok_shop', 'active', '2024-03-01', NULL, 15000000, 11200000, 48500000, 28400, 4.2, 3.8, 'Strong ROAS. Increase budget next week.'),
  ('33333333-0000-0000-0000-000000000002', 'Tank Top Flash Sale - TikTok', '22222222-0000-0000-0000-000000000002', 'tiktok_shop', 'active', '2024-03-10', NULL, 8000000, 6800000, 24000000, 18200, 5.1, 4.2, 'Viral video boosting organic reach.'),
  ('33333333-0000-0000-0000-000000000003', 'Floral Dress - Shopee Sale', '22222222-0000-0000-0000-000000000005', 'shopee', 'active', '2024-03-05', NULL, 10000000, 8400000, 29800000, 22100, 3.9, 3.1, 'Shopee voucher applied boosting CR.'),
  ('33333333-0000-0000-0000-000000000004', 'Mini Bag - TikTok Collab', '22222222-0000-0000-0000-000000000014', 'tiktok_shop', 'active', '2024-03-12', NULL, 12000000, 9200000, 38500000, 31000, 6.2, 5.4, 'Influencer collab. Very high ROAS.'),
  ('33333333-0000-0000-0000-000000000005', 'FW Clearance - Shopee', '22222222-0000-0000-0000-000000000006', 'shopee', 'paused', '2024-02-01', '2024-02-28', 5000000, 4200000, 8900000, 9800, 2.1, 1.8, 'Paused. Not profitable enough.'),
  ('33333333-0000-0000-0000-000000000006', 'Blazer Awareness - TikTok', '22222222-0000-0000-0000-000000000010', 'tiktok_shop', 'active', '2024-03-08', NULL, 8000000, 5600000, 21000000, 16500, 3.5, 2.9, 'Brand awareness focus.'),
  ('33333333-0000-0000-0000-000000000007', 'Linen Blouse - Shopee Bundle', '22222222-0000-0000-0000-000000000001', 'shopee', 'active', '2024-03-14', NULL, 7000000, 3800000, 16200000, 12400, 4.0, 3.6, 'Bundle deal with accessories working well.'),
  ('33333333-0000-0000-0000-000000000008', 'Crochet Top - TikTok', '22222222-0000-0000-0000-000000000016', 'tiktok_shop', 'draft', '2024-03-25', NULL, 6000000, 0, 0, 0, 0.0, 0.0, 'Campaign ready. Waiting for content approval.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TASKS
-- ============================================================
INSERT INTO tasks (title, description, assigned_to, created_by, status, priority, deadline, product_id, campaign_id) VALUES
  ('Shoot content for Maxi Sundress launch', 'Need 3 outfit styling videos + 5 product photos on white background', '11111111-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'doing', 'high', NOW() + INTERVAL '3 days', '22222222-0000-0000-0000-000000000017', NULL),
  ('Restock Mini Crossbody Bag', 'Critical low stock. Contact supplier for urgent reorder. Min 50 units.', '11111111-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000001', 'todo', 'urgent', NOW() + INTERVAL '1 day', '22222222-0000-0000-0000-000000000014', NULL),
  ('Increase TikTok campaign budget for Slip Dress', 'ROAS is 4.3x. Recommend increasing daily budget from 500K to 800K VND.', '11111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'todo', 'high', NOW() + INTERVAL '2 days', '22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000001'),
  ('Reply to 45 pending Shopee reviews', 'Customer reviews from last week need responses. Focus on negative ones first.', '11111111-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', 'doing', 'medium', NOW() + INTERVAL '1 day', NULL, NULL),
  ('Design banner for SS2024 collection page', 'Create Shopee and TikTok Shop banner assets. Brand colors: beige, terracotta, sage.', '11111111-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003', 'todo', 'medium', NOW() + INTERVAL '5 days', NULL, NULL),
  ('Analyze Off-Shoulder Top performance and decide action', 'Sales very low past 30 days. Consider 20% discount or discontinue.', '11111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'todo', 'medium', NOW() + INTERVAL '7 days', '22222222-0000-0000-0000-000000000003', NULL),
  ('Launch Crochet Top TikTok campaign', 'Content approved. Set up ads, targeting 18-28F, fashion interest.', '11111111-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'todo', 'high', NOW() + INTERVAL '2 days', '22222222-0000-0000-0000-000000000016', '33333333-0000-0000-0000-000000000008'),
  ('Weekly inventory audit - Shelf A & B', 'Count all units in Shelf A and B. Update system if discrepancies found.', '11111111-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000001', 'done', 'low', NOW() - INTERVAL '1 day', NULL, NULL),
  ('Prepare monthly performance report - March 2024', 'Compile all campaign metrics, top SKUs, and team KPIs for management review.', '11111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'doing', 'high', NOW() + INTERVAL '7 days', NULL, NULL),
  ('Pack and ship influencer PR packages x10', 'Prepare 10 PR packages with Slip Dress + Straw Hat + Scrunchie for micro-influencers.', '11111111-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', 'done', 'medium', NOW() - INTERVAL '2 days', NULL, NULL),
  ('Update product description for Cargo Pants', 'Mark as discontinued in system and update listing on Shopee.', '11111111-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', 'done', 'low', NOW() - INTERVAL '3 days', '22222222-0000-0000-0000-000000000009', NULL),
  ('Review and approve Mini Bag collab content', 'Influencer sent 4 videos. Need review before publishing. Check brand guidelines.', '11111111-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', 'doing', 'urgent', NOW() + INTERVAL '0 days', '22222222-0000-0000-0000-000000000014', '33333333-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;
