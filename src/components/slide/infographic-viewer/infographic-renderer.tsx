'use client'

import { Infographic } from '@antv/infographic'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('slideViewer')
  const infographicInstanceRef = useRef<Infographic | null>(null)
  const previousThemeRef = useRef<'dark' | 'light' | null>(null)
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
    previousThemeRef.current = null
  }, [])

  // 渲染或更新 Infographic
  const renderInfographic = useCallback(
    (contentToRender: string, options: { theme: 'dark' | 'light' }) => {
      if (!containerRef.current) {
        return
      }

      try {
        // 如果实例已存在，使用 update 方法更新
        if (infographicInstanceRef.current) {
          // 如果主题变化了，先更新主题，再更新内容
          if (previousThemeRef.current !== options.theme) {
            infographicInstanceRef.current.update({
              theme: options.theme,
            })
          }
          // 更新内容（字符串会被解析为 DSL）
          infographicInstanceRef.current.update(contentToRender)
          previousThemeRef.current = options.theme
          return
        }

        // 如果实例不存在，创建新实例并渲染
        containerRef.current.innerHTML = ''

        const infographic = new Infographic({
          container: containerRef.current,
          width: '100%',
          height: '100%',
          theme: options.theme,
        })

        // 使用字符串渲染
        infographic.render(contentToRender)

        // 保存实例引用和主题
        infographicInstanceRef.current = infographic
        previousThemeRef.current = options.theme
      } catch (error) {
        console.error('Failed to render infographic:', error)
        // 显示错误信息
        if (containerRef.current) {
          const errorMessage =
            error instanceof Error ? error.message : t('unknownError')
          containerRef.current.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #ef4444;">
            <p style="font-weight: 500; margin-bottom: 8px;">${t('renderError')}</p>
            <p style="font-size: 12px; color: #6b7280;">${errorMessage}</p>
          </div>
        `
        }
      }
    },
    [containerRef, t]
  )

  // 在内容或主题变化时渲染或更新
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
    }
  }, [
    content,
    isEmptyContent,
    resolvedTheme, // 添加主题依赖，主题变化时更新
    renderInfographic,
    cleanupInfographic,
    containerRef,
  ])

  // 组件卸载时清理实例
  useEffect(() => {
    return cleanupInfographic
  }, [cleanupInfographic])

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="h-full w-full bg-background" ref={containerRef} />
    </div>
  )
})
