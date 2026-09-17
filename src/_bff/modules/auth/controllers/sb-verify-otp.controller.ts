import { Match } from 'effect'
import { z } from 'zod'
import { SB_OTP_TOKEN_LENGTH } from '@/_bff/core/constants/auth-otp.constants'
import { publicProcedure } from '@/_bff/trpc/server'
import { runEffect } from '@/_bff/trpc/utils'
import { sbVerifyOtp } from '@/_bff/modules/auth/services/sb-verify-otp.service'

export const SB_VERIFY_OTP_PUBLIC_CONTROLLER = publicProcedure
    .input(z.object({ email: z.email(), token: z.string().length(SB_OTP_TOKEN_LENGTH) }))
    .mutation(({ input }) =>
        runEffect(sbVerifyOtp(input.email, input.token), 'sbVerifyOtp', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('VerifyOtpError', () => 'UNAUTHORIZED' as const),
                Match.exhaustive
            )
        )
    )
