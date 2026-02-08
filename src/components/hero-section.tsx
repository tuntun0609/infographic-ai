import {
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  MousePointer,
  Play,
  Sparkles,
  Star,
} from 'lucide-react'
import type { Variants } from 'motion'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const features = [
  {
    icon: Eye,
    title: 'Real-time Preview',
    description:
      'See your changes instantly as the AI integrates your data. No loading bars, just instant visual feedback.',
  },
  {
    icon: Sparkles,
    title: 'AI-Driven Edits',
    description:
      'Ask for changes in plain English like "make it pop" or "use warmer colors" and watch the magic happen.',
  },
  {
    icon: MousePointer,
    title: 'Precise Control',
    description:
      'AI does the heavy lifting, but you stay in control. Fine-tune every pixel manually when you need absolute perfection.',
  },
]

const testimonials = [
  {
    quote:
      'This tool saved me hours on my last quarterly presentation. The AI understands context surrounding each.',
    name: 'Sarah Jenkins',
    title: 'Product Designer at Stripe',
    avatar: 'SJ',
  },
  {
    quote:
      'Finally, a design tool that actually helps me visualize complex data without needing a PhD in statistics.',
    name: 'Mike T.',
    title: 'Data Analyst at Google',
    avatar: 'MT',
  },
  {
    quote:
      'The drag and drop interface combined with AI suggestions makes this the fastest tool at my arsenal.',
    name: 'Elena Rodriguez',
    title: 'Marketing Dir.',
    avatar: 'ER',
  },
]

const footerLinks = {
  product: [
    { name: 'Platform', href: '#' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Templates', href: '#' },
    { name: 'Integrations', href: '#' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Help Center', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
}

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        {/* ===== Hero Section ===== */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
          {/* Background decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -top-40 -right-40 size-[600px] rounded-full bg-purple-100/50 blur-3xl dark:bg-purple-900/20" />
            <div className="absolute -bottom-40 -left-40 size-[400px] rounded-full bg-violet-100/30 blur-3xl dark:bg-violet-900/15" />
          </div>

          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Content */}
              <div>
                <AnimatedGroup variants={transitionVariants as Variants}>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm">
                    <Sparkles className="size-4" />
                    <span>v2.0 is here</span>
                  </div>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={
                    {
                      container: {
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.2,
                          },
                        },
                      },
                      ...transitionVariants,
                    } as Variants
                  }
                >
                  <h1 className="mt-8 font-bold text-5xl text-foreground tracking-tight md:text-6xl lg:text-7xl">
                    Design
                    <br />
                    Infographics
                    <br />
                    with{' '}
                    <span className="bg-linear-to-r from-purple-600 to-violet-400 bg-clip-text text-transparent dark:from-purple-400 dark:to-violet-300">
                      Intelligent AI
                    </span>
                  </h1>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={
                    {
                      container: {
                        visible: {
                          transition: { delayChildren: 0.4 },
                        },
                      },
                      ...transitionVariants,
                    } as Variants
                  }
                >
                  <p className="mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed">
                    Transform raw data into stunning visual art instantly. The
                    world&apos;s first AI-powered infographic engine that gives
                    you precise control over every pixel.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  className="mt-10 flex flex-wrap items-center gap-4"
                  variants={
                    {
                      container: {
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.6,
                          },
                        },
                      },
                      ...transitionVariants,
                    } as Variants
                  }
                >
                  <Button
                    className="rounded-xl px-6 text-base"
                    key="cta-primary"
                    nativeButton={false}
                    render={<Link href="/slide" />}
                    size="lg"
                  >
                    <Sparkles className="mr-2 size-4" />
                    <span>Start Creating Free</span>
                  </Button>
                  <Button
                    className="rounded-xl px-6 text-base"
                    key="cta-demo"
                    nativeButton={false}
                    render={<Link href="/slide/explore" />}
                    size="lg"
                    variant="outline"
                  >
                    <Play className="mr-2 size-4" />
                    <span>View Demo</span>
                  </Button>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={
                    {
                      container: {
                        visible: {
                          transition: { delayChildren: 0.8 },
                        },
                      },
                      ...transitionVariants,
                    } as Variants
                  }
                >
                  <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
                    <span>Trusted by design teams at:</span>
                    <span className="font-semibold text-foreground">ACME</span>
                    <span className="font-semibold text-foreground">
                      GlobalTech
                    </span>
                    <span className="font-semibold text-foreground">
                      NexGen
                    </span>
                  </div>
                </AnimatedGroup>
              </div>

              {/* Right - Hero Visual */}
              <AnimatedGroup
                className="relative hidden lg:block"
                variants={{
                  container: {
                    visible: {
                      transition: { delayChildren: 0.5 },
                    },
                  },
                  item: {
                    hidden: { opacity: 0, scale: 0.95, y: 20 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        type: 'spring',
                        bounce: 0.3,
                        duration: 2,
                      },
                    },
                  },
                }}
              >
                <div className="relative h-[520px]">
                  {/* Dot pattern */}
                  <div
                    aria-hidden
                    className="absolute top-0 right-0 size-48 opacity-20"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, rgb(139 92 246) 1.5px, transparent 1.5px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* Main infographic card */}
                  <div className="absolute top-12 right-4 bottom-12 left-8 rounded-2xl border bg-background p-6 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded-full bg-red-400" />
                      <div className="size-3 rounded-full bg-yellow-400" />
                      <div className="size-3 rounded-full bg-green-400" />
                      <div className="ml-auto h-3 w-24 rounded-full bg-muted" />
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="h-4 w-40 rounded bg-muted" />
                      <div className="flex gap-3">
                        <div className="h-28 flex-1 rounded-lg bg-linear-to-t from-purple-500/20 to-purple-500/5" />
                        <div className="h-28 flex-1 rounded-lg bg-linear-to-t from-violet-500/30 to-violet-500/5" />
                        <div className="h-28 flex-1 rounded-lg bg-linear-to-t from-fuchsia-500/20 to-fuchsia-500/5" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-20 rounded-lg border bg-muted/30 p-3">
                          <div className="h-2.5 w-16 rounded bg-muted" />
                          <div className="mt-2 h-2 w-full rounded bg-primary/20" />
                          <div className="mt-1.5 h-2 w-3/4 rounded bg-primary/10" />
                        </div>
                        <div className="h-20 rounded-lg border bg-muted/30 p-3">
                          <div className="h-2.5 w-12 rounded bg-muted" />
                          <div className="mt-3 flex items-end gap-1.5">
                            {[60, 80, 45, 90, 70, 55].map((h, i) => (
                              <div
                                className="flex-1 rounded-t bg-primary/30"
                                key={i}
                                style={{ height: `${h * 0.4}px` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2.5 w-full rounded bg-muted" />
                        <div className="h-2.5 w-5/6 rounded bg-muted" />
                      </div>
                    </div>
                  </div>

                  {/* Stats floating card */}
                  <div className="absolute -top-2 right-0 z-10 rounded-xl border bg-background p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="size-4 text-primary" />
                      <span className="text-muted-foreground text-xs">
                        Total Views
                      </span>
                    </div>
                    <div className="mt-1 font-bold text-xl">1.2M Points</div>
                    <div className="mt-2 flex h-6 items-end gap-1">
                      {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
                        <div
                          className="w-2.5 rounded-t bg-primary/40"
                          key={i}
                          style={{ height: `${h * 0.24}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Generation Complete card */}
                  <div className="absolute -bottom-2 left-0 z-10 flex items-center gap-3 rounded-xl border bg-background p-3 pr-5 shadow-lg">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="size-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        Generation Complete
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Your infographic is ready
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>

        {/* ===== Features Section ===== */}
        <section className="py-20 md:py-32" id="features">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
                Powerful AI Features
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Experience the future of design with tools built for speed,
                precision, and creativity.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  className="rounded-2xl border bg-card p-8 transition-shadow duration-300 hover:shadow-lg"
                  key={feature.title}
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-6 font-semibold text-lg">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Interactive Workspace Section ===== */}
        <section className="bg-muted/30 py-20 md:py-32" id="showcase">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Content */}
              <div>
                <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
                  Interactive Workspace
                </h2>
                <p className="mt-2 text-lg text-muted-foreground italic">
                  Designed for modern flow.
                </p>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  A sleek interface designed for modern creators. Drag, drop,
                  and let AI handle the layout, spacing, and hierarchy based on
                  your content context.
                </p>
                <div className="mt-8 space-y-5">
                  <div className="flex gap-4">
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="size-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Smart Layout Engine</div>
                      <div className="mt-0.5 text-muted-foreground text-sm">
                        Automatically adjusts spacing based on content density.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="size-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        Contextual Suggestions
                      </div>
                      <div className="mt-0.5 text-muted-foreground text-sm">
                        AI suggests chart types that best represent your
                        specific dataset.
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  className="mt-8 inline-flex items-center gap-1 font-medium text-primary text-sm hover:underline"
                  href="/slide"
                >
                  Explore the Interface
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              {/* Right - Screenshot */}
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl">
                  <Image
                    alt="Interactive Workspace"
                    className="hidden w-full dark:block"
                    height={1440}
                    src="/mail2.png"
                    width={2700}
                  />
                  <Image
                    alt="Interactive Workspace"
                    className="w-full dark:hidden"
                    height={1440}
                    src="/mail2-light.png"
                    width={2700}
                  />
                </div>
                {/* AI Suggestion overlay */}
                <div className="absolute bottom-4 -left-4 z-10 rounded-xl border bg-background p-4 shadow-lg md:bottom-8 md:-left-8">
                  <div className="flex items-center gap-2 font-medium text-primary text-xs">
                    <Sparkles className="size-3.5" />
                    AI SUGGESTION
                  </div>
                  <p className="mt-2 max-w-[200px] text-muted-foreground text-xs">
                    Try using a bar chart for this dataset to highlight trends
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground text-xs">
                      Apply
                    </span>
                    <span className="rounded-md border px-3 py-1 font-medium text-muted-foreground text-xs">
                      Dismiss
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Testimonials Section ===== */}
        <section className="py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
                  Loved by Creators
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Join thousands of designers streamlining their workflow.
                </p>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <button
                  className="flex size-10 items-center justify-center rounded-full border transition-colors hover:bg-muted"
                  type="button"
                >
                  <ArrowRight className="size-4 rotate-180" />
                </button>
                <button
                  className="flex size-10 items-center justify-center rounded-full border transition-colors hover:bg-muted"
                  type="button"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  className="rounded-2xl border bg-card p-6"
                  key={testimonial.name}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        className="size-4 fill-amber-400 text-amber-400"
                        key={i}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t pt-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA Section ===== */}
        <section className="px-6 pb-20 md:pb-32">
          <div className="mx-auto max-w-4xl rounded-3xl bg-linear-to-br from-primary/5 via-purple-50 to-violet-50 px-8 py-16 text-center md:px-16 dark:from-primary/10 dark:via-purple-950/20 dark:to-violet-950/20">
            <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
              Ready to visualize your data?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join over 50,000 users creating professional infographics in
              minutes, not hours.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                className="rounded-xl px-6"
                nativeButton={false}
                render={<Link href="/slide" />}
                size="lg"
              >
                Get Started for Free
              </Button>
              <Button
                className="rounded-xl px-6"
                nativeButton={false}
                render={<Link href="#" />}
                size="lg"
                variant="outline"
              >
                Contact Sales
              </Button>
            </div>
            <p className="mt-6 text-muted-foreground text-xs">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
              {/* Brand */}
              <div className="lg:col-span-2">
                <Link className="flex items-center gap-2" href="/">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <span className="font-bold text-lg">InfographAI</span>
                </Link>
                <p className="mt-4 max-w-xs text-muted-foreground text-sm leading-relaxed">
                  Making data beautiful and accessible for everyone through the
                  power of artificial intelligence.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    className="flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
                    href="#"
                  >
                    <svg
                      className="size-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>X (Twitter)</title>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Link>
                  <Link
                    className="flex size-8 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
                    href="#"
                  >
                    <svg
                      className="size-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>GitHub</title>
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold text-sm">Product</h4>
                <ul className="mt-4 space-y-3 text-sm">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        href={link.href}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-sm">Resources</h4>
                <ul className="mt-4 space-y-3 text-sm">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        href={link.href}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-sm">Company</h4>
                <ul className="mt-4 space-y-3 text-sm">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        href={link.href}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t pt-8 text-center text-muted-foreground text-sm">
              © 2024 InfographAI Inc. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
