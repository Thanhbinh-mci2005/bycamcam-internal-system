import { Topbar } from '@/components/layout/topbar'
import { Badge } from '@/components/ui/badge'
import { mockProfiles, mockTasks } from '@/lib/mock-data'

const teamColors: Record<string, string> = {
  operations: 'bg-purple-100 text-purple-700',
  ads: 'bg-blue-100 text-blue-700',
  design: 'bg-pink-100 text-pink-700',
  customer_service: 'bg-green-100 text-green-700',
  warehouse: 'bg-orange-100 text-orange-700',
}

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  manager: 'bg-amber-100 text-amber-700',
  staff: 'bg-stone-100 text-stone-600',
}

export default function TeamPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Team" subtitle={`${mockProfiles.length} members`} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockProfiles.map(profile => {
            const assignedTasks = mockTasks.filter(t => t.assigned_to === profile.id)
            const openTasks = assignedTasks.filter(t => t.status !== 'done')
            const doneTasks = assignedTasks.filter(t => t.status === 'done')

            return (
              <div key={profile.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-base font-bold text-amber-700 shrink-0">
                    {profile.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900 truncate">{profile.name}</p>
                    <p className="text-xs text-stone-400 truncate">{profile.email}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Badge className={roleColors[profile.role]}>{profile.role}</Badge>
                  <Badge className={teamColors[profile.team]}>{profile.team.replace('_', ' ')}</Badge>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-50 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-stone-800">{assignedTasks.length}</p>
                    <p className="text-xs text-stone-400">Total</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600">{openTasks.length}</p>
                    <p className="text-xs text-stone-400">Open</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{doneTasks.length}</p>
                    <p className="text-xs text-stone-400">Done</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
