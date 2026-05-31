'use client'

import { formatAmount, formatDate, formatPaymentMethod } from '@/lib/formatters'
import { trpc } from '@/server/trpc-client'
import { ReceiptIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import type { Invoice } from '@/types/Invoice'

export function AccountInvoicesTable() {
    const { data: invoices = [], isLoading } = trpc.getInvoices.useQuery()

    if (isLoading) {
        return (
            <>
                {/* Desktop skeleton */}
                <div className="hidden md:block divide-y divide-border rounded-none border border-border overflow-hidden">
                    <div className="grid grid-cols-[1fr_12rem_12rem_8rem] px-4 py-2.5 bg-muted text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        <span>Description</span>
                        <span className="text-right">Method</span>
                        <span className="text-right">Date</span>
                        <span className="text-right">Amount</span>
                    </div>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-[1fr_12rem_12rem_8rem] px-4 py-3 items-center"
                        >
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>

                {/* Mobile skeleton */}
                <div className="flex flex-col gap-3 md:hidden">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </>
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
        <>
            {/* Desktop: grid table */}
            <div className="hidden md:block divide-y divide-border rounded-none border border-border overflow-hidden">
                <div className="grid grid-cols-[1fr_12rem_12rem_8rem] px-4 py-2.5 bg-muted text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <span>Description</span>
                    <span className="text-right">Method</span>
                    <span className="text-right">Date</span>
                    <span className="text-right">Amount</span>
                </div>
                {invoices.map((invoice) => (
                    <DesktopRow key={invoice.id} invoice={invoice} />
                ))}
            </div>

            {/* Mobile: stacked cards */}
            <div className="flex flex-col gap-3 md:hidden">
                {invoices.map((invoice) => (
                    <MobileCard key={invoice.id} invoice={invoice} />
                ))}
            </div>
        </>
    )
}

function DesktopRow({ invoice }: { invoice: Invoice }) {
    return (
        <div className="grid grid-cols-[1fr_12rem_12rem_8rem] px-4 py-3 text-sm items-center hover:bg-muted/50 transition-colors">
            <span className="text-foreground font-medium truncate">{invoice.description}</span>
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
    )
}

function MobileCard({ invoice }: { invoice: Invoice }) {
    return (
        <Card className="pt-0">
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-foreground leading-tight">
                        {invoice.description}
                    </span>
                    <span className="font-semibold tabular-nums whitespace-nowrap shrink-0">
                        {formatAmount(invoice.amount, invoice.currency)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        {formatDate(invoice.date)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatPaymentMethod(invoice.paymentMethod)}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
