import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

export function StartAnalysisPreviewCard() {
    return (
        <div className="mt-14 pt-10 border-t border-border">
            <div className="bg-card border border-border rounded-none p-8">
                <h3 className="text-xl font-bold mb-2">Ready to analyse a stock?</h3>
                <p className="text-primary-muted text-sm leading-relaxed mb-5">
                    Apply what you have learned. Run an AI-powered stock analysis and get a full
                    breakdown of financials, competitive position, risk, and growth potential in
                    under 120 seconds.
                </p>
                <Link
                    href="/analysis"
                    prefetch={false}
                    className="w-full sm:w-fit justify-center sm:justify-start inline-flex items-center gap-2 px-5 py-2.5 bg-accent-blue text-background text-sm font-semibold rounded-none hover:bg-accent-blue/90 transition-colors duration-200"
                >
                    Start free analysis
                    <ArrowLeftIcon className="size-4 rotate-180" />
                </Link>
            </div>
        </div>
    )
}
