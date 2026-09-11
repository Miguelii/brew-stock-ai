import Link from 'next/link'
import { ArrowUpRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroCard } from '@/modules/home/hero/hero-card'
import { HeroHeadline } from '@/modules/home/hero/hero-headline'
import { HeroScene } from '@/modules/home/hero/hero-scene'
import { TickerDemo } from '@/modules/home/hero/ticker-demo'
import { HERO_LINES } from '@/modules/home/hero/constants'
import { PRODUCT_STATS } from '@/lib/analysis-content'

export function Hero() {
    return (
        <section
            data-tone="navy"
            className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-tone pt-36 pb-20 lg:pt-44 lg:pb-24"
        >
            <HeroScene />

            <div className="section-shell relative z-10">
                <HeroHeadline lines={HERO_LINES} className="mt-7 text-amber-soft" />

                <p className="mt-7 max-w-[52ch] text-lg leading-snug font-bold text-tone-ink">
                    Professional-level stock analysis covering the key numbers, market sentiment,
                    and price signals. All for less than a coffee ☕
                </p>

                <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-fit sm:flex-row sm:items-center">
                    <Link href="/analysis" prefetch={false} className="contents">
                        <Button size="xl" variant="tangerine" className="group">
                            Start free analysis
                            <ArrowUpRight className="size-5 transition-transform duration-300 ease-out-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                        </Button>
                    </Link>
                    <Link href="/example-report" prefetch={false} className="contents">
                        <Button size="xl" variant="white">
                            <FileText className="size-5" />
                            See a sample report
                        </Button>
                    </Link>
                </div>

                <div className="mt-9 flex flex-wrap gap-2.5">
                    {PRODUCT_STATS.map((stat) => (
                        <span
                            key={stat.label}
                            className="eyebrow inline-flex items-center rounded-full bg-tone-ink/12 px-4 py-2 text-tone-ink"
                        >
                            {stat.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="section-shell relative z-10 mt-14 flex justify-center lg:mt-20">
                <HeroCard>
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="display display-card text-amber-soft">
                            Live
                            <br />
                            preview
                        </h2>
                        <span className="eyebrow shrink-0 rounded-full bg-card px-3 py-1.5 text-[11px] text-tangerine-deep">
                            Demo
                        </span>
                    </div>

                    <div className="mt-auto">
                        <TickerDemo />
                    </div>
                </HeroCard>
            </div>
        </section>
    )
}
