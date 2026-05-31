'use client'

import { formatAmount } from '@/lib/formatters'
import { trpc } from '@/server/trpc-client'
import { ClockIcon } from 'lucide-react'

export function PendingPaymentBanner() {
    const { data: invoices } = trpc.getInvoices.useQuery()

    const pending = invoices?.filter((i) => i.status === 'pending') ?? []

    if (pending.length === 0) return null

    return (
        <>
            {pending.map((invoice) => {
                const formatted = formatAmount(invoice.amount, invoice.currency.toUpperCase())

                return (
                    <div
                        key={invoice.id}
                        className="flex items-start gap-3 rounded-none border border-yellow-400 bg-yellow-400/10 px-4 py-3 text-sm text-muted-foreground"
                    >
                        <ClockIcon className="w-4 h-4 shrink-0 text-yellow-500 mt-0.5" />
                        <span>
                            You have a pending payment of{' '}
                            <strong className="text-foreground">{formatted}</strong> for{' '}
                            <strong className="text-foreground">{invoice.description}</strong>.
                            Credits will be added to your account automatically once the payment
                            clears — this usually takes 1–3 business days.
                        </span>
                    </div>
                )
            })}
        </>
    )
}
