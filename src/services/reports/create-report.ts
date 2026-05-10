import 'server-only'

import { Effect } from 'effect'
import {
    CreateReportError,
    CreateSbClientError,
    InvalidPromptTypeError,
    UnauthenticatedError,
} from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { createSbServerClient } from '@/lib/utils.server'
import { ReportStatus } from '@/types/ReportDTO'
import { getSession } from '@/services/auth/get-session'
import { deductCredit } from '@/services/tokens/deduct-credit'
import { tasks } from '@trigger.dev/sdk/v3'
import { PROMPT_COSTS_MAP, PROMPTS_MAP } from '@/services/analysis/helpers/constants'
import type { processReportTask } from '@/services/trigger/process-report'

export const createReport = Effect.fn('createReport')(function* (
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

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.REPORT_CREATE_UNAUTH })
    }

    const creditCost = PROMPT_COSTS_MAP[promptType] ?? 1

    yield* deductCredit(user.id, supabase, creditCost)

    const { data: report, error: insertError } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .insert({
                    created_at: 'now()',
                    type: promptType,
                    status: ReportStatus.GENERATING,
                    user_id: user.id,
                    stock: stockSymbol,
                })
                .select('id')
                .single(),
        catch: (cause) =>
            new CreateReportError({ cause, error_hash: ErrorCode.REPORT_CREATE_INSERT_ERR }),
    })

    if (insertError) {
        return yield* new CreateReportError({
            cause: insertError,
            error_hash: ErrorCode.REPORT_CREATE_INSERT_ERR,
        })
    }

    // Send to trigger.dev to process in the background — non-fatal so the report
    // ID is always returned to the client even if queueing has a transient blip
    yield* Effect.tryPromise({
        try: () =>
            tasks.trigger<typeof processReportTask>('process-report', {
                reportId: report.id,
                useBaseModel: process.env.NODE_ENV === 'development',
            }),
        catch: (cause) => cause,
    }).pipe(Effect.orElse(() => Effect.void))

    return report.id as string
})
