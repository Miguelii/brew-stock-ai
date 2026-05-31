import * as motion from 'motion/react-client'
import { BrainIcon, ShieldIcon, TrendingUpIcon } from 'lucide-react'

const features = [
    {
        icon: BrainIcon,
        title: 'AI-Powered Insights',
        description:
            'Our models process thousands of data points from earnings reports, balance sheets, and market data to deliver institutional-grade analysis.',
    },
    {
        icon: ShieldIcon,
        title: 'Risk Assessment',
        description:
            'Identify vulnerabilities before they become losses. Our risk analysis covers debt levels, regulatory exposure, and sector headwinds.',
    },
    {
        icon: TrendingUpIcon,
        title: 'Growth Potential',
        description:
            'Evaluate expansion opportunities, R&D pipelines, and total addressable market size to find stocks with strong upside.',
    },
] as const

export function MarketingCard() {
    return (
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
                        StockBrewAI processes earnings reports, balance sheets, and market data the
                        same way professional analysts do. You get the output in under 2 minutes for
                        less than a coffee.
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
    )
}
