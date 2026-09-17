type CalendarParts = {
    month: string
    day: string
    year: string
}

const DAY_MS = 24 * 60 * 60 * 1000

const toUtcDay = (date: string) => {
    const d = new Date(date)
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? '' : 's'}`

// Whole calendar days from `from` to `to` (UTC), ignoring the time of day. Negative when `to` is earlier.
export function getDayDiff(from: string, to: string): number {
    return Math.round((toUtcDay(to) - toUtcDay(from)) / DAY_MS)
}

export function formatEventAge(days: number): string {
    if (days <= 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 30) return `${days} days ago`
    if (days < 365) return `${plural(Math.floor(days / 30), 'month')} ago`

    return `${plural(Math.floor(days / 365), 'year')} ago`
}

export function getCalendarParts(date: string): CalendarParts {
    const d = new Date(date)
    const part = (options: Intl.DateTimeFormatOptions) =>
        d.toLocaleDateString('en-US', { ...options, timeZone: 'UTC' })

    return {
        month: part({ month: 'short' }),
        day: part({ day: '2-digit' }),
        year: part({ year: 'numeric' }),
    }
}
