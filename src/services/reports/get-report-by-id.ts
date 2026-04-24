import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import {
    CreateSbClientError,
    GetReportByIdError,
    UnauthenticatedError,
} from '@/services/utils/constants'
import type { ReportDTO } from '@/types/ReportDTO'
import { getSession } from '@/services/supabase/get-session'

export const getReportById = Effect.fn('getReportById')(function* (id: ReportDTO['id']) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'egrptbidsbclnt' }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: 'egrptbidunauthd' })
    }

    const { data: report, error } = yield* Effect.tryPromise({
        try: () =>
            supabase.from('reports').select('*').eq('id', id).eq('user_id', user.id).single(),
        catch: (cause) => new GetReportByIdError({ cause, error_hash: 'egrptbidfetch' }),
    })

    if (error) {
        return yield* new GetReportByIdError({ cause: error, error_hash: 'egrptbiderr' })
    }

    return report as ReportDTO
})
