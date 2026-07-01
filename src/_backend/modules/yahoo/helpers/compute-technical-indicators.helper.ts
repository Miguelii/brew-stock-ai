import type { PricePoint } from '@/_backend/modules/yahoo/types'
import type { StockTechnicals } from '@/types/ReportDTO'

// Approximate number of trading days per calendar window.
const TRADING_DAYS = { month: 21, threeMonths: 63, sixMonths: 126, year: 252 } as const
const TRADING_DAYS_PER_YEAR = 252

const EMPTY_TECHNICALS: StockTechnicals = {
    currentPrice: null,
    sma50: null,
    sma200: null,
    priceVsSma50Pct: null,
    priceVsSma200Pct: null,
    trend: 'neutral',
    rsi14: null,
    high52w: null,
    low52w: null,
    pctFrom52wHigh: null,
    pctFrom52wLow: null,
    return1m: null,
    return3m: null,
    return6m: null,
    return12m: null,
    annualizedVolatilityPct: null,
}

/**
 * Arithmetic mean of a non-empty list of numbers.
 *
 * @param nums - The values to average (callers guarantee at least one element).
 * @returns The mean of `nums`.
 */
const average = (nums: number[]): number => nums.reduce((sum, n) => sum + n, 0) / nums.length

/**
 * Percentage change between two values.
 *
 * @param from - The baseline value.
 * @param to - The later value.
 * @returns The change from `from` to `to`, expressed as a percentage (e.g. 5.3 for +5.3%).
 */
const pctChange = (from: number, to: number): number => (to / from - 1) * 100

/**
 * Simple moving average of the most recent `period` closes.
 *
 * @param closes - Closing prices ordered oldest → newest.
 * @param period - Number of trailing closes to average.
 * @returns The average of the last `period` closes, or `null` when history is shorter than `period`.
 */
const sma = (closes: number[], period: number): number | null =>
    closes.length < period ? null : average(closes.slice(-period))

/**
 * Trailing return measured over a fixed number of trading days.
 *
 * @param closes - Closing prices ordered oldest → newest.
 * @param days - How many trading days back to compare the latest close against.
 * @returns The percentage return over the window, or `null` when history is too short.
 */
const returnOverDays = (closes: number[], days: number): number | null => {
    if (closes.length <= days) return null
    return pctChange(closes.at(-1 - days)!, closes.at(-1)!)
}

/**
 * Classic 14-period Relative Strength Index using simple averages of gains and
 * losses (not Wilder smoothing).
 *
 * @param closes - Closing prices ordered oldest → newest.
 * @param period - RSI look-back period (defaults to 14).
 * @returns The RSI in the 0–100 range, `100` when there are no losses in the window,
 *          or `null` when history is shorter than `period + 1`.
 */
const computeRsi = (closes: number[], period = 14): number | null => {
    if (closes.length < period + 1) return null
    const window = closes.slice(-(period + 1))
    let gains = 0
    let losses = 0
    for (let i = 1; i < window.length; i++) {
        const diff = window[i] - window[i - 1]
        if (diff >= 0) gains += diff
        else losses -= diff
    }
    const avgLoss = losses / period
    if (avgLoss === 0) return 100
    const rs = gains / period / avgLoss
    return 100 - 100 / (1 + rs)
}

/**
 * Annualised volatility from daily log returns, using the sample standard
 * deviation scaled by √252.
 *
 * @param closes - Closing prices ordered oldest → newest.
 * @returns The annualised volatility as a percentage, or `null` when there are fewer than 2 closes.
 */
const annualizedVolatility = (closes: number[]): number | null => {
    if (closes.length < 2) return null
    const returns: number[] = []
    for (let i = 1; i < closes.length; i++) {
        returns.push(Math.log(closes[i] / closes[i - 1]))
    }
    const mean = average(returns)
    const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (returns.length - 1)
    return Math.sqrt(variance) * Math.sqrt(TRADING_DAYS_PER_YEAR) * 100
}

/**
 * Derive a compact set of technical indicators from a 1-year daily price series:
 * SMA50/SMA200 (and the price's distance to each), the SMA-cross trend regime,
 * RSI(14), 52-week-range position, trailing 1m/3m/6m/12m returns and annualised
 * volatility. Pure and side-effect free: it sorts a copy of the input, returns
 * all-null indicators for an empty series, and guards every metric against
 * insufficient history.
 *
 * @param points - Daily price points (any order); sorted ascending internally.
 * @returns The computed {@link StockTechnicals} snapshot.
 */
export function computeTechnicalIndicators(points: PricePoint[]): StockTechnicals {
    if (points.length === 0) return EMPTY_TECHNICALS

    const closes = points.toSorted((a, b) => a.date - b.date).map((p) => p.close)
    const currentPrice = closes.at(-1)!

    const sma50 = sma(closes, 50)
    const sma200 = sma(closes, 200)

    let trend: StockTechnicals['trend'] = 'neutral'
    if (sma50 != null && sma200 != null && sma50 !== sma200) {
        trend = sma50 > sma200 ? 'golden-cross' : 'death-cross'
    }

    const high52w = Math.max(...closes)
    const low52w = Math.min(...closes)

    return {
        currentPrice,
        sma50,
        sma200,
        priceVsSma50Pct: sma50 != null ? pctChange(sma50, currentPrice) : null,
        priceVsSma200Pct: sma200 != null ? pctChange(sma200, currentPrice) : null,
        trend,
        rsi14: computeRsi(closes),
        high52w,
        low52w,
        pctFrom52wHigh: pctChange(high52w, currentPrice),
        pctFrom52wLow: pctChange(low52w, currentPrice),
        return1m: returnOverDays(closes, TRADING_DAYS.month),
        return3m: returnOverDays(closes, TRADING_DAYS.threeMonths),
        return6m: returnOverDays(closes, TRADING_DAYS.sixMonths),
        return12m: returnOverDays(closes, TRADING_DAYS.year),
        annualizedVolatilityPct: annualizedVolatility(closes),
    }
}
