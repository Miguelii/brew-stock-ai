import { Button } from '@/components/ui/button'
import { ArrowRightIcon, BadgeEuroIcon, FileTextIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import Link from 'next/link'

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
        <section className="bg-primary">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center text-center gap-6"
                >
                    <span className="font-mono text-xs tracking-widest uppercase text-primary-foreground/50">
                        Get Started
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground max-w-3xl">
                        Your first analysis is free
                    </h2>
                    <p className="text-primary-foreground/60 text-lg max-w-xl">
                        Pick a ticker, choose a report type, get a detailed breakdown.
                    </p>
                    <div className="mt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-fit">
                        <Link href="/analysis" prefetch={false} className="contents">
                            <Button
                                size="lg"
                                className="gap-2 text-base px-8 h-12 bg-background text-primary hover:bg-background/90 hover:text-primary w-full sm:w-fit"
                            >
                                Start free analysis
                                <ArrowRightIcon className="size-4" />
                            </Button>
                        </Link>
                        <Link href={href} prefetch={false} className="contents">
                            <Button
                                size="lg"
                                variant="outline"
                                className="gap-2 text-base px-8 h-12 bg-transparent border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground w-full sm:w-fit"
                            >
                                <Icon className="size-4" />
                                {label}
                            </Button>
                        </Link>
                    </div>
                    <p className="font-mono text-xs text-primary-foreground/40 tracking-wide">
                        No credit card required · First analysis free
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
