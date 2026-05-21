import { createCaller } from '@/server/caller'
import type { ReportDTO } from '@/types/ReportDTO'
import { ReportLatestNewsCard } from '@/modules/report-view/report-latest-news-server/report-latest-news-card'

type Props = {
    ticker: ReportDTO['ticker']
}

export async function ReportLatestNewsServer({ ticker }: Props) {
    if (!ticker) return null

    const caller = await createCaller()

    const response = await caller.getLatestNews({ ticker }).catch(() => null)

    return <ReportLatestNewsCard news={response ?? []} />
}
