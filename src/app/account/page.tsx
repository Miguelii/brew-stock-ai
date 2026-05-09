import type { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'
import { Effect } from 'effect'
import { getSession } from '@/services/supabase/get-session'
import { notFound } from 'next/navigation'
import { UserIcon, ReceiptTextIcon } from 'lucide-react'
import { AccountInvoicesTable } from '@/modules/account/invoices-table'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Account',
}

export default async function AccountPage() {
    const user = await Effect.runPromise(
        getSession().pipe(Effect.catchAll(() => Effect.succeed(null)))
    )

    if (!user) return notFound()

    return (
        <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Account</h1>
                <p className="text-sm text-muted-foreground">Manage your profile and billing.</p>
            </div>

            <Separator />

            {/* Profile */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <UserIcon className="size-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                        Profile
                    </h2>
                </div>
                <div className="rounded-none border border-border px-4 py-3 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0">
                        {user?.user_metadata?.avatar_url ? (
                            <Image
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                className="h-full w-full object-cover bg-background rounded-full"
                                referrerPolicy="no-referrer"
                                width={36}
                                height={36}
                            />
                        ) : (
                            <span className="text-sm font-bold text-accent-blue uppercase">
                                {user.email?.[0] ?? '?'}
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-medium">{user.email}</p>
                </div>
            </section>

            <Separator />

            {/* Billing */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <ReceiptTextIcon className="size-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                        Billing History
                    </h2>
                </div>
                <AccountInvoicesTable />
            </section>
        </main>
    )
}
