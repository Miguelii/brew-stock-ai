import 'server-only'

import { router } from '@/_trpc/server'
import { GET_PRICE_HISTORY_PROTECTED_CONTROLLER } from '@/backend/modules/yahoo/controllers/get-price-history.controller'

export const YAHOO_ROUTER = router({
    getPriceHistory: GET_PRICE_HISTORY_PROTECTED_CONTROLLER,
})
