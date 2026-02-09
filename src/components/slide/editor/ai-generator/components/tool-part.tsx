import { useTranslations } from 'next-intl'
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool'
import { toolTitleKeys } from '../constants'
import type { ChatMessage, ToolState, ToolType } from '../types'

interface ToolPartProps {
  part: ChatMessage['parts'][number]
}

export function ToolPart({ part }: ToolPartProps) {
  const t = useTranslations('aiGenerator')

  // 检查是否是工具调用相关的 part
  if (!part.type.startsWith('tool-')) {
    return null
  }

  // 提取工具名称（去掉 'tool-' 前缀）
  const toolName = part.type.replace('tool-', '')
  const toolPart = part as {
    type: string
    toolCallId: string
    state: string
    input?: unknown
    output?: unknown
    errorText?: string
  }

  // 获取工具标题的翻译键
  const titleKey = toolTitleKeys[toolName]
  const title = titleKey ? t(titleKey) : toolName

  return (
    <Tool key={toolPart.toolCallId}>
      <ToolHeader
        state={toolPart.state as ToolState}
        title={title}
        type={part.type as ToolType}
      />
      <ToolContent>
        {toolPart.input !== undefined && toolPart.input !== null && (
          <ToolInput input={toolPart.input} />
        )}
        {(toolPart.output !== undefined || toolPart.errorText) && (
          <ToolOutput errorText={toolPart.errorText} output={toolPart.output} />
        )}
      </ToolContent>
    </Tool>
  )
}
