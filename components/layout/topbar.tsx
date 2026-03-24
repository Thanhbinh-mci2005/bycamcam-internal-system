'use client'

import { Bell, Search } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="h-14 border-b border-stone-100 bg-white flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-base font-semibold text-stone-900">{title}</h1>
        {subtitle && <p className="text-xs text-stone-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-8 pl-8 pr-3 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 w-48"
          />
        </div>

        <button className="relative h-8 w-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-amber-400 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-semibold text-amber-700">
            C
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-stone-800">Cam Nguyen</p>
            <p className="text-xs text-stone-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
