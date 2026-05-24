export function fmtLarge(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    const abs = Math.abs(n)
    const sign = n < 0 ? '-' : ''
    if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`
    if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`
    if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`
    return `${sign}$${abs.toFixed(2)}`
}

export function fmtPct(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    const val = Math.abs(n) < 10 ? n * 100 : n
    return `${val.toFixed(1)}%`
}

export function fmtX(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    return `${n.toFixed(1)}x`
}

export function fmtNum(n: number | null | undefined, decimals = 2): string {
    if (n == null) return 'N/A'
    return n.toFixed(decimals)
}

export function fmtPrice(n: number | null | undefined): string {
    if (n == null) return 'N/A'
    return `$${n.toFixed(2)}`
}

export const fmtDate = (d: string, month: 'long' | 'short' = 'long') =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric' })

export function formatDate(ts: number): string {
    return new Date(ts * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amount / 100)
}

export const parseReportDate = (date: string) => {
    return date.slice(0, 16).replace('T', ' ')
}
