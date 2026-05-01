import { AnalysisFormCard } from '@/features/analysis/analysis-form-card'
import { WebApplicationSchema, WebSiteSchema } from '@/features/metadata/structured-data'
import { getCachedSession } from '@/services/supabase/get-cached-session'

export default async function Home() {
    const user = await getCachedSession()

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
