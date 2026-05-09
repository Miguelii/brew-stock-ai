import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Shield, TrendingUp } from 'lucide-react'
import { BackgroundLines } from '@/components/hero/background-lines'
import * as motion from 'motion/react-client'
import { cn } from '@/lib/utils'
import { Hero } from '@/components/hero'

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
        <main className="flex-1 overflow-x-hidden">
            {/* Hero — Cinematic Center */}
            <Hero />

            {/* Analysis Types — Bento Grid */}
            <section id="analysis-types" className="border border-border bg-card/50">
                <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-8%' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Five Analysis Types, One Platform
                        </h2>
                        <p className="text-primary-muted leading-relaxed max-w-2xl text-lg">
                            Choose the analysis that matches your investment strategy. Each report
                            answers different questions — from financial health to long-term growth.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 grid-flow-dense">
                        {analysisTypes.map((type, i) => (
                            <motion.div
                                key={type.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-5%' }}
                                transition={{
                                    duration: 0.5,
                                    delay: i * 0.07,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className={cn(
                                    'group p-7 border border-border rounded-xl bg-card cursor-default transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 hover:border-accent-blue/30',
                                    i === 0 && 'lg:col-span-2'
                                )}
                            >
                                <h3 className="text-lg font-semibold mb-3 group-hover:text-accent-blue transition-colors duration-200">
                                    {type.title}
                                </h3>
                                <p className="text-primary-muted leading-relaxed text-sm">
                                    {type.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-8%' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Hours of Research, Seconds to Deliver
                        </h2>
                        <p className="text-primary-muted leading-relaxed max-w-2xl text-lg">
                            StockBrewAI processes earnings reports, balance sheets, and market data
                            the same way professional analysts do. You get the output in under 1
                            minute for less than a coffee.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-5%' }}
                                transition={{
                                    duration: 0.5,
                                    delay: i * 0.12,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="flex flex-col gap-4"
                            >
                                <div className="w-11 h-11 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
                                    <feature.icon className="size-5 text-accent-blue" />
                                </div>
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                                <p className="text-primary-muted leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-primary">
                <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-8%' }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground">
                                Your first analysis is free
                            </h2>
                            <p className="text-primary-foreground/60 mt-3 text-lg">
                                See what StockBrewAI can do.
                                <br />
                                Pick a ticker, choose a report type and get a detailed breakdown.
                            </p>
                        </div>
                        <Link href="/analysis" prefetch={false} className="shrink-0">
                            <Button
                                size="lg"
                                className="gap-2 text-base px-8 h-12 bg-background text-primary hover:bg-background/90 hover:text-primary"
                            >
                                Start free analysis
                                <ArrowRight className="size-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* CTA — High Contrast Dark */}
        </main>
    )
}
