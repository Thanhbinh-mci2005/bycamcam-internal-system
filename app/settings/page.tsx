import { Topbar } from '@/components/layout/topbar'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Settings" subtitle="System configuration" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-semibold text-stone-800">Supabase Configuration</h3>
          <p className="text-sm text-stone-500">
            To connect to a live Supabase backend, add the following environment variables to your <code className="bg-stone-100 px-1 rounded text-xs">.env.local</code> file:
          </p>
          <div className="bg-stone-900 rounded-lg p-4 text-xs font-mono text-stone-300 space-y-1">
            <p>NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</p>
          </div>
          <p className="text-xs text-stone-400">
            Then run the schema and seed files in <code className="bg-stone-100 px-1 rounded text-xs">supabase/</code> against your Supabase project via the SQL Editor.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-semibold text-stone-800">System Info</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Version', value: '1.0.0 MVP' },
              { label: 'Framework', value: 'Next.js 15 (App Router)' },
              { label: 'Database', value: 'Supabase (PostgreSQL)' },
              { label: 'Data Mode', value: 'Mock Data (connect Supabase to go live)' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-stone-50">
                <span className="text-stone-500">{item.label}</span>
                <span className="font-medium text-stone-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">Development Mode</h3>
          <p className="text-sm text-amber-700">
            This system is currently running with mock data. All changes are in-memory and reset on page refresh.
            Connect Supabase to persist data.
          </p>
        </div>
      </div>
    </div>
  )
}
