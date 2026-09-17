import { Match } from 'effect'
import { z } from 'zod'
import {
    MAX_STOCK_INPUT_LENGTH,
    STOCK_INPUT_PATTERN,
} from '@/_bff/core/constants/stock-input.constants'
import { protectedProcedure } from '@/_bff/trpc/server'
import { runEffect } from '@/_bff/trpc/utils'
import { refreshStockData } from '@/_bff/modules/admin/services/refresh-stock-data.service'

export const REFRESH_STOCK_DATA_PROTECTED_CONTROLLER = protectedProcedure
    .input(
        z.object({
            ticker: z.string().trim().min(1).max(MAX_STOCK_INPUT_LENGTH).regex(STOCK_INPUT_PATTERN),
        })
    )
    .mutation(({ input }) =>
        runEffect(refreshStockData(input.ticker), 'refreshStockData', (error) =>
            Match.value(error).pipe(
                Match.tag('ForbiddenError', () => 'FORBIDDEN' as const),
                Match.tag('StockDataRefreshError', () => 'BAD_GATEWAY' as const),
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('IsAdminError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('SaveStockDataError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
