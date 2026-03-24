'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 bg-white rounded-xl shadow-xl border border-stone-200 w-full mx-4 max-h-[90vh] flex flex-col',
          {
            'max-w-sm': size === 'sm',
            'max-w-lg': size === 'md',
            'max-w-2xl': size === 'lg',
            'max-w-4xl': size === 'xl',
          }
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
