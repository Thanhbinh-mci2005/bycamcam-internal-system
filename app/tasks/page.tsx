'use client'

import { Topbar } from '@/components/layout/topbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { mockProfiles, mockTasks, mockProducts } from '@/lib/mock-data'
import { formatStatusLabel, getPriorityColor, getStatusColor, isOverdue } from '@/lib/utils'
import type { Task, TaskPriority, TaskStatus } from '@/types'
import { CheckCircle2, Circle, Clock, Edit2, Plus } from 'lucide-react'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'

type FilterStatus = TaskStatus | 'all'

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'bg-slate-100' },
  { status: 'doing', label: 'In Progress', color: 'bg-blue-50' },
  { status: 'done', label: 'Done', color: 'bg-green-50' },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [view, setView] = useState<'board' | 'list'>('board')
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium' as TaskPriority,
    deadline: '',
    product_id: '',
    status: 'todo' as TaskStatus,
  })

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    const assignee = mockProfiles.find(p => p.id === newTask.assigned_to)
    const product = mockProducts.find(p => p.id === newTask.product_id)
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assigned_to: newTask.assigned_to,
      status: newTask.status,
      priority: newTask.priority,
      deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : undefined,
      product_id: newTask.product_id || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assignee: assignee ? { name: assignee.name, team: assignee.team } : undefined,
      product: product ? { sku: product.sku, name: product.name } : undefined,
    }
    setTasks(prev => [task, ...prev])
    setCreateOpen(false)
    setNewTask({ title: '', description: '', assigned_to: '', priority: 'medium', deadline: '', product_id: '', status: 'todo' })
  }

  function handleStatusChange(taskId: string, status: TaskStatus) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, updated_at: new Date().toISOString() } : t))
  }

  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    doing: tasks.filter(t => t.status === 'doing').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => t.status !== 'done' && t.deadline && isOverdue(t.deadline)).length,
  }

  const TaskForm = ({ initial = newTask, onChange }: { initial: typeof newTask; onChange: (v: typeof newTask) => void }) => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-stone-600">Task Title *</label>
        <Input value={initial.title} onChange={e => onChange({ ...initial, title: e.target.value })} placeholder="What needs to be done?" required />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-stone-600">Description</label>
        <Textarea value={initial.description} onChange={e => onChange({ ...initial, description: e.target.value })} rows={2} placeholder="Add details..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Assign To</label>
          <Select value={initial.assigned_to} onChange={e => onChange({ ...initial, assigned_to: e.target.value })}>
            <option value="">Unassigned</option>
            {mockProfiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.team})</option>)}
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Priority</label>
          <Select value={initial.priority} onChange={e => onChange({ ...initial, priority: e.target.value as TaskPriority })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Deadline</label>
          <Input type="datetime-local" value={initial.deadline} onChange={e => onChange({ ...initial, deadline: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600">Related Product</label>
          <Select value={initial.product_id} onChange={e => onChange({ ...initial, product_id: e.target.value })}>
            <option value="">None</option>
            {mockProducts.map(p => <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}
          </Select>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Tasks" subtitle="Team task management" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-4 py-2 shadow-sm">
            <Circle size={14} className="text-slate-400" />
            <span className="text-sm font-medium text-stone-700">To Do</span>
            <Badge className="bg-slate-100 text-slate-700">{counts.todo}</Badge>
          </div>
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-4 py-2 shadow-sm">
            <Clock size={14} className="text-blue-400" />
            <span className="text-sm font-medium text-stone-700">In Progress</span>
            <Badge className="bg-blue-100 text-blue-700">{counts.doing}</Badge>
          </div>
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-4 py-2 shadow-sm">
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="text-sm font-medium text-stone-700">Done</span>
            <Badge className="bg-green-100 text-green-700">{counts.done}</Badge>
          </div>
          {counts.overdue > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-red-700">⚠ {counts.overdue} overdue</span>
            </div>
          )}
          <div className="ml-auto">
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={15} className="mr-1.5" />
              New Task
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.status)
            return (
              <div key={col.status} className={`rounded-xl border border-stone-200 ${col.color} overflow-hidden`}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-stone-800">{col.label}</h3>
                    <Badge className={getStatusColor(col.status)}>{colTasks.length}</Badge>
                  </div>
                </div>
                <div className="p-3 space-y-2 min-h-[300px]">
                  {colTasks.map(task => {
                    const overdue = task.deadline && task.status !== 'done' ? isOverdue(task.deadline) : false
                    return (
                      <div key={task.id} className="bg-white rounded-lg border border-stone-200 shadow-sm p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-stone-800 leading-snug">{task.title}</p>
                          <button onClick={() => setEditTask(task)} className="p-0.5 rounded hover:bg-stone-100 text-stone-300 hover:text-stone-500 shrink-0">
                            <Edit2 size={12} />
                          </button>
                        </div>

                        {task.product && (
                          <p className="text-xs text-stone-400 mt-1 truncate">{task.product.sku}</p>
                        )}

                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <Badge className={getPriorityColor(task.priority)}>{formatStatusLabel(task.priority)}</Badge>
                          {task.assignee && (
                            <span className="text-xs text-stone-500">{task.assignee.name}</span>
                          )}
                        </div>

                        {task.deadline && (
                          <div className={`mt-2 flex items-center gap-1 text-xs ${overdue ? 'text-red-500 font-medium' : 'text-stone-400'}`}>
                            <Clock size={11} />
                            {overdue ? '⚠ ' : ''}{format(new Date(task.deadline), 'MMM d, HH:mm')}
                          </div>
                        )}

                        {/* Quick status change */}
                        {col.status !== 'done' && (
                          <div className="mt-2 pt-2 border-t border-stone-50 flex gap-1">
                            {col.status === 'todo' && (
                              <button onClick={() => handleStatusChange(task.id, 'doing')} className="text-xs text-blue-600 hover:underline">→ Start</button>
                            )}
                            {col.status === 'doing' && (
                              <button onClick={() => handleStatusChange(task.id, 'done')} className="text-xs text-green-600 hover:underline">✓ Complete</button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {colTasks.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-xs text-stone-300">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Task" size="lg">
        <form onSubmit={handleCreateTask} className="p-6 space-y-4">
          <TaskForm initial={newTask} onChange={setNewTask} />
          <div className="flex gap-3 justify-end pt-2 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editTask} onClose={() => setEditTask(null)} title="Edit Task" size="lg">
        {editTask && (
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-600">Title</label>
              <Input value={editTask.title} onChange={e => setEditTask(prev => prev ? { ...prev, title: e.target.value } : null)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-600">Description</label>
              <Textarea value={editTask.description ?? ''} onChange={e => setEditTask(prev => prev ? { ...prev, description: e.target.value } : null)} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">Status</label>
                <Select value={editTask.status} onChange={e => setEditTask(prev => prev ? { ...prev, status: e.target.value as TaskStatus } : null)}>
                  <option value="todo">To Do</option>
                  <option value="doing">In Progress</option>
                  <option value="done">Done</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">Priority</label>
                <Select value={editTask.priority} onChange={e => setEditTask(prev => prev ? { ...prev, priority: e.target.value as TaskPriority } : null)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">Assign To</label>
                <Select value={editTask.assigned_to ?? ''} onChange={e => {
                  const profile = mockProfiles.find(p => p.id === e.target.value)
                  setEditTask(prev => prev ? { ...prev, assigned_to: e.target.value, assignee: profile ? { name: profile.name, team: profile.team } : undefined } : null)
                }}>
                  <option value="">Unassigned</option>
                  {mockProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-600">Deadline</label>
                <Input type="datetime-local" value={editTask.deadline ? editTask.deadline.slice(0, 16) : ''} onChange={e => setEditTask(prev => prev ? { ...prev, deadline: e.target.value } : null)} />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-stone-100">
              <Button variant="outline" onClick={() => setEditTask(null)}>Cancel</Button>
              <Button onClick={() => {
                setTasks(prev => prev.map(t => t.id === editTask.id ? { ...editTask, updated_at: new Date().toISOString() } : t))
                setEditTask(null)
              }}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
