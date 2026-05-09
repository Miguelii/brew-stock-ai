import 'server-only'

export const TOKEN_PACKAGES = [
    { id: 'starter', credits: 5, amount: 249, label: 'Starter' },
    { id: 'pro', credits: 15, amount: 599, label: 'Pro' },
    { id: 'expert', credits: 50, amount: 1499, label: 'Expert' },
] as const
