import 'server-only'

import { router } from '@/_trpc/server'
import { GET_LATEST_NEWS_PROTECTED_CONTROLLER } from '@/_bff/modules/finnhub/controllers/get-latest-news.controller'

export const FINNHUB_ROUTER = router({
    getLatestNews: GET_LATEST_NEWS_PROTECTED_CONTROLLER,
})
