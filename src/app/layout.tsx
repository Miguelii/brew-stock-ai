import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Providers } from '@/providers'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'StockBrewAI — AI Stock Analysis',
    description:
        'Deep financial insights, market sentiment, and technical indicators. For less than a coffee',
}

type Props = LayoutProps<'/'>

export default function RootLayout({ children }: Props) {
    return (
        <html
            data-scroll-behavior="smooth"
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased font-sans text-primary`}
        >
            <VercelAnalytics />
            <VercelSpeedInsights />
            <body className="min-h-screen flex flex-col">
                <Providers>
                    <Toaster />
                    <Header />
                    <div className="flex-1">{children}</div>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
