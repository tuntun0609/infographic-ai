'use client'

import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useRouter } from '@/i18n/navigation'

interface ExploreHeaderProps {
  totalCount: number
}

export function ExploreHeader({ totalCount }: ExploreHeaderProps) {
  const t = useTranslations('explore')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  )

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
      return params.toString()
        ? `/slide/explore?${params.toString()}`
        : '/slide/explore'
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

  return (
    <header className="sticky top-0 z-5 flex flex-col gap-4 bg-background/80 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <h1 className="font-medium text-lg tracking-tight sm:text-xl">
          {t('title')}
        </h1>
        <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
          {totalCount}
        </span>
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
    </header>
  )
}
