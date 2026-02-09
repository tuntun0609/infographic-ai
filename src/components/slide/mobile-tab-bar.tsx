'use client'

import { Eye, Pencil, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface MobileTabBarProps {
  currentView: 'viewer' | 'editor' | 'ai'
  onViewChange: (view: 'viewer' | 'editor' | 'ai') => void
}

export function MobileTabBar({ currentView, onViewChange }: MobileTabBarProps) {
  const t = useTranslations('slideEditor')

  const mobileTabItems = [
    { key: 'viewer' as const, icon: Eye, label: t('preview') },
    { key: 'editor' as const, icon: Pencil, label: t('edit') },
    { key: 'ai' as const, icon: Sparkles, label: t('ai') },
  ]

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
