import 'server-only'

import { Effect } from 'effect'
import {
    CreateReportError,
    CreateSbClientError,
    InvalidPromptTypeError,
    PROMPTS_MAP,
    UnauthenticatedError,
} from '@/services/utils/constants'
import { createSbServerClient } from '@/lib/utils.server'
import { ReportStatus } from '@/types/ReportDTO'
import { getSession } from '@/services/supabase/get-session'

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

    return report.id as string
})
