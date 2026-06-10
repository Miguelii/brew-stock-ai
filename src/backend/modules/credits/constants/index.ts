// Set to false to restore original pricing
const LAUNCH_PROMO_ACTIVE = true

const PROMO_MULTIPLIER = LAUNCH_PROMO_ACTIVE ? 0.5 : 1

export const TOKEN_PACKAGES = [
    { id: 'starter', credits: 5, amount: Math.round(198 * PROMO_MULTIPLIER), label: 'Starter' },
    { id: 'pro', credits: 15, amount: Math.round(498 * PROMO_MULTIPLIER), label: 'Pro' },
    { id: 'expert', credits: 50, amount: Math.round(1198 * PROMO_MULTIPLIER), label: 'Expert' },
] as const
