'use client'

import { useAtom, useSetAtom } from 'jotai'
import Cookies from 'js-cookie'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { motion } from 'motion/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import type { Layout, PanelImperativeHandle } from 'react-resizable-panels'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { toast } from 'sonner'
import { updateSlide } from '@/actions/slide'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  editingInfographicContentAtom,
  type SlideData,
  selectedInfographicIdAtom,
  slideAtom,
} from '@/store/slide-store'
import { RESIZABLE_PANELS_COOKIE_NAME } from '@/type'
import { AIGenerator } from './editor/ai-generator'
import { InfographicEditor } from './editor/infographic-editor'
import { InfographicViewer } from './infographic-viewer'

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
  const panelRef = useRef<PanelImperativeHandle>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const [slide, setSlide] = useAtom(slideAtom)
  const setSelectedInfographicId = useSetAtom(selectedInfographicIdAtom)
  const setEditingContent = useSetAtom(editingInfographicContentAtom)
  const lastSlideIdRef = useRef<string | null>(null)
  const searchParams = useSearchParams()
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
        toast.success('保存成功')
      } catch (error) {
        toast.error('保存失败')
        console.error('Failed to save slide:', error)
      }
    })
  }, [slide, slideId])

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

  const onLayoutChange = (layout: Layout) => {
    Cookies.set(RESIZABLE_PANELS_COOKIE_NAME, JSON.stringify(layout))
  }

  const toggleCollapse = () => {
    const panel = panelRef.current
    if (panel) {
      if (isCollapsed) {
        panel.expand()
      } else {
        panel.collapse()
      }
    }
  }

  const handleTabChange = (value: string) => {
    const nextTab = value === 'ai' ? 'ai' : 'editor'
    setCurrentTab(nextTab)

    // 使用 window.history.replaceState 更新 URL，避免触发 Next.js 路由导航和服务器重新渲染
    const params = new URLSearchParams(searchParams.toString())
    if (nextTab === 'editor') {
      params.delete('tab')
    } else {
      params.set('tab', nextTab)
    }
    const query = params.toString()
    const newUrl = query ? `${pathname}?${query}` : pathname
    // 直接使用浏览器 API 更新 URL，不触发 Next.js 路由导航
    window.history.replaceState(null, '', newUrl)
  }

  const handleSeparatorClick = () => {
    if (isCollapsed) {
      const panel = panelRef.current
      if (panel) {
        panel.expand()
      }
    }
  }

  return (
    <main className="flex h-full flex-col overflow-hidden">
      {/* Unified top bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-t border-b px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isEditingTitle ? (
            <Input
              autoFocus
              className="h-7 max-w-[300px] border-transparent px-2 py-1 font-medium text-sm shadow-none"
              onBlur={handleTitleSubmit}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTitleSubmit()
                }
                if (e.key === 'Escape') {
                  setIsEditingTitle(false)
                  setTitleValue(slide?.title || '')
                }
              }}
              value={titleValue}
            />
          ) : (
            <button
              className="h-7 cursor-pointer truncate rounded-md px-2 py-1 text-left font-medium text-sm transition-colors hover:bg-muted"
              onClick={() => setIsEditingTitle(true)}
              type="button"
            >
              {slide?.title || 'Untitled Slide'}
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {isCollapsed && (
            <Button
              className="h-7 w-7"
              onClick={toggleCollapse}
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
            whileHover={isPending ? {} : { scale: 1.03 }}
            whileTap={isPending ? {} : { scale: 0.97 }}
          >
            <Button
              className="h-7 px-3 text-xs"
              disabled={isPending || !slide}
              onClick={handleSave}
              size="sm"
              variant="default"
            >
              {isPending ? '保存中...' : 'Save'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Panel group */}
      <div className="min-h-0 flex-1 p-3">
        <Group
          className="h-full w-full"
          defaultLayout={
            defaultLayout ?? {
              'infographic-viewer': 70,
              'infographic-editor': 30,
            }
          }
          onLayoutChange={onLayoutChange}
          orientation="horizontal"
        >
          <Panel
            className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-xs"
            id="infographic-viewer"
            minSize="400px"
          >
            <div className="relative min-h-0 flex-1">
              <InfographicViewer slideId={slideId} />
            </div>
          </Panel>

          <Separator
            className="relative w-1.5 cursor-col-resize rounded-full bg-transparent transition-colors hover:bg-primary/8 focus-visible:outline-none data-[dragging=true]:bg-primary/12"
            onClick={handleSeparatorClick}
          >
            <div className="mx-auto h-full w-px" />
          </Separator>

          <Panel
            className={cn(
              'overflow-hidden rounded-lg border bg-card shadow-xs transition-all duration-200',
              isCollapsed ? 'border-transparent bg-transparent shadow-none' : ''
            )}
            collapsible
            id="infographic-editor"
            onResize={(size) => {
              setIsCollapsed(size.asPercentage === 0)
            }}
            panelRef={panelRef}
          >
            {!isCollapsed && (
              <div className="flex h-full flex-col">
                <Tabs
                  className="flex h-full flex-col"
                  onValueChange={handleTabChange}
                  value={currentTab}
                >
                  <div className="flex h-10 items-center justify-between border-b px-3">
                    <TabsList className="h-auto gap-0.5 bg-transparent p-0">
                      <TabsTrigger
                        className="h-7 rounded-md px-2.5 text-xs data-active:bg-muted data-active:shadow-none"
                        value="editor"
                      >
                        Editor
                      </TabsTrigger>
                      <TabsTrigger
                        className="h-7 rounded-md px-2.5 text-xs data-active:bg-muted data-active:shadow-none"
                        value="ai"
                      >
                        AI
                      </TabsTrigger>
                    </TabsList>
                    <Button
                      className="h-7 w-7"
                      onClick={toggleCollapse}
                      size="icon"
                      variant="ghost"
                    >
                      <PanelRightClose className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <TabsContent
                    className="min-h-0 flex-1"
                    keepMounted
                    value="editor"
                  >
                    <InfographicEditor slideId={slideId} />
                  </TabsContent>
                  <TabsContent
                    className="min-h-0 flex-1"
                    keepMounted
                    value="ai"
                  >
                    <AIGenerator slideId={slideId} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </Panel>
        </Group>
      </div>
    </main>
  )
}
