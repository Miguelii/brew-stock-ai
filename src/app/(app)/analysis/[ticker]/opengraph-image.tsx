import { ImageResponse } from 'next/og'
import { TICKER_PAGES, resolveTickerPage } from '@/lib/ticker-pages'
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from '@/modules/og/og-card'
import { truncateText } from '@/_bff/core/utils/formatters.utils'

export const alt = 'Stock analysis on BrewStock'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

const OG_DESCRIPTION_MAX_CHARS = 120

export function generateStaticParams() {
    return TICKER_PAGES.map((t) => ({ ticker: t.slug }))
}

type Props = PageProps<'/analysis/[ticker]'>

export default async function Image({ params }: Props) {
    const { ticker } = await params
    const page = resolveTickerPage(ticker)

    return new ImageResponse(
        <OgCard
            eyebrow={page ? `${page.ticker} · ${page.sector}` : 'Stock analysis'}
            title={page ? `${page.name} stock analysis` : 'Stock analysis'}
            description={
                page ? truncateText(page.description, OG_DESCRIPTION_MAX_CHARS) : undefined
            }
        />,
        size
    )
}
