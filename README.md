# Bycamcam Internal Operations System

Internal dashboard for daily operations management at Bycamcam fashion brand.

## Modules

| Module | Description |
|---|---|
| **Dashboard** | Overview — active SKUs, low stock alerts, campaign performance, task summary |
| **Products** | Full CRUD — SKU, category, collection, status, cost/price/margin, notes |
| **Inventory** | Stock tracking, import/export logs, low stock alerts |
| **Campaigns** | TikTok Shop & Shopee campaign tracking — spend, revenue, ROAS, CTR, CR |
| **Tasks** | Kanban board — assign to team, priority, deadline, linked product/campaign |
| **Analytics** | Charts — campaign performance, ROAS comparison, product distribution |
| **Team** | Member profiles, roles, task overview per member |

## Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)

## Getting Started

```bash
npm install
npm run dev
```

The app runs with **realistic mock data** out of the box — no Supabase connection required.

## Connect Supabase (Production)

1. Create a project at supabase.com
2. Copy `.env.local.example` to `.env.local` and fill in your credentials
3. Run `supabase/schema.sql` in the Supabase SQL Editor
4. Run `supabase/seed.sql` to populate with sample data

## Role Access

| Role | Access |
|---|---|
| Admin | Full access — all modules, settings |
| Manager | Products, inventory, campaigns, tasks |
| Staff | Assigned tasks, limited product view |
