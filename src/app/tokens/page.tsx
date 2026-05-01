import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { TokenPackages } from '@/features/tokens/token-packages'
import { CheckIcon } from 'lucide-react'
import { TokenBalanceCard } from '@/components/token-balance-card'

export const metadata: Metadata = {
    title: 'Buy Tokens',
}

type Props = PageProps<'/tokens'>

export default async function TokensPage({ searchParams }: Props) {
    const params = await searchParams

    return (
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Buy Tokens</h1>
                <p className="text-sm text-muted-foreground">
                    Each analysis costs 1–2 tokens depending on depth. Tokens never expire.
                </p>
            </div>

            {params.success && (
                <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                    <CheckIcon className="w-4 h-4 shrink-0" />
                    Payment successful! Your tokens have been added to your account.
                </div>
            )}

            {params.canceled && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                    Checkout was canceled. No charges were made.
                </div>
            )}

            <TokenBalanceCard />

            <Separator />

            <TokenPackages />
        </main>
    )
}
