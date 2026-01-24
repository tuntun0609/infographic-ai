'use client'

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Plus,
  Search,
} from 'lucide-react'
import type { Variants } from 'motion/react'
import { motion } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { createSlide } from '@/actions/slide'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { slide } from '@/db/schema'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type Slide = typeof slide.$inferSelect

interface SlideListProps {
  slides: Slide[]
  currentPage: number
  totalPages: number
  totalCount: number
}

export function SlideList({
  slides,
  currentPage,
  totalPages,
  totalCount,
}: SlideListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  )
  const [isPending, startTransition] = useTransition()

  const handleCreateSlide = () => {
    startTransition(async () => {
      await createSlide()
    })
  }

  // 同步 URL 参数到本地状态
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
  }, [searchParams])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set('search', value.trim())
        params.delete('page') // 搜索时重置到第一页
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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }
    const newUrl = params.toString() ? `/slide?${params.toString()}` : '/slide'
    router.push(newUrl)
  }

  const formatDate = (date: Date | null) => {
    if (!date) {
      return ''
    }
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  // hover 动画变体
  const hoverVariants: Variants = {
    rest: {
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 工具栏 */}
      <div className="border-b-0 bg-background px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* 搜索栏 */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="搜索 slide..."
              value={searchQuery}
            />
          </div>
          {/* 新建按钮 */}
          <Button
            className="gap-2"
            disabled={isPending}
            onClick={handleCreateSlide}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            新建 Slide
          </Button>
        </div>
      </div>

      {/* 列表内容 */}
      {slides.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
          <motion.div
            className="flex size-16 items-center justify-center rounded-full bg-muted"
            initial="rest"
            variants={hoverVariants}
            whileHover="hover"
          >
            <FileText className="size-8 text-muted-foreground" />
          </motion.div>
          <div className="flex flex-col items-center gap-2 text-center">
            <motion.h3
              className="font-semibold text-lg"
              initial="rest"
              variants={hoverVariants}
              whileHover="hover"
            >
              还没有创建任何 Slide
            </motion.h3>
            <motion.p
              className="text-muted-foreground text-sm"
              initial="rest"
              variants={hoverVariants}
              whileHover="hover"
            >
              点击上方的 "新建 Slide" 按钮开始创建你的第一个 Slide
            </motion.p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-2xl">My Slides</h1>
              <p className="mt-1 text-muted-foreground text-sm">
                共 {totalCount} 个 Slide
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {slides.map((slideItem) => (
              <Link href={`/slide/${slideItem.id}`} key={slideItem.id}>
                <Card className="group/card h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {slideItem.title}
                    </CardTitle>
                    <CardDescription>
                      {slideItem.infographics.length} 个信息图
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground text-xs">
                      <div>创建于 {formatDate(slideItem.createdAt)}</div>
                      {slideItem.updatedAt &&
                        slideItem.updatedAt.getTime() !==
                          slideItem.createdAt.getTime() && (
                          <div className="mt-1">
                            更新于 {formatDate(slideItem.updatedAt)}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="border-t bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              第 {currentPage} / {totalPages} 页
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="size-4" />
                上一页
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // 只显示当前页附近和首尾的页码
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)

                    if (!showPage) {
                      // 显示省略号
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            className="px-2 text-muted-foreground text-sm"
                            key={page}
                          >
                            ...
                          </span>
                        )
                      }
                      return null
                    }

                    return (
                      <Button
                        className={cn(
                          'min-w-10',
                          page === currentPage && 'pointer-events-none'
                        )}
                        key={page}
                        onClick={() => handlePageChange(page)}
                        size="sm"
                        variant={page === currentPage ? 'default' : 'ghost'}
                      >
                        {page}
                      </Button>
                    )
                  }
                )}
              </div>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                size="sm"
                variant="outline"
              >
                下一页
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
