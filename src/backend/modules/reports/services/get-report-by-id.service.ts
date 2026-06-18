import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { ReportDTO, ReportWithStockData } from '@/types/ReportDTO'
import { isAdmin } from '@/backend/modules/admin/services/is-admin.service'
import type { User } from '@supabase/supabase-js'
import {
    selectReportById,
    selectStockDataByTicker,
} from '@/backend/modules/reports/repositories/reports.repository'

export const getReportById = Effect.fn('getReportById')(function* (
    user: User,
    id: ReportDTO['id']
) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.REPORT_BY_ID_SB_CLIENT }),
    })

    const admin = yield* isAdmin(supabase)

    const report = yield* selectReportById(supabase, id, admin ? undefined : user.id)

    const stockData = yield* selectStockDataByTicker(supabase, report.ticker)

    return { report, stockData } satisfies ReportWithStockData
})
