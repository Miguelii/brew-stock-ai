import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import {
    CreateSbClientError,
    GetReportsError,
    UnauthenticatedError,
} from '@/services/utils/constants'
import type { ReportListItem } from '@/types/ReportDTO'
import { getSession } from '@/services/supabase/get-session'

export const getReports = Effect.fn('getReports')(function* () {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'ecrtrptsbclnt' }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: 'ecrtrptunauthd' })
    }

    const { data: reports, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .select('created_at,id,status,stock,type')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false }),
        catch: (cause) => new GetReportsError({ cause, error_hash: 'ecrtrptinsrtr' }),
    })

    if (error) {
        return yield* new GetReportsError({ cause: error, error_hash: 'ecrtrptinsrtr' })
    }

    return reports as ReportListItem[]
})
