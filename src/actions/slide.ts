'use server'

import { nanoid } from 'nanoid'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { slide } from '@/db/schema'
import { getSession } from '@/lib/auth'

export async function createSlide() {
  const session = await getSession()
  if (!session?.user) {
    redirect('/login')
  }

  const newSlide = {
    id: nanoid(),
    userId: session.user.id,
    title: '未命名 Slide',
    infographics: [],
  }

  await db.insert(slide).values(newSlide)
  redirect(`/slide/${newSlide.id}`)
}
