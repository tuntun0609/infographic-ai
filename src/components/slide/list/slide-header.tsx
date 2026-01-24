'use client'

import { Plus, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SlideHeaderProps {
  totalCount: number
  onCreateSlide: () => void
  isPending: boolean
}

export function SlideHeader({
  totalCount,
  onCreateSlide,
  isPending,
}: SlideHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  )

  // Sync URL params to local state
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
  }, [searchParams])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set('search', value.trim())
        params.delete('page')
      } else {
        params.delete('search')
      }
      const newUrl = params.toString()
        ? `/slide?${params.toString()}`
        : '/slide'
      router.push(newUrl)
    },
    [router, searchParams]
  )

  return (
    <header className="sticky top-0 z-5 flex items-center justify-between bg-background/80 px-8 py-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <h1 className="font-medium text-xl tracking-tight">我的演示</h1>
        <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground text-xs">
          {totalCount}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="group relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground" />
          <Input
            className="h-9 w-64 rounded-full bg-muted/50 pl-9 transition-all hover:bg-muted focus:w-80 focus:bg-background"
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="搜索..."
            value={searchQuery}
          />
        </div>
        <Button
          className="h-9 rounded-full px-4 font-medium transition-all hover:scale-105 active:scale-95"
          disabled={isPending}
          onClick={onCreateSlide}
        >
          <Plus className="mr-2 size-4" />
          新建
        </Button>
      </div>
    </header>
  )
}
