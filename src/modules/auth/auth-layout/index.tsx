import Logo from '@/components/logo'
import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export function AuthLayout({ children }: Props) {
    return (
        <div className="fixed inset-0 z-9999 flex">
            <div className="flex flex-1 flex-col bg-background px-12 py-8">
                <Logo linkToHome={false} />
                <div className="flex flex-1 items-center justify-center">{children}</div>
            </div>

            <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-16 relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <span className="text-[120px] leading-none text-muted-foreground font-serif absolute -top-10 -left-6 select-none">
                        &ldquo;
                    </span>
                    <blockquote className="text-2xl font-medium text-background leading-snug">
                        I used to spend hours reading earnings calls and analyst reports.
                        StockBrewAI gives me the same depth in minutes — for less than my morning
                        coffee.
                    </blockquote>
                    <div className="mt-8 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-blue-dark flex items-center justify-center text-background text-sm font-bold shrink-0">
                            FM
                        </div>
                        <div>
                            <p className="text-sm font-medium text-background">Francisca Mendes</p>
                            <p className="text-xs text-muted-foreground">Investor</p>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-transparent pointer-events-none" />
            </div>
        </div>
    )
}
