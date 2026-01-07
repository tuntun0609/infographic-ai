'use client'

import { Infographic } from '@antv/infographic'
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'
import { selectedInfographicAtom } from '@/store/slide-store'

interface InfographicViewerProps {
  slideId: string
}

export function InfographicViewer({ slideId }: InfographicViewerProps) {
  const selectedInfographic = useAtomValue(selectedInfographicAtom)
  const containerRef = useRef<HTMLDivElement>(null)
  const infographicInstanceRef = useRef<Infographic | null>(null)

  useEffect(() => {
    if (!(selectedInfographic?.content && containerRef.current)) {
      // 清理之前的实例
      if (infographicInstanceRef.current) {
        infographicInstanceRef.current.destroy()
        infographicInstanceRef.current = null
      }
      return
    }

    try {
      // 清理之前的实例
      if (infographicInstanceRef.current) {
        infographicInstanceRef.current.destroy()
        infographicInstanceRef.current = null
      }

      // 清空容器
      containerRef.current.innerHTML = ''

      // 创建 Infographic 实例，直接传入语法字符串
      const infographic = new Infographic({
        container: containerRef.current,
        width: '100%',
        height: '100%',
      })

      // 使用字符串渲染
      infographic.render(selectedInfographic.content)

      // 保存实例引用
      infographicInstanceRef.current = infographic
    } catch (error) {
      console.error('Failed to render infographic:', error)
      // 显示错误信息
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #ef4444;">
            <p style="font-weight: 500; margin-bottom: 8px;">渲染错误</p>
            <p style="font-size: 12px; color: #6b7280;">${error instanceof Error ? error.message : '未知错误'}</p>
          </div>
        `
      }
    }

    // 清理函数
    return () => {
      if (infographicInstanceRef.current) {
        infographicInstanceRef.current.destroy()
        infographicInstanceRef.current = null
      }
    }
  }, [selectedInfographic?.content])

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted/50">
        {selectedInfographic ? (
          <div className="relative h-full w-full">
            <div
              className="h-full w-full"
              ref={containerRef}
              style={{ minHeight: '400px' }}
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="font-medium text-muted-foreground">信息图展示区域</p>
            <p className="mt-1 text-muted-foreground text-xs">
              Slide ID: {slideId}
            </p>
            <p className="mt-2 text-muted-foreground text-xs">
              请选择一个信息图进行编辑
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
