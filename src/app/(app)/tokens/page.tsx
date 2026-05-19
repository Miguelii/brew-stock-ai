import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { TokenPackages } from '@/modules/tokens/token-packages'
import { CheckIcon } from 'lucide-react'
import { TokenBalanceCard } from '@/modules/tokens/token-balance-card'

export const metadata: Metadata = {
    title: 'Buy Tokens',
}

type Props = PageProps<'/tokens'>

export default async function TokensPage({ searchParams }: Props) {
    const params = await searchParams

    return (
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Buy Tokens</h1>
                <p className="text-sm text-muted-foreground">
                    Each analysis costs 1–2 tokens depending on depth. Tokens never expire.
                </p>
            </div>

            {params.success && (
                <div className="flex items-center gap-3 rounded-none border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                    <CheckIcon className="w-4 h-4 shrink-0" />
                    Payment successful! Your tokens have been added to your account.
                </div>
            )}

            {params.canceled && (
                <div className="flex items-center gap-3 rounded-none border border-yellow-400 bg-yellow-400/10 px-4 py-3 text-sm text-muted-foreground">
                    Checkout was canceled. No charges were made.
                </div>
            )}

            <TokenBalanceCard />

            <Separator />

            <TokenPackages
                showFree={false}
                showBuyButton={true}
                className="md:grid-cols-2 lg:grid-cols-3"
            />
        </main>
    )
}
