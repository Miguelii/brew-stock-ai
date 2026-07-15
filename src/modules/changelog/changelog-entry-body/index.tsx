import { Fragment } from 'react'
import { CheckIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import type { ChangelogEntry } from '@/types/ChangelogEntry'

type Props = {
    entry: ChangelogEntry
}

export function ChangelogEntryBody({ entry }: Props) {
    return (
        <article className="max-w-none">
            {entry.highlights.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 rounded-none border border-border bg-card p-6"
                >
                    <p className="text-xs font-semibold tracking-widest uppercase text-accent-blue mb-4">
                        What is new
                    </p>
                    <ul className="flex flex-col gap-3">
                        {entry.highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-3">
                                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-blue-light text-accent-blue">
                                    <CheckIcon className="size-3" />
                                </span>
                                <span className="text-sm text-primary-muted leading-relaxed">
                                    {highlight}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {entry.sections.map((section, i) => (
                <Fragment key={`changelog-section-${section.heading || i}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1 + i * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mb-8"
                    >
                        {section.heading && (
                            <h2 className="text-xl font-semibold mb-3 text-primary">
                                {section.heading}
                            </h2>
                        )}
                        <p className="text-primary-muted leading-relaxed text-base">
                            {section.body}
                        </p>
                        {section.bullets && section.bullets.length > 0 && (
                            <ul className="mt-4 flex flex-col gap-2 pl-1">
                                {section.bullets.map((bullet) => (
                                    <li
                                        key={bullet}
                                        className="flex items-start gap-3 text-sm text-primary-muted leading-relaxed"
                                    >
                                        <span
                                            aria-hidden
                                            className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-blue"
                                        />
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                </Fragment>
            ))}
        </article>
    )
}
