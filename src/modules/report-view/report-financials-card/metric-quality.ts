/**
 * Turns a raw financial metric into a plain-language "is this good or concerning?"
 * signal so non-expert readers can triage the card at a glance.
 *
 * The thresholds below are documented rule-of-thumb heuristics — not financial
 * advice — and are intentionally easy to tune in one place.
 */

type MetricQuality = 'good' | 'neutral' | 'caution' | 'concern'

export type MetricKey =
    | 'revenueGrowth'
    | 'earningsGrowth'
    | 'profitMargins'
    | 'operatingMargins'
    | 'ebitda'
    | 'trailingPE'
    | 'forwardPE'
    | 'priceToBook'
    | 'beta'
    | 'dividendYield'
    | 'returnOnEquity'
    | 'freeCashflow'
    | 'operatingCashflow'
    | 'debtToEquity'
    | 'netIncome'
    | 'epsGrowth'
    | 'revenueGrowthFwd'

type MetricEval = { quality: MetricQuality; verdict: string }

type MetricRule = {
    evaluate: (value: number) => MetricEval
    /** Short plain-language hint shown under jargon-heavy ratios. */
    help?: string
}

// Mirror `fmtPct`: a magnitude below 10 is treated as a ratio and scaled to a percentage.
const asPct = (n: number): number => (Math.abs(n) < 10 ? n * 100 : n)

// Growth-style metrics: shrinking is a concern, flat is neutral, real growth is good.
const evaluateGrowth = (value: number): MetricEval => {
    const pct = asPct(value)
    if (pct < -1) return { quality: 'concern', verdict: 'Shrinking' }
    if (pct < 5) return { quality: 'neutral', verdict: 'Flat' }
    if (pct < 20) return { quality: 'good', verdict: 'Growing' }
    return { quality: 'good', verdict: 'Fast growth' }
}

// Profit-margin-style metrics: a loss is a concern, thin is caution, fat is good.
const evaluateMargin = (value: number): MetricEval => {
    const pct = asPct(value)
    if (pct < 0) return { quality: 'concern', verdict: 'Lossmaking' }
    if (pct < 10) return { quality: 'caution', verdict: 'Thin margin' }
    if (pct < 20) return { quality: 'neutral', verdict: 'Decent' }
    return { quality: 'good', verdict: 'Strong margin' }
}

// Earnings multiples: low is cheap, mid is fair, high is rich; losses flagged.
const evaluatePE = (value: number): MetricEval => {
    if (value <= 0) return { quality: 'concern', verdict: 'Lossmaking' }
    if (value < 15) return { quality: 'good', verdict: 'Cheap' }
    if (value < 30) return { quality: 'neutral', verdict: 'Fair' }
    if (value < 50) return { quality: 'caution', verdict: 'Rich' }
    return { quality: 'concern', verdict: 'Expensive' }
}

// Cash-flow / profit absolutes: positive is good, negative is a concern.
const evaluateSign =
    (positive: string, negative: string) =>
    (value: number): MetricEval => {
        if (value > 0) return { quality: 'good', verdict: positive }
        if (value < 0) return { quality: 'concern', verdict: negative }
        return { quality: 'neutral', verdict: 'Break-even' }
    }

const METRIC_RULES: Record<MetricKey, MetricRule> = {
    revenueGrowth: { evaluate: evaluateGrowth },
    earningsGrowth: { evaluate: evaluateGrowth },
    epsGrowth: { evaluate: evaluateGrowth },
    revenueGrowthFwd: { evaluate: evaluateGrowth },

    profitMargins: { evaluate: evaluateMargin },
    operatingMargins: { evaluate: evaluateMargin },

    returnOnEquity: {
        help: 'Profit made on shareholders’ money',
        evaluate: (value) => {
            const pct = asPct(value)
            if (pct < 0) return { quality: 'concern', verdict: 'Negative' }
            if (pct < 10) return { quality: 'caution', verdict: 'Low' }
            if (pct < 20) return { quality: 'neutral', verdict: 'Solid' }
            return { quality: 'good', verdict: 'Excellent' }
        },
    },

    ebitda: { evaluate: evaluateSign('Profitable', 'Lossmaking') },
    netIncome: { evaluate: evaluateSign('Profitable', 'Lossmaking') },
    freeCashflow: { evaluate: evaluateSign('Cash positive', 'Cash negative') },
    operatingCashflow: { evaluate: evaluateSign('Cash positive', 'Cash negative') },

    trailingPE: { help: 'Price vs each $1 of profit', evaluate: evaluatePE },
    forwardPE: { help: 'Price vs next year’s profit', evaluate: evaluatePE },

    priceToBook: {
        help: 'Price vs net assets',
        evaluate: (value) => {
            if (value <= 0) return { quality: 'neutral', verdict: 'N/A' }
            if (value < 1) return { quality: 'good', verdict: 'Below book' }
            if (value < 3) return { quality: 'neutral', verdict: 'Fair' }
            if (value < 8) return { quality: 'caution', verdict: 'Pricey' }
            return { quality: 'concern', verdict: 'Very pricey' }
        },
    },

    beta: {
        help: '1.0 = moves with the market',
        evaluate: (value) => {
            if (value < 0.8) return { quality: 'good', verdict: 'Stable' }
            if (value < 1.3) return { quality: 'neutral', verdict: 'Market-like' }
            if (value < 2) return { quality: 'caution', verdict: 'Volatile' }
            return { quality: 'concern', verdict: 'Very volatile' }
        },
    },

    dividendYield: {
        evaluate: (value) => {
            const pct = asPct(value)
            if (pct <= 0) return { quality: 'neutral', verdict: 'No dividend' }
            if (pct < 2) return { quality: 'neutral', verdict: 'Small yield' }
            if (pct < 6) return { quality: 'good', verdict: 'Solid yield' }
            return { quality: 'caution', verdict: 'Very high yield' }
        },
    },

    debtToEquity: {
        help: 'Debt vs shareholders’ equity',
        evaluate: (value) => {
            // Yahoo often reports D/E as a percentage (e.g. 150 for 1.5x).
            const de = value > 10 ? value / 100 : value
            if (de < 0) return { quality: 'neutral', verdict: 'N/A' }
            if (de < 0.5) return { quality: 'good', verdict: 'Low debt' }
            if (de < 1.5) return { quality: 'neutral', verdict: 'Moderate debt' }
            if (de < 3) return { quality: 'caution', verdict: 'High debt' }
            return { quality: 'concern', verdict: 'Heavy debt' }
        },
    },
}

/**
 * Evaluate a metric's value into a quality bucket and a one-word verdict.
 *
 * @returns The evaluation, or `null` when the metric is unknown or the value is nullish.
 */
export function evaluateMetric(
    key: MetricKey | undefined,
    value: number | null | undefined
): MetricEval | null {
    if (key == null || value == null || !Number.isFinite(value)) return null
    return METRIC_RULES[key].evaluate(value)
}

/** Plain-language hint for a metric, when one is defined. */
export function metricHelp(key: MetricKey | undefined): string | undefined {
    return key == null ? undefined : METRIC_RULES[key].help
}

const QUALITY_TEXT: Record<MetricQuality, string> = {
    good: 'text-positive',
    neutral: 'text-primary',
    caution: 'text-warning',
    concern: 'text-destructive',
}

const QUALITY_BG: Record<MetricQuality, string> = {
    good: 'bg-positive/10',
    neutral: 'bg-muted',
    caution: 'bg-warning/10',
    concern: 'bg-destructive/10',
}

/** Semantic text token for a quality bucket. */
export const qualityToken = (quality: MetricQuality): string => QUALITY_TEXT[quality]

/** Faint tinted background token for a quality (used by the grade badge). */
export const qualityBgToken = (quality: MetricQuality): string => QUALITY_BG[quality]

// Points awarded per quality bucket when grading a whole category (0–100 scale).
const QUALITY_POINTS: Record<MetricQuality, number> = {
    good: 100,
    neutral: 65,
    caution: 40,
    concern: 15,
}

type CategoryGrade = { letter: string; quality: MetricQuality; score: number }

// Letter bands, highest first; a score maps to the first band it clears.
const GRADE_BANDS: readonly [number, string][] = [
    [90, 'A'],
    [85, 'A-'],
    [80, 'B+'],
    [75, 'B'],
    [70, 'B-'],
    [65, 'C+'],
    [60, 'C'],
    [55, 'C-'],
    [50, 'D+'],
    [45, 'D'],
    [40, 'D-'],
]

const scoreToLetter = (score: number): string => {
    for (const [min, letter] of GRADE_BANDS) if (score >= min) return letter
    return 'F'
}

// A–B read as healthy (green), C as fair (amber), D–F as weak (red).
const letterQuality = (letter: string): MetricQuality => {
    const head = letter[0]
    if (head === 'A' || head === 'B') return 'good'
    if (head === 'C') return 'caution'
    return 'concern'
}

/** Plain-language word for a category grade (used under the letter). */
export const gradeWord = (quality: MetricQuality): string =>
    quality === 'good' ? 'Strong' : quality === 'caution' ? 'Fair' : 'Weak'

/**
 * Grade a category from its metrics: averages the per-metric quality points over the
 * classifiable metrics and maps the score to a letter grade.
 *
 * @returns The grade, or `null` when the category has no classifiable metrics.
 */
export function gradeCategory(
    items: { metricKey?: MetricKey; rawValue?: number | null }[]
): CategoryGrade | null {
    const points: number[] = []
    for (const item of items) {
        const evaluation = evaluateMetric(item.metricKey, item.rawValue ?? null)
        if (evaluation) points.push(QUALITY_POINTS[evaluation.quality])
    }
    if (points.length === 0) return null
    const score = points.reduce((sum, p) => sum + p, 0) / points.length
    const letter = scoreToLetter(score)
    return { letter, quality: letterQuality(letter), score }
}
