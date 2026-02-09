'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { SlideData } from '@/store/slide-store'
import { AIGenerator } from './editor/ai-generator'
import { InfographicEditor } from './editor/infographic-editor'
import { InfographicViewer } from './infographic-viewer'
import { MobileTabBar } from './mobile-tab-bar'
import { SlideTopBar } from './slide-top-bar'

interface MobileSlidePanelsProps {
  slideId: string
  slide: SlideData | null
  titleValue: string
  isEditingTitle: boolean
  isPending: boolean
  onTitleChange: (value: string) => void
  onTitleEdit: (editing: boolean) => void
  onTitleSubmit: () => void
  onSave: () => void
}

export function MobileSlidePanels({
  slideId,
  slide,
  titleValue,
  isEditingTitle,
  isPending,
  onTitleChange,
  onTitleEdit,
  onTitleSubmit,
  onSave,
}: MobileSlidePanelsProps) {
  const [mobileView, setMobileView] = useState<'viewer' | 'editor' | 'ai'>(
    'viewer'
  )

  return (
    <main className="flex h-full flex-col overflow-hidden">
      {/* Mobile top bar */}
      <SlideTopBar
        isEditingTitle={isEditingTitle}
        isMobile
        isPending={isPending}
        onSave={onSave}
        onTitleChange={onTitleChange}
        onTitleEdit={onTitleEdit}
        onTitleSubmit={onTitleSubmit}
        slide={slide}
        titleValue={titleValue}
      />

      {/* Mobile content area */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Viewer */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col overflow-hidden',
            mobileView === 'viewer'
              ? 'z-10'
              : 'pointer-events-none z-0 opacity-0'
          )}
        >
          <div className="relative min-h-0 flex-1 rounded-lg">
            <InfographicViewer slideId={slideId} />
          </div>
        </div>

        {/* Editor */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col overflow-hidden bg-card',
            mobileView === 'editor'
              ? 'z-10'
              : 'pointer-events-none z-0 opacity-0'
          )}
        >
          <InfographicEditor slideId={slideId} />
        </div>

        {/* AI */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col overflow-hidden bg-card',
            mobileView === 'ai' ? 'z-10' : 'pointer-events-none z-0 opacity-0'
          )}
        >
          <AIGenerator slideId={slideId} />
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <MobileTabBar currentView={mobileView} onViewChange={setMobileView} />
    </main>
  )
}
