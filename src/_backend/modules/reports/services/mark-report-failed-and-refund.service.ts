import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import { markReportFailed } from '@/_backend/modules/reports/repositories/reports.repository'
import { refundCredits } from '@/_backend/modules/credits/services/refund-credits.service'
import { PROMPT_COSTS_MAP } from '@/_backend/modules/analysis/constants'
import type { ReportDTO } from '@/types/ReportDTO'

type MarkReportFailedAndRefundResult = {
    userId: ReportDTO['user_id']
    type: ReportDTO['type']
    refund: number
} | null

// Owns the GENERATING → FAILED transition: marks the report as failed and gives the
// user back the credits deducted at creation. Returns null when the report was
// already FAILED (nothing to do — the refund already happened).
export const markReportFailedAndRefund = Effect.fn('markReportFailedAndRefund')(function* (
    reportId: ReportDTO['id']
) {
    const supabase = yield* Effect.try({
        try: () => createSbAdminClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PROCESS_REPORT_SB_CLIENT }),
    })

    const failedReport = yield* markReportFailed(supabase, reportId)

    if (!failedReport) return null

    const refund = PROMPT_COSTS_MAP[failedReport.type] ?? 1

    yield* refundCredits(failedReport.user_id, refund, supabase)

    return {
        userId: failedReport.user_id,
        type: failedReport.type,
        refund,
    } satisfies MarkReportFailedAndRefundResult
})
