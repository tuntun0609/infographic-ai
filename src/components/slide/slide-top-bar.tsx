'use client'

import {
  Check,
  Copy,
  Globe,
  GlobeLock,
  Link2,
  PanelRightOpen,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { publishSlide } from '@/actions/slide'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  onPublishChange?: (published: boolean) => void
}

interface TitleEditorProps {
  isEditing: boolean
  titleValue: string
  slideTitle: string | undefined
  isMobile: boolean
  onTitleChange: (value: string) => void
  onTitleEdit: (editing: boolean) => void
  onTitleSubmit: () => void
}

function TitleEditor({
  isEditing,
  titleValue,
  slideTitle,
  isMobile,
  onTitleChange,
  onTitleEdit,
  onTitleSubmit,
}: TitleEditorProps) {
  const t = useTranslations('slide')

  if (isEditing) {
    return (
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
            onTitleChange(slideTitle || '')
          }
        }}
        value={titleValue}
      />
    )
  }

  return (
    <button
      className="h-7 cursor-pointer truncate rounded-md px-2 py-1 text-left font-medium text-sm transition-colors hover:bg-muted"
      onClick={() => onTitleEdit(true)}
      type="button"
    >
      {slideTitle || t('untitledSlide')}
    </button>
  )
}

interface PublishDropdownProps {
  slide: SlideData
  isMobile: boolean
  onPublishChange?: (published: boolean) => void
}

function PublishDropdown({
  slide,
  isMobile,
  onPublishChange,
}: PublishDropdownProps) {
  const t = useTranslations('slide')
  const [isPublishing, startPublishTransition] = useTransition()
  const [copied, setCopied] = useState(false)
  const isPublished = slide.published ?? false

  const handleTogglePublish = () => {
    startPublishTransition(async () => {
      try {
        const newPublished = !isPublished
        await publishSlide(slide.id, newPublished)
        onPublishChange?.(newPublished)
        toast.success(
          newPublished ? t('publishSuccess') : t('unpublishSuccess')
        )
      } catch {
        toast.error(t('saveFailed'))
      }
    })
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/preview/${slide.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success(t('linkCopied'))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="h-7 gap-1.5 px-2.5 text-xs"
            disabled={isPublishing}
            size="sm"
            variant={isPublished ? 'outline' : 'ghost'}
          />
        }
      >
        {isPublished ? (
          <>
            <Globe className="h-3.5 w-3.5 text-green-600" />
            {!isMobile && t('published')}
          </>
        ) : (
          <>
            <GlobeLock className="h-3.5 w-3.5 text-muted-foreground" />
            {!isMobile && t('publish')}
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-2">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPublished ? (
                <Globe className="h-4 w-4 text-green-600" />
              ) : (
                <GlobeLock className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium text-sm">
                {isPublished ? t('published') : t('unpublish')}
              </span>
            </div>
            <Button
              className="h-7 px-2 text-xs"
              disabled={isPublishing}
              onClick={handleTogglePublish}
              size="sm"
              variant="outline"
            >
              {isPublished ? t('unpublish') : t('publish')}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {isPublished ? t('publishSuccess') : t('unpublishSuccess')}
          </p>
        </div>

        {isPublished && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{t('copyLink')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Input
                  className="h-8 flex-1 bg-muted/30 text-[11px]"
                  readOnly
                  value={`${window.location.origin}/preview/${slide.id}`}
                />
                <Button
                  className="h-8 w-8 shrink-0 hover:bg-muted"
                  onClick={handleCopyLink}
                  size="icon"
                  title={t('copyLink')}
                  variant="ghost"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface SaveButtonProps {
  isPending: boolean
  isMobile: boolean
  hasSlide: boolean
  onSave: () => void
}

function SaveButton({
  isPending,
  isMobile,
  hasSlide,
  onSave,
}: SaveButtonProps) {
  const t = useTranslations('slide')
  const hoverAnimation = isMobile || isPending ? {} : { scale: 1.03 }

  return (
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
        disabled={isPending || !hasSlide}
        onClick={onSave}
        size="sm"
        variant="default"
      >
        {isPending ? t('saving') : t('save')}
      </Button>
    </motion.div>
  )
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
  onPublishChange,
}: SlideTopBarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between border-t border-b px-3',
        isMobile ? 'h-11' : 'h-12 px-4'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <TitleEditor
          isEditing={isEditingTitle}
          isMobile={isMobile}
          onTitleChange={onTitleChange}
          onTitleEdit={onTitleEdit}
          onTitleSubmit={onTitleSubmit}
          slideTitle={slide?.title}
          titleValue={titleValue}
        />
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
        {slide && (
          <PublishDropdown
            isMobile={isMobile}
            onPublishChange={onPublishChange}
            slide={slide}
          />
        )}
        <SaveButton
          hasSlide={!!slide}
          isMobile={isMobile}
          isPending={isPending}
          onSave={onSave}
        />
      </div>
    </div>
  )
}
