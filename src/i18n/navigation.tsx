import { createNavigation } from 'next-intl/navigation'
import type { ComponentProps } from 'react'

import { routing } from './routing'

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
const {
  Link: BaseLink,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing)

// 默认禁用 prefetch 的 Link 组件
function Link(props: ComponentProps<typeof BaseLink>) {
  return <BaseLink prefetch={false} {...props} />
}

export { Link, redirect, usePathname, useRouter, getPathname }
