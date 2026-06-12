import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { ReportDTO, ReportWithStockData } from '@/types/ReportDTO'
import { isSuperAdmin } from '@/backend/modules/admin/helpers/is-super-admin.helper'
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

    const isAdmin = isSuperAdmin(user?.email)

    const report = yield* selectReportById(supabase, id, isAdmin ? undefined : user.id)

    const stockData = yield* selectStockDataByTicker(supabase, report.ticker)

    return { report, stockData } satisfies ReportWithStockData
})
