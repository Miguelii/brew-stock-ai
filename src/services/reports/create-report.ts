import 'server-only'

import { Effect } from 'effect'
import {
    CreateReportError,
    CreateSbClientError,
    InvalidPromptTypeError,
    UnauthenticatedError,
} from '@/services/utils/tagged-errors'
import { createSbServerClient } from '@/lib/utils.server'
import { ReportStatus } from '@/types/ReportDTO'
import { getSession } from '@/services/supabase/get-session'
import { deductCredit } from '@/services/tokens/deduct-credit'
import { tasks } from '@trigger.dev/sdk/v3'
import type { processReportTask } from '@/trigger/process-report'
import { PROMPT_COSTS_MAP, PROMPTS_MAP } from '@/services/utils/constants'

export const createReport = Effect.fn('createReport')(function* (
    stockSymbol: string,
    promptType: string
) {
    if (!PROMPTS_MAP[promptType]) {
        return yield* new InvalidPromptTypeError({ promptType, error_hash: 'ecrtrptprtntf' })
    }

    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'ecrtrptsbclnt' }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: 'ecrtrptunauthd' })
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
        catch: (cause) => new CreateReportError({ cause, error_hash: 'ecrtrptinsrtr' }),
    })

    if (insertError) {
        return yield* new CreateReportError({ cause: insertError, error_hash: 'ecrtrptinsrtr' })
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
