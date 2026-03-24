import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import type { Campaign } from '@/types'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface CampaignSummaryProps {
  campaigns: Campaign[]
}

const platformColors: Record<string, string> = {
  tiktok_shop: 'bg-black text-white',
  shopee: 'bg-orange-500 text-white',
}

export function CampaignSummary({ campaigns }: CampaignSummaryProps) {
  const active = campaigns.filter(c => c.status === 'active')

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-stone-800">Active Campaigns</h3>
          <Badge className="bg-blue-100 text-blue-700">{active.length}</Badge>
        </div>
        <Link href="/campaigns" className="text-xs text-amber-600 hover:underline font-medium">
          View all
        </Link>
      </div>
      <div className="divide-y divide-stone-50">
        {active.map((campaign) => {
          const roas = campaign.spend > 0 ? (campaign.revenue / campaign.spend).toFixed(2) : '0'
          return (
            <div key={campaign.id} className="px-5 py-3 hover:bg-stone-50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-800 truncate">{campaign.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">{campaign.product?.name}</p>
                </div>
                <Badge className={platformColors[campaign.platform] ?? 'bg-gray-100 text-gray-700'}>
                  {campaign.platform === 'tiktok_shop' ? 'TikTok' : 'Shopee'}
                </Badge>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                <div>
                  <p className="text-xs text-stone-400">Spend</p>
                  <p className="text-xs font-semibold text-stone-700">{formatCurrency(campaign.spend)}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400">Revenue</p>
                  <p className="text-xs font-semibold text-green-700">{formatCurrency(campaign.revenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400">ROAS</p>
                  <p className="text-xs font-semibold text-stone-700">{roas}x</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400">CTR</p>
                  <p className="text-xs font-semibold text-stone-700">{formatPercent(campaign.ctr)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
