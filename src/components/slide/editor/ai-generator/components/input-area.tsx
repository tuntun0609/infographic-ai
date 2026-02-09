import { useTranslations } from 'next-intl'
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'

interface InputAreaProps {
  status: string
  isLoading: boolean
  onSubmit: (message: PromptInputMessage) => void
}

export function InputArea({ status, isLoading, onSubmit }: InputAreaProps) {
  const t = useTranslations('aiGenerator')

  // 获取输入框的 placeholder 文本
  function getPlaceholder(status: string) {
    if (status === 'error') {
      return t('errorPlaceholder')
    }
    return t('placeholder')
  }

  // 将 status 转换为 PromptInputSubmit 需要的格式
  function getSubmitStatus(status: string) {
    if (status === 'streaming') {
      return 'streaming'
    }
    if (status === 'submitted') {
      return 'submitted'
    }
    if (status === 'error') {
      return 'error'
    }
    return undefined
  }

  return (
    <div className="border-t bg-background p-3 sm:p-4">
      <PromptInput onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            disabled={isLoading}
            placeholder={getPlaceholder(status)}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <div />
          <PromptInputSubmit status={getSubmitStatus(status)} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
}
