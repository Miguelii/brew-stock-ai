import 'server-only'

import { Effect } from 'effect'
import { CreateSbClientError, InvalidPromptTypeError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { createSbServerClient } from '@/lib/utils.server'
import type { User } from '@supabase/supabase-js'
import { enqueueReportProcessing } from '@/_bff/modules/reports/jobs/process-report.job'
import { PROMPT_COSTS_MAP, PROMPTS_MAP } from '@/_bff/modules/analysis/constants'
import { deductCredit } from '@/_bff/modules/credits/services/deduct-credit.service'
import { refundCredits } from '@/_bff/modules/credits/services/refund-credits.service'
import { Logger } from '@/_bff/lib/server-logger'
import { insertReport } from '@/_bff/modules/reports/repositories/reports.repository'

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

    // Credits are already deducted: give them back if the report row can't be created
    const reportId = yield* insertReport(supabase, {
        userId: user.id,
        stock: stockSymbol,
        type: promptType,
    }).pipe(
        Effect.tapError(() =>
            refundCredits(user.id, creditCost, supabase).pipe(
                Effect.catchAll((error) =>
                    Effect.sync(() =>
                        Logger({
                            level: 'error',
                            prefix: 'createReport',
                            message: 'Refund after failed insert failed',
                            error,
                            userId: user.id,
                            metadata: { creditCost },
                        })
                    )
                )
            )
        )
    )

    // Send to trigger.dev to process in the background. Non-fatal, so the report
    // ID is always returned to the client (a queueing failure marks it FAILED and refunds)
    yield* enqueueReportProcessing(reportId)

    return reportId
})
