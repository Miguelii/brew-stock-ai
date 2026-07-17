export type TokenPackage = {
    id: 'free' | 'starter' | 'pro' | 'expert'
    label: string
    credits: number
    price: string
    pricePerToken: string
    originalPrice: string | null
    originalPricePerToken: string | null
    description: string
    highlight: boolean
    hasPromo?: boolean
}

export type PickTokenPackage = Pick<TokenPackage, 'id' | 'credits' | 'label'> & {
    /** Price in cents, used for Stripe checkout */
    amount: number
}
