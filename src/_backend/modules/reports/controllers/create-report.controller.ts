import { Match } from 'effect'
import { MAX_STOCK_INPUT_LENGHT, STOCK_INPUT_PATTERN } from '@/lib/constants'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { createReport } from '@/_backend/modules/reports/services/create-report.service'

export const CREATE_REPORT_PROTECTED_CONTROLLER = protectedProcedure
    .input(
        z.object({
            stockSymbol: z
                .string()
                .trim()
                .min(1)
                .max(MAX_STOCK_INPUT_LENGHT)
                .regex(STOCK_INPUT_PATTERN),
            promptType: z.string().min(1),
        })
    )
    .mutation(({ input, ctx }) =>
        runEffect(
            createReport(ctx.user, input.stockSymbol, input.promptType),
            'createReport',
            (error) =>
                Match.value(error).pipe(
                    Match.tag('InvalidPromptTypeError', () => 'BAD_REQUEST' as const),
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('DeductCreditError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('InsufficientCreditsError', () => 'PAYMENT_REQUIRED' as const),
                    Match.tag('CreateReportError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
        )
    )
