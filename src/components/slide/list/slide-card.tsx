'use client'

import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { LayoutTemplate } from 'lucide-react'
import { motion } from 'motion/react'
import type { slide } from '@/db/schema'
import { Link } from '@/i18n/navigation'
import { SlideCardMenu } from './slide-card-menu'

type Slide = typeof slide.$inferSelect

interface SlideCardProps {
  slide: Slide
}

export function SlideCard({ slide }: SlideCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="group relative flex aspect-4/3 flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link className="flex-1 cursor-pointer" href={`/slide/${slide.id}`}>
        <div className="flex h-full w-full flex-col items-center justify-center bg-muted/30 p-6 transition-colors group-hover:bg-muted/50">
          <LayoutTemplate className="size-12 text-muted-foreground/20" />
        </div>
      </Link>

      <SlideCardMenu slide={slide} />

      <div className="flex flex-col gap-1 border-t bg-background p-4">
        <div className="flex items-center justify-between">
          <h3 className="truncate font-medium text-sm" title={slide.title}>
            {slide.title}
          </h3>
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>{slide.infographics?.length || 0} 页</span>
          <span>
            {formatDistanceToNow(slide.updatedAt || slide.createdAt, {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
