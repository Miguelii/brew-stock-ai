import 'server-only'

import { Data } from 'effect'

export class InvalidPromptTypeError extends Data.TaggedError('InvalidPromptTypeError')<{
    promptType: string
    error_hash: string
}> {}

export class AiGenerationError extends Data.TaggedError('AiGenerationError')<{
    cause: unknown
    error_hash: string
}> {}

export class CreateSbClientError extends Data.TaggedError('CreateSbClientError')<{
    cause: unknown
    error_hash: string
}> {}

export class UnauthenticatedError extends Data.TaggedError('UnauthenticatedError')<{
    cause?: unknown
    error_hash: string
}> {}

export class GetUserError extends Data.TaggedError('GetUserError')<{
    cause: unknown
    error_hash: string
}> {}

export class CreateReportError extends Data.TaggedError('CreateReportError')<{
    cause: unknown
    error_hash: string
}> {}

export class SaveAnalysisError extends Data.TaggedError('SaveAnalysisError')<{
    cause: unknown
    error_hash: string
}> {}

export class GetReportByIdError extends Data.TaggedError('GetReportByIdError')<{
    cause: unknown
    error_hash: string
}> {}

export class GetReportsError extends Data.TaggedError('GetReportsError')<{
    cause: unknown
    error_hash: string
}> {}

export class FetchReportForTaskError extends Data.TaggedError('FetchReportForTaskError')<{
    cause: unknown
    error_hash: string
}> {}

export class MarkReportFailedError extends Data.TaggedError('MarkReportFailedError')<{
    cause: unknown
    error_hash: string
}> {}

export class SignInWithPasswordError extends Data.TaggedError('SignInWithPasswordError')<{
    cause: unknown
    error_hash: string
}> {}

export class LogoutError extends Data.TaggedError('LogoutError')<{
    cause: unknown
    error_hash: string
}> {}

export class ExportReportError extends Data.TaggedError('ExportReportError')<{
    cause: unknown
    error_hash: string
}> {}

export class SavePushSubscriptionError extends Data.TaggedError('SavePushSubscriptionError')<{
    cause: unknown
    error_hash: string
}> {}

export class DeletePushSubscriptionError extends Data.TaggedError('DeletePushSubscriptionError')<{
    cause: unknown
    error_hash: string
}> {}

export class GetPushSubscriptionError extends Data.TaggedError('GetPushSubscriptionError')<{
    cause: unknown
    error_hash: string
}> {}

export class SendPushNotificationError extends Data.TaggedError('SendPushNotificationError')<{
    cause: unknown
    error_hash: string
}> {}

export class GetCreditsError extends Data.TaggedError('GetCreditsError')<{
    cause: unknown
    error_hash: string
}> {}

export class DeductCreditError extends Data.TaggedError('DeductCreditError')<{
    cause: unknown
    error_hash: string
}> {}

export class InsufficientCreditsError extends Data.TaggedError('InsufficientCreditsError')<{
    error_hash: string
}> {}

export class CreateCheckoutSessionError extends Data.TaggedError('CreateCheckoutSessionError')<{
    cause: unknown
    error_hash: string
}> {}

export class GetInvoicesError extends Data.TaggedError('GetInvoicesError')<{
    cause: unknown
    error_hash: string
}> {}

export class OAuthInitError extends Data.TaggedError('OAuthInitError')<{
    cause: unknown
    error_hash: string
}> {}

export class OAuthCallbackError extends Data.TaggedError('OAuthCallbackError')<{
    cause: unknown
    error_hash: string
}> {}

export class CreateConsentCookieError extends Data.TaggedError('CreateConsentCookieError')<{
    cause: unknown
    error_hash: string
}> {}

export class YahooClientError extends Data.TaggedError('YahooClientError')<{
    cause: unknown
    error_hash: string
}> {}

export class YahooInsightsError extends Data.TaggedError('YahooInsightsError')<{
    cause: unknown
    error_hash: string
}> {}

export class SaveStockDataError extends Data.TaggedError('SaveStockDataError')<{
    cause: unknown
    error_hash: string
}> {}
