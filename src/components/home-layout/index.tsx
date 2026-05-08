import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
    companyName?: string
}>

export function HomeLayout({ children, companyName }: Props) {
    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center w-full justify-between">
                <div className="flex flex-col gap-4 w-full md:w-fit items-start">
                    <div className="flex flex-col gap-2">
                        {companyName && (
                            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                                {companyName}
                            </h2>
                        )}
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                            AI-Powered Stock Analysis
                        </h1>
                    </div>

                    <div className="text-primary-muted max-w-2xl leading-relaxed">
                        <p>Deep financial insights, market sentiment, and technical indicators.</p>
                        <p className="font-semibold">For less than a coffee ☕</p>
                    </div>
                </div>
                {children}
            </div>
        </main>
    )
}
