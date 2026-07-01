import { Match } from 'effect'
import { MAX_STOCK_INPUT_LENGHT } from '@/lib/constants'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { getPriceHistory } from '@/_backend/modules/yahoo/services/get-price-history.service'

export const GET_PRICE_HISTORY_PROTECTED_CONTROLLER = protectedProcedure
    .input(z.object({ ticker: z.string().min(1).max(MAX_STOCK_INPUT_LENGHT) }))
    .query(({ input }) =>
        runEffect(getPriceHistory(input.ticker), 'getCachedPriceHistory', (error) =>
            Match.value(error).pipe(
                Match.tag('YahooPriceHistoryError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
