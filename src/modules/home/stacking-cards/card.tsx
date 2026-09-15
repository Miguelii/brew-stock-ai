'use client'

import { m, useMotionTemplate, useTransform, type MotionValue } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'

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
 *
 * The scroll-driven values are published as custom properties instead of being
 * applied directly, because only the lg deck layout consumes them. Below lg, and
 * under reduced motion, the very same element is just a card in a column, so the
 * deck renders one tree at every breakpoint and never disagrees with the server.
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

    const transform = useMotionTemplate`translateY(${y}) rotate(${rotate}deg) scale(${scale})`

    return (
        <m.article
            data-tone={tone}
            data-stack-card
            style={
                {
                    '--stack-transform': transform,
                    '--stack-top': `${index * 18}px`,
                } as CSSProperties
            }
            className="surface flex flex-col gap-5 bg-tone p-8 text-tone-ink lg:absolute lg:inset-x-0 lg:top-[var(--stack-top)] lg:min-h-[400px] lg:p-10 lg:[transform:var(--stack-transform)]"
        >
            <span className="eyebrow opacity-80">
                {String(index + 1).padStart(2, '0')} · {tag}
            </span>
            <h3 className="display display-card max-w-[14ch]">{title}</h3>
            <p className="max-w-[46ch] leading-snug opacity-85">{description}</p>
            <Icon className="mt-2 size-14 lg:mt-auto lg:size-16" strokeWidth={1.5} />
        </m.article>
    )
}
