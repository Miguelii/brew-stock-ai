import 'server-only'

import { Match } from 'effect'
import {
    CONTACT_FORM_MAX_NAME_LENGTH,
    CONTACT_FORM_MIN_MESSAGE_LENGTH,
    CONTACT_FORM_MAX_MESSAGE_LENGTH,
} from '@/lib/constants'
import { publicProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { submitFeedback } from '@/backend/modules/core/services/submit-feedback.service'

export const SUBMIT_FEEDBACK_PUBLIC_CONTROLLER = publicProcedure
    .input(
        z.object({
            name: z.string().min(1).max(CONTACT_FORM_MAX_NAME_LENGTH),
            email: z.email(),
            message: z
                .string()
                .min(CONTACT_FORM_MIN_MESSAGE_LENGTH)
                .max(CONTACT_FORM_MAX_MESSAGE_LENGTH),
        })
    )
    .mutation(({ input }) =>
        runEffect(
            submitFeedback(input.name, input.email, input.message),
            'submitFeedback',
            (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('SubmitFeedbackError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
        )
    )
