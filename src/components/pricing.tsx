'use client'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

export default function Pricing() {
  const t = useTranslations('pricing')

  return (
    <section className="py-16 md:py-32" id="pricing">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center font-semibold text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <p>{t('description')}</p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
          <div className="flex flex-col justify-between space-y-8 rounded-lg border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
            <div className="space-y-4">
              <div>
                <h2 className="font-medium">{t('free.planName')}</h2>
                <span className="my-3 block font-semibold text-2xl">
                  {t('free.price')}
                </span>
                <p className="text-muted-foreground text-sm">
                  {t('free.perEditor')}
                </p>
              </div>

              <Button
                className="w-full"
                nativeButton={false}
                render={<Link href="/slide" />}
                variant="outline"
              >
                {t('getStarted')}
              </Button>

              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  t('free.features.createSlide'),
                  t('free.features.infographicEditor'),
                  t('free.features.aiAssisted'),
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border p-6 shadow-gray-950/5 shadow-lg md:col-span-3 lg:p-10 dark:bg-muted dark:[--color-muted:var(--color-zinc-900)]">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">{t('pro.planName')}</h2>
                  <span className="my-3 block font-semibold text-2xl">
                    {t('pro.price')}
                  </span>
                  <p className="text-muted-foreground text-sm">
                    {t('pro.perEditor')}
                  </p>
                </div>

                <Button
                  className="w-full"
                  disabled
                  nativeButton={false}
                  render={<Link href="" />}
                >
                  {t('comingSoon')}
                </Button>
              </div>

              <div>
                <div className="font-medium text-sm">
                  {t('pro.everythingInFreePlus')}
                </div>

                <ul className="mt-4 list-outside space-y-3 text-sm">
                  {[
                    t('pro.features.betterAIModel'),
                    t('pro.features.fileUpload'),
                  ].map((item, index) => (
                    <li className="flex items-center gap-2" key={index}>
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
