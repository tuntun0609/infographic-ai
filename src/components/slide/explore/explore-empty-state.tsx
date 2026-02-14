'use client'

import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

export function ExploreEmptyState() {
  const t = useTranslations('explore.emptyState')

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-3 sm:gap-4"
        initial={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex size-16 items-center justify-center rounded-3xl bg-muted/30 sm:size-20">
          <Search className="size-8 text-muted-foreground/50 sm:size-10" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-base sm:text-lg">{t('title')}</h3>
          <p className="max-w-xs text-muted-foreground text-xs sm:text-sm">
            {t('description')}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
