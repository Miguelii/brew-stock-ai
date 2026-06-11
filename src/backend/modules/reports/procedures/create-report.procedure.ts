import 'server-only'

import { Effect, Match } from 'effect'
import {
    CreateReportError,
    CreateSbClientError,
    InvalidPromptTypeError,
} from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { createSbServerClient } from '@/lib/utils.server'
import { ReportStatus } from '@/types/ReportDTO'
import type { User } from '@supabase/supabase-js'
import { enqueueReportProcessing } from '@/backend/modules/trigger-dev/jobs/process-report'
import { PROMPT_COSTS_MAP, PROMPTS_MAP } from '@/backend/modules/analysis/constants'
import { MAX_STOCK_INPUT_LENGHT } from '@/lib/constants'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { deductCredit } from '@/backend/modules/credits/processors/deduct-credit.processor'

const createReport = Effect.fn('createReport')(function* (
    user: User,
    stockSymbol: string,
    promptType: string
) {
    if (!PROMPTS_MAP[promptType]) {
        return yield* new InvalidPromptTypeError({
            promptType,
            error_hash: ErrorCode.REPORT_CREATE_INVALID_PROMPT,
        })
    }

    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.REPORT_CREATE_SB_CLIENT }),
    })

    const creditCost = PROMPT_COSTS_MAP[promptType] ?? 1

    yield* deductCredit(user.id, supabase, creditCost)

    const { data: report, error: insertError } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .insert({
                    created_at: 'now()',
                    type: promptType,
                    status: ReportStatus.GENERATING,
                    user_id: user.id,
                    stock: stockSymbol,
                })
                .select('id')
                .single(),
        catch: (cause) =>
            new CreateReportError({ cause, error_hash: ErrorCode.REPORT_CREATE_INSERT_ERR }),
    })

    if (insertError) {
        return yield* new CreateReportError({
            cause: insertError,
            error_hash: ErrorCode.REPORT_CREATE_INSERT_ERR,
        })
    }

    // Send to trigger.dev to process in the background — non-fatal so the report
    // ID is always returned to the client even if queueing has a transient blip
    yield* enqueueReportProcessing(report.id)

    return report.id as string
})

export const CREATE_REPORT_PROTECTED_PROCEDURE = protectedProcedure
    .input(
        z.object({
            stockSymbol: z.string().min(1).max(MAX_STOCK_INPUT_LENGHT),
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
