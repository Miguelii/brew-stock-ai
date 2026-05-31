import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { TokenPackages } from '@/modules/tokens/token-packages'
import { CheckIcon } from 'lucide-react'
import { TokenBalanceCard } from '@/modules/tokens/token-balance-card'
import { PendingPaymentBanner } from '@/modules/tokens/pending-payment-banner'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Buy Credits'
const META_DESCRIPTION =
    'Buy StockBrewAI credits to unlock AI-powered stock analysis reports. Pay-as-you-go — credits never expire and each analysis costs just 1–2 credits.'
const META_URL = `${SITE_URL}/tokens`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    alternates: {
        canonical: META_URL,
    },
    openGraph: {
        title: META_TITLE,
        description: META_DESCRIPTION,
        url: META_URL,
    },
    twitter: {
        title: META_TITLE,
        description: META_DESCRIPTION,
    },
}

type Props = PageProps<'/tokens'>

export default async function TokensPage({ searchParams }: Props) {
    const params = await searchParams

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />
            <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Buy Credits
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Each analysis costs 1–2 credits depending on depth. Credits never expire.
                    </p>
                </div>

                {params.success && (
                    <div className="flex items-center gap-3 rounded-none border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                        <CheckIcon className="w-4 h-4 shrink-0" />
                        Payment successful! Your credits have been added to your account.
                    </div>
                )}

                {params.canceled && (
                    <div className="flex items-center gap-3 rounded-none border border-yellow-400 bg-yellow-400/10 px-4 py-3 text-sm text-muted-foreground">
                        Checkout was canceled. No charges were made.
                    </div>
                )}

                <TokenBalanceCard />

                <PendingPaymentBanner />

                <Separator />

                <TokenPackages
                    showFree={false}
                    showBuyButton={true}
                    className="md:grid-cols-2 lg:grid-cols-3"
                />
            </main>
        </>
    )
}
