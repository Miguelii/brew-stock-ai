import { Match } from 'effect'
import { z } from 'zod'
import { publicProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { sbLogin } from '@/_backend/modules/auth/services/sb-login.service'

export const SB_LOGIN_PUBLIC_CONTROLLER = publicProcedure
    .input(z.object({ email: z.email(), password: z.string() }))
    .mutation(({ input }) =>
        runEffect(sbLogin(input.email, input.password), 'sbLogin', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('SignInWithPasswordError', () => 'UNAUTHORIZED' as const),
                Match.exhaustive
            )
        )
    )
