import Link from 'next/link'
import { ArrowUpRight, BadgeEuroIcon, FileTextIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/motion/reveal'
import { GiantWord } from '@/modules/home/giant-word'
import { CtaScene } from '@/components/scene/cta-scene'

type Props = {
    secondCTA: 'report' | 'pricing'
}

const getSecondCTABtnProps = (secondCTA: Props['secondCTA']) => {
    if (secondCTA === 'pricing') {
        return {
            label: 'See pricing',
            href: '/pricing',
            icon: BadgeEuroIcon,
        }
    }

    return {
        label: 'See a sample report',
        href: '/example-report',
        icon: FileTextIcon,
    }
}

export function FinalCTA({ secondCTA }: Props) {
    const { label, href, icon: Icon } = getSecondCTABtnProps(secondCTA)

    return (
        <section
            data-tone="tangerine"
            className="relative isolate overflow-hidden bg-tone text-tone-ink"
        >
            <div className="section-shell relative z-10 pt-20 pb-24 lg:pt-30 lg:pb-36">
                <span className="eyebrow opacity-80">Get started</span>

                <div className="mt-6 max-w-[74%] text-tone-soft">
                    <GiantWord word="Free" />
                </div>

                <Reveal className="mt-8">
                    <h2 className="max-w-[20ch] text-[clamp(26px,3vw,40px)] leading-[1.1] font-extrabold">
                        Your first analysis is free
                    </h2>
                    <p className="mt-4 max-w-[46ch] text-lg leading-snug opacity-85">
                        Pick a ticker, choose a report type, get a detailed breakdown.
                    </p>

                    <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-fit sm:flex-row sm:items-center">
                        <Link href="/analysis" prefetch={false} className="contents">
                            <Button size="xl" variant="ink" className="group">
                                Start free analysis
                                <ArrowUpRight className="size-5 transition-transform duration-300 ease-out-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                            </Button>
                        </Link>
                        <Link href={href} prefetch={false} className="contents">
                            <Button size="xl" variant="white">
                                <Icon className="size-5" />
                                {label}
                            </Button>
                        </Link>
                    </div>

                    <p className="eyebrow mt-8 opacity-70">
                        No credit card required · First analysis free
                    </p>
                </Reveal>
            </div>

            <CtaScene className="pointer-events-none absolute right-0 bottom-0 z-0 w-[clamp(180px,24vw,330px)] opacity-90" />
        </section>
    )
}
