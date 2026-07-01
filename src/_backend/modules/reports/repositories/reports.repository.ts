import { Effect } from 'effect'
import {
    CreateReportError,
    ExportReportError,
    FetchReportForTaskError,
    GetReportByIdError,
    GetReportsError,
    MarkReportFailedError,
    SaveAnalysisError,
} from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import {
    type ReportDTO,
    type ReportListItem,
    ReportStatus,
    type StockData,
} from '@/types/ReportDTO'
import type { SupabaseClient } from '@supabase/supabase-js'

export const insertReport = Effect.fn('insertReport')(function* (
    supabase: SupabaseClient,
    params: { userId: string; stock: string; type: string }
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
    const { data: report, error } = yield* Effect.tryPromise({
        try: () => supabase.from('reports').select('*').eq('id', reportId).single(),
        catch: (cause) =>
            new FetchReportForTaskError({ cause, error_hash: ErrorCode.PROCESS_REPORT_FETCH }),
    })

    if (error || !report) {
        return yield* new FetchReportForTaskError({
            cause: `Report not found: ${reportId}`,
            error_hash: ErrorCode.PROCESS_REPORT_NOT_FOUND,
        })
    }

    return report as ReportDTO
})

// Best-effort — resolves to null instead of failing so report views never break on stock data
export const selectStockDataByTicker = Effect.fn('selectStockDataByTicker')(function* (
    supabase: SupabaseClient,
    ticker: string | null | undefined
) {
    return yield* Effect.tryPromise({
        try: () => supabase.from('stock_data').select('*').eq('id', ticker).maybeSingle(),
        catch: (cause) => cause,
    }).pipe(
        Effect.map((res) => (res.data as StockData) ?? null),
        Effect.orElse(() => Effect.succeed(null))
    )
})

export const markReportFailed = Effect.fn('markReportFailed')(function* (
    supabase: SupabaseClient,
    reportId: ReportDTO['id']
) {
    yield* Effect.tryPromise({
        try: () =>
            supabase.from('reports').update({ status: ReportStatus.FAILED }).eq('id', reportId),
        catch: (cause) =>
            new MarkReportFailedError({
                cause,
                error_hash: ErrorCode.PROCESS_REPORT_MARK_FAILED,
            }),
    })
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
                    cost: params.tokenUsdCost ?? 'N/A',
                })
                .eq('id', reportId),
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
