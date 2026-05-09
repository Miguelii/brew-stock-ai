import 'server-only'

import { createSbServerClient } from '@/lib/utils.server'
import { Effect } from 'effect'
import { CreateSbClientError, LogoutError } from '@/services/errors'
import { revalidatePath } from 'next/cache'
import { HOME_PAGE_PATH } from '@/lib/constants'

export const sbLogout = Effect.fn('sbLogout')(function* () {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'lga12sd1231sdsda' }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () => supabase.auth.signOut(),
        catch: (cause) => new LogoutError({ cause, error_hash: 'signpasrasda' }),
    })

    if (error) return yield* new LogoutError({ cause: error, error_hash: 'signpasrasdaa123' })

    revalidatePath(HOME_PAGE_PATH, 'layout')

    return { status: 200 }
})
