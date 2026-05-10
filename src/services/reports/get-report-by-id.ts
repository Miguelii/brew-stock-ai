import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, GetReportByIdError, UnauthenticatedError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import type { ReportDTO, ReportWithStockData, StockData } from '@/types/ReportDTO'
import { getSession } from '@/services/auth/get-session'

export const getReportById = Effect.fn('getReportById')(function* (id: ReportDTO['id']) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.REPORT_BY_ID_SB_CLIENT }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.REPORT_BY_ID_UNAUTH })
    }

    const { data: report, error } = yield* Effect.tryPromise({
        try: () =>
            supabase.from('reports').select('*').eq('id', id).eq('user_id', user.id).single(),
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
