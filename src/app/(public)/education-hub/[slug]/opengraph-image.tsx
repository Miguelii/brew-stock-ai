import { ImageResponse } from 'next/og'
import {
    EDUCATION_HUB_ARTICLES,
    EDUCATION_HUB_ARTICLE_MAP,
    EDUCATION_HUB_THEME_LABELS,
} from '@/modules/education-hub/education-hub-articles'
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from '@/modules/og/og-card'
import { truncateText } from '@/_bff/core/utils/formatters.utils'

export const alt = 'Investing guide on BrewStock'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

const OG_DESCRIPTION_MAX_CHARS = 120

export function generateStaticParams() {
    return EDUCATION_HUB_ARTICLES.map((a) => ({ slug: a.slug }))
}

type Props = PageProps<'/education-hub/[slug]'>

export default async function Image({ params }: Props) {
    const { slug } = await params
    const article = EDUCATION_HUB_ARTICLE_MAP.get(slug)

    return new ImageResponse(
        <OgCard
            eyebrow={article ? EDUCATION_HUB_THEME_LABELS[article.theme] : 'Education Hub'}
            title={article?.title ?? 'Education Hub'}
            description={
                article ? truncateText(article.description, OG_DESCRIPTION_MAX_CHARS) : undefined
            }
        />,
        size
    )
}
