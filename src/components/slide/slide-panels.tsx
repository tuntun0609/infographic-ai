'use client'

import { useAtom, useSetAtom } from 'jotai'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import type { Layout } from 'react-resizable-panels'
import { toast } from 'sonner'
import { updateSlide } from '@/actions/slide'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  editingInfographicContentAtom,
  type SlideData,
  selectedInfographicIdAtom,
  slideAtom,
} from '@/store/slide-store'
import { DesktopSlidePanels } from './desktop-slide-panels'
import { MobileSlidePanels } from './mobile-slide-panels'

import 'jotai-devtools/styles.css'

export function SlidePanels({
  slideId,
  defaultLayout,
  initialSlideData,
}: {
  slideId: string
  defaultLayout?: Layout
  initialSlideData?: SlideData
}) {
  const [slide, setSlide] = useAtom(slideAtom)
  const setSelectedInfographicId = useSetAtom(selectedInfographicIdAtom)
  const setEditingContent = useSetAtom(editingInfographicContentAtom)
  const lastSlideIdRef = useRef<string | null>(null)
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()

  const [currentTab, setCurrentTab] = useState<'editor' | 'ai'>(() => {
    const tab = searchParams.get('tab')
    return tab === 'ai' ? 'ai' : 'editor'
  })

  // Title editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(initialSlideData?.title || '')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (slide?.title) {
      setTitleValue(slide.title)
    }
  }, [slide?.title])

  const handleTitleSubmit = useCallback(() => {
    setIsEditingTitle(false)
    if (slide && titleValue.trim() !== '' && titleValue !== slide.title) {
      setSlide({ ...slide, title: titleValue.trim() })
    }
  }, [slide, titleValue, setSlide])

  const t = useTranslations('slide')

  const handleSave = useCallback(() => {
    if (!slide) {
      return
    }
    startTransition(async () => {
      try {
        await updateSlide(slideId, {
          title: slide.title,
          infographics: slide.infographics,
        })
        toast.success(t('saveSuccess'))
      } catch (error) {
        toast.error(t('saveFailed'))
        console.error('Failed to save slide:', error)
      }
    })
  }, [slide, slideId, t])

  // 初始化 slide 数据 - 只在 slideId 或 initialSlideData 变化时运行
  useEffect(() => {
    if (!initialSlideData) {
      return
    }

    const isSlideChanged = lastSlideIdRef.current !== slideId

    // 只在首次加载或 slide 切换时设置数据
    if (lastSlideIdRef.current === null || isSlideChanged) {
      setSlide(initialSlideData)

      if (initialSlideData.infographics.length > 0) {
        const firstInfographic = initialSlideData.infographics[0]
        setSelectedInfographicId(firstInfographic.id)
        setEditingContent(firstInfographic.content)
      }
    }

    lastSlideIdRef.current = slideId
  }, [
    initialSlideData,
    setSlide,
    setSelectedInfographicId,
    setEditingContent,
    slideId,
  ])

  useEffect(() => {
    const tab = searchParams.get('tab')
    setCurrentTab(tab === 'ai' ? 'ai' : 'editor')
  }, [searchParams])

  const handleTabChange = useCallback((tab: 'editor' | 'ai') => {
    setCurrentTab(tab)
  }, [])

  const slideValue: SlideData | null = slide ?? null

  if (isMobile) {
    return (
      <MobileSlidePanels
        isEditingTitle={isEditingTitle}
        isPending={isPending}
        onSave={handleSave}
        onTitleChange={setTitleValue}
        onTitleEdit={setIsEditingTitle}
        onTitleSubmit={handleTitleSubmit}
        slide={slideValue}
        slideId={slideId}
        titleValue={titleValue}
      />
    )
  }

  return (
    <DesktopSlidePanels
      currentTab={currentTab}
      defaultLayout={defaultLayout}
      isEditingTitle={isEditingTitle}
      isPending={isPending}
      onSave={handleSave}
      onTabChange={handleTabChange}
      onTitleChange={setTitleValue}
      onTitleEdit={setIsEditingTitle}
      onTitleSubmit={handleTitleSubmit}
      slide={slideValue}
      slideId={slideId}
      titleValue={titleValue}
    />
  )
}
