import 'server-only'

// Set to false to restore original pricing
const LAUNCH_PROMO_ACTIVE = true

const PROMO_MULTIPLIER = LAUNCH_PROMO_ACTIVE ? 0.5 : 1

export const TOKEN_PACKAGES = [
    { id: 'starter', credits: 5, amount: Math.round(249 * PROMO_MULTIPLIER), label: 'Starter' },
    { id: 'pro', credits: 15, amount: Math.round(599 * PROMO_MULTIPLIER), label: 'Pro' },
    { id: 'expert', credits: 50, amount: Math.round(1499 * PROMO_MULTIPLIER), label: 'Expert' },
] as const
