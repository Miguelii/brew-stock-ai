import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next'
import { Footer } from '@/components/footer'
import { Providers } from '@/providers'
import { Toaster } from '@/components/ui/sonner'
import { ClientEnv } from '@/env/client'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
import { CookiePrompt } from '@/modules/cookie-prompt'
import { GtmScript } from '@/components/gtm-script'
import {
    OrganizationSchema,
    WebApplicationSchema,
    WebSiteSchema,
} from '@/components/structured-data'
import { GOOGLE_ADSENSE_ACCOUNT_ID } from '@/lib/constants'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap',
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
})

const siteUrl = ClientEnv.NEXT_PUBLIC_WEBSITE_URL

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'StockBrewAI — AI-Powered Stock Analysis',
        template: '%s | StockBrewAI',
    },
    description:
        'Get institutional-grade AI stock analysis for any equity — financial metrics, market sentiment, and technical indicators. For less than a coffee.',
    keywords: [
        'AI stock analysis',
        'stock market AI',
        'financial analysis tool',
        'market sentiment analysis',
        'technical indicators',
        'equity analysis',
        'investment research',
        'fundamental analysis',
        'AI investing',
        'stock report',
    ],
    authors: [
        {
            name: 'Miguel Gonçalves',
            url: 'https://www.linkedin.com/in/miguelgoncalves18/',
        },
    ],
    publisher: 'StockBrewAI',
    creator: 'StockBrewAI',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteUrl,
        siteName: 'StockBrewAI',
        title: 'StockBrewAI — AI Stock Analysis',
        description:
            'Get institutional-grade AI stock analysis for any equity — financial metrics, market sentiment, and technical indicators. For less than a coffee.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'StockBrewAI — AI Stock Analysis',
        description:
            'Get institutional-grade AI stock analysis for any equity — financial metrics, market sentiment, and technical indicators. For less than a coffee.',
    },
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

type Props = LayoutProps<'/'>

export default function RootLayout({ children }: Props) {
    return (
        <html
            data-scroll-behavior="smooth"
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased font-sans text-primary`}
        >
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="StockBrewAI" />
                <meta name="google-adsense-account" content={GOOGLE_ADSENSE_ACCOUNT_ID} />
            </head>
            <VercelAnalytics />
            <VercelSpeedInsights />
            <GtmScript />
            <Script
                id="adsense"
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_ACCOUNT_ID}`}
                crossOrigin="anonymous"
                strategy="lazyOnload"
            />
            <body className="min-h-screen flex flex-col">
                <Providers>
                    <WebSiteSchema />
                    <WebApplicationSchema />
                    <OrganizationSchema />
                    <Toaster />
                    <CookiePrompt />
                    <div className="flex-1">{children}</div>
                    <Footer />
                </Providers>
                <ServiceWorkerRegister />
            </body>
        </html>
    )
}
