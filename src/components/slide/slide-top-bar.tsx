'use client'

import { PanelRightOpen } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { SlideData } from '@/store/slide-store'

interface SlideTopBarProps {
  slide: SlideData | null
  titleValue: string
  isEditingTitle: boolean
  isPending: boolean
  isMobile?: boolean
  isCollapsed?: boolean
  onTitleChange: (value: string) => void
  onTitleEdit: (editing: boolean) => void
  onTitleSubmit: () => void
  onSave: () => void
  onToggleCollapse?: () => void
}

export function SlideTopBar({
  slide,
  titleValue,
  isEditingTitle,
  isPending,
  isMobile = false,
  isCollapsed = false,
  onTitleChange,
  onTitleEdit,
  onTitleSubmit,
  onSave,
  onToggleCollapse,
}: SlideTopBarProps) {
  const t = useTranslations('slide')
  const hoverAnimation = isMobile || isPending ? {} : { scale: 1.03 }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between border-t border-b px-3',
        isMobile ? 'h-11' : 'h-12 px-4'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {isEditingTitle ? (
          <Input
            autoFocus
            className={cn(
              'h-7 border-transparent px-2 py-1 font-medium text-sm shadow-none',
              isMobile ? 'max-w-[200px]' : 'max-w-[300px]'
            )}
            onBlur={onTitleSubmit}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onTitleSubmit()
              }
              if (e.key === 'Escape') {
                onTitleEdit(false)
                onTitleChange(slide?.title || '')
              }
            }}
            value={titleValue}
          />
        ) : (
          <button
            className="h-7 cursor-pointer truncate rounded-md px-2 py-1 text-left font-medium text-sm transition-colors hover:bg-muted"
            onClick={() => onTitleEdit(true)}
            type="button"
          >
            {slide?.title || t('untitledSlide')}
          </button>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {!isMobile && isCollapsed && onToggleCollapse && (
          <Button
            className="h-7 w-7"
            onClick={onToggleCollapse}
            size="icon"
            variant="ghost"
          >
            <PanelRightOpen className="h-3.5 w-3.5" />
          </Button>
        )}
        <motion.div
          animate={isPending ? { scale: [1, 1.02, 1] } : {}}
          transition={
            isPending
              ? {
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }
              : { type: 'spring', stiffness: 400, damping: 17 }
          }
          whileHover={hoverAnimation}
          whileTap={isPending ? {} : { scale: 0.97 }}
        >
          <Button
            className="h-7 px-3 text-xs"
            disabled={isPending || !slide}
            onClick={onSave}
            size="sm"
            variant="default"
          >
            {isPending ? t('saving') : t('save')}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
