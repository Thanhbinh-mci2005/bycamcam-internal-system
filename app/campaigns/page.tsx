'use client'

import { Topbar } from '@/components/layout/topbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { mockCampaigns, mockProducts } from '@/lib/mock-data'
import { formatCurrency, formatNumber, formatPercent, formatStatusLabel, getStatusColor } from '@/lib/utils'
import type { Campaign, CampaignStatus, Platform } from '@/types'
import { Edit2, Megaphone, Plus, TrendingUp } from 'lucide-react'
import { useState, useMemo } from 'react'

const PLATFORM_LABELS: Record<Platform, string> = {
  tiktok_shop: 'TikTok Shop',
  shopee: 'Shopee',
}

const PLATFORM_COLORS: Record<Platform, string> = {
  tiktok_shop: 'bg-black text-white',
  shopee: 'bg-orange-500 text-white',
}

type FilterPlatform = Platform | 'all'
type FilterStatus = CampaignStatus | 'all'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [platformFilter, setPlatformFilter] = useState<FilterPlatform>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() =>
    campaigns.filter(c =>
      (platformFilter === 'all' || c.platform === platformFilter) &&
      (statusFilter === 'all' || c.status === statusFilter)
    ), [campaigns, platformFilter, statusFilter])

  const totalSpend = campaigns.filter(c => c.status === 'active').reduce((s, c) => s + c.spend, 0)
  const totalRevenue = campaigns.filter(c => c.status === 'active').reduce((s, c) => s + c.revenue, 0)
  const avgRoas = totalSpend > 0 ? (totalRevenue / totalSpend) : 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Campaigns" subtitle="Ad performance tracking" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Active Campaigns</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{campaigns.filter(c => c.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Total Spend</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{formatCurrency(totalSpend)}</p>
          </div>
          <div className="bg-white rounded-xl border border-l-4 border-l-green-400 border-stone-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Total Revenue</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-l-4 border-l-amber-400 border-stone-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Avg ROAS</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{avgRoas.toFixed(2)}x</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={platformFilter} onChange={e => setPlatformFilter(e.target.value as FilterPlatform)} className="w-40">
            <option value="all">All Platforms</option>
            <option value="tiktok_shop">TikTok Shop</option>
            <option value="shopee">Shopee</option>
          </Select>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value as FilterStatus)} className="w-36">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
            <option value="ended">Ended</option>
          </Select>
          <div className="ml-auto">
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={15} className="mr-1.5" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(campaign => {
            const roas = campaign.spend > 0 ? campaign.revenue / campaign.spend : 0
            const spendPct = campaign.budget > 0 ? (campaign.spend / campaign.budget) * 100 : 0
            return (
              <div key={campaign.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-stone-900 text-sm truncate">{campaign.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">{campaign.product?.name ?? 'No product linked'}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge className={PLATFORM_COLORS[campaign.platform]}>
                        {PLATFORM_LABELS[campaign.platform]}
                      </Badge>
                      <button onClick={() => setEditCampaign(campaign)} className="p-1 rounded hover:bg-stone-100 text-stone-400">
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(campaign.status)}>{formatStatusLabel(campaign.status)}</Badge>
                    <span className="text-xs text-stone-400">Since {campaign.start_date}</span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  {/* Budget Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-stone-500 mb-1">
                      <span>Budget Used</span>
                      <span>{formatCurrency(campaign.spend)} / {formatCurrency(campaign.budget)}</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${spendPct >= 90 ? 'bg-red-500' : spendPct >= 70 ? 'bg-amber-400' : 'bg-green-400'}`}
                        style={{ width: `${Math.min(100, spendPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-stone-400">Revenue</p>
                      <p className="text-sm font-semibold text-green-700">{formatCurrency(campaign.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">ROAS</p>
                      <p className={`text-sm font-semibold ${roas >= 3 ? 'text-green-700' : roas >= 2 ? 'text-amber-700' : 'text-red-600'}`}>
                        {roas.toFixed(2)}x
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Traffic</p>
                      <p className="text-sm font-semibold text-stone-700">{formatNumber(campaign.traffic)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">CTR</p>
                      <p className="text-sm font-semibold text-stone-700">{formatPercent(campaign.ctr)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">CR</p>
                      <p className="text-sm font-semibold text-stone-700">{formatPercent(campaign.cr)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400">Profit</p>
                      <p className={`text-sm font-semibold ${campaign.revenue - campaign.spend > 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {formatCurrency(campaign.revenue - campaign.spend)}
                      </p>
                    </div>
                  </div>

                  {campaign.notes && (
                    <p className="mt-3 text-xs text-stone-400 italic line-clamp-2">{campaign.notes}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-20 text-stone-400 text-sm">
            No campaigns found.
          </div>
        )}
      </div>

      {/* Edit Campaign Modal */}
      <Modal open={!!editCampaign} onClose={() => setEditCampaign(null)} title="Edit Campaign" size="lg">
        {editCampaign && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">Status</label>
                <Select
                  value={editCampaign.status}
                  onChange={e => setEditCampaign(prev => prev ? { ...prev, status: e.target.value as CampaignStatus } : null)}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="ended">Ended</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">Budget (VND)</label>
                <Input
                  type="number"
                  value={editCampaign.budget}
                  onChange={e => setEditCampaign(prev => prev ? { ...prev, budget: Number(e.target.value) } : null)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">Spend (VND)</label>
                <Input type="number" value={editCampaign.spend} onChange={e => setEditCampaign(prev => prev ? { ...prev, spend: Number(e.target.value) } : null)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">Revenue (VND)</label>
                <Input type="number" value={editCampaign.revenue} onChange={e => setEditCampaign(prev => prev ? { ...prev, revenue: Number(e.target.value) } : null)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">Traffic</label>
                <Input type="number" value={editCampaign.traffic} onChange={e => setEditCampaign(prev => prev ? { ...prev, traffic: Number(e.target.value) } : null)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">CTR (%)</label>
                <Input type="number" step="0.01" value={editCampaign.ctr} onChange={e => setEditCampaign(prev => prev ? { ...prev, ctr: Number(e.target.value) } : null)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">CR (%)</label>
                <Input type="number" step="0.01" value={editCampaign.cr} onChange={e => setEditCampaign(prev => prev ? { ...prev, cr: Number(e.target.value) } : null)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-600">Notes</label>
              <Textarea value={editCampaign.notes ?? ''} onChange={e => setEditCampaign(prev => prev ? { ...prev, notes: e.target.value } : null)} rows={2} />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-stone-100">
              <Button variant="outline" onClick={() => setEditCampaign(null)}>Cancel</Button>
              <Button onClick={() => {
                setCampaigns(prev => prev.map(c => c.id === editCampaign.id ? editCampaign : c))
                setEditCampaign(null)
              }}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
