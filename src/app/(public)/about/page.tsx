import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'About StockBrewAI'
const META_DESCRIPTION =
    'StockBrewAI brings institutional-grade stock research to retail investors through AI, to make educational financial analysis affordable and accessible. Learn who we are and how the product works.'
const META_URL = `${SITE_URL}/about`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    alternates: {
        canonical: META_URL,
    },
    openGraph: {
        title: META_TITLE,
        description: META_DESCRIPTION,
        url: META_URL,
    },
    twitter: {
        title: META_TITLE,
        description: META_DESCRIPTION,
    },
}

export default function AboutPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: 'About', url: META_URL },
                ]}
            />

            <main className="main-container">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">About StockBrewAI</h1>
                    <p className="text-sm text-muted-foreground">
                        Institutional-grade stock research, made accessible.
                    </p>
                </div>

                <Separator />

                <div className="space-y-7">
                    <Section title="Our mission">
                        <p>
                            Retail investors are flooded with noise: tickers, headlines, hot takes,
                            and signals. What is missing is the structured, multi-angle research
                            that an analyst at a fund would spend hours putting together for a
                            single name.
                        </p>
                        <p>
                            StockBrewAI exists to close that gap. We use AI to compress that
                            research into a few minutes and a few cents — so that anyone curious
                            about a company can read a clear, structured breakdown of its
                            financials, risks, and competitive position before deciding what to do.
                        </p>
                        <p>
                            Our role is educational. We help you{' '}
                            <strong className="text-foreground">understand a company</strong>; we do
                            not tell you what to buy or sell. See our{' '}
                            <Link
                                href="/disclaimer"
                                prefetch={false}
                                className="text-accent-blue underline underline-offset-2"
                            >
                                Risk Disclosure
                            </Link>
                            .
                        </p>
                    </Section>

                    <Section title="How the product works">
                        <p>
                            When you request an analysis, StockBrewAI pulls the latest public
                            financial data for the ticker, structures it, and runs it through a
                            large language model with prompts engineered to mimic the way an equity
                            analyst would frame the question. The output is a structured report —
                            not a chat answer — covering the dimensions that matter for that report
                            type.
                        </p>
                        <p>Five report types are available today:</p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            <li>
                                <strong className="text-foreground">Wall Street Analysis</strong> —
                                full-scope view of valuation, financial health, and competitive
                                positioning.
                            </li>
                            <li>
                                <strong className="text-foreground">
                                    Deep Financial Breakdown
                                </strong>{' '}
                                — revenue, margins, cash flow, and balance-sheet quality.
                            </li>
                            <li>
                                <strong className="text-foreground">Competitive Advantage</strong> —
                                moat analysis covering brand, network effects, switching costs, and
                                scale.
                            </li>
                            <li>
                                <strong className="text-foreground">Risk Analysis</strong> — debt
                                exposure, regulatory threats, management risk, and macro
                                vulnerabilities.
                            </li>
                            <li>
                                <strong className="text-foreground">Growth Potential</strong> —
                                market expansion, product pipelines, and international reach.
                            </li>
                        </ul>
                    </Section>

                    <Section title="Data sources">
                        <p>
                            Reports are built from publicly available data: company filings, market
                            data feeds, and financial APIs. We do not have access to non-public
                            information, broker recommendations, or proprietary research.
                        </p>
                        <p>
                            Because data can be incomplete, delayed, or inaccurate, every report
                            should be cross-checked against primary sources before any decision is
                            made.
                        </p>
                    </Section>
                </div>
            </main>
        </>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                {children}
            </div>
        </section>
    )
}
