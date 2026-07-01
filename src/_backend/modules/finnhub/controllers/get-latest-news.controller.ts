import { Match } from 'effect'
import { MAX_STOCK_INPUT_LENGHT } from '@/lib/constants'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { getLatestNews } from '@/_backend/modules/finnhub/services/get-latest-news-cached.service'

export const GET_LATEST_NEWS_PROTECTED_CONTROLLER = protectedProcedure
    .input(z.object({ ticker: z.string().min(1).max(MAX_STOCK_INPUT_LENGHT) }))
    .query(({ input }) =>
        runEffect(getLatestNews(input.ticker), 'getLatestNewsProcedure', (error) =>
            Match.value(error).pipe(
                Match.tag('LatestNewsError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
