import { TRPCError } from '@trpc/server'
import { Cause, Effect, Exit, Match, Option } from 'effect'
import { z } from 'zod'
import { Logger } from '@/lib/logger'
import { publicProcedure, router } from './trpc'
import { sbLogin } from '@/services/supabase/sb-login'
import { sbSignUp } from '@/services/supabase/sb-signup'
import { sbLogout } from '@/services/supabase/sb-logout'
import { createReport } from '@/services/reports/create-report'
import { getStockAnalysis } from '@/services/analysis/get-stock-analysis'
import { getReports } from '@/services/reports/get-reports'
import { getReportById } from '@/services/reports/get-report-by-id'
import { exportReport } from '@/services/reports/export-report'
import { MAX_STOCK_INPUT_LENGHT } from '@/lib/constants'

async function runEffect<A, E extends { _tag: string; error_hash: string }>(
    effect: Effect.Effect<A, E>,
    context: string,
    mapCode: (error: E) => TRPCError['code']
): Promise<A> {
    const exit = await Effect.runPromiseExit(effect)

    if (Exit.isSuccess(exit)) return exit.value

    const maybeError = Cause.failureOption(exit.cause)

    if (Option.isNone(maybeError)) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'unexpected_defect' })
    }

    const error = maybeError.value

    Logger({ level: 'error', error, context: `[${context}] ${error._tag}` })

    throw new TRPCError({ code: mapCode(error), message: error.error_hash })
}

export const appRouter = router({
    getStockAnalysis: publicProcedure
        .input(
            z.object({
                stockSymbol: z.string().min(1),
                promptType: z.string().min(1),
                reportId: z.string().min(1),
            })
        )
        .mutation(({ input }) =>
            runEffect(
                getStockAnalysis(input.stockSymbol, input.promptType, input.reportId),
                'getStockAnalysis',
                (error) =>
                    Match.value(error).pipe(
                        Match.tag('InvalidPromptTypeError', () => 'BAD_REQUEST' as const),
                        Match.tag('AiGenerationError', () => 'INTERNAL_SERVER_ERROR' as const),
                        //@ts-expect-error - debug only
                        Match.exhaustive
                    )
            )
        ),

    createReport: publicProcedure
        .input(
            z.object({
                stockSymbol: z.string().min(1).max(MAX_STOCK_INPUT_LENGHT),
                promptType: z.string().min(1),
            })
        )
        .mutation(({ input }) =>
            runEffect(createReport(input.stockSymbol, input.promptType), 'createReport', (error) =>
                Match.value(error).pipe(
                    Match.tag('InvalidPromptTypeError', () => 'BAD_REQUEST' as const),
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                    Match.tag('CreateReportError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
            )
        ),

    signIn: publicProcedure
        .input(z.object({ email: z.email(), password: z.string() }))
        .mutation(({ input }) =>
            runEffect(sbLogin(input.email, input.password), 'sbLogin', (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('SignInWithPasswordError', () => 'UNAUTHORIZED' as const),
                    Match.exhaustive
                )
            )
        ),

    signUp: publicProcedure
        .input(z.object({ email: z.email(), password: z.string().min(6) }))
        .mutation(({ input }) =>
            runEffect(sbSignUp(input.email, input.password), 'sbSignUp', (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('SignUpError', () => 'BAD_REQUEST' as const),
                    Match.exhaustive
                )
            )
        ),

    getReports: publicProcedure.query(() =>
        runEffect(getReports(), 'getReports', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                Match.tag('GetReportsError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    ),

    sbLogout: publicProcedure.mutation(() =>
        runEffect(sbLogout(), 'sbLogout', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('LogoutError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    ),

    getReportById: publicProcedure.input(z.object({ id: z.string().min(1) })).query(({ input }) =>
        runEffect(getReportById(input.id), 'getReportById', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                Match.tag('GetReportByIdError', () => 'NOT_FOUND' as const),
                Match.exhaustive
            )
        )
    ),

    exportReport: publicProcedure.input(z.object({ id: z.string().min(1) })).mutation(({ input }) =>
        runEffect(exportReport(input.id), 'exportReport', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                Match.tag('ExportReportError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    ),
})

export type AppRouter = typeof appRouter
