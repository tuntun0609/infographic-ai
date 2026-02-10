'use client'

import { format, formatDistanceToNow } from 'date-fns'
import { enUS, zhCN } from 'date-fns/locale'
import { FileText, Globe } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import type { slide } from '@/db/schema'
import { Link } from '@/i18n/navigation'
import { SlideCardMenu } from './slide-card-menu'

type Slide = typeof slide.$inferSelect

interface SlideListItemProps {
  slide: Slide
}

export function SlideListItem({ slide }: SlideListItemProps) {
  const locale = useLocale()
  const t = useTranslations('slide')
  const dateLocale = locale === 'zh' ? zhCN : enUS
  const firstInfographic = slide.infographics?.[0]
  const hasInfographic = firstInfographic?.content?.trim()

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="group relative flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-foreground/20"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        className="flex flex-1 items-center gap-4 overflow-hidden"
        href={`/slide/${slide.id}`}
      >
        {/* Thumbnail */}
        <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/40">
          {hasInfographic ? (
            <FileText className="size-5 text-muted-foreground/60" />
          ) : (
            <Image
              alt=""
              className="size-5 opacity-20"
              height={20}
              src="/infographic.svg"
              width={20}
            />
          )}
        </div>

        {/* Title + Badge */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium text-sm" title={slide.title}>
              {slide.title}
            </h3>
            {slide.published && (
              <Badge
                className="shrink-0 gap-1 bg-green-500/10 text-[10px] text-green-600 dark:text-green-400"
                variant="secondary"
              >
                <Globe className="h-2.5 w-2.5" />
                {t('published')}
              </Badge>
            )}
          </div>
          <p className="mt-0.5 truncate text-muted-foreground text-xs">
            {slide.infographics?.length || 0} {t('pages')}
          </p>
        </div>

        {/* Meta columns - hidden on small screens */}
        <div className="hidden shrink-0 items-center gap-8 text-muted-foreground text-xs sm:flex">
          <div className="w-28 text-right">
            <p className="text-[10px] text-muted-foreground/60">
              {t('sortCreatedAt')}
            </p>
            <p>
              {format(slide.createdAt, 'yyyy/MM/dd', { locale: dateLocale })}
            </p>
          </div>
          <div className="w-28 text-right">
            <p className="text-[10px] text-muted-foreground/60">
              {t('sortUpdatedAt')}
            </p>
            <p>
              {formatDistanceToNow(slide.updatedAt || slide.createdAt, {
                addSuffix: true,
                locale: dateLocale,
              })}
            </p>
          </div>
        </div>
      </Link>

      <SlideCardMenu
        className="shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        slide={slide}
      />
    </motion.div>
  )
}
