import { ArrowUpRightIcon } from 'lucide-react'
import type { NewsItem } from '@/types/news'
import { NewsLeadMedia } from '@/modules/report-view/report-latest-news-card/news-lead/news-lead-media'
import { formatNewsAge, toIsoDateTime } from '@/modules/report-view/report-latest-news-card/utils'

type Props = {
    item: NewsItem
    ticker?: string
}

export function NewsLeadStory({ item, ticker }: Props) {
    return (
        <a
            data-testid="latest-news-lead"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 rounded-[var(--radius-surface-inner)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-blue"
        >
            <NewsLeadMedia image={item.image} source={item.source} ticker={ticker} />

            <div className="flex flex-col gap-1.5">
                <p className="eyebrow flex flex-wrap items-center gap-x-2 text-xs text-ink/60">
                    <span className="text-blue">Featured</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.source}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={toIsoDateTime(item.datetime)}>
                        {formatNewsAge(item.datetime)}
                    </time>
                </p>

                <p
                    data-testid="latest-news-lead-headline"
                    className="line-clamp-2 text-lg leading-tight font-semibold text-ink transition-colors duration-200 group-hover:text-blue lg:text-xl"
                >
                    {item.headline}
                </p>

                {item.summary && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-ink/60">
                        {item.summary}
                    </p>
                )}

                <span className="mt-0.5 inline-flex w-fit items-center gap-1 text-sm font-semibold transition-colors duration-200 group-hover:text-blue text-blue">
                    Read on {item.source}
                    <ArrowUpRightIcon
                        aria-hidden="true"
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                </span>
            </div>
        </a>
    )
}
