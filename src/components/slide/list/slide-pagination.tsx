'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SlidePaginationProps {
  currentPage: number
  totalPages: number
}

export function SlidePagination({
  currentPage,
  totalPages,
}: SlidePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) {
    return null
  }

  return (
    <footer className="flex justify-center border-t bg-background/50 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            className={cn(
              'h-8 w-8 rounded-full p-0 font-normal',
              currentPage === page &&
                'bg-foreground text-background hover:bg-foreground/90'
            )}
            key={page}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.set('page', String(page))
              router.push(`/slide?${params.toString()}`)
            }}
            size="sm"
            variant={currentPage === page ? 'secondary' : 'ghost'}
          >
            {page}
          </Button>
        ))}
      </div>
    </footer>
  )
}
