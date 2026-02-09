import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getSession } from '@/lib/auth'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('explore')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ExplorePage() {
  const t = await getTranslations('explore')
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-4xl">{t('comingSoon')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('workingOnSomething')}
        </p>
      </div>
    </div>
  )
}
