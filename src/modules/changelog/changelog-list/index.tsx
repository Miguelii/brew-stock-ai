import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import { CHANGELOG_ENTRIES_BY_DATE } from '@/modules/changelog/changelog'
import { ChangelogMeta } from '@/modules/changelog/changelog-meta'

export function ChangelogList() {
    return (
        <div className="flex flex-col divide-y divide-border">
            {CHANGELOG_ENTRIES_BY_DATE.map((entry, i) => (
                <motion.article
                    key={entry.slug}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="py-8 first:pt-0 last:pb-0"
                >
                    <Link
                        href={`/changelog/${entry.slug}`}
                        prefetch={false}
                        className="group flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                    >
                        <div className="flex-1">
                            <div className="mb-3">
                                <ChangelogMeta
                                    version={entry.version}
                                    tags={entry.tags}
                                    publishedAt={entry.publishedAt}
                                />
                            </div>
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-accent-blue transition-colors duration-200">
                                {entry.title}
                            </h2>
                            <p className="text-primary-muted text-sm leading-relaxed max-w-2xl">
                                {entry.description}
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center text-accent-blue text-sm font-medium gap-1 group-hover:gap-2 transition-all duration-200">
                            Read
                            <ArrowRightIcon className="size-4" />
                        </div>
                    </Link>
                </motion.article>
            ))}
        </div>
    )
}
