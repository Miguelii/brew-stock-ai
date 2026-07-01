import 'server-only'

import { router } from '@/_trpc/server'
import { CREATE_CHECKOUT_SESSION_PROTECTED_CONTROLLER } from '@/_backend/modules/credits/controllers/create-checkout-session.controller'
import { GET_CREDITS_PROTECTED_CONTROLLER } from '@/_backend/modules/credits/controllers/get-credits.controller'
import { GET_INVOICES_PROTECTED_CONTROLLER } from '@/_backend/modules/credits/controllers/get-invoices.controller'

export const CREDITS_ROUTER = router({
    get: GET_CREDITS_PROTECTED_CONTROLLER,
    getInvoices: GET_INVOICES_PROTECTED_CONTROLLER,
    createCheckoutSession: CREATE_CHECKOUT_SESSION_PROTECTED_CONTROLLER,
})
