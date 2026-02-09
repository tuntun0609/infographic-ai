'use client'

import { Eye, Pencil, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileTabBarProps {
  currentView: 'viewer' | 'editor' | 'ai'
  onViewChange: (view: 'viewer' | 'editor' | 'ai') => void
}

const mobileTabItems = [
  { key: 'viewer' as const, icon: Eye, label: '预览' },
  { key: 'editor' as const, icon: Pencil, label: '编辑' },
  { key: 'ai' as const, icon: Sparkles, label: 'AI' },
]

export function MobileTabBar({ currentView, onViewChange }: MobileTabBarProps) {
  return (
    <div className="flex shrink-0 items-center justify-around border-t bg-background/95 backdrop-blur-sm">
      {mobileTabItems.map(({ key, icon: Icon, label }) => (
        <button
          className={cn(
            'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors',
            currentView === key ? 'text-primary' : 'text-muted-foreground'
          )}
          key={key}
          onClick={() => onViewChange(key)}
          type="button"
        >
          <Icon className="size-4.5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
