import { HomeLayout } from '@/components/home-layout'
import { AnalysisFormCard } from '@/features/analysis/analysis-form-card'
import { getCachedSession } from '@/services/supabase/get-cached-session'

export default async function Home() {
    const user = await getCachedSession()
    return (
        <HomeLayout>
            <AnalysisFormCard isAuthenticated={!!user} />
        </HomeLayout>
    )
}
