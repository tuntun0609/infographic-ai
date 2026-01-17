'use client'

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Plus,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DeleteDialog } from './delete-dialog'

interface ToolbarProps {
  currentIndex: number
  totalCount: number
  isEmptyContent: boolean
  isFullscreen: boolean
  onPrevious: () => void
  onNext: () => void
  onAddSlide: () => void
  onDeleteSlide: () => void
  onDownload: () => void
  onFullscreen: () => void
  onJumpTo: (index: number) => void
}

export function Toolbar({
  currentIndex,
  totalCount,
  isEmptyContent,
  isFullscreen,
  onPrevious,
  onNext,
  onAddSlide,
  onDeleteSlide,
  onDownload,
  onFullscreen,
  onJumpTo,
}: ToolbarProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (totalCount <= 1) {
      return
    }
    setIsEditing(true)
    setInputValue(String(currentIndex))
    // 使用 setTimeout 确保 DOM 更新后再聚焦
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const handleBlur = () => {
    setIsEditing(false)
    const pageNum = Number.parseInt(inputValue, 10)
    if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= totalCount) {
      onJumpTo(pageNum)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setInputValue(String(currentIndex))
    }
  }

  return (
    <div className="flex shrink-0 items-center justify-center gap-2 border-t bg-background p-2 shadow-sm">
      <div className="flex items-center gap-2 rounded-lg bg-background p-2">
        {/* 切换器 */}
        {totalCount > 1 && (
          <>
            <Button
              onClick={onPrevious}
              size="icon-sm"
              title="上一个"
              variant="ghost"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  className="h-7 w-12 px-2 text-center text-sm"
                  max={totalCount}
                  min={1}
                  onBlur={handleBlur}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  ref={inputRef}
                  type="number"
                  value={inputValue}
                />
                <span className="text-muted-foreground text-sm">
                  / {totalCount}
                </span>
              </div>
            ) : (
              <button
                className="cursor-pointer px-3 py-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                onClick={handleClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClick()
                  }
                }}
                title="点击跳转到指定页面"
                type="button"
              >
                {currentIndex} / {totalCount}
              </button>
            )}
            <Button
              onClick={onNext}
              size="icon-sm"
              title="下一个"
              variant="ghost"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        {/* 分割线 */}
        {totalCount > 1 && <div className="h-6 w-px bg-border" />}
        {/* 新增 slide 按钮 */}
        <Button
          onClick={onAddSlide}
          size="icon-sm"
          title="新增 slide"
          variant="ghost"
        >
          <Plus className="h-4 w-4" />
        </Button>
        {/* 删除 slide 按钮 */}
        <DeleteDialog onDelete={onDeleteSlide} />
        {/* 分割线 */}
        <div className="h-6 w-px bg-border" />
        {/* 工具按钮 */}
        <Button
          disabled={isEmptyContent}
          onClick={onDownload}
          size="icon-sm"
          title="下载"
          variant="ghost"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          onClick={onFullscreen}
          size="icon-sm"
          title={isFullscreen ? '退出全屏' : '全屏'}
          variant="ghost"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
