'use client'

import { formatAmount, formatDate, formatPaymentMethod } from '@/lib/formatters'
import { trpc } from '@/server/trpc-client'
import { ReceiptIcon } from 'lucide-react'

export function AccountInvoicesTable() {
    const { data: invoices = [], isLoading } = trpc.getInvoices.useQuery()

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 rounded bg-muted animate-pulse" />
                ))}
            </div>
        )
    }

    if (invoices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <ReceiptIcon className="size-8 opacity-40" />
                <p className="text-sm">No purchases yet.</p>
            </div>
        )
    }

    return (
        <div className="divide-y divide-border rounded-none border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2.5 bg-muted text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <span>Description</span>
                <span className="text-right">Method</span>
                <span className="text-right">Date</span>
                <span className="text-right">Amount</span>
            </div>
            {invoices.map((invoice) => (
                <div
                    key={invoice.id}
                    className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 text-sm items-center hover:bg-muted/50 transition-colors"
                >
                    <span className="text-foreground font-medium truncate">
                        {invoice.description}
                    </span>
                    <span className="text-muted-foreground text-right whitespace-nowrap">
                        {formatPaymentMethod(invoice.paymentMethod)}
                    </span>
                    <span className="text-muted-foreground text-right whitespace-nowrap">
                        {formatDate(invoice.date)}
                    </span>
                    <span className="font-semibold text-right whitespace-nowrap tabular-nums">
                        {formatAmount(invoice.amount, invoice.currency)}
                    </span>
                </div>
            ))}
        </div>
    )
}
