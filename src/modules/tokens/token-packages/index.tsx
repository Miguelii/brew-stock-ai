'use client'

import { trpcClient } from '@/_trpc/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CoinsIcon, Loader2Icon } from 'lucide-react'
import { toastError } from '@/lib/toast-error'
import { cn } from '@/lib/utils'
import { TokenPromo } from '@/modules/tokens/token-packages/token-promo'
import { useTransition } from 'react'
import type { TokenPackage } from '@/types/TokenPackage'
import { getPackageIcon } from './get-package-icon'

type Props = {
    showFree?: boolean
    showBuyButton?: boolean
    className?: string
    packages: TokenPackage[]
}

export function TokenPackages({
    showFree = false,
    showBuyButton = true,
    className,
    packages,
}: Props) {
    const [pending, startTransition] = useTransition()

    const showPromoBanner = packages.some((item) => item.hasPromo === true) != null

    const checkout = trpcClient.credits.createCheckoutSession.useMutation({
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

            {showPromoBanner ? <TokenPromo /> : null}

            <div
                className={cn(
                    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
                    className
                )}
            >
                {packages.map((pkg) => {
                    const Icon = getPackageIcon(pkg.id)
                    const isLoading = checkout.isPending && checkout.variables?.packageId === pkg.id

                    if (!showFree && pkg.id === 'free') return null

                    return (
                        <Card
                            key={pkg.id}
                            data-testid={`token-package-${pkg.id}`}
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

                                {pkg.hasPromo && (
                                    <span className="absolute top-3 right-3 text-xs font-bold tracking-wider text-accent-blue border border-accent-blue/35 px-1.5 py-0.5 leading-tight">
                                        50% OFF
                                    </span>
                                )}

                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            'p-2 rounded-none',
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
                                        analysis credits
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground">{pkg.description}</p>

                                {showBuyButton && (
                                    <Button
                                        data-testid="buy-now-button"
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
