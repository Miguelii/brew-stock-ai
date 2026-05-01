import { ClientEnv } from '@/env/client'

const WEBSITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export function WebSiteSchema() {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'StockBrewAI',
        url: WEBSITE_URL,
        description:
            'Institutional-grade AI stock analysis for any equity — financial metrics, market sentiment, and technical indicators. For less than a coffee.',
        inLanguage: 'en-US',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${WEBSITE_URL}/?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }

    return (
        <script
            id="website-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
    )
}

export function WebApplicationSchema() {
    const appSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'StockBrewAI',
        url: WEBSITE_URL,
        description:
            'AI-powered stock analysis tool that delivers institutional-grade financial insights, market sentiment, and technical indicators for any equity.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'AI stock analysis for less than the price of a coffee.',
        },
        featureList: [
            'AI-powered fundamental analysis',
            'Market sentiment scoring',
            'Technical indicators',
            'Financial metrics breakdown',
            'Moat analysis',
            'Risk assessment',
            'Growth potential analysis',
        ],
    }

    return (
        <script
            id="web-application-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
    )
}

// oxlint-disable-next-line no-unused-vars - to be used in the future
function BreadcrumbSchema({ items }: Readonly<{ items: Array<{ name: string; url: string }> }>) {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }

    return (
        <script
            id="breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
    )
}
