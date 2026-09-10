'use client'

import { motion, type MotionValue, useTransform } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

type Props = {
    icon: LucideIcon
    tone: string
    tag: string
    title: string
    description: string
    index: number
    total: number
    progress: MotionValue<number>
}

/**
 * One card in the deck. It flies in from below, then settles into a fanned stack
 * as the cards behind it shrink away.
 */
export function StackCard({
    icon: Icon,
    tone,
    tag,
    title,
    description,
    index,
    total,
    progress,
}: Props) {
    const step = 1 / (total + 0.8)
    const start = index * step
    const end = start + step

    const y = useTransform(progress, [start, end], ['115%', '0%'])
    const rotate = useTransform(
        progress,
        [start, end],
        [index % 2 ? 10 : -12, (index - (total - 1) / 2) * 1.5]
    )
    const scale = useTransform(progress, [start, end], [1, 1 - (total - 1 - index) * 0.02])

    return (
        <motion.article
            data-tone={tone}
            style={{ y, rotate, scale, top: index * 18 }}
            className="surface absolute inset-x-0 flex min-h-[400px] flex-col gap-5 bg-tone p-8 text-tone-ink sm:p-10"
        >
            <span className="eyebrow opacity-80">
                {String(index + 1).padStart(2, '0')} · {tag}
            </span>
            <h3 className="display display-card max-w-[14ch]">{title}</h3>
            <p className="max-w-[46ch] leading-snug opacity-85">{description}</p>
            <Icon className="mt-auto size-16" strokeWidth={1.5} />
        </motion.article>
    )
}
