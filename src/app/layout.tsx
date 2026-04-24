import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Providers } from '@/providers'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'EquityIntel — AI Stock Analysis',
    description: 'Institutional-grade AI stock analysis platform for private investors.',
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
                    <Header />
                    <div className="flex-1">{children}</div>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
