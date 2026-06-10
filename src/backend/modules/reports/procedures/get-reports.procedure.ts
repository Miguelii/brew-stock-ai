import 'server-only'

import { Effect, Match } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, GetReportsError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { ReportListItem } from '@/types/ReportDTO'
import type { User } from '@supabase/supabase-js'
import { protectedProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'

const getReports = Effect.fn('getReports')(function* (user: User) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.REPORT_LIST_SB_CLIENT }),
    })

    const { data: reports, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .select('created_at,id,status,stock,type')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false }),
        catch: (cause) =>
            new GetReportsError({ cause, error_hash: ErrorCode.REPORT_LIST_FETCH_ERR }),
    })

    if (error) {
        return yield* new GetReportsError({
            cause: error,
            error_hash: ErrorCode.REPORT_LIST_FETCH_ERR,
        })
    }

    return reports as ReportListItem[]
})

export const GET_REPORTS_PROTECTED_PROCEDURE = protectedProcedure.query(({ ctx }) =>
    runEffect(getReports(ctx.user), 'getReports', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('GetReportsError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
