import { ChevronDownIcon } from 'lucide-react'
import type { StockReports } from '@/types/ReportDTO'
import { EXPERT_REPORT_SUMMARY_MAX_CHARS } from '@/_bff/core/constants/expert-reports.constants'
import { fmtDate, truncateText } from '@/_bff/core/utils/formatters.utils'

type Props = {
    report: StockReports
}

export function ExpertReportItem({ report }: Props) {
    return (
        <li data-testid="expert-report-item" className="border-ink/10 not-last:border-b">
            {report.reportTitle ? (
                <details className="faq-accordion group">
                    {/* The whole row is the toggle, so its content must stay phrasing (spans) */}
                    <summary className="group/row flex cursor-pointer list-none items-start gap-4 rounded-[var(--radius-surface-inner)] py-5 outline-offset-2 focus-visible:outline-2 focus-visible:outline-blue md:items-center [&::-webkit-details-marker]:hidden">
                        <ReportHeading report={report} />
                        <SummaryToggle />
                    </summary>
                    <p
                        data-testid="expert-report-summary"
                        className="max-w-[90%] pb-5 text-sm leading-relaxed text-ink/70"
                    >
                        {truncateText(report.reportTitle, EXPERT_REPORT_SUMMARY_MAX_CHARS)}
                    </p>
                </details>
            ) : (
                <div className="py-5">
                    <ReportHeading report={report} />
                </div>
            )}
        </li>
    )
}

function SummaryToggle() {
    return (
        <span
            aria-hidden="true"
            className="mt-0.5 flex shrink-0 items-center gap-1 text-xs font-semibold text-blue md:mt-0"
        >
            <span className="hidden sm:inline sm:group-open:hidden">Read summary</span>
            <span className="hidden sm:group-open:inline">Hide summary</span>
            <ChevronDownIcon className="size-5 transition-transform duration-300 ease-out-strong group-open:rotate-180 motion-reduce:transition-none" />
        </span>
    )
}

function ReportHeading({ report }: Props) {
    return (
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="eyebrow flex flex-wrap items-center gap-x-2 text-xs text-ink/60">
                <span className="text-blue">{report.provider}</span>
                {report.reportDate && (
                    <>
                        <span aria-hidden="true">·</span>
                        <time dateTime={report.reportDate}>
                            {fmtDate(report.reportDate, 'short')}
                        </time>
                    </>
                )}
            </span>

            <span
                data-testid="expert-report-title"
                className="line-clamp-2 text-base leading-snug font-semibold text-ink transition-colors duration-200 group-hover/row:text-blue"
            >
                {report.title}
            </span>
        </span>
    )
}
