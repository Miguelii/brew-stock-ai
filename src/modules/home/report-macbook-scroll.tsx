'use client'

import * as motion from 'motion/react-client'
import dynamic from 'next/dynamic'

const MacbookScroll = dynamic(
    () => import('@/components/ui/macbook-scroll').then((m) => ({ default: m.MacbookScroll })),
    { ssr: false }
)
export function ReportMacbookScroll() {
    return (
        <section className="bg-primary py-16 lg:py-24 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
            >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-8 text-center">
                    This is what your report looks like.
                </h2>
                <MacbookScroll src="/assets/report-preview-v1.1.png" showGradient={false} />
            </motion.div>
        </section>
    )
}
