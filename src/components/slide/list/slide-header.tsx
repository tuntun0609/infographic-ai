'use client'

import {
  ArrowDownAZ,
  ArrowUpZA,
  CalendarPlus,
  Clock,
  LayoutGrid,
  List,
  Plus,
  Search,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useRouter } from '@/i18n/navigation'

type ViewMode = 'card' | 'list'
type SortKey = 'updatedAt' | 'createdAt' | 'titleAsc' | 'titleDesc'

interface SlideHeaderProps {
  totalCount: number
  onCreateSlide: () => void
  isPending: boolean
  viewMode: string
  onViewModeChange: (mode: 'card' | 'list') => void
  sort: string
}

const SORT_ICONS: Record<SortKey, typeof Clock> = {
  updatedAt: Clock,
  createdAt: CalendarPlus,
  titleAsc: ArrowDownAZ,
  titleDesc: ArrowUpZA,
}

export function SlideHeader({
  totalCount,
  onCreateSlide,
  isPending,
  viewMode,
  onViewModeChange,
  sort,
}: SlideHeaderProps) {
  const t = useTranslations('slide')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  )

  // Sync URL params to local state
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
  }, [searchParams])

  const buildUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      return params.toString() ? `/slide?${params.toString()}` : '/slide'
    },
    [searchParams]
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      const trimmed = value.trim()
      router.push(
        buildUrl({
          search: trimmed || null,
          page: null,
        })
      )
    },
    [router, buildUrl]
  )

  const handleViewChange = useCallback(
    (mode: ViewMode) => {
      onViewModeChange(mode)
      const params = new URLSearchParams(searchParams.toString())
      if (mode === 'card') {
        params.delete('view')
      } else {
        params.set('view', mode)
      }
      const url = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname
      window.history.replaceState(null, '', url)
    },
    [onViewModeChange, searchParams]
  )

  const handleSortChange = useCallback(
    (sortKey: SortKey) => {
      router.push(
        buildUrl({
          sort: sortKey === 'updatedAt' ? null : sortKey,
          page: null,
        })
      )
    },
    [router, buildUrl]
  )

  const currentSort = (sort || 'updatedAt') as SortKey
  const CurrentSortIcon = SORT_ICONS[currentSort] || Clock

  const sortOptions: { key: SortKey; label: string; icon: typeof Clock }[] = [
    { key: 'updatedAt', label: t('sortUpdatedAt'), icon: Clock },
    { key: 'createdAt', label: t('sortCreatedAt'), icon: CalendarPlus },
    { key: 'titleAsc', label: t('sortTitleAsc'), icon: ArrowDownAZ },
    { key: 'titleDesc', label: t('sortTitleDesc'), icon: ArrowUpZA },
  ]

  return (
    <header className="sticky top-0 z-5 flex flex-col gap-4 bg-background/80 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <h1 className="font-medium text-lg tracking-tight sm:text-xl">
          {t('mySlides')}
        </h1>
        <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
          {totalCount}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
            <button
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                viewMode === 'card'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => handleViewChange('card')}
              title={t('viewCard')}
              type="button"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => handleViewChange('list')}
              title={t('viewList')}
              type="button"
            >
              <List className="size-3.5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className="flex h-8 items-center gap-1.5 rounded-lg border bg-muted/50 px-2.5 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground"
                  type="button"
                >
                  <CurrentSortIcon className="size-3.5" />
                  <span className="hidden sm:inline">
                    {sortOptions.find((o) => o.key === currentSort)?.label}
                  </span>
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.key}
                  onClick={() => handleSortChange(option.key)}
                >
                  <option.icon className="mr-2 size-4" />
                  <span
                    className={currentSort === option.key ? 'font-medium' : ''}
                  >
                    {option.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="group relative w-full sm:w-auto">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground" />
          <Input
            className="h-9 w-full rounded-full bg-muted/50 pl-9 transition-all hover:bg-muted focus:bg-background sm:w-64 lg:focus:w-80"
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t('search')}
            value={searchQuery}
          />
        </div>
        <Button
          className="h-9 w-full rounded-full px-4 font-medium transition-all hover:scale-105 active:scale-95 sm:w-auto"
          disabled={isPending}
          onClick={onCreateSlide}
        >
          <Plus className="mr-2 size-4" />
          <span className="sm:hidden lg:inline">{t('newSlide')}</span>
          <span className="hidden sm:inline lg:hidden">{t('new')}</span>
        </Button>
      </div>
    </header>
  )
}
