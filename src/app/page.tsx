import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Shield, TrendingUp } from 'lucide-react'
import { BackgroundLines } from '@/components/ui/background-lines'

const features = [
    {
        icon: Brain,
        title: 'AI-Powered Insights',
        description:
            'Our models process thousands of data points from earnings reports, balance sheets, and market data to deliver institutional-grade analysis.',
    },
    {
        icon: Shield,
        title: 'Risk Assessment',
        description:
            'Identify vulnerabilities before they become losses. Our risk analysis covers debt levels, regulatory exposure, and sector headwinds.',
    },
    {
        icon: TrendingUp,
        title: 'Growth Potential',
        description:
            'Evaluate expansion opportunities, R&D pipelines, and total addressable market size to find stocks with strong upside.',
    },
] as const

const analysisTypes = [
    {
        title: 'Wall Street Analysis',
        description:
            'A full-scope report covering valuation, financials, and competitive positioning — the same framework used by professional analysts.',
    },
    {
        title: 'Deep Financial Breakdown',
        description:
            'Dive into revenue trends, profit margins, cash flow health, and balance sheet strength to understand the financial foundation of any stock.',
    },
    {
        title: 'Competitive Advantage',
        description:
            'Identify durable moats — brand power, network effects, switching costs, and cost advantages that protect a company from competitors.',
    },
    {
        title: 'Risk Analysis',
        description:
            'Uncover hidden risks including debt exposure, regulatory threats, management concerns, and macroeconomic vulnerabilities.',
    },
    {
        title: 'Growth Potential',
        description:
            'Assess future growth drivers such as market expansion, product pipelines, international reach, and emerging sector trends.',
    },
] as const

export default function Home() {
    return (
        <main className="flex-1">
            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-600 text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                    AI-Powered Stock Analysis <br className="" /> For Smarter Investing
                </h1>
                <p className="max-w-xl mx-auto text-sm md:text-lg text-muted-foreground text-center">
                    Stock analysis with a comprehensive report covering financial metrics, market
                    sentiment and technical indicators — Powered by our trained AI.
                </p>
                <Link href="/analysis" className="mt-6 z-99">
                    <Button size="lg" className="gap-2 text-base px-6 h-12">
                        Start Free Analysis
                        <ArrowRight className="size-5" />
                    </Button>
                </Link>
            </BackgroundLines>

            <section className="border-t border-border bg-card/50">
                <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Five Analysis Types, One Platform
                    </h2>
                    <p className="text-primary-muted leading-relaxed mb-12 max-w-2xl">
                        Choose the analysis that matches your investment strategy. Each report type
                        is tailored to answer different questions about a stock, from its financial
                        health to its long-term growth potential.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analysisTypes.map((type) => (
                            <div
                                key={type.title}
                                className="p-6 border border-border rounded-lg bg-card"
                            >
                                <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                                <p className="text-primary-muted leading-relaxed text-sm">
                                    {type.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-border">
                <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Why Choose StockBrewAI?
                    </h2>
                    <p className="text-primary-muted leading-relaxed mb-12 max-w-2xl">
                        Traditional stock research is time-consuming and expensive. StockBrewAI uses
                        AI to process the same data that professional analysts rely on and delivers
                        clear, actionable insights in seconds.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-accent-blue/10">
                                        <feature.icon className="size-5 text-accent-blue" />
                                    </div>
                                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                                </div>
                                <p className="text-primary-muted leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-border">
                <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Ready to Analyze Your Next Stock?
                    </h2>
                    <p className="text-primary-muted leading-relaxed mb-8 max-w-xl mx-auto">
                        Join thousands of investors who use StockBrewAI to make smarter, data-driven
                        decisions. Start your first free analysis today.
                    </p>
                    <Link href="/analysis">
                        <Button size="lg" className="gap-2 text-base px-6 h-12">
                            Start Free Analysis
                            <ArrowRight className="size-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    )
}
