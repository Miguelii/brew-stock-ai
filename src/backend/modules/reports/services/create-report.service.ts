import 'server-only'

import { Effect } from 'effect'
import { CreateSbClientError, InvalidPromptTypeError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { createSbServerClient } from '@/lib/utils.server'
import type { User } from '@supabase/supabase-js'
import { enqueueReportProcessing } from '@/backend/modules/reports/jobs/process-report.job'
import { PROMPT_COSTS_MAP, PROMPTS_MAP } from '@/backend/modules/analysis/constants'
import { deductCredit } from '@/backend/modules/credits/services/deduct-credit.service'
import { insertReport } from '@/backend/modules/reports/repositories/reports.repository'

export const createReport = Effect.fn('createReport')(function* (
    user: User,
    stockSymbol: string,
    promptType: string
) {
    if (!PROMPTS_MAP[promptType]) {
        return yield* new InvalidPromptTypeError({
            promptType,
            error_hash: ErrorCode.REPORT_CREATE_INVALID_PROMPT,
        })
    }

    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.REPORT_CREATE_SB_CLIENT }),
    })

    const creditCost = PROMPT_COSTS_MAP[promptType] ?? 1

    yield* deductCredit(user.id, supabase, creditCost)

    const reportId = yield* insertReport(supabase, {
        userId: user.id,
        stock: stockSymbol,
        type: promptType,
    })

    // Send to trigger.dev to process in the background — non-fatal so the report
    // ID is always returned to the client even if queueing has a transient blip
    yield* enqueueReportProcessing(reportId)

    return reportId
})
