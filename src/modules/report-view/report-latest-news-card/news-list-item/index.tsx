import { ArrowUpRightIcon } from 'lucide-react'
import type { NewsItem } from '@/types/news'
import { formatNewsAge, toIsoDateTime } from '@/modules/report-view/report-latest-news-card/utils'

type Props = {
    item: NewsItem
    position: number
}

export function NewsListItem({ item, position }: Props) {
    return (
        <li data-testid="latest-news-item" className="border-ink/10 not-last:border-b">
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 rounded-sm py-3 outline-offset-2 focus-visible:outline-2 focus-visible:outline-blue"
            >
                <span
                    aria-hidden="true"
                    className="font-mono text-xs leading-5 text-ink/40 transition-colors duration-200 group-hover:text-blue"
                >
                    {String(position).padStart(2, '0')}
                </span>

                <div className="flex flex-col gap-1">
                    <p className="eyebrow flex flex-wrap items-center gap-x-2 text-[11px] text-ink/60">
                        <span className="text-blue">{item.source}</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={toIsoDateTime(item.datetime)}>
                            {formatNewsAge(item.datetime)}
                        </time>
                    </p>

                    <p
                        data-testid="latest-news-item-headline"
                        className="line-clamp-2 text-sm leading-snug font-semibold text-ink transition-colors duration-200 group-hover:text-blue"
                    >
                        {item.headline}
                        <span className="sr-only"> (opens in a new tab)</span>
                    </p>
                </div>

                <ArrowUpRightIcon
                    aria-hidden="true"
                    className="mt-0.5 size-4 transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue motion-reduce:transition-none text-blue"
                />
            </a>
        </li>
    )
}
