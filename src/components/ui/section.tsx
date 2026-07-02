import type { PropsWithChildren } from 'react'

type SectionProps = PropsWithChildren & {
    title: string
}

export function Section({ title, children }: SectionProps) {
    return (
        <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                {children}
            </div>
        </section>
    )
}
