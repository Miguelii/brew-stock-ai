import type { LucideIcon } from 'lucide-react'

type Props = {
    icon: LucideIcon
    tone: string
    tag: string
    title: string
    description: string
    index: number
}

/** Flat fallback used on small screens and under reduced motion. */
export function StaticCard({ icon: Icon, tone, tag, title, description, index }: Props) {
    return (
        <article data-tone={tone} className="surface flex flex-col gap-5 bg-tone p-8 text-tone-ink">
            <span className="eyebrow opacity-80">
                {String(index + 1).padStart(2, '0')} · {tag}
            </span>
            <h3 className="display display-card max-w-[14ch]">{title}</h3>
            <p className="max-w-[46ch] leading-snug opacity-85">{description}</p>
            <Icon className="mt-2 size-14" strokeWidth={1.5} />
        </article>
    )
}
