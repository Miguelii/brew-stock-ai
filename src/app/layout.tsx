import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { ClientEnv } from '@/env/client'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
import { CookiePrompt } from '@/modules/cookie-prompt'
import {
    OrganizationSchema,
    WebApplicationSchema,
    WebSiteSchema,
} from '@/components/structured-data'
import { GOOGLE_ADSENSE_ACCOUNT_ID } from '@/lib/constants'
import { GtmScript } from '@/components/scripts/gtm-script'
import { AdsenseScript } from '@/components/scripts/adsence-script'
import { TrpcContextProvider } from '@/_trpc/context/trpc-context.provider'

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

export const viewport: Viewport = {
    colorScheme: 'light',
    width: 'device-width',
    initialScale: 1,
    height: 'device-height',
}

const META_TITLE = 'StockBrewAI | AI-Powered Stock Analysis'
const META_DESCRIPTION =
    'Get institutional-grade AI stock analysis for any equity — financial metrics, market sentiment, and technical indicators. For less than a coffee.'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: META_TITLE,
        template: '%s | StockBrewAI',
    },
    description: META_DESCRIPTION,
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
        title: {
            default: META_TITLE,
            template: '%s | StockBrewAI',
        },
        description: META_DESCRIPTION,
    },
    twitter: {
        card: 'summary_large_image',
        title: {
            default: META_TITLE,
            template: '%s | StockBrewAI',
        },
        description: META_DESCRIPTION,
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
                <script
                    defer
                    data-website-id="dfid_MsT1XaqrlyOQW7l5eAsic"
                    data-domain="brewstockai.com"
                    src="https://datafa.st/js/script.js"
                />
            </head>
            <VercelAnalytics />
            <VercelSpeedInsights />
            <GtmScript />
            <AdsenseScript />
            <body className="min-h-screen flex flex-col">
                <TrpcContextProvider>
                    <WebSiteSchema />
                    <WebApplicationSchema />
                    <OrganizationSchema />
                    <Toaster />
                    <CookiePrompt />
                    <div className="flex-1">{children}</div>
                    <Footer />
                </TrpcContextProvider>
                <ServiceWorkerRegister />
            </body>
        </html>
    )
}
