import { Effect } from 'effect'
import {
    CreateReportError,
    ExportReportError,
    FetchReportForTaskError,
    GetReportByIdError,
    GetReportsError,
    MarkReportFailedError,
    SaveAnalysisError,
} from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import {
    type ReportDTO,
    type ReportListItem,
    ReportStatus,
    type StockData,
} from '@/types/ReportDTO'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { createDBAdminClient } from '@/_bff/core/db'
import {
    STOCK_DATA_CACHE_KEY,
    STOCK_DATA_CACHE_TTL,
    stockDataCacheTag,
} from '@/_bff/modules/reports/constants'
import { unstable_cache } from 'next/cache'
import { Logger } from '@/_bff/lib/server-logger'

export const insertReport = Effect.fn('insertReport')(function* (
    supabase: SupabaseClient,
    params: { userId: string; stock: string; type: string; isDev: boolean }
) {
    const { data: report, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .insert({
                    created_at: 'now()',
                    type: params.type,
                    status: ReportStatus.GENERATING,
                    user_id: params.userId,
                    stock: params.stock,
                    is_dev: params.isDev,
                })
                .select('id')
                .single(),
        catch: (cause) =>
            new CreateReportError({ cause, error_hash: ErrorCode.REPORT_CREATE_INSERT_ERR }),
    })

    if (error) {
        return yield* new CreateReportError({
            cause: error,
            error_hash: ErrorCode.REPORT_CREATE_INSERT_ERR,
        })
    }

    // SAFETY: reports.id is a uuid column, returned by select('id').single() after a successful insert
    return report.id as string
})

export const selectUserReports = Effect.fn('selectUserReports')(function* (
    supabase: SupabaseClient,
    userId: string
) {
    const { data: reports, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .select('created_at,id,status,stock,type')
                .eq('user_id', userId)
                .order('created_at', { ascending: false }),
        catch: (cause) =>
            new GetReportsError({ cause, error_hash: ErrorCode.REPORT_LIST_FETCH_ERR }),
    })

    if (error) {
        return yield* new GetReportsError({
            cause: error,
            error_hash: ErrorCode.REPORT_LIST_FETCH_ERR,
        })
    }

    // SAFETY: the select list is exactly the ReportListItem columns
    return reports as ReportListItem[]
})

// `userId` filters ownership; omit it for super-admin access to any report
export const selectReportById = Effect.fn('selectReportById')(function* (
    supabase: SupabaseClient,
    id: ReportDTO['id'],
    userId?: string
) {
    const { data: report, error } = yield* Effect.tryPromise({
        try: () => {
            const query = supabase.from('reports').select('*').eq('id', id)
            return userId ? query.eq('user_id', userId).single() : query.single()
        },
        catch: (cause) =>
            new GetReportByIdError({ cause, error_hash: ErrorCode.REPORT_BY_ID_FETCH }),
    })

    if (error) {
        return yield* new GetReportByIdError({
            cause: error,
            error_hash: ErrorCode.REPORT_BY_ID_FETCH_ERR,
        })
    }

    // SAFETY: select('*') on reports returns the full row that ReportDTO mirrors
    return report as ReportDTO
})

export const selectReportForExport = Effect.fn('selectReportForExport')(function* (
    supabase: SupabaseClient,
    id: ReportDTO['id'],
    userId: string
) {
    const { data: report, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .select('stock, type, ai_response, sentiment, created_at, ticker')
                .eq('id', id)
                .eq('user_id', userId)
                .single(),
        catch: (cause) =>
            new ExportReportError({ cause, error_hash: ErrorCode.EXPORT_REPORT_FETCH }),
    })

    if (error) {
        return yield* new ExportReportError({
            cause: error,
            error_hash: ErrorCode.EXPORT_REPORT_FETCH_ERR,
        })
    }

    return report
})

export const selectReportForProcessing = Effect.fn('selectReportForProcessing')(function* (
    supabase: SupabaseClient,
    reportId: string
) {
    // Only the columns the processing job needs — `*` would drag the large ai_response JSON along.
    const { data: report, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .select('id, stock, type, user_id, status')
                .eq('id', reportId)
                .single(),
        catch: (cause) =>
            new FetchReportForTaskError({ cause, error_hash: ErrorCode.PROCESS_REPORT_FETCH }),
    })

    if (error || !report) {
        return yield* new FetchReportForTaskError({
            cause: `Report not found: ${reportId}`,
            error_hash: ErrorCode.PROCESS_REPORT_NOT_FOUND,
        })
    }

    // SAFETY: the select list is exactly the picked ReportDTO columns
    return report as Pick<ReportDTO, 'id' | 'stock' | 'type' | 'user_id' | 'status'>
})

// Marks the report as FAILED exactly once: the `neq` guard means only the first caller
// gets the row back (later calls return null), so the credit refund can't double-fire.
export const markReportFailed = Effect.fn('markReportFailed')(function* (
    supabase: SupabaseClient,
    reportId: ReportDTO['id']
) {
    const { data, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .update({ status: ReportStatus.FAILED })
                .eq('id', reportId)
                .neq('status', ReportStatus.FAILED)
                .select('user_id, type')
                .maybeSingle(),
        catch: (cause) =>
            new MarkReportFailedError({
                cause,
                error_hash: ErrorCode.PROCESS_REPORT_MARK_FAILED,
            }),
    })

    if (error) {
        return yield* new MarkReportFailedError({
            cause: error,
            error_hash: ErrorCode.PROCESS_REPORT_MARK_FAILED,
        })
    }

    // SAFETY: the select list is exactly the picked ReportDTO columns, maybeSingle() yields null when absent
    return data as Pick<ReportDTO, 'user_id' | 'type'> | null
})

// Uses the admin client: unstable_cache runs outside the request scope, so cookie-based
// clients are unavailable there; stock_data is not user-scoped, so this is safe.
const selectStockDataByTickerRaw = async (ticker: string): Promise<StockData | null> => {
    const supabase = createDBAdminClient()

    const { data, error } = await supabase
        .from('stock_data')
        .select('*')
        .eq('id', ticker)
        .maybeSingle()

    if (error) {
        throw new Error(`Failed to fetch stock data for ${ticker}: ${error.message}`)
    }

    // SAFETY: stock_data rows are only written by upsertStockData, whose columns StockData mirrors
    return (data ?? null) as StockData | null
}

// Best-effort — resolves to null instead of failing so report views never break on stock data.
// Do NOT call from Trigger.dev jobs: unstable_cache only works in the Next runtime;
export const selectStockDataByTickerCached = Effect.fn('selectStockDataByTickerCached')(function* (
    ticker: string | null | undefined,
    userId: User['id'] // only necessary for logger
) {
    if (!ticker) {
        return null
    }

    return yield* Effect.tryPromise({
        try: () =>
            unstable_cache(
                () => selectStockDataByTickerRaw(ticker),
                [STOCK_DATA_CACHE_KEY, ticker],
                {
                    revalidate: STOCK_DATA_CACHE_TTL,
                    tags: [stockDataCacheTag(ticker)],
                }
            )(),
        catch: (cause) => cause,
    }).pipe(
        Effect.tapError((cause) =>
            Effect.sync(() =>
                Logger({
                    level: 'error',
                    prefix: 'selectStockDataByTickerCached',
                    message: 'Stock data fetch failed',
                    error: cause,
                    metadata: { ticker },
                    userId: userId,
                })
            )
        ),
        Effect.catch(() => Effect.succeed(null))
    )
})

export const updateReportWithAnalysis = Effect.fn('updateReportWithAnalysis')(function* (
    supabase: SupabaseClient,
    reportId: ReportDTO['id'],
    params: {
        analysis: string
        ticker: string | null
        tokenUsdCost: number | 'N/A'
        sentiment?: number
    }
) {
    const response = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .update({
                    status: ReportStatus.COMPLETED,
                    ai_response: params.analysis,
                    sentiment: params.sentiment ?? null,
                    ticker: params.ticker ?? null,
                    // No usage (e.g. the dev mock) means no cost, never a text marker
                    cost: params.tokenUsdCost === 'N/A' ? null : params.tokenUsdCost,
                })
                .eq('id', reportId)
                // Never overwrite a report that already FAILED (and was refunded)
                .eq('status', ReportStatus.GENERATING),
        catch: (cause) =>
            new SaveAnalysisError({ cause, error_hash: ErrorCode.SAVE_ANALYSIS_UPDATE }),
    })

    if (response.error) {
        return yield* new SaveAnalysisError({
            cause: response.error,
            error_hash: ErrorCode.SAVE_ANALYSIS_UPDATE_ERR,
        })
    }
})
