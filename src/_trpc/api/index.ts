import { router } from '@/_trpc/server'
import { SUBSCRIBE_PUSH_PROTECTED_PROCEDURE } from '@/backend/modules/core/procedures/subscribe-push'
import { UNSUBSCRIBE_PUSH_PROTECTED_PROCEDURE } from '@/backend/modules/core/procedures/unsubscribe-push'
import { SEND_PUSH_NOTIFICATION_PROTECTED_PROCEDURE } from '@/backend/modules/core/procedures/send-push-notification'
import { GET_LATEST_NEWS_PROTECTED_PROCEDURE } from '@/backend/modules/finnhub/procedures/get-latest-news.procedure'
import { CREATE_REPORT_PROTECTED_PROCEDURE } from '@/backend/modules/reports/procedures/create-report.procedure'
import { GET_REPORTS_PROTECTED_PROCEDURE } from '@/backend/modules/reports/procedures/get-reports.procedure'
import { EXPORT_REPORT_PROTECTED_PROCEDURE } from '@/backend/modules/reports/procedures/export-report.procedure'
import { GET_REPORT_BY_ID_PROTECTED_PROCEDURE } from '@/backend/modules/reports/procedures/get-report-by-id.procedure'
import { SB_LOGIN_PUBLIC_PROCEDURE } from '@/backend/modules/auth/procedures/sb-login.procedure'
import { SB_LOGOUT_PUBLIC_PROCEDURE } from '@/backend/modules/auth/procedures/sb-logout.procedure'
import { SB_SEND_OTP_PUBLIC_PROCEDURE } from '@/backend/modules/auth/procedures/sb-send-otp.procedure'
import { SB_VERIFY_OTP_PUBLIC_PROCEDURE } from '@/backend/modules/auth/procedures/sb-verify-otp.procedure'
import { GET_CREDITS_PROTECTED_PROCEDURE } from '@/backend/modules/credits/procedures/get-credits.procedure'
import { GET_INVOICES_PROTECTED_PROCEDURE } from '@/backend/modules/credits/procedures/get-invoices.procedure'
import { CREATE_CHECKOUT_SESSION_PROTECTED_PROCEDURE } from '@/backend/modules/credits/procedures/create-checkout-session.procedure'
import { GET_PRICE_HISTORY_PROTECTED_PROCEDURE } from '@/backend/modules/yahoo/procedures/get-price-history.procedure'
import { CREATE_CONSENT_COOKIE_PUBLIC_PROCEDURE } from '@/backend/modules/core/procedures/create-consent-cookie'
import { SUBMIT_FEEDBACK_PUBLIC_PROCEDURE } from '@/backend/modules/core/procedures/submit-feedback'

export const appRouter = router({
    /** REPORTS **/
    createReport: CREATE_REPORT_PROTECTED_PROCEDURE,
    exportReport: EXPORT_REPORT_PROTECTED_PROCEDURE,
    getReportById: GET_REPORT_BY_ID_PROTECTED_PROCEDURE,
    getReports: GET_REPORTS_PROTECTED_PROCEDURE,
    getLatestNews: GET_LATEST_NEWS_PROTECTED_PROCEDURE,
    priceHistory: GET_PRICE_HISTORY_PROTECTED_PROCEDURE,

    /** AUTH **/
    signIn: SB_LOGIN_PUBLIC_PROCEDURE,
    sbLogout: SB_LOGOUT_PUBLIC_PROCEDURE,
    sendOtp: SB_SEND_OTP_PUBLIC_PROCEDURE,
    verifyOtp: SB_VERIFY_OTP_PUBLIC_PROCEDURE,

    /** CREDITS **/
    getCredits: GET_CREDITS_PROTECTED_PROCEDURE,
    getInvoices: GET_INVOICES_PROTECTED_PROCEDURE,
    createCheckoutSession: CREATE_CHECKOUT_SESSION_PROTECTED_PROCEDURE,

    /** PUSH **/
    subscribePush: SUBSCRIBE_PUSH_PROTECTED_PROCEDURE,
    unsubscribePush: UNSUBSCRIBE_PUSH_PROTECTED_PROCEDURE,
    sendPushNotification: SEND_PUSH_NOTIFICATION_PROTECTED_PROCEDURE,

    /** CORE **/
    submitFeedback: SUBMIT_FEEDBACK_PUBLIC_PROCEDURE,
    createConsentCookie: CREATE_CONSENT_COOKIE_PUBLIC_PROCEDURE,
})

export type AppRouter = typeof appRouter
