'use client'

import { Infographic } from '@antv/infographic'
import { useTheme } from 'next-themes'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

interface InfographicRendererProps {
  content: string
  isEmptyContent: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}

export interface InfographicRendererRef {
  getInstance: () => Infographic | null
}

export const InfographicRenderer = forwardRef<
  InfographicRendererRef,
  InfographicRendererProps
>(function InfographicRenderer({ content, isEmptyContent, containerRef }, ref) {
  const infographicInstanceRef = useRef<Infographic | null>(null)
  const { resolvedTheme } = useTheme()

  // 暴露 Infographic 实例给父组件
  useImperativeHandle(ref, () => ({
    getInstance: () => infographicInstanceRef.current,
  }))

  // 清理 Infographic 实例
  const cleanupInfographic = useCallback(() => {
    if (infographicInstanceRef.current) {
      infographicInstanceRef.current.destroy()
      infographicInstanceRef.current = null
    }
  }, [])

  // 渲染 Infographic（只在内容变化时渲染一次）
  const renderInfographic = useCallback(
    (contentToRender: string, options: { theme: 'dark' | 'light' }) => {
      if (!containerRef.current) {
        return
      }

      cleanupInfographic()
      containerRef.current.innerHTML = ''

      try {
        // 创建 Infographic 实例，使用 100% 宽度和高度，让 SVG 自适应容器
        const infographic = new Infographic({
          container: containerRef.current,
          width: '100%',
          height: '100%',
          theme: options.theme,
        })

        // 使用字符串渲染
        infographic.render(contentToRender)

        // 保存实例引用
        infographicInstanceRef.current = infographic
      } catch (error) {
        console.error('Failed to render infographic:', error)
        // 显示错误信息
        if (containerRef.current) {
          const errorMessage =
            error instanceof Error ? error.message : '未知错误'
          containerRef.current.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #ef4444;">
            <p style="font-weight: 500; margin-bottom: 8px;">渲染错误</p>
            <p style="font-size: 12px; color: #6b7280;">${errorMessage}</p>
          </div>
        `
        }
      }
    },
    [cleanupInfographic, containerRef.current]
  )

  // 在内容或主题变化时重新渲染
  useEffect(() => {
    if (!(content && containerRef.current && !isEmptyContent)) {
      cleanupInfographic()
      return
    }

    // 延迟渲染以确保容器已挂载
    const timer = setTimeout(() => {
      renderInfographic(content, {
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      })
    }, 0)

    return () => {
      clearTimeout(timer)
      cleanupInfographic()
    }
  }, [
    content,
    isEmptyContent,
    resolvedTheme, // 添加主题依赖，主题变化时重新渲染
    cleanupInfographic,
    renderInfographic,
    containerRef.current,
  ])

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="h-full w-full bg-background" ref={containerRef} />
    </div>
  )
})
