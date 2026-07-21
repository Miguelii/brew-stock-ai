import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
    companyName?: string
}>

export function AnalysisHero({ children, companyName }: Props) {
    return (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center w-full justify-between">
            <div className="flex flex-col gap-4 w-full md:w-fit items-start">
                {/* The company name must live inside the H1 — it is the target keyword. */}
                {companyName ? (
                    <h1 className="flex flex-col gap-2 text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                        <span>{companyName}</span>
                        <span>Professional Stock Analysis</span>
                    </h1>
                ) : (
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                        Professional Stock Analysis
                    </h1>
                )}

                <div className="text-primary-muted max-w-2xl leading-relaxed">
                    <p>Deep financial insights, market sentiment, and technical indicators.</p>
                    <p className="font-semibold">For less than a coffee ☕</p>
                </div>
            </div>
            {children}
        </div>
    )
}
