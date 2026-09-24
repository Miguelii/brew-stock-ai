import { Reveal } from '@/components/ui/motion/reveal'
import { cn } from '@/lib/utils'

type Props = {
    title: string
    lede?: string
    eyebrow?: string
    className?: string
    /** Caps the heading measure in characters. Short headings read better tight. */
    titleClassName?: string
}

export function SectionHeader({ title, lede, eyebrow, className, titleClassName }: Props) {
    return (
        <Reveal className={cn('mb-14 flex flex-col gap-5', className)}>
            {eyebrow && <span className="eyebrow text-tone-deep opacity-80">{eyebrow}</span>}
            <h2 className={cn('display display-section max-w-[18ch]', titleClassName)}>{title}</h2>
            {lede && <p className="max-w-[52ch] text-lg leading-snug opacity-75">{lede}</p>}
        </Reveal>
    )
}
