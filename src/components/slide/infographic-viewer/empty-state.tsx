'use client'

import { useTranslations } from 'next-intl'

interface EmptyStateProps {
  slideId: string
  isEmptyContent: boolean
}

export function EmptyState({ slideId, isEmptyContent }: EmptyStateProps) {
  const t = useTranslations('slideViewer')
  if (isEmptyContent) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="text-muted-foreground">
          <svg
            aria-label={t('emptyInfographic')}
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>{t('emptyInfographic')}</title>
            <path
              d="M3.75 3v18h16.5V3H3.75zM3.75 3h16.5M3.75 3v18M20.25 3v18M9 9h6M9 15h6M9 12h6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-sm">{t('emptyInfographic')}</h3>
          <p className="text-muted-foreground text-sm">
            {t('emptyInfographicDesc')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <p className="font-medium text-muted-foreground">
        {t('infographicDisplayArea')}
      </p>
      <p className="mt-1 text-muted-foreground text-xs">Slide ID: {slideId}</p>
      <p className="mt-2 text-muted-foreground text-xs">
        {t('selectInfographicToEdit')}
      </p>
    </div>
  )
}
