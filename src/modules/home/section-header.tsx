import * as motion from 'motion/react-client'
import { cn } from '@/lib/utils'

type Props = {
    title: string
    lede?: string
    className?: string
}

export function SectionHeader({ title, lede, className }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn('mb-12 flex flex-col gap-4', className)}
        >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
            {lede && <p className="text-primary-muted leading-relaxed text-lg max-w-2xl">{lede}</p>}
        </motion.div>
    )
}
