import { cookies } from 'next/headers'
import type { Layout } from 'react-resizable-panels'
import { SlidePanels } from '@/components/slide/slide-panels'
import { JotaiProvider } from '@/components/slide/slide-provider'
import { RESIZABLE_PANELS_COOKIE_NAME } from '@/type'

export default async function SlideIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const api = await cookies()

  const defaultLayoutString = api.get(RESIZABLE_PANELS_COOKIE_NAME)?.value
  const defaultLayout = defaultLayoutString
    ? (JSON.parse(defaultLayoutString) as Layout)
    : undefined

  return (
    <JotaiProvider>
      <SlidePanels defaultLayout={defaultLayout} slideId={id} />
    </JotaiProvider>
  )
}
