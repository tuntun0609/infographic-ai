'use client'

import { Infographic } from '@antv/infographic'
import { formatDistanceToNow } from 'date-fns'
import { enUS, zhCN } from 'date-fns/locale'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import type { ExploreSlide } from './explore-list'

interface ExploreCardProps {
  slide: ExploreSlide
}

function InfographicPreview({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const infographicInstanceRef = useRef<Infographic | null>(null)

  useEffect(() => {
    if (!(containerRef.current && content)) {
      return
    }

    const cleanup = () => {
      if (infographicInstanceRef.current) {
        infographicInstanceRef.current.destroy()
        infographicInstanceRef.current = null
      }
    }

    cleanup()
    containerRef.current.innerHTML = ''

    try {
      const infographic = new Infographic({
        container: containerRef.current,
        width: '100%',
        height: '100%',
      })
      infographic.render(content)
      infographicInstanceRef.current = infographic
    } catch (error) {
      console.error('Failed to render infographic preview:', error)
    }

    return cleanup
  }, [content])

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      ref={containerRef}
    />
  )
}

export function ExploreCard({ slide }: ExploreCardProps) {
  const locale = useLocale()
  const t = useTranslations('explore')
  const firstInfographic = slide.infographics?.[0]
  const hasInfographic = firstInfographic?.content?.trim()
  const dateLocale = locale === 'zh' ? zhCN : enUS

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="group relative flex aspect-4/3 flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        className="flex-1 cursor-pointer overflow-hidden"
        href={`/preview/${slide.id}`}
      >
        <div className="relative flex h-full w-full items-center justify-center bg-muted/30 transition-colors group-hover:bg-muted/50">
          {hasInfographic && firstInfographic ? (
            <InfographicPreview content={firstInfographic.content} />
          ) : (
            <div className="flex items-center justify-center p-6">
              <Image
                alt="Infographic Icon"
                className="size-12 opacity-20"
                height={48}
                src="/infographic.svg"
                width={48}
              />
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-1 border-t bg-background p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="truncate font-medium text-xs sm:text-sm"
            title={slide.title}
          >
            {slide.title}
          </h3>
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <div className="flex items-center gap-1.5">
            {slide.userImage ? (
              <img
                alt={slide.userName}
                className="size-4 rounded-full object-cover"
                height={16}
                src={slide.userImage}
                width={16}
              />
            ) : (
              <div className="flex size-4 items-center justify-center rounded-full bg-muted font-medium text-[8px]">
                {slide.userName?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <span className="truncate">{slide.userName || t('anonymous')}</span>
          </div>
          <span className="text-[10px] sm:text-xs">
            {formatDistanceToNow(slide.updatedAt || slide.createdAt, {
              addSuffix: true,
              locale: dateLocale,
            })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
