'use client'

import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createSlide } from '@/actions/slide'
import type { slide } from '@/db/schema'
import { useRouter } from '@/i18n/navigation'
import { EmptyState } from './empty-state'
import { SlideCard } from './slide-card'
import { SlideHeader } from './slide-header'
import { SlideListItem } from './slide-list-item'
import { SlidePagination } from './slide-pagination'

type Slide = typeof slide.$inferSelect

interface SlideListProps {
  slides: Slide[]
  currentPage: number
  totalPages: number
  totalCount: number
  sort: string
  view: string
}

export function SlideList({
  slides,
  currentPage,
  totalPages,
  totalCount,
  sort,
  view,
}: SlideListProps) {
  const t = useTranslations('slide')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [viewMode, setViewMode] = useState<'card' | 'list'>(
    view === 'list' ? 'list' : 'card'
  )

  const handleCreateSlide = () => {
    startTransition(async () => {
      try {
        const id = await createSlide()
        router.push(`/slide/${id}`)
      } catch {
        toast.error(t('createFailed'))
      }
    })
  }

  return (
    <div className="flex h-full flex-col bg-background/50">
      <SlideHeader
        isPending={isPending}
        onCreateSlide={handleCreateSlide}
        onViewModeChange={setViewMode}
        sort={sort}
        totalCount={totalCount}
        viewMode={viewMode}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {slides.length === 0 && (
          <EmptyState isPending={isPending} onCreate={handleCreateSlide} />
        )}
        {slides.length > 0 && viewMode === 'card' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {slides.map((slide) => (
              <SlideCard key={slide.id} slide={slide} />
            ))}
          </div>
        )}
        {slides.length > 0 && viewMode === 'list' && (
          <div className="flex flex-col gap-2">
            {slides.map((slide) => (
              <SlideListItem key={slide.id} slide={slide} />
            ))}
          </div>
        )}
      </main>

      <SlidePagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
