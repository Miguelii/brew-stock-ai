import 'server-only'

import { Effect, Match } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, GetReportByIdError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { ReportDTO, ReportWithStockData, StockData } from '@/types/ReportDTO'
import { isSuperAdmin } from '@/backend/modules/admin/is-super-admin'
import { protectedProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'
import { z } from 'zod'
import type { User } from '@supabase/supabase-js'

const getReportById = Effect.fn('getReportById')(function* (user: User, id: ReportDTO['id']) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.REPORT_BY_ID_SB_CLIENT }),
    })

    const isAdmin = isSuperAdmin(user?.email)

    const { data: report, error } = yield* Effect.tryPromise({
        try: () => {
            const query = supabase.from('reports').select('*').eq('id', id)
            return isAdmin ? query.single() : query.eq('user_id', user.id).single()
        },
        catch: (cause) =>
            new GetReportByIdError({ cause, error_hash: ErrorCode.REPORT_BY_ID_FETCH }),
    })

    if (error) {
        return yield* new GetReportByIdError({
            cause: error,
            error_hash: ErrorCode.REPORT_BY_ID_FETCH_ERR,
        })
    }

    const typedReport = report as ReportDTO

    const stockData = yield* Effect.tryPromise({
        try: () =>
            supabase.from('stock_data').select('*').eq('id', typedReport.ticker).maybeSingle(),
        catch: (cause) => cause,
    }).pipe(
        Effect.map((res) => (res.data as StockData) ?? null),
        Effect.orElse(() => Effect.succeed(null))
    )

    return { report: typedReport, stockData } satisfies ReportWithStockData
})

export const GET_REPORT_BY_ID_PROTECTED_PROCEDURE = protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ input, ctx }) =>
        runEffect(getReportById(ctx.user, input.id), 'getReportById', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetReportByIdError', () => 'NOT_FOUND' as const),
                Match.exhaustive
            )
        )
    )
