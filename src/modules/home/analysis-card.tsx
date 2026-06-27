import * as motion from 'motion/react-client'
import { cn } from '@/lib/utils'

const analysisTypes = [
    {
        title: 'Wall Street Analysis',
        description:
            'A full-scope report covering valuation, financials, and competitive positioning — the same framework used by professional analysts.',
        featured: true,
    },
    {
        title: 'Deep Financial Breakdown',
        description:
            'Dive into revenue trends, profit margins, cash flow health, and balance sheet strength to understand the financial foundation of any stock.',
        featured: false,
    },
    {
        title: 'Competitive Advantage',
        description:
            'Identify durable moats — brand power, network effects, switching costs, and cost advantages that protect a company from competitors.',
        featured: false,
    },
    {
        title: 'Risk Analysis',
        description:
            'Uncover hidden risks including debt exposure, regulatory threats, management concerns, and macroeconomic vulnerabilities.',
        featured: false,
    },
    {
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
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Five AI Stock Analysis Types, One Platform
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
                                'group relative p-7 border border-border rounded-none bg-card cursor-default transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 hover:border-accent-blue/30',
                                i === 0 && 'lg:col-span-2',
                                type.featured &&
                                    'bg-gradient-to-br from-accent-blue/5 to-transparent border-accent-blue/20'
                            )}
                        >
                            {type.featured && (
                                <span className="absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-none bg-accent-blue/10 text-accent-blue border border-accent-blue/20 uppercase tracking-wider">
                                    Most Complete
                                </span>
                            )}
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
    )
}
