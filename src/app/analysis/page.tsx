import { HomeLayout } from '@/components/home-layout'
import { AnalysisFormCard } from '@/modules/analysis/analysis-form-card'
import { getCachedSession } from '@/services/auth/get-cached-session'

export default async function AnalysisPage() {
    const user = await getCachedSession()
    return (
        <HomeLayout>
            <AnalysisFormCard isAuthenticated={!!user} />
        </HomeLayout>
    )
}
