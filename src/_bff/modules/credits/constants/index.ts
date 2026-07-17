import 'server-only'

import type { PickTokenPackage, TokenPackage } from '@/types/TokenPackage'

const STARTER_PROMO_ACTIVE = true

const STARTER_PACKAGE: PickTokenPackage = {
    id: 'starter',
    credits: 5,
    amount: STARTER_PROMO_ACTIVE ? 50 : 99,
    label: 'Starter',
}

const PRO_PACKAGE: PickTokenPackage = { id: 'pro', credits: 15, amount: 249, label: 'Pro' }

const EXPERT_PACKAGE: PickTokenPackage = { id: 'expert', credits: 50, amount: 599, label: 'Expert' }

export const TOKEN_PACKAGES = [STARTER_PACKAGE, PRO_PACKAGE, EXPERT_PACKAGE] as const

export const PACKAGES: TokenPackage[] = [
    {
        id: 'free',
        label: 'Trial',
        credits: 2,
        price: 'Free',
        pricePerToken: '2 analysis credits included',
        originalPrice: null,
        originalPricePerToken: null,
        description: 'Your first analysis, on us.',
        highlight: false,
    },
    {
        id: 'starter',
        label: STARTER_PACKAGE.label,
        credits: STARTER_PACKAGE.credits,
        price: STARTER_PROMO_ACTIVE ? '€0.50' : '€0.99',
        pricePerToken: STARTER_PROMO_ACTIVE ? '€0.10/credit' : '€0.20/credit',
        originalPrice: STARTER_PROMO_ACTIVE ? '€0.99' : null,
        originalPricePerToken: STARTER_PROMO_ACTIVE ? '€0.20/credit' : null,
        description: 'Perfect for trying out analyses',
        highlight: true,
        hasPromo: STARTER_PROMO_ACTIVE,
    },
    {
        id: 'pro',
        label: PRO_PACKAGE.label,
        credits: PRO_PACKAGE.credits,
        price: '€2.49',
        pricePerToken: '€0.17/credit',
        originalPrice: null,
        originalPricePerToken: null,
        description: 'Most popular for regular investors',
        highlight: false,
    },
    {
        id: 'expert',
        label: EXPERT_PACKAGE.label,
        credits: EXPERT_PACKAGE.credits,
        price: '€5.99',
        pricePerToken: '€0.12/credit',
        originalPrice: null,
        originalPricePerToken: null,
        description: 'Best value for power users',
        highlight: false,
    },
]
