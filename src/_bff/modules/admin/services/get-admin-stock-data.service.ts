import 'server-only'

import { Effect } from 'effect'
import { createDBAdminClient } from '@/_bff/core/db'
import { UnauthenticatedError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { isAdmin } from '@/_bff/modules/admin/services/is-admin.service'
import { selectAdminStockData } from '@/_bff/modules/admin/repositories/admin.repository'

export type AdminStockData = {
    ticker: string
    lastUpdateAt: string | null
}

export const getAdminStockData = Effect.fn('getAdminStockData')(function* () {
    if (!(yield* isAdmin())) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createDBAdminClient()

    const rows = yield* selectAdminStockData(supabase)

    return rows.map((row): AdminStockData => ({ ticker: row.id, lastUpdateAt: row.last_update_at }))
})
