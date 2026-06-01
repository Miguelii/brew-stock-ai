import 'server-only'

import { Data } from 'effect'
import type { ErrorCode } from '@/services/error-codes'

type ServiceErrorFields = { cause: unknown; error_hash: ErrorCode }

// Analysis
export class AiGenerationError extends Data.TaggedError('AiGenerationError')<ServiceErrorFields> {}
export class LatestNewsError extends Data.TaggedError('LatestNewsError')<
    ServiceErrorFields & { ticker: string }
> {}
export class YahooClientError extends Data.TaggedError('YahooClientError')<
    ServiceErrorFields & { symbol: string }
> {}
export class YahooInsightsError extends Data.TaggedError('YahooInsightsError')<
    ServiceErrorFields & { ticker: string }
> {}
export class YahooSearchError extends Data.TaggedError('YahooSearchError')<
    ServiceErrorFields & { symbol: string }
> {}
export class YahooQuoteSummaryError extends Data.TaggedError('YahooQuoteSummaryError')<
    ServiceErrorFields & { ticker: string }
> {}
export class YahooPriceHistoryError extends Data.TaggedError('YahooPriceHistoryError')<
    ServiceErrorFields & { ticker: string }
> {}
export class SaveStockDataError extends Data.TaggedError(
    'SaveStockDataError'
)<ServiceErrorFields> {}

// Reports
export class CreateReportError extends Data.TaggedError('CreateReportError')<ServiceErrorFields> {}
export class SaveAnalysisError extends Data.TaggedError('SaveAnalysisError')<ServiceErrorFields> {}
export class GetReportByIdError extends Data.TaggedError(
    'GetReportByIdError'
)<ServiceErrorFields> {}
export class GetReportsError extends Data.TaggedError('GetReportsError')<ServiceErrorFields> {}
export class FetchReportForTaskError extends Data.TaggedError(
    'FetchReportForTaskError'
)<ServiceErrorFields> {}
export class MarkReportFailedError extends Data.TaggedError(
    'MarkReportFailedError'
)<ServiceErrorFields> {}
export class ExportReportError extends Data.TaggedError('ExportReportError')<ServiceErrorFields> {}

// Auth
export class CreateSbClientError extends Data.TaggedError(
    'CreateSbClientError'
)<ServiceErrorFields> {}
export class GetUserError extends Data.TaggedError('GetUserError')<ServiceErrorFields> {}
export class SignInWithPasswordError extends Data.TaggedError(
    'SignInWithPasswordError'
)<ServiceErrorFields> {}
export class LogoutError extends Data.TaggedError('LogoutError')<ServiceErrorFields> {}
export class OAuthInitError extends Data.TaggedError('OAuthInitError')<ServiceErrorFields> {}
export class OAuthCallbackError extends Data.TaggedError(
    'OAuthCallbackError'
)<ServiceErrorFields> {}
export class SendOtpError extends Data.TaggedError('SendOtpError')<ServiceErrorFields> {}
export class VerifyOtpError extends Data.TaggedError('VerifyOtpError')<ServiceErrorFields> {}

// Notifications
export class SavePushSubscriptionError extends Data.TaggedError(
    'SavePushSubscriptionError'
)<ServiceErrorFields> {}
export class DeletePushSubscriptionError extends Data.TaggedError(
    'DeletePushSubscriptionError'
)<ServiceErrorFields> {}
export class GetPushSubscriptionError extends Data.TaggedError(
    'GetPushSubscriptionError'
)<ServiceErrorFields> {}
export class SendPushNotificationError extends Data.TaggedError(
    'SendPushNotificationError'
)<ServiceErrorFields> {}

// Tokens
export class GetCreditsError extends Data.TaggedError('GetCreditsError')<ServiceErrorFields> {}
export class DeductCreditError extends Data.TaggedError('DeductCreditError')<ServiceErrorFields> {}
export class CreateCheckoutSessionError extends Data.TaggedError(
    'CreateCheckoutSessionError'
)<ServiceErrorFields> {}
export class GetInvoicesError extends Data.TaggedError('GetInvoicesError')<ServiceErrorFields> {}

// Admin
export class AdminStatsError extends Data.TaggedError('AdminStatsError')<ServiceErrorFields> {}
export class GetAdminFeedbackError extends Data.TaggedError(
    'GetAdminFeedbackError'
)<ServiceErrorFields> {}

// Feedback
export class SubmitFeedbackError extends Data.TaggedError(
    'SubmitFeedbackError'
)<ServiceErrorFields> {}

// Consent
export class CreateConsentCookieError extends Data.TaggedError(
    'CreateConsentCookieError'
)<ServiceErrorFields> {}

// Special cases
export class InvalidPromptTypeError extends Data.TaggedError('InvalidPromptTypeError')<{
    promptType: string
    error_hash: ErrorCode
}> {}

export class UnauthenticatedError extends Data.TaggedError('UnauthenticatedError')<{
    cause?: unknown
    error_hash: ErrorCode
}> {}

export class InsufficientCreditsError extends Data.TaggedError('InsufficientCreditsError')<{
    error_hash: ErrorCode
}> {}
