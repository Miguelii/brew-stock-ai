'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Hills } from '@/components/scene/hills'
import { getNewsImageUrl } from '@/_bff/core/helpers/news-image.helper'

type Props = {
    image: string
    source: string
    ticker?: string
}

type CoverProps = Pick<Props, 'source' | 'ticker'>

function NewsCover({ source, ticker }: CoverProps) {
    return (
        <div
            data-testid="latest-news-lead-cover"
            data-tone="navy"
            aria-hidden="true"
            className="absolute inset-0 flex flex-col justify-between bg-tone p-4 text-tone-ink lg:p-5"
        >
            <div className="absolute inset-x-0 bottom-0 h-1/2 text-tone-ink/10">
                <Hills variant="back" fill="currentColor" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 text-tone-ink/15">
                <Hills variant="front" fill="currentColor" />
            </div>

            <span className="eyebrow relative text-tone-ink/70">Latest coverage · {source}</span>
            <span className="display display-card relative text-amber-soft">
                {ticker ?? 'News'}
            </span>
        </div>
    )
}

export function NewsLeadMedia({ image, source, ticker }: Props) {
    const [hasFailed, setHasFailed] = useState(false)
    const src = getNewsImageUrl(image)

    return (
        <div className="relative aspect-[2/1] overflow-hidden rounded-[var(--radius-surface-inner)] bg-navy">
            {src && !hasFailed ? (
                <Image
                    data-testid="latest-news-lead-image"
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                    onError={() => setHasFailed(true)}
                />
            ) : (
                <NewsCover source={source} ticker={ticker} />
            )}
        </div>
    )
}
