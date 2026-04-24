import { AnalysisFormCard } from '@/features/analysis/analysis-form-card'

export default function Home() {
    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
            <div className="mb-12">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
                    AI-Powered Stock Analysis
                </h1>
                <p className="text-primary-muted max-w-2xl leading-relaxed">
                    Leverage institutional-grade artificial intelligence to uncover deep financial
                    metrics, market sentiment, and technical indicators for any equity.
                </p>
            </div>

            <AnalysisFormCard />
        </main>
    )
}
