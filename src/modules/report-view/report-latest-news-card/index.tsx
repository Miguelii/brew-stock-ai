import { NewspaperIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { NewsItem } from '@/types/news'
import { NewsLeadStory } from '@/modules/report-view/report-latest-news-card/news-lead/news-lead-story'
import { NewsListItem } from '@/modules/report-view/report-latest-news-card/news-list-item'

type Props = {
    news: NewsItem[]
    ticker?: string
}

export function ReportLatestNewsCard({ news, ticker }: Props) {
    const [lead, ...rest] = news ?? []
    const hasList = rest.length > 0

    return (
        <Card data-testid="latest-news-card" className="h-fit gap-0">
            <CardHeader className="border-b-2 border-ink/8 pb-4">
                <CardTitle className="display text-2xl">
                    {ticker ? (
                        <>
                            <span>Recent news mentioning </span>
                            <span className="text-blue">{ticker}</span>
                        </>
                    ) : (
                        'Recent news'
                    )}
                </CardTitle>
                <CardDescription className="text-xs text-ink/60">
                    The latest headlines about this company from across the financial press
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                {lead ? (
                    <div className={cn('grid gap-6', hasList ? 'lg:grid-cols-2' : 'max-w-xl')}>
                        <NewsLeadStory item={lead} ticker={ticker} />

                        {hasList && (
                            <div className="flex flex-col">
                                <p className="eyebrow border-b-2 border-ink/8 pb-2 text-xs text-ink/60">
                                    Latest headlines
                                </p>
                                <ol>
                                    {rest.map((item, i) => (
                                        <NewsListItem key={item.id} item={item} position={i + 1} />
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        data-testid="latest-news-empty"
                        className="flex flex-col items-center justify-center gap-2 py-8 text-center"
                    >
                        <NewspaperIcon aria-hidden="true" className="size-6 text-ink/30" />
                        <span className="text-xs text-ink/60">No recent news available</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
