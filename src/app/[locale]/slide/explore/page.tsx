import { and, desc, eq, ilike } from 'drizzle-orm'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ExploreList } from '@/components/slide/explore/explore-list'
import { db } from '@/db'
import { slide, user } from '@/db/schema'
import { getSession } from '@/lib/auth'

const PAGE_SIZE = 12

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('explore')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  const params = await searchParams
  const page = Number.parseInt(params.page || '1', 10)
  const currentPage = page > 0 ? page : 1
  const offset = (currentPage - 1) * PAGE_SIZE
  const searchQuery = params.search?.trim() || ''

  const whereClause = searchQuery
    ? and(eq(slide.published, true), ilike(slide.title, `%${searchQuery}%`))
    : eq(slide.published, true)

  const totalCount = await db.$count(slide, whereClause)

  const slides = await db
    .select({
      id: slide.id,
      title: slide.title,
      infographics: slide.infographics,
      published: slide.published,
      createdAt: slide.createdAt,
      updatedAt: slide.updatedAt,
      userId: slide.userId,
      userName: user.name,
      userImage: user.image,
    })
    .from(slide)
    .innerJoin(user, eq(slide.userId, user.id))
    .where(whereClause)
    .orderBy(desc(slide.updatedAt))
    .limit(PAGE_SIZE)
    .offset(offset)

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ExploreList
        currentPage={currentPage}
        slides={slides}
        totalCount={totalCount}
        totalPages={totalPages}
      />
    </div>
  )
}
