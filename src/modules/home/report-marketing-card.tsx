import * as motion from 'motion/react-client'
import { BarChart3, FileText, Newspaper, Rss, Scale, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const reportSections = [
    {
        icon: FileText,
        title: 'Summary',
        description:
            'What the AI found — the overall verdict, top strengths, and the one risk you should know about.',
        featured: false,
    },
    {
        icon: TrendingUp,
        title: 'Market & Analyst Outlook',
        description:
            "Where the stock has traded over the past year, what Wall Street analysts think it's worth, and how their buy, hold, and sell recommendations break down.",
        featured: false,
    },
    {
        icon: BarChart3,
        title: 'Key Financial Metrics',
        description:
            'The numbers that matter — revenue and profitability, valuation, financial health, forward estimates, and insider activity, all in plain English.',
        featured: false,
    },
    {
        icon: Sparkles,
        title: 'Full AI Report',
        description:
            'A complete, in-depth analysis of the company — growth, profitability, cash flow, and financial health, explained in clear terms.',
        featured: false,
    },
    {
        icon: Zap,
        title: "What's Happening Now",
        description:
            'The most notable recent event our AI identified — a big announcement, leadership change, or market-moving news — and why it matters.',
        featured: false,
    },
    {
        icon: Rss,
        title: 'Latest News',
        description:
            "The most recent headlines about the company, pulled in real time so the analysis reflects what's happening today.",
        featured: false,
    },
    {
        icon: Newspaper,
        title: 'What Experts Are Saying',
        description:
            'A curated digest of recent reports from professional investors and analysts, filtered for relevance to this specific company.',
        featured: false,
    },
    {
        icon: Scale,
        title: 'How It Compares',
        description:
            'Side-by-side comparison of the company against others in the same sector — showing where it leads, lags, or stands out.',
        featured: false,
    },
] as const

export function ReportMarketingCard() {
    return (
        <section className="border-b border-border bg-card/50">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Every section. Every metric.
                    </h2>
                    <p className="text-muted-foreground leading-relaxed max-w-2xl text-lg">
                        A full Wall Street Analysis covers eight distinct report sections — each
                        answering a different question about the stock.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 grid-flow-dense">
                    {reportSections.map((section, i) => {
                        const Icon = section.icon
                        return (
                            <motion.div
                                key={section.title}
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
                                    'group relative p-7 border border-border rounded-xl bg-card cursor-default transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 hover:border-accent-blue/30',
                                    i === 0 && 'lg:col-span-2',
                                    section.featured &&
                                        'bg-gradient-to-br from-accent-blue/5 to-transparent border-accent-blue/20'
                                )}
                            >
                                {section.featured && (
                                    <span className="absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 uppercase tracking-wider">
                                        Most Complete
                                    </span>
                                )}
                                <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center mb-5">
                                    <Icon className="size-5 text-accent-blue" />
                                </div>
                                <h3 className="text-lg font-semibold mb-3 group-hover:text-accent-blue transition-colors duration-200">
                                    {section.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {section.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
