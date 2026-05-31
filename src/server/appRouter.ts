// oxlint-disable import/max-dependencies

import { TRPCError } from '@trpc/server'
import { Cause, Effect, Exit, Match, Option } from 'effect'
import { z } from 'zod'
import { Logger } from '@/lib/logger'
import { publicProcedure, router } from '@/server/trpc'
import { sbLogin } from '@/services/auth/sb-login'
import { sbLogout } from '@/services/auth/sb-logout'
import { sbSendOtp } from '@/services/auth/sb-send-otp'
import { sbVerifyOtp } from '@/services/auth/sb-verify-otp'
import { createReport } from '@/services/reports/create-report'
import { getReports } from '@/services/reports/get-reports'
import { getReportById } from '@/services/reports/get-report-by-id'
import { exportReport } from '@/services/reports/export-report'
import { subscribePush } from '@/services/notifications/subscribe-push'
import { unsubscribePush } from '@/services/notifications/unsubscribe-push'
import { sendPushNotification } from '@/services/notifications/send-push-notification'
import { getCredits } from '@/services/tokens/get-credits'
import { getInvoices } from '@/services/tokens/get-invoices'
import { createCheckoutSession } from '@/services/tokens/create-checkout-session'
import type { TokenPackageId } from '@/services/tokens/create-checkout-session'
import { createConsentCookie } from '@/services/consent/create-consent-cookie'
import { submitFeedback } from '@/services/feedback/submit-feedback'
import { getLatestNews } from '@/services/analysis/get-latest-news'
import { getPriceHistory } from '@/services/analysis/get-price-history'
import {
    CONTACT_FORM_MAX_MESSAGE_LENGTH,
    CONTACT_FORM_MAX_NAME_LENGTH,
    CONTACT_FORM_MIN_MESSAGE_LENGTH,
    MAX_STOCK_INPUT_LENGHT,
    SB_OTP_TOKEN_LENGTH,
} from '@/lib/constants'

async function runEffect<A, E extends { _tag: string; error_hash: string }>(
    effect: Effect.Effect<A, E>,
    context: string,
    mapCode: (error: E) => TRPCError['code']
): Promise<A> {
    const exit = await Effect.runPromiseExit(effect)

    if (Exit.isSuccess(exit)) return exit.value

    const maybeError = Cause.failureOption(exit.cause)

    if (Option.isNone(maybeError)) {
        const defects = Cause.defects(exit.cause)
        Logger({ level: 'error', prefix: context, message: 'defect', error: defects })
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'unexpected_defect' })
    }

    const error = maybeError.value

    Logger({ level: 'error', prefix: context, error })

    throw new TRPCError({ code: mapCode(error), message: error.error_hash })
}

export const appRouter = router({
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
                    Match.tag('DeductCreditError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('InsufficientCreditsError', () => 'PAYMENT_REQUIRED' as const),
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

    sendOtp: publicProcedure.input(z.object({ email: z.email() })).mutation(({ input }) =>
        runEffect(sbSendOtp(input.email), 'sbSendOtp', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('SendOtpError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    ),

    verifyOtp: publicProcedure
        .input(z.object({ email: z.email(), token: z.string().length(SB_OTP_TOKEN_LENGTH) }))
        .mutation(({ input }) =>
            runEffect(sbVerifyOtp(input.email, input.token), 'sbVerifyOtp', (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('VerifyOtpError', () => 'UNAUTHORIZED' as const),
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

    subscribePush: publicProcedure
        .input(
            z.object({
                subscription: z.object({
                    endpoint: z.string(),
                    expirationTime: z.number().nullable(),
                    keys: z.object({ p256dh: z.string(), auth: z.string() }),
                }),
            })
        )
        .mutation(({ input }) =>
            runEffect(subscribePush(input.subscription), 'subscribePush', (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                    Match.tag('SavePushSubscriptionError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
            )
        ),

    unsubscribePush: publicProcedure.mutation(() =>
        runEffect(unsubscribePush(), 'unsubscribePush', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                Match.tag('DeletePushSubscriptionError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    ),

    sendPushNotification: publicProcedure
        .input(z.object({ title: z.string().min(1), body: z.string().min(1) }))
        .mutation(({ input }) =>
            runEffect(
                sendPushNotification(input.title, input.body),
                'sendPushNotification',
                (error) =>
                    Match.value(error).pipe(
                        Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                        Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                        Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                        Match.tag(
                            'GetPushSubscriptionError',
                            () => 'INTERNAL_SERVER_ERROR' as const
                        ),
                        Match.tag(
                            'SendPushNotificationError',
                            () => 'INTERNAL_SERVER_ERROR' as const
                        ),
                        Match.exhaustive
                    )
            )
        ),

    getCredits: publicProcedure.query(() =>
        runEffect(getCredits(), 'getCredits', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                Match.tag('GetCreditsError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    ),

    getInvoices: publicProcedure.query(() =>
        runEffect(getInvoices(), 'getInvoices', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                Match.tag('GetInvoicesError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    ),

    createCheckoutSession: publicProcedure
        .input(z.object({ packageId: z.enum(['starter', 'pro', 'expert']) }))
        .mutation(({ input }) =>
            runEffect(
                createCheckoutSession(input.packageId as TokenPackageId),
                'createCheckoutSession',
                (error) =>
                    Match.value(error).pipe(
                        Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                        Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                        Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                        Match.tag(
                            'CreateCheckoutSessionError',
                            () => 'INTERNAL_SERVER_ERROR' as const
                        ),
                        Match.exhaustive
                    )
            )
        ),
    submitFeedback: publicProcedure
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
        ),

    getLatestNews: publicProcedure
        .input(z.object({ ticker: z.string().min(1).max(MAX_STOCK_INPUT_LENGHT) }))
        .query(({ input }) =>
            runEffect(getLatestNews(input.ticker), 'getLatestNews', (error) =>
                Match.value(error).pipe(
                    Match.tag('LatestNewsError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                    Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
            )
        ),

    priceHistory: publicProcedure
        .input(z.object({ ticker: z.string().min(1).max(MAX_STOCK_INPUT_LENGHT) }))
        .query(({ input }) =>
            runEffect(getPriceHistory(input.ticker), 'getPriceHistory', (error) =>
                Match.value(error).pipe(
                    Match.tag('YahooPriceHistoryError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('UnauthenticatedError', () => 'UNAUTHORIZED' as const),
                    Match.tag('GetUserError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
            )
        ),

    createConsentCookie: publicProcedure
        .input(z.object({ allowAnalytics: z.boolean() }))
        .mutation(({ input }) =>
            runEffect(createConsentCookie(input.allowAnalytics), 'createConsentCookie', (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateConsentCookieError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
            )
        ),
})

export type AppRouter = typeof appRouter
