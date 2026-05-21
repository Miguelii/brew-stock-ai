'use client'

import { trpc } from '@/server/trpc-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CoinsIcon, ZapIcon, StarIcon, TrophyIcon, Loader2Icon } from 'lucide-react'
import { toastError } from '@/lib/toast-error'
import { cn } from '@/lib/utils'
import { TokenPromo } from '@/modules/tokens/token-packages/token-promo'
import { useTransition } from 'react'

// Set to false to restore original pricing
const LAUNCH_PROMO_ACTIVE = true

const PACKAGES = [
    {
        id: 'free' as const,
        label: 'Trial',
        credits: 2,
        price: 'Free',
        pricePerToken: '2 analysis token included',
        originalPrice: null as string | null,
        originalPricePerToken: null as string | null,
        description: 'Your first analysis, on us.',
        icon: TrophyIcon,
        highlight: false,
    },
    {
        id: 'starter' as const,
        label: 'Starter',
        credits: 5,
        price: LAUNCH_PROMO_ACTIVE ? '€1.25' : '€2.49',
        pricePerToken: LAUNCH_PROMO_ACTIVE ? '€0.25/token' : '€0.50/token',
        originalPrice: LAUNCH_PROMO_ACTIVE ? '€2.49' : null,
        originalPricePerToken: LAUNCH_PROMO_ACTIVE ? '€0.50/token' : null,
        description: 'Perfect for trying out analyses',
        icon: ZapIcon,
        highlight: true,
    },
    {
        id: 'pro' as const,
        label: 'Pro',
        credits: 15,
        price: LAUNCH_PROMO_ACTIVE ? '€3.00' : '€5.99',
        pricePerToken: LAUNCH_PROMO_ACTIVE ? '€0.20/token' : '€0.40/token',
        originalPrice: LAUNCH_PROMO_ACTIVE ? '€5.99' : null,
        originalPricePerToken: LAUNCH_PROMO_ACTIVE ? '€0.40/token' : null,
        description: 'Most popular for regular investors',
        icon: StarIcon,
        highlight: false,
    },
    {
        id: 'expert' as const,
        label: 'Expert',
        credits: 50,
        price: LAUNCH_PROMO_ACTIVE ? '€7.50' : '€14.99',
        pricePerToken: LAUNCH_PROMO_ACTIVE ? '€0.15/token' : '€0.30/token',
        originalPrice: LAUNCH_PROMO_ACTIVE ? '€14.99' : null,
        originalPricePerToken: LAUNCH_PROMO_ACTIVE ? '€0.30/token' : null,
        description: 'Best value for power users',
        icon: TrophyIcon,
        highlight: false,
    },
]

type Props = {
    showFree?: boolean
    showBuyButton?: boolean
    className?: string
}

export function TokenPackages({ showFree = false, showBuyButton = true, className }: Props) {
    const [pending, startTransition] = useTransition()

    const checkout = trpc.createCheckoutSession.useMutation({
        onSuccess: (url) => {
            startTransition(() => {
                window.location.href = url
            })
        },
        onError: (error) => {
            toastError('Failed to start checkout.', error, 'Please try again later.')
        },
    })

    return (
        <div className="w-full">
            <style>{`
                @keyframes shimmer-sweep {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .promo-shimmer::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        105deg,
                        transparent 40%,
                        rgba(59,130,246,0.08) 50%,
                        transparent 60%
                    );
                    animation: shimmer-sweep 3.2s ease-in-out infinite;
                }
            `}</style>

            {LAUNCH_PROMO_ACTIVE ? <TokenPromo /> : null}

            <div
                className={cn(
                    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
                    className
                )}
            >
                {PACKAGES.map((pkg) => {
                    const Icon = pkg.icon
                    const isLoading = checkout.isPending && checkout.variables?.packageId === pkg.id
                    const isPromo = LAUNCH_PROMO_ACTIVE && pkg.id !== 'free'

                    if (!showFree && pkg.id === 'free') return null

                    return (
                        <Card
                            key={pkg.id}
                            className={cn(
                                'relative flex flex-col rounded-none gap-0 pt-0 overflow-visible transition-shadow duration-300',
                                pkg.highlight && 'border-accent-blue bg-accent-blue/5 shadow-md'
                            )}
                        >
                            <CardContent className="flex flex-col gap-4 p-6">
                                {pkg.highlight && (
                                    <span className="z-50 absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-none bg-accent-blue text-background whitespace-nowrap">
                                        Most Popular
                                    </span>
                                )}

                                {isPromo && (
                                    <span className="absolute top-3 right-3 text-[9px] font-bold tracking-wider text-accent-blue border border-accent-blue/35 px-1.5 py-0.5 leading-tight">
                                        50% OFF
                                    </span>
                                )}

                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            'p-2 rounded-sm',
                                            pkg.highlight ? 'bg-accent-blue/20' : 'bg-muted'
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'w-5 h-5',
                                                pkg.highlight
                                                    ? 'text-accent-blue'
                                                    : 'text-muted-foreground'
                                            )}
                                        />
                                    </div>
                                    <span className="font-semibold text-foreground">
                                        {pkg.label}
                                    </span>
                                </div>

                                <div>
                                    {pkg.originalPrice && (
                                        <span className="text-xs text-muted-foreground line-through tabular-nums block mb-0.5">
                                            {pkg.originalPrice}
                                        </span>
                                    )}
                                    <div className="flex items-end gap-1.5">
                                        <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
                                            {pkg.price}
                                        </span>
                                        {pkg.id !== 'free' && (
                                            <span className="text-sm text-muted-foreground mb-1">
                                                one-time
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    {pkg.originalPricePerToken ? (
                                        <>
                                            <span className="line-through mr-1">
                                                {pkg.originalPricePerToken}
                                            </span>
                                            <span className="text-accent-blue font-medium">
                                                {pkg.pricePerToken}
                                            </span>
                                        </>
                                    ) : (
                                        pkg.pricePerToken
                                    )}
                                </p>

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

                                {showBuyButton && (
                                    <Button
                                        className="mt-auto w-full"
                                        variant={pkg.highlight ? 'default' : 'outline'}
                                        disabled={checkout.isPending}
                                        onClick={() =>
                                            checkout.mutate({
                                                packageId: pkg.id as 'starter' | 'pro' | 'expert',
                                            })
                                        }
                                    >
                                        {pending || isLoading ? (
                                            <>
                                                <Loader2Icon className="animate-spin w-3 h-3" />
                                                Creating checkout
                                            </>
                                        ) : (
                                            'Buy Now'
                                        )}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
