import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Providers } from '@/providers'
import { Toaster } from '@/components/ui/sonner'
import { ClientEnv } from '@/env/client'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
import { PushNotificationPrompt } from '@/features/push-notifications'
import { CookiePrompt } from '@/features/cookie-prompt'
import { getCachedSession } from '@/services/supabase/get-cached-session'
import { GtmScript } from '@/components/gtm-script'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
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

export default async function RootLayout({ children }: Props) {
    const user = await getCachedSession()

    return (
        <html
            data-scroll-behavior="smooth"
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased font-sans text-primary`}
        >
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="StockBrewAI" />
            </head>
            <VercelAnalytics />
            <VercelSpeedInsights />
            <GtmScript />
            <body className="min-h-screen flex flex-col">
                <Providers>
                    <Toaster />
                    <Header />
                    {user && <PushNotificationPrompt />}
                    <CookiePrompt />
                    <div className="flex-1">{children}</div>
                    <Footer />
                </Providers>
                <ServiceWorkerRegister />
            </body>
        </html>
    )
}
