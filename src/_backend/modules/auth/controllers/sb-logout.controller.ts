import { Match } from 'effect'
import { runEffect } from '@/_trpc/utils'
import { publicProcedure } from '@/_trpc/server'
import { sbLogout } from '@/_backend/modules/auth/services/sb-logout.service'

export const SB_LOGOUT_PUBLIC_CONTROLLER = publicProcedure.mutation(() =>
    runEffect(sbLogout(), 'sbLogout', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('LogoutError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
