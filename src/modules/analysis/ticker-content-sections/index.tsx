import * as motion from 'motion/react-client'
import type { TickerPage } from '@/types/TickerPage'
import type { PropsWithChildren } from 'react'

type SectionProps = PropsWithChildren<{
    title: string
    /** Stagger index, so sections fade in one after the other on scroll. */
    index: number
}>

type Props = {
    page: TickerPage
}

function Section({ title, index, children }: SectionProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
            <h2 className="text-2xl font-bold tracking-tight mb-4">{title}</h2>
            {children}
        </motion.section>
    )
}

/**
 * The unique, per-company editorial body of a ticker page. Everything here is
 * hand-written in `ticker-pages.ts`: it is what separates this page from a
 * templated one, so it must stay above the FAQ and in the initial HTML, with no
 * client-side gating.
 */
export function TickerContentSections({ page }: Props) {
    const { content } = page
    const narrativeParagraphs = content.investmentNarrative.split('\n\n')

    return (
        <div className="flex flex-col gap-12 lg:gap-16 max-w-3xl">
            <Section title={`How ${page.name} makes money`} index={0}>
                <p className="text-primary-muted leading-relaxed">{content.businessModel}</p>
            </Section>

            <Section title="Key products and revenue lines" index={1}>
                <ul className="flex flex-col gap-2">
                    {content.keyProducts.map((product) => (
                        <li key={product} className="flex gap-3 text-primary-muted leading-relaxed">
                            <span aria-hidden className="text-accent-blue shrink-0">
                                &bull;
                            </span>
                            <span>{product}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title={`The bull and bear case for ${page.ticker}`} index={2}>
                <div className="flex flex-col gap-4">
                    {narrativeParagraphs.map((paragraph) => (
                        <p
                            key={paragraph.slice(0, 48)}
                            className="text-primary-muted leading-relaxed"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            </Section>

            <Section title={`Key risks for ${page.name} investors`} index={3}>
                <ul className="flex flex-col gap-2">
                    {content.keyRisks.map((risk) => (
                        <li key={risk} className="flex gap-3 text-primary-muted leading-relaxed">
                            <span aria-hidden className="text-accent-blue shrink-0">
                                &bull;
                            </span>
                            <span>{risk}</span>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title="What to watch next" index={4}>
                <p className="text-primary-muted leading-relaxed">{content.whatToWatch}</p>
            </Section>

            <Section title={`Who ${page.name} competes with`} index={5}>
                <p className="text-primary-muted leading-relaxed">
                    {page.name} operates in the {page.sector} sector and competes most directly with{' '}
                    {content.competitors.join(', ')}. Comparing a company against its own peer group
                    matters more than reading its metrics in isolation: a valuation multiple, a
                    margin, or a growth rate only means something relative to the alternatives an
                    investor could buy instead.
                </p>
            </Section>
        </div>
    )
}
