import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HorizontalTrack } from '@/modules/home/horizontal-track'
import { REPORT_SECTIONS } from '@/modules/home/report-sections-content'

export function ReportSections() {
    return (
        <section data-tone="green" className="bg-tone text-tone-ink">
            <div className="section-shell py-20 lg:py-0">
                <HorizontalTrack>
                    <div className="surface flex w-[min(330px,80vw)] shrink-0 snap-start flex-col bg-tone-deep p-7">
                        <span className="eyebrow opacity-80">Inside a report</span>
                        <h2 className="display display-card mt-auto max-w-[12ch] pt-6">
                            Every section. Every metric.
                        </h2>
                        <p className="mt-4 max-w-[34ch] text-[15px] leading-snug opacity-80">
                            A full Wall Street Analysis covers eight sections. Each one answers a
                            different question about the stock.
                        </p>
                    </div>

                    {REPORT_SECTIONS.map((section, i) => {
                        const Icon = section.icon

                        return (
                            <article
                                key={section.title}
                                className="surface flex w-[min(330px,80vw)] shrink-0 snap-start flex-col bg-card p-7 text-ink"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-mono text-sm text-ink/45">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <Icon className="size-7 text-green" strokeWidth={1.75} />
                                </div>

                                <h3 className="mt-auto pt-6 text-xl leading-tight font-extrabold">
                                    {section.title}
                                </h3>
                                <p className="mt-3 text-[15px] leading-snug opacity-70">
                                    {section.description}
                                </p>
                            </article>
                        )
                    })}

                    <div
                        data-tone="amber"
                        className="surface flex w-[min(330px,80vw)] shrink-0 snap-start flex-col bg-tone p-7 text-tone-ink"
                    >
                        <span className="eyebrow opacity-80">Ready when you are</span>
                        <h3 className="display display-card mt-auto max-w-[10ch] pt-6">
                            See it on a real ticker
                        </h3>
                        <Link href="/example-report" prefetch={false} className="mt-6">
                            <Button variant="ink" size="xl" className="group w-full">
                                Open a sample report
                                <ArrowUpRight className="size-5 transition-transform duration-300 ease-out-strong group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                            </Button>
                        </Link>
                    </div>
                </HorizontalTrack>
            </div>
        </section>
    )
}
