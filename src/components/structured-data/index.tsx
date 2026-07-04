import { ClientEnv } from '@/env/client'
import { SITE_AUTHOR_NAME, SITE_AUTHOR_URL } from '@/lib/constants'

const WEBSITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export function OrganizationSchema() {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'StockBrewAI',
        url: WEBSITE_URL,
        logo: `${WEBSITE_URL}/web-app-manifest-192x192.png`,
        description:
            'Institutional-grade AI stock analysis for any equity. Financial metrics, market sentiment, and technical indicators.',
        founder: {
            '@type': 'Person',
            name: SITE_AUTHOR_NAME,
            url: SITE_AUTHOR_URL,
        },
        sameAs: [SITE_AUTHOR_URL],
    }

    return (
        <script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
    )
}

export function WebSiteSchema() {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'StockBrewAI',
        url: WEBSITE_URL,
        description:
            'Institutional-grade AI stock analysis for any equity. Financial metrics, market sentiment, and technical indicators. For less than a coffee.',
        inLanguage: 'en-US',
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

export function ArticleSchema({
    title,
    description,
    url,
    datePublished,
    dateModified,
}: Readonly<{
    title: string
    description: string
    url: string
    datePublished: string
    dateModified?: string
}>) {
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        image: `${WEBSITE_URL}/opengraph-image.png`,
        datePublished,
        dateModified: dateModified ?? datePublished,
        inLanguage: 'en-US',
        author: {
            '@type': 'Person',
            name: SITE_AUTHOR_NAME,
            url: SITE_AUTHOR_URL,
        },
        publisher: {
            '@type': 'Organization',
            name: 'StockBrewAI',
            url: WEBSITE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${WEBSITE_URL}/web-app-manifest-192x192.png`,
            },
        },
    }

    return (
        <script
            id="article-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
    )
}

export function FAQSchema({
    questions,
}: Readonly<{ questions: Array<{ question: string; answer: string }> }>) {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
            },
        })),
    }

    return (
        <script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
    )
}

export function FinancialProductSchema({
    ticker,
    name,
    description,
    url,
}: Readonly<{ ticker: string; name: string; description: string; url: string }>) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: `${name} (${ticker}) Stock`,
        description,
        url,
        provider: {
            '@type': 'Organization',
            name: 'StockBrewAI',
            url: WEBSITE_URL,
        },
        category: 'Stock Analysis',
    }

    return (
        <script
            id="financial-product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export function BreadcrumbSchema({
    items,
}: Readonly<{ items: Array<{ name: string; url: string }> }>) {
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
