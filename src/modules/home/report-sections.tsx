import * as motion from 'motion/react-client'
import { REPORT_SECTIONS } from '@/modules/home/report-sections-content'
import { SectionHeader } from '@/modules/home/section-header'

export function ReportSections() {
    return (
        <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <SectionHeader
                    title="Every Section. Every Metric."
                    lede="A full Wall Street Analysis covers eight report sections. Each one answers a different question about the stock."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    {REPORT_SECTIONS.map((section, i) => {
                        const Icon = section.icon
                        return (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-5%' }}
                                transition={{
                                    duration: 0.5,
                                    delay: (i % 2) * 0.07,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="group flex gap-5 border-t border-border pt-6"
                            >
                                <div className="shrink-0 w-9 h-9 rounded-none bg-accent-blue/10 flex items-center justify-center">
                                    <Icon className="size-5 text-accent-blue" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-base font-semibold flex items-baseline gap-3">
                                        <span
                                            aria-hidden
                                            className="font-mono text-xs text-primary-muted"
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        {section.title}
                                    </h3>
                                    <p className="text-primary-muted leading-relaxed text-sm">
                                        {section.description}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
