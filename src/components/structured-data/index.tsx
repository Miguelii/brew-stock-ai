import { ClientEnv } from '@/env/client'
import { SITE_AUTHOR_NAME } from '@/lib/constants'
import { PACKAGES, TOKEN_PACKAGES } from '@/_bff/modules/credits/constants'

const WEBSITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

// The site is published anonymously: the brand itself is the author of every article
const ORGANIZATION_SCHEMA_ID = `${WEBSITE_URL}/#organization`

const LOGO_URL = `${WEBSITE_URL}/web-app-manifest-192x192.png`

const PRICING_URL = `${WEBSITE_URL}/pricing`

const OFFER_CURRENCY = 'EUR'

const TRIAL_CREDITS = PACKAGES.find((pkg) => pkg.id === 'free')?.credits

// One Offer per real price point, derived from the checkout packages so promos stay in sync
const APP_OFFERS = [
    ...(TRIAL_CREDITS
        ? [
              {
                  '@type': 'Offer',
                  name: 'Trial',
                  price: '0',
                  priceCurrency: OFFER_CURRENCY,
                  description: `${TRIAL_CREDITS} free analysis credits for new accounts.`,
                  url: PRICING_URL,
              },
          ]
        : []),
    ...TOKEN_PACKAGES.map((pkg) => ({
        '@type': 'Offer',
        name: `${pkg.label} (${pkg.credits} credits)`,
        // Package amounts are stored in cents
        price: (pkg.amount / 100).toFixed(2),
        priceCurrency: OFFER_CURRENCY,
        url: PRICING_URL,
    })),
]

// JSON.stringify does not HTML-escape; a `</script>` or `<` in the data would
// break out of the script tag, so escape the three dangerous characters.
function jsonLdHtml(schema: object): { __html: string } {
    return {
        __html: JSON.stringify(schema)
            .replaceAll('<', String.raw`\u003c`)
            .replaceAll('>', String.raw`\u003e`)
            .replaceAll('&', String.raw`\u0026`),
    }
}

export function OrganizationSchema() {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': ORGANIZATION_SCHEMA_ID,
        name: SITE_AUTHOR_NAME,
        url: WEBSITE_URL,
        logo: LOGO_URL,
        description:
            'Institutional-grade stock analysis for any equity. Financial metrics, market sentiment, and technical indicators.',
    }

    return (
        <script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={jsonLdHtml(organizationSchema)}
        />
    )
}

export function WebSiteSchema() {
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'BrewStock',
        url: WEBSITE_URL,
        description:
            'Institutional-grade stock analysis for any equity. Financial metrics, market sentiment, and technical indicators. For less than a coffee.',
        inLanguage: 'en-US',
    }

    return (
        <script
            id="website-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={jsonLdHtml(websiteSchema)}
        />
    )
}

export function WebApplicationSchema() {
    const appSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'BrewStock',
        url: WEBSITE_URL,
        description:
            'AI-powered stock analysis tool that delivers institutional-grade financial insights, market sentiment, and technical indicators for any equity.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: APP_OFFERS,
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
            dangerouslySetInnerHTML={jsonLdHtml(appSchema)}
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
        // Author and publisher both point at the `OrganizationSchema` entity (rendered in
        // the root layout), so every article resolves to the same described brand.
        author: {
            '@type': 'Organization',
            '@id': ORGANIZATION_SCHEMA_ID,
            name: SITE_AUTHOR_NAME,
            url: WEBSITE_URL,
        },
        publisher: {
            '@type': 'Organization',
            '@id': ORGANIZATION_SCHEMA_ID,
            name: SITE_AUTHOR_NAME,
            url: WEBSITE_URL,
            logo: {
                '@type': 'ImageObject',
                url: LOGO_URL,
            },
        },
    }

    return (
        <script
            id="article-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={jsonLdHtml(articleSchema)}
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
            dangerouslySetInnerHTML={jsonLdHtml(faqSchema)}
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
            name: 'BrewStock',
            url: WEBSITE_URL,
        },
        category: 'Stock Analysis',
    }

    return (
        <script
            id="financial-product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={jsonLdHtml(schema)}
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
            dangerouslySetInnerHTML={jsonLdHtml(breadcrumbSchema)}
        />
    )
}
