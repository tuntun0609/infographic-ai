'use client'

import { useAtom } from 'jotai'
import { Textarea } from '@/components/ui/textarea'
import {
  editingInfographicContentAtom,
  selectedInfographicIdAtom,
  updateInfographicContentAtom,
} from '@/store/slide-store'

interface InfographicEditorProps {
  slideId: string
}

export function InfographicEditor({ slideId }: InfographicEditorProps) {
  const [content, setContent] = useAtom(editingInfographicContentAtom)
  const [selectedId] = useAtom(selectedInfographicIdAtom)
  const [, updateInfographicContent] = useAtom(updateInfographicContentAtom)

  const handleContentChange = (value: string) => {
    setContent(value)
    if (selectedId) {
      updateInfographicContent({ infographicId: selectedId, content: value })
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="space-y-2">
        <h3 className="font-medium text-sm">AntV Infographic 语法</h3>
        <Textarea
          className="min-h-[400px] resize-none font-mono text-xs"
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="在这里输入信息图语法..."
          value={content}
        />
      </div>
      <div className="flex-1" />
      <div className="text-[10px] text-muted-foreground italic">
        编辑器支持 AntV Infographic 语法 {slideId}
      </div>
    </div>
  )
}
