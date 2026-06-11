import 'server-only'

import { Match } from 'effect'
import { z } from 'zod'
import { publicProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { sbSendOtp } from '@/backend/modules/auth/services/sb-send-otp.service'

export const SB_SEND_OTP_PUBLIC_CONTROLLER = publicProcedure
    .input(z.object({ email: z.email() }))
    .mutation(({ input }) =>
        runEffect(sbSendOtp(input.email), 'sbSendOtp', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('SendOtpError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
