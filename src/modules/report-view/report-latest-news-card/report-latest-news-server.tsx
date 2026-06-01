import { createCaller } from '@/server/caller'
import type { ReportDTO } from '@/types/ReportDTO'
import type { NewsItem } from '@/types/news'
import { ReportLatestNewsCard } from '@/modules/report-view/report-latest-news-card'

type Props = {
    ticker: ReportDTO['ticker']
}

export async function ReportLatestNewsServer({ ticker }: Props) {
    let news: NewsItem[] = []

    if (ticker) {
        const caller = await createCaller()
        news = (await caller.getLatestNews({ ticker }).catch(() => null)) ?? []
    }

    return <ReportLatestNewsCard news={news} />
}
