'use client'

import { LayoutTemplate, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreate: () => void
  isPending: boolean
}

export function EmptyState({ onCreate, isPending }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-4"
        initial={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex size-20 items-center justify-center rounded-3xl bg-muted/30">
          <LayoutTemplate className="size-10 text-muted-foreground/50" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-lg">开始你的创作</h3>
          <p className="max-w-xs text-muted-foreground text-sm">
            创建一个新的演示文稿，开始你的精彩演讲。
          </p>
        </div>
        <Button
          className="mt-4 rounded-full px-8"
          disabled={isPending}
          onClick={onCreate}
        >
          <Plus className="mr-2 size-4" />
          新建演示
        </Button>
      </motion.div>
    </div>
  )
}
