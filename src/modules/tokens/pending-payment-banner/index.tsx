'use client'

import { useGetInvoices } from '@/hooks/use-get-invoices'
import { formatAmount } from '@/lib/formatters'
import { ClockIcon } from 'lucide-react'

export function PendingPaymentBanner() {
    const { invoices } = useGetInvoices()

    const pending = invoices?.filter((i) => i.status === 'pending') ?? []

    if (pending.length === 0) return null

    return (
        <>
            {pending.map((invoice) => {
                const formatted = formatAmount(invoice.amount, invoice.currency.toUpperCase())

                return (
                    <div
                        key={invoice.id}
                        data-testid="pending-payment-banner"
                        className="flex items-start gap-3 rounded-none border border-yellow-400 bg-yellow-400/10 px-4 py-3 text-sm text-muted-foreground"
                    >
                        <ClockIcon className="w-4 h-4 shrink-0 text-yellow-500 mt-0.5" />
                        <span>
                            You have a pending payment of{' '}
                            <strong
                                data-testid="pending-payment-amount"
                                className="text-foreground"
                            >
                                {formatted}
                            </strong>{' '}
                            for{' '}
                            <strong
                                data-testid="pending-payment-description"
                                className="text-foreground"
                            >
                                {invoice.description}
                            </strong>
                            . Credits will be added to your account automatically once the payment
                            clears. This usually takes 1 to 3 business days.
                        </span>
                    </div>
                )
            })}
        </>
    )
}
