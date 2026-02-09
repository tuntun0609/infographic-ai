'use client'

import { PanelRightClose } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AIGenerator } from './editor/ai-generator'
import { InfographicEditor } from './editor/infographic-editor'

interface EditorTabsProps {
  slideId: string
  currentTab: 'editor' | 'ai'
  onTabChange: (tab: 'editor' | 'ai') => void
  onToggleCollapse: () => void
}

export function EditorTabs({
  slideId,
  currentTab,
  onTabChange,
  onToggleCollapse,
}: EditorTabsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleTabChange = (value: string) => {
    const nextTab = value === 'ai' ? 'ai' : 'editor'
    onTabChange(nextTab)

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

  return (
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
          onClick={onToggleCollapse}
          size="icon"
          variant="ghost"
        >
          <PanelRightClose className="h-3.5 w-3.5" />
        </Button>
      </div>
      <TabsContent className="min-h-0 flex-1" keepMounted value="editor">
        <InfographicEditor slideId={slideId} />
      </TabsContent>
      <TabsContent className="min-h-0 flex-1" keepMounted value="ai">
        <AIGenerator slideId={slideId} />
      </TabsContent>
    </Tabs>
  )
}
