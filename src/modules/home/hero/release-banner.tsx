import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import * as motion from 'motion/react-client'
import { LATEST_CHANGELOG_ENTRY } from '@/modules/changelog/changelog'

export function ReleaseBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
        >
            <Link
                href={`/changelog/${LATEST_CHANGELOG_ENTRY.slug}`}
                prefetch={false}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 py-1.5 pl-2 pr-3 text-sm backdrop-blur-sm transition-colors duration-200 hover:border-accent-blue"
            >
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-blue-light px-2 py-0.5 text-[11px] font-semibold text-accent-blue">
                    <Sparkles className="size-3" />
                    New
                </span>
                <span className="text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                    Our AI just got more powerful
                </span>
                <ArrowRight className="size-3.5 text-accent-blue transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
        </motion.div>
    )
}
