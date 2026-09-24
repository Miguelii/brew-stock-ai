import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/motion/reveal'
import { STEPS } from '@/lib/analysis-content'
import { BrandName } from '@/components/brand-name'

export function HowItWorks() {
    return (
        <section id="how-it-works" data-tone="paper" className="bg-tone text-tone-ink">
            <div className="section-shell section-pad">
                <Reveal className="surface mx-auto w-full max-w-[1400px] bg-card p-7 sm:p-10 lg:p-12">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
                        <div className="flex flex-col">
                            <span className="eyebrow text-blue">How it works</span>
                            <h2 className="mt-5 max-w-[16ch] text-[clamp(28px,3.4vw,40px)] leading-[1.1] font-extrabold">
                                What <BrandName /> actually does
                            </h2>
                            <p className="mt-5 max-w-[46ch] leading-snug opacity-70">
                                It reads earnings reports, balance sheets, and market data the same
                                way a professional analyst would. You get the result in under two
                                minutes, for less than a coffee.
                            </p>

                            <div className="mt-8">
                                <Link href="/analysis" prefetch={false} className="contents">
                                    <Button
                                        size="xl"
                                        variant="ink"
                                        className="group w-full sm:w-fit"
                                    >
                                        Run your first report
                                        <ArrowUpRight className="size-5 transition-transform duration-300 ease-out-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <ol className="flex flex-col gap-8">
                            {STEPS.map((step) => {
                                const Icon = step.icon

                                return (
                                    <li key={step.title} className="flex gap-5">
                                        <Icon className="size-16 shrink-0" tint={step.tint} />
                                        <div className="flex flex-col gap-2 pt-1">
                                            <h3 className="text-xl leading-tight font-bold">
                                                {step.title}
                                            </h3>
                                            <p className="leading-snug opacity-70">
                                                {step.description}
                                            </p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
