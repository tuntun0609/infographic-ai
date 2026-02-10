import { and, asc, desc, eq, ilike } from 'drizzle-orm'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { SlideList } from '@/components/slide/list/slide-list'
import { db } from '@/db'
import { slide } from '@/db/schema'
import { getSession } from '@/lib/auth'

const PAGE_SIZE = 12

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('slide')
  return {
    title: t('mySlides'),
    description: t('editInInfographicAI'),
  }
}

export default async function SlidePage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    search?: string
    sort?: string
    view?: string
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
  const sort = params.sort || 'updatedAt'
  const view = params.view || 'card'

  // 构建查询条件
  const whereClause = searchQuery
    ? and(
        eq(slide.userId, session.user.id),
        ilike(slide.title, `%${searchQuery}%`)
      )
    : eq(slide.userId, session.user.id)

  // 构建排序条件
  const orderByClause = (() => {
    switch (sort) {
      case 'createdAt':
        return desc(slide.createdAt)
      case 'titleAsc':
        return asc(slide.title)
      case 'titleDesc':
        return desc(slide.title)
      default:
        return desc(slide.updatedAt)
    }
  })()

  // 获取当前用户的 slides 总数（带搜索条件）
  const totalCount = await db.$count(slide, whereClause)

  // 获取当前页的 slides（带搜索条件）
  const slides = await db
    .select()
    .from(slide)
    .where(whereClause)
    .orderBy(orderByClause)
    .limit(PAGE_SIZE)
    .offset(offset)

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SlideList
        currentPage={currentPage}
        slides={slides}
        sort={sort}
        totalCount={totalCount}
        totalPages={totalPages}
        view={view}
      />
    </div>
  )
}
