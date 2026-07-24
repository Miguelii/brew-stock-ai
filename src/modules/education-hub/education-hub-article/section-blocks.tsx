import type { ArticleSection } from '@/types/EducationHubArticle'

type Props = {
    section: ArticleSection
}

export function SectionBlocks({ section }: Props) {
    return (
        <>
            {section.list && (
                <ul className="mt-4 flex flex-col gap-2">
                    {section.list.items.map((item, i) => (
                        <li
                            key={item.slice(0, 48)}
                            className="flex gap-3 text-primary-muted leading-relaxed text-base"
                        >
                            <span aria-hidden className="text-accent-blue shrink-0 tabular-nums">
                                {section.list?.ordered ? `${i + 1}.` : '•'}
                            </span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}

            {section.table && (
                <figure className="mt-6">
                    {section.table.caption && (
                        <figcaption className="text-sm font-semibold text-primary mb-3">
                            {section.table.caption}
                        </figcaption>
                    )}
                    <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-border bg-card">
                                    {section.table.headers.map((header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className="px-4 py-3 text-left font-semibold text-primary whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {section.table.rows.map((row) => (
                                    <tr
                                        key={row.join('|')}
                                        className="border-b border-border last:border-0"
                                    >
                                        {row.map((cell, i) => (
                                            <td
                                                key={`${row.join('|')}-${i}`}
                                                className="px-4 py-3 align-top text-primary-muted"
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {section.table.footnote && (
                        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                            {section.table.footnote}
                        </p>
                    )}
                </figure>
            )}

            {section.callout && (
                <aside className="mt-6 rounded-lg border border-border bg-card p-5">
                    <p className="text-sm font-semibold text-primary mb-2">
                        {section.callout.title}
                    </p>
                    <p className="text-sm text-primary-muted leading-relaxed">
                        {section.callout.body}
                    </p>
                </aside>
            )}

            {section.afterBody && (
                <p className="mt-4 text-primary-muted leading-relaxed text-base">
                    {section.afterBody}
                </p>
            )}
        </>
    )
}
