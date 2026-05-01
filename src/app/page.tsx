import { AnalysisFormCard } from '@/features/analysis/analysis-form-card'
import { WebApplicationSchema, WebSiteSchema } from '@/features/metadata/structured-data'
import { getCachedSession } from '@/services/supabase/get-cached-session'

export default async function Home() {
    const user = await getCachedSession()

    if (!user) {
        return (
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
                <WebSiteSchema />
                <WebApplicationSchema />
                <div className="flex flex-col items-center text-center gap-6 w-full mt-12">
                    <div className="space-y-2 max-w-md">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-semibold tracking-widest uppercase mb-2">
                            Beta Coming Soon
                        </div>
                        <div className="text-3xl font-bold tracking-tight text-foreground">
                            <span>StockBrew</span>
                            <span className="text-accent-blue font-mono">AI</span>
                        </div>
                        <p className="text-sm text-primary-muted leading-relaxed">
                            We&apos;re brewing something new. Institutional-grade AI stock analysis
                            for less than a coffee. ☕
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
            <WebSiteSchema />
            <WebApplicationSchema />
            <div className="mb-12">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
                    AI-Powered Stock Analysis
                </h1>
                <span className="text-primary-muted max-w-2xl leading-relaxed">
                    <p>Deep financial insights, market sentiment, and technical indicators.</p>
                    <strong>For less than a coffee ☕</strong>
                </span>
            </div>
            <AnalysisFormCard isAuthenticated={!!user} />
        </main>
    )
}
