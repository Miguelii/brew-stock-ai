import * as motion from 'motion/react-client'
import { BarChart3, Castle, Landmark, TrendingUp, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeader } from '@/modules/home/section-header'

const analysisTypes = [
    {
        icon: Landmark,
        title: 'Wall Street Analysis',
        description:
            'The complete report: valuation, financials, and competitive position, built with the same framework professional analysts use.',
        featured: true,
    },
    {
        icon: BarChart3,
        title: 'Deep Financial Breakdown',
        description:
            'Dive into revenue trends, profit margins, cash flow health, and balance sheet strength to understand the financial foundation of any stock.',
        featured: false,
    },
    {
        icon: Castle,
        title: 'Competitive Advantage',
        description:
            'Find out if the company has a lasting edge over competitors: brand power, network effects, switching costs, and cost advantages.',
        featured: false,
    },
    {
        icon: TriangleAlert,
        title: 'Risk Analysis',
        description:
            'Uncover hidden risks including debt exposure, regulatory threats, management concerns, and macroeconomic vulnerabilities.',
        featured: false,
    },
    {
        icon: TrendingUp,
        title: 'Growth Potential',
        description:
            'Assess future growth drivers such as market expansion, product pipelines, international reach, and emerging sector trends.',
        featured: false,
    },
] as const

export function AnalysisCard() {
    return (
        <section id="analysis-types" className="border border-border bg-card/50">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <SectionHeader
                    title="Five Stock Analysis Types, One Platform"
                    lede="Choose the analysis that matches what you want to learn. Each report answers a different question, from financial health to long-term growth."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 grid-flow-dense">
                    {analysisTypes.map((type, i) => {
                        const Icon = type.icon
                        return (
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
                                    'group relative p-7 border border-border rounded-none bg-card cursor-default transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 hover:border-accent-blue/30',
                                    i === 0 && 'lg:col-span-2',
                                    type.featured &&
                                        'bg-gradient-to-br from-accent-blue/5 to-transparent border-accent-blue/20'
                                )}
                            >
                                {type.featured && (
                                    <span className="absolute top-4 right-4 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-none bg-accent-blue/10 text-accent-blue border border-accent-blue/20 uppercase tracking-wider">
                                        Most Complete
                                    </span>
                                )}
                                <div className="w-10 h-10 rounded-none bg-accent-blue/10 flex items-center justify-center mb-5">
                                    <Icon className="size-5 text-accent-blue" />
                                </div>
                                <h3 className="text-lg font-semibold mb-3 group-hover:text-accent-blue transition-colors duration-200">
                                    {type.title}
                                </h3>
                                <p className="text-primary-muted leading-relaxed text-sm">
                                    {type.description}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
