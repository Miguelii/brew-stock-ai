'use client'

import { trpc } from '@/server/trpc-client'
import { Button } from '@/components/ui/button'
import { CoinsIcon, ZapIcon, StarIcon, TrophyIcon } from 'lucide-react'
import { toast } from 'sonner'

const PACKAGES = [
    {
        id: 'starter' as const,
        label: 'Starter',
        credits: 5,
        price: '€2.49',
        pricePerToken: '€0.50/token',
        description: 'Perfect for trying out analyses',
        icon: ZapIcon,
        highlight: false,
    },
    {
        id: 'pro' as const,
        label: 'Pro',
        credits: 15,
        price: '€5.99',
        pricePerToken: '€0.40/token',
        description: 'Most popular for regular investors',
        icon: StarIcon,
        highlight: true,
    },
    {
        id: 'expert' as const,
        label: 'Expert',
        credits: 50,
        price: '€14.99',
        pricePerToken: '€0.30/token',
        description: 'Best value for power users',
        icon: TrophyIcon,
        highlight: false,
    },
]

export function TokenPackages() {
    const checkout = trpc.createCheckoutSession.useMutation({
        onSuccess: (url) => {
            window.location.href = url
        },
        onError: () => {
            toast.error('Failed to start checkout. Please try again.')
        },
    })

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => {
                const Icon = pkg.icon
                const isLoading = checkout.isPending && checkout.variables?.packageId === pkg.id

                return (
                    <div
                        key={pkg.id}
                        className={`relative flex flex-col rounded-xl border p-6 gap-4 ${
                            pkg.highlight
                                ? 'border-accent-blue bg-accent-blue/5 shadow-md'
                                : 'border-border bg-card'
                        }`}
                    >
                        {pkg.highlight && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full bg-accent-blue text-white">
                                Most Popular
                            </span>
                        )}

                        <div className="flex items-center gap-3">
                            <div
                                className={`p-2 rounded-lg ${pkg.highlight ? 'bg-accent-blue/20' : 'bg-muted'}`}
                            >
                                <Icon
                                    className={`w-5 h-5 ${pkg.highlight ? 'text-accent-blue' : 'text-muted-foreground'}`}
                                />
                            </div>
                            <span className="font-semibold text-foreground">{pkg.label}</span>
                        </div>

                        <div className="flex items-end gap-1.5">
                            <span className="text-3xl font-bold tracking-tight text-foreground">
                                {pkg.price}
                            </span>
                            <span className="text-sm text-muted-foreground mb-1">one-time</span>
                        </div>

                        <p className="text-xs text-muted-foreground">{pkg.pricePerToken}</p>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CoinsIcon className="w-4 h-4 text-accent-blue shrink-0" />
                            <span>
                                <span className="font-semibold text-foreground tabular-nums">
                                    {pkg.credits}
                                </span>{' '}
                                analysis tokens
                            </span>
                        </div>

                        <p className="text-sm text-muted-foreground">{pkg.description}</p>

                        <Button
                            className="mt-auto w-full"
                            variant={pkg.highlight ? 'default' : 'outline'}
                            disabled={checkout.isPending}
                            onClick={() => checkout.mutate({ packageId: pkg.id })}
                        >
                            {isLoading ? 'Redirecting…' : 'Buy Now'}
                        </Button>
                    </div>
                )
            })}
        </div>
    )
}
