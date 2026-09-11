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
                </HorizontalTrack>
            </div>
        </section>
    )
}
