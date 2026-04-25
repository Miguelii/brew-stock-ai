import { AnalysisFormCard } from '@/features/analysis/analysis-form-card'
import { getSession } from '@/services/supabase/get-session'
import { Effect } from 'effect'

export default async function Home() {
    const user = await Effect.runPromise(
        getSession().pipe(Effect.catchAll(() => Effect.succeed(null)))
    )

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
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
