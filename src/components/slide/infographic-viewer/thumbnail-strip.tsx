'use client'

import { Infographic } from '@antv/infographic'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Reorder, useDragControls } from 'motion/react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Infographic as InfographicType } from '@/lib/slide-schema'

interface ThumbnailStripProps {
  infographics: InfographicType[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (newOrder: string[]) => void
}

interface ThumbnailCache {
  content: string
  dataUrl: string
}

// Schedule work via requestIdleCallback with fallback
const scheduleIdle =
  typeof requestIdleCallback !== 'undefined'
    ? requestIdleCallback
    : (cb: () => void) => setTimeout(cb, 1) as unknown as number
const cancelIdle =
  typeof cancelIdleCallback !== 'undefined'
    ? cancelIdleCallback
    : (id: number) => clearTimeout(id)

export function ThumbnailStrip({
  infographics,
  selectedId,
  onSelect,
  onReorder,
}: ThumbnailStripProps) {
  const { resolvedTheme } = useTheme()
  const [thumbnails, setThumbnails] = useState<Map<string, ThumbnailCache>>(
    new Map()
  )
  const [generating, setGenerating] = useState<Set<string>>(new Set())
  const [collapsed, setCollapsed] = useState(false)
  const queueRef = useRef<InfographicType[]>([])
  const isProcessingRef = useRef(false)
  const offscreenRef = useRef<HTMLDivElement | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null)

  // IDs for reorder
  const ids = infographics.map((i) => i.id)
  const [dragOrder, setDragOrder] = useState<string[] | null>(null)
  const displayIds = dragOrder ?? ids

  useEffect(() => {
    setDragOrder(null)
  }, [infographics.length])

  const displayInfographics = displayIds
    .map((id) => infographics.find((i) => i.id === id))
    .filter((i): i is InfographicType => !!i)

  // Generate thumbnail for a single infographic
  const generateThumbnail = useCallback(
    async (
      info: InfographicType,
      container: HTMLDivElement
    ): Promise<string | null> => {
      if (!info.content || info.content.trim() === '') {
        return null
      }

      try {
        container.innerHTML = ''

        const infographic = new Infographic({
          container,
          width: 160,
          height: 90,
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        })

        infographic.render(info.content)

        // Minimal wait — just yield to let the render flush
        await new Promise((resolve) => setTimeout(resolve, 50))

        const dataUrl = await infographic.toDataURL({
          type: 'png',
          dpr: 1,
        })

        infographic.destroy()
        return dataUrl
      } catch (error) {
        console.error(`Failed to generate thumbnail for ${info.id}:`, error)
        return null
      }
    },
    [resolvedTheme]
  )

  // Process the generation queue using idle callbacks
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || !offscreenRef.current) {
      return
    }
    isProcessingRef.current = true

    while (queueRef.current.length > 0) {
      const info = queueRef.current.shift()!
      setGenerating((prev) => new Set(prev).add(info.id))

      // Yield to main thread between items
      await new Promise<void>((resolve) => {
        const id = scheduleIdle(() => resolve())
        setTimeout(() => {
          cancelIdle(id as number)
          resolve()
        }, 300)
      })

      const dataUrl = await generateThumbnail(info, offscreenRef.current)

      if (dataUrl) {
        setThumbnails((prev) => {
          const next = new Map(prev)
          next.set(info.id, { content: info.content, dataUrl })
          return next
        })
      }

      setGenerating((prev) => {
        const next = new Set(prev)
        next.delete(info.id)
        return next
      })
    }

    isProcessingRef.current = false
  }, [generateThumbnail])

  // Queue thumbnails with debounce — prioritize selected page
  const queueThumbnails = useCallback(() => {
    const toGenerate: InfographicType[] = []

    for (const info of infographics) {
      if (!info.content || info.content.trim() === '') {
        continue
      }
      const cached = thumbnails.get(info.id)
      if (!cached || cached.content !== info.content) {
        toGenerate.push(info)
      }
    }

    if (toGenerate.length > 0) {
      if (selectedId) {
        const selectedIdx = toGenerate.findIndex((i) => i.id === selectedId)
        if (selectedIdx > 0) {
          const [selected] = toGenerate.splice(selectedIdx, 1)
          toGenerate.unshift(selected)
        }
      }
      queueRef.current = toGenerate
      processQueue()
    }
  }, [infographics, thumbnails, processQueue, selectedId])

  useEffect(() => {
    clearTimeout(debounceTimerRef.current!)

    debounceTimerRef.current = setTimeout(() => {
      queueThumbnails()
    }, 300)

    return () => clearTimeout(debounceTimerRef.current!)
  }, [queueThumbnails])

  // Re-generate all thumbnails when theme changes
  useEffect(() => {
    setThumbnails(new Map())
  }, [resolvedTheme])

  const handleReorder = useCallback((newOrder: string[]) => {
    setDragOrder(newOrder)
  }, [])

  const commitReorder = useCallback(() => {
    if (dragOrder) {
      onReorder(dragOrder)
      setDragOrder(null)
    }
  }, [dragOrder, onReorder])

  // --- Collapsed view ---
  if (collapsed) {
    return (
      <div className="flex h-full w-10 flex-col items-center rounded-lg border bg-card shadow-xs">
        <div className="flex h-10 w-full items-center justify-center border-b">
          <Button
            className="h-7 w-7"
            onClick={() => setCollapsed(false)}
            size="icon"
            variant="ghost"
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-2">
          {ids.map((id, index) => (
            <button
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded font-medium text-[11px] transition-colors ${
                id === selectedId
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              key={id}
              onClick={() => onSelect(id)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // --- Expanded view ---
  return (
    <div className="flex h-full w-[130px] flex-col rounded-lg border bg-card shadow-xs">
      {/* Offscreen container for rendering thumbnails */}
      <div
        ref={offscreenRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '160px',
          height: '90px',
          overflow: 'hidden',
        }}
      />

      {/* Header */}
      <div className="flex h-10 items-center justify-end border-b px-1.5">
        <Button
          className="h-7 w-7 shrink-0"
          onClick={() => setCollapsed(true)}
          size="icon"
          variant="ghost"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Thumbnail list */}
      <div className="flex-1 overflow-y-auto p-1.5">
        <Reorder.Group
          as="div"
          axis="y"
          className="flex flex-col gap-1.5"
          onReorder={handleReorder}
          values={displayIds}
        >
          {displayIds.map((id, index) => {
            const info = displayInfographics[index]
            if (!info) {
              return null
            }
            const cached = thumbnails.get(id)
            const isSelected = id === selectedId
            const isGenerating = generating.has(id)
            const isEmpty = !info.content || info.content.trim() === ''

            return (
              <ThumbnailItem
                dataUrl={cached?.dataUrl}
                id={id}
                index={index}
                isEmpty={isEmpty}
                isGenerating={isGenerating}
                isSelected={isSelected}
                key={id}
                onCommit={commitReorder}
                onSelect={onSelect}
              />
            )
          })}
        </Reorder.Group>
      </div>
    </div>
  )
}

interface ThumbnailItemProps {
  id: string
  index: number
  isSelected: boolean
  isGenerating: boolean
  isEmpty: boolean
  dataUrl?: string
  onSelect: (id: string) => void
  onCommit: () => void
}

function ThumbnailItem({
  id,
  index,
  isSelected,
  isGenerating,
  isEmpty,
  dataUrl,
  onSelect,
  onCommit,
}: ThumbnailItemProps) {
  const controls = useDragControls()

  return (
    <Reorder.Item
      as="div"
      className="shrink-0"
      dragControls={controls}
      dragListener={false}
      onDragEnd={onCommit}
      value={id}
    >
      <button
        className={`group relative w-full cursor-pointer overflow-hidden rounded-md border transition-all ${
          isSelected
            ? 'border-primary shadow-sm ring-1 ring-primary/30'
            : 'border-border hover:border-muted-foreground/40'
        }`}
        onClick={() => onSelect(id)}
        onPointerDown={(e) => controls.start(e)}
        type="button"
      >
        {/* Page number badge */}
        <div className="absolute top-0.5 left-0.5 z-10 flex h-4 min-w-4 items-center justify-center rounded-sm bg-black/50 px-0.5 font-medium text-[9px] text-white">
          {index + 1}
        </div>

        {/* Thumbnail content */}
        <div className="aspect-video w-full overflow-hidden rounded-[5px] bg-muted">
          {isEmpty && (
            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
              Empty
            </div>
          )}
          {!isEmpty && isGenerating && (
            <div className="h-full w-full animate-pulse bg-muted" />
          )}
          {!(isEmpty || isGenerating || dataUrl) && (
            <div className="h-full w-full animate-pulse bg-muted" />
          )}
          {!(isEmpty || isGenerating) && dataUrl && (
            <img
              alt={`Page ${index + 1}`}
              className="h-full w-full object-contain"
              draggable={false}
              height={90}
              src={dataUrl}
              width={160}
            />
          )}
        </div>
      </button>
    </Reorder.Item>
  )
}
