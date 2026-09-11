import { ChevronDownIcon } from 'lucide-react'
import * as motion from 'motion/react-client'

type Props = {
    companyName: string
    questions: {
        question: string
        answer: string
    }[]
}

export function TickerFaq({ companyName, questions }: Props) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            <h2 className="text-2xl font-bold tracking-tight mb-6">
                Frequently asked questions about {companyName}
            </h2>
            <div className="flex flex-col">
                {questions.map((item) => (
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
            </div>
        </motion.section>
    )
}
