'use client'

import Cookies from 'js-cookie'
import { useRef, useState } from 'react'
import type { Layout, PanelImperativeHandle } from 'react-resizable-panels'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { cn } from '@/lib/utils'
import type { SlideData } from '@/store/slide-store'
import { RESIZABLE_PANELS_COOKIE_NAME } from '@/type'
import { EditorTabs } from './editor-tabs'
import { InfographicViewer } from './infographic-viewer'
import { SlideTopBar } from './slide-top-bar'

interface DesktopSlidePanelsProps {
  slideId: string
  slide: SlideData | null
  defaultLayout?: Layout
  titleValue: string
  isEditingTitle: boolean
  isPending: boolean
  currentTab: 'editor' | 'ai'
  onTitleChange: (value: string) => void
  onTitleEdit: (editing: boolean) => void
  onTitleSubmit: () => void
  onSave: () => void
  onTabChange: (tab: 'editor' | 'ai') => void
}

export function DesktopSlidePanels({
  slideId,
  slide,
  defaultLayout,
  titleValue,
  isEditingTitle,
  isPending,
  currentTab,
  onTitleChange,
  onTitleEdit,
  onTitleSubmit,
  onSave,
  onTabChange,
}: DesktopSlidePanelsProps) {
  const panelRef = useRef<PanelImperativeHandle>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

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
      <SlideTopBar
        isCollapsed={isCollapsed}
        isEditingTitle={isEditingTitle}
        isPending={isPending}
        onSave={onSave}
        onTitleChange={onTitleChange}
        onTitleEdit={onTitleEdit}
        onTitleSubmit={onTitleSubmit}
        onToggleCollapse={toggleCollapse}
        slide={slide}
        titleValue={titleValue}
      />

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
                <EditorTabs
                  currentTab={currentTab}
                  onTabChange={onTabChange}
                  onToggleCollapse={toggleCollapse}
                  slideId={slideId}
                />
              </div>
            )}
          </Panel>
        </Group>
      </div>
    </main>
  )
}
