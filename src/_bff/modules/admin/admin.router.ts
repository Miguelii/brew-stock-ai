import 'server-only'

import { router } from '@/_bff/trpc/server'
import { REFRESH_STOCK_DATA_PROTECTED_CONTROLLER } from '@/_bff/modules/admin/controllers/refresh-stock-data.controller'

export const ADMIN_ROUTER = router({
    refreshStockData: REFRESH_STOCK_DATA_PROTECTED_CONTROLLER,
})
