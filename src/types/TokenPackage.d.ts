export type TokenPackage = {
    id: 'free' | 'starter' | 'pro' | 'expert'
    label: string
    credits: number
    /** Price in cents, used for Stripe checkout and for reporting order value */
    amount: number
    price: string
    pricePerToken: string
    originalPrice: string | null
    originalPricePerToken: string | null
    description: string
    highlight: boolean
    hasPromo?: boolean
}

export type PickTokenPackage = Pick<TokenPackage, 'id' | 'credits' | 'label' | 'amount'>
