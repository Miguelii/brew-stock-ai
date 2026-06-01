import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { NewsItem } from '@/types/news'
import { formatDate } from '@/lib/formatters'

type Props = {
    news: NewsItem[]
}

export function ReportLatestNewsCard({ news }: Props) {
    const isEmpty = !news || news.length === 0

    return (
        <Card className="h-fit overflow-hidden gap-0 pb-0!">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">Latest News</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {isEmpty ? (
                    <div className="flex items-center justify-center px-4 py-10">
                        <span className="text-xs text-muted-foreground">
                            No recent news available
                        </span>
                    </div>
                ) : (
                    news.map((item, i) => {
                        const isLast = i === news.length - 1

                        return (
                            <Link
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    'group flex flex-col gap-1 px-4 py-4 transition-colors duration-200 hover:bg-muted/40',
                                    !isLast && 'border-b border-border'
                                )}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-accent-blue">
                                        {item.source}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground">
                                        · {formatDate(item.datetime)}
                                    </span>
                                </div>

                                <p className="text-xs font-medium leading-snug text-primary transition-colors duration-200 group-hover:text-accent-blue">
                                    {item.headline}
                                </p>

                                {item.summary && (
                                    <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                        {item.summary}
                                    </p>
                                )}

                                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground transition-all duration-200 group-hover:gap-1.5 group-hover:text-accent-blue">
                                    See Full Article
                                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                                        →
                                    </span>
                                </span>
                            </Link>
                        )
                    })
                )}
            </CardContent>
        </Card>
    )
}
