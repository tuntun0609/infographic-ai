'use client'

import type { Infographic } from '@/lib/slide-schema'
import { ExploreCard } from './explore-card'
import { ExploreEmptyState } from './explore-empty-state'
import { ExploreHeader } from './explore-header'
import { ExplorePagination } from './explore-pagination'

export interface ExploreSlide {
  id: string
  title: string
  infographics: Infographic[]
  published: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  userName: string
  userImage: string | null
}

interface ExploreListProps {
  slides: ExploreSlide[]
  currentPage: number
  totalPages: number
  totalCount: number
}

export function ExploreList({
  slides,
  currentPage,
  totalPages,
  totalCount,
}: ExploreListProps) {
  return (
    <div className="flex h-full flex-col bg-background/50">
      <ExploreHeader totalCount={totalCount} />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {slides.length === 0 && <ExploreEmptyState />}
        {slides.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {slides.map((slide) => (
              <ExploreCard key={slide.id} slide={slide} />
            ))}
          </div>
        )}
      </main>

      <ExplorePagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
