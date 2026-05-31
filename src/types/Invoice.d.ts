export type Invoice = {
    id: string
    date: number
    amount: number
    currency: string
    description: string
    status: 'paid' | 'pending'
    paymentMethod?: string
}
