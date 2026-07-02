import Link from 'next/link'
import { ArrowRightIcon, ChevronDownIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import { FAQ_GROUPS, type FaqItem } from '@/modules/faq/faq-content'
import { SectionHeader } from '@/modules/home/section-header'

const FEATURED_QUESTIONS = [
    'What is StockBrewAI?',
    'What data does the AI use?',
    'How accurate is it? What are the limitations?',
    'How does pricing work?',
    'Is there a free trial?',
    'Is this financial advice?',
] as const

const ALL_ITEMS: readonly FaqItem[] = FAQ_GROUPS.flatMap((group): readonly FaqItem[] => group.items)

export function HomeFaq() {
    const items = FEATURED_QUESTIONS.flatMap((question) => {
        const item = ALL_ITEMS.find((candidate) => candidate.question === question)
        return item ? [item] : []
    })

    return (
        <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
                    <div>
                        <SectionHeader
                            title="Questions, answered"
                            lede="The short version of what people ask before their first report."
                            className="mb-8"
                        />
                        <Link
                            href="/faq"
                            className="inline-flex items-center gap-2 text-accent-blue font-medium group"
                        >
                            Read the full FAQ
                            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-8%' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col"
                    >
                        {items.map((item) => (
                            <details key={item.question} className="group border-t border-border">
                                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                    <h3 className="text-base font-semibold group-hover:text-accent-blue transition-colors duration-200">
                                        {item.question}
                                    </h3>
                                    <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                                </summary>
                                <p className="text-primary-muted leading-relaxed text-sm pb-6 max-w-3xl">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                        <div className="border-t border-border" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
