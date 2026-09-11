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

    const showPromoBanner = packages.some((item) => item.hasPromo === true)

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
                                'relative flex flex-col gap-0 overflow-visible border-0 bg-card pt-0 text-ink',
                                pkg.highlight && 'ring-[3px] ring-ink'
                            )}
                        >
                            <CardContent className="flex flex-col gap-4 p-6">
                                {pkg.highlight && (
                                    <span className="absolute -top-3 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-3 py-1 font-mono text-[11px] font-medium tracking-wider whitespace-nowrap text-paper uppercase">
                                        Most Popular
                                    </span>
                                )}

                                {pkg.hasPromo && (
                                    <span className="absolute top-4 right-4 rounded-full bg-tangerine px-2.5 py-1 font-mono text-[11px] leading-tight font-medium tracking-wider text-white uppercase">
                                        50% OFF
                                    </span>
                                )}

                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            'rounded-full p-2.5',
                                            pkg.highlight ? 'bg-blue/12' : 'bg-ink/6'
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'w-5 h-5',
                                                pkg.highlight ? 'text-blue' : 'text-ink/55'
                                            )}
                                        />
                                    </div>
                                    <span className="text-lg font-extrabold">{pkg.label}</span>
                                </div>

                                <div>
                                    {pkg.originalPrice && (
                                        <span className="text-xs text-muted-foreground line-through tabular-nums block mb-0.5">
                                            {pkg.originalPrice}
                                        </span>
                                    )}
                                    <div className="flex items-end gap-1.5">
                                        <span className="display text-[40px] tabular-nums">
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
