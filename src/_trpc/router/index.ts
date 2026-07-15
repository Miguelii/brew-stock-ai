import { router } from '@/_trpc/server'
import { AUTH_ROUTER } from '@/_bff/modules/auth/auth.router'
import { CORE_ROUTER } from '@/_bff/modules/core/core.router'
import { CREDITS_ROUTER } from '@/_bff/modules/credits/credits.router'
import { FINNHUB_ROUTER } from '@/_bff/modules/finnhub/finnhub.router'
import { REPORTS_ROUTER } from '@/_bff/modules/reports/reports.router'
import { YAHOO_ROUTER } from '@/_bff/modules/yahoo/yahoo.router'

export const appRouter = router({
    auth: AUTH_ROUTER,
    core: CORE_ROUTER,
    credits: CREDITS_ROUTER,
    finnhub: FINNHUB_ROUTER,
    reports: REPORTS_ROUTER,
    yahoo: YAHOO_ROUTER,
})

export type AppRouter = typeof appRouter
