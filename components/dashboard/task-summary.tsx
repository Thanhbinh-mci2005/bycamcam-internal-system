import { Badge } from '@/components/ui/badge'
import { formatStatusLabel, getPriorityColor, getStatusColor, isOverdue } from '@/lib/utils'
import type { Task } from '@/types'
import { ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface TaskSummaryProps {
  tasks: Task[]
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
  const active = tasks.filter(t => t.status !== 'done').slice(0, 6)

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} className="text-purple-500" />
          <h3 className="text-sm font-semibold text-stone-800">Active Tasks</h3>
          <Badge className="bg-purple-100 text-purple-700">{active.length}</Badge>
        </div>
        <Link href="/tasks" className="text-xs text-amber-600 hover:underline font-medium">
          View all
        </Link>
      </div>
      <div className="divide-y divide-stone-50">
        {active.map((task) => {
          const overdue = task.deadline ? isOverdue(task.deadline) : false
          return (
            <div key={task.id} className="flex items-start gap-3 px-5 py-3 hover:bg-stone-50 transition-colors">
              <div
                className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  task.priority === 'urgent' ? 'bg-red-500' :
                  task.priority === 'high' ? 'bg-orange-400' :
                  task.priority === 'medium' ? 'bg-yellow-400' : 'bg-stone-300'
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800 truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge className={getStatusColor(task.status)}>{formatStatusLabel(task.status)}</Badge>
                  <span className="text-xs text-stone-400">{task.assignee?.name}</span>
                  {task.deadline && (
                    <span className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-stone-400'}`}>
                      {overdue ? '⚠ ' : ''}{format(new Date(task.deadline), 'MMM d')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
