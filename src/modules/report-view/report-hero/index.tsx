import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReportExport } from '@/modules/report-view/report-export'
import { ReportHeroScene } from '@/modules/report-view/report-hero/scene'
import { fmtDate } from '@/lib/formatters'
import type { ReportDTO } from '@/types/ReportDTO'

type Props = {
    report: ReportDTO
    typeLabel?: string
}

export function ReportHero({ report, typeLabel }: Props) {
    return (
        <section
            data-tone="navy"
            className="relative isolate overflow-hidden bg-tone pt-22 pb-9 lg:pt-24 lg:pb-10"
        >
            <ReportHeroScene />

            <div className="section-shell relative z-10">
                <Link href="/reports" prefetch={false} className="w-fit">
                    <Button variant="white" className="h-10 px-5 text-[15px] font-bold">
                        <ArrowLeftIcon className="size-4" />
                        Back
                    </Button>
                </Link>

                <div className="mt-6 flex w-full flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
                    <div>
                        {typeLabel && (
                            <span
                                data-testid="report-type-badge"
                                className="eyebrow inline-flex items-center rounded-full bg-paper px-4 py-2.5 text-navy-deep"
                            >
                                {typeLabel}
                            </span>
                        )}

                        {/* Must contain the ticker and nothing else: e2e asserts exact text. */}
                        <h1
                            data-testid="report-ticker-heading"
                            className="display display-hero mt-5 text-amber-soft"
                        >
                            {report.stock}
                        </h1>

                        <p className="mt-4 text-lg leading-snug font-bold text-white">
                            Fundamental Analysis &amp; Sentiment Report
                        </p>
                        <p className="eyebrow mt-3 text-white/60">
                            Generated {fmtDate(report.created_at, 'short')}
                        </p>
                    </div>

                    <ReportExport reportId={report.id} />
                </div>
            </div>
        </section>
    )
}
