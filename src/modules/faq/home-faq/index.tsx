import Link from 'next/link'
import { ArrowRightIcon, ChevronDownIcon } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { FAQ_GROUPS, type FaqItem } from '@/modules/faq/faq-content'
import { SectionHeader } from '@/components/section-header'

const FEATURED_QUESTIONS = [
    'What is BrewStockAI?',
    'What data does the engine use?',
    'How accurate is it? What are the limitations?',
    'How much does one analysis cost?',
    'Can I try it for free?',
    'Is this financial advice?',
] as const

const ALL_ITEMS: readonly FaqItem[] = FAQ_GROUPS.flatMap((group): readonly FaqItem[] => group.items)

export function HomeFaq() {
    const items = FEATURED_QUESTIONS.flatMap((question) => {
        const item = ALL_ITEMS.find((candidate) => candidate.question === question)
        return item ? [item] : []
    })

    return (
        <section data-tone="paper" className="bg-tone text-tone-ink">
            <div className="section-shell section-pad">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
                    <div>
                        <SectionHeader
                            eyebrow="FAQ"
                            title="Questions, answered"
                            lede="The short version of what people ask before their first report."
                            className="mb-8"
                        />
                        <Link
                            href="/faq"
                            className="group inline-flex items-center gap-2 border-b-2 border-ink pb-1 text-lg font-bold"
                        >
                            Read the full FAQ
                            <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out-strong group-hover:translate-x-1.5" />
                        </Link>
                    </div>

                    <Reveal className="flex flex-col">
                        {items.map((item) => (
                            <details
                                key={item.question}
                                className="faq-accordion group border-t-2 border-ink/10"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 [&::-webkit-details-marker]:hidden">
                                    <h3 className="text-lg leading-tight font-extrabold transition-colors duration-200 group-hover:text-blue">
                                        {item.question}
                                    </h3>
                                    <ChevronDownIcon className="size-5 shrink-0 text-ink/45 transition-transform duration-300 ease-out-strong group-open:rotate-180" />
                                </summary>
                                <p className="max-w-[62ch] pb-7 leading-snug opacity-70">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                        <div className="border-t-2 border-ink/10" />
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
