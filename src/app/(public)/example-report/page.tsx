import type { Metadata } from 'next'
import * as motion from 'motion/react-client'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-static'

export const metadata: Metadata = {
    title: 'Example Report',
}

export default function ExampleReport() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-12 space-y-8 lg:pb-24">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                    Example Report
                </h1>
            </motion.div>

            <Separator />
        </main>
    )
}
